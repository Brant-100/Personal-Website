"""
scanner/discovery.py

Host discovery: sweep a subnet and find which IP addresses
have live machines on them before we start port scanning.

Why this matters:
    A /24 subnet has 254 possible hosts. Rather than running a
    full port scan on all 254 (slow, noisy), we do a fast sweep
    first to find the 5-10 that are actually alive, then scan
    only those in depth.

How we detect a live host (without ICMP ping):
    ICMP ping requires root/admin privileges on most systems.
    Instead, we probe a handful of common TCP ports. If ANY of
    them respond (open or actively refused), the host is up.
    An active refusal (connection refused) still proves the
    machine exists: a dead host wouldn't refuse anything.
"""

import socket
import ipaddress
import concurrent.futures
from dataclasses import dataclass
from typing import Optional


# ─────────────────────────────────────────────────────────────
#  PROBE PORTS
#
#  We try these ports to check if a host is alive.
#  We don't care if they're open or closed: we just need
#  any response to prove the machine is there.
#
#  These are chosen because they're open on a wide variety
#  of different machine types:
#    80/443 : almost any web server or router
#    22     : Linux servers, network equipment
#    445    : Windows machines
#    3389   : Windows with RDP enabled
# ─────────────────────────────────────────────────────────────

PROBE_PORTS: list[int] = [80, 443, 22, 445, 3389, 8080]


# ─────────────────────────────────────────────────────────────
#  HostResult
#
#  Everything we learn about a single host during discovery.
#  Similar to ScanResult in core.py: a clean typed container.
#  essentially it is a container for the host results which will be used in the report obviosly 
# ─────────────────────────────────────────────────────────────

@dataclass
class HostResult:
    ip:       str
    hostname: Optional[str] = None   # Resolved via reverse DNS if available
    is_up:    bool = False


# ─────────────────────────────────────────────────────────────
#  probe_host
#
#  Checks whether a single IP address has a live machine on it.
#
#  We try each probe port in sequence.
#  Two outcomes tell us the host is alive:
#
#    1. connect_ex returns 0
#       → Port is open, full TCP handshake succeeded.
#          Machine is definitely there.
#
#    2. connect_ex returns errno 111 (ECONNREFUSED) on Linux
#       or errno 61 on macOS / 10061 on Windows
#       → Port is closed BUT the machine actively sent a RST
#          packet to refuse the connection. A dead host can't
#          send RST packets: so the machine is alive, just
#          not running that service.
#
#  If all ports time out → host is down or heavily firewalled.
# ─────────────────────────────────────────────────────────────

def probe_host(ip: str, timeout: float = 1.0) -> HostResult:
    """
    Check if a single IP address has a live host.

    Args:
        ip:      IP address string to probe
        timeout: Seconds to wait per probe port (default 1.0)

    Returns:
        HostResult with is_up=True if the host responded to any probe
    """
    result = HostResult(ip=ip)

    for port in PROBE_PORTS:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            response = sock.connect_ex((ip, port))
            sock.close()

            # Response 0        = port open       = host is up
            # Response 111/61   = connection refused = host is up (sent RST)
            # Response 10061    = connection refused on Windows
            # Anything else     = timeout or unreachable = keep trying
            if response in (0, 111, 61, 10061):
                result.is_up = True
                break  # No need to try more ports: we know it's alive

        except OSError:
            # Network error on this probe: try the next port
            continue

    # If the host is up, attempt a reverse DNS lookup to get its hostname.
    # This turns "192.168.1.1" into something like "router.local": useful
    # context in the report. We ignore failures: not every IP has a PTR record.
    if result.is_up:
        result.hostname = _reverse_dns(ip)

    return result


# ─────────────────────────────────────────────────────────────
#   sweep_network
#
#  Sweeps an entire subnet and returns all live hosts.
#
#  Takes a CIDR string like "192.168.1.0/24" and:
#    1. Expands it to all 254 host IPs
#    2. Probes each one in parallel using a thread pool
#    3. Returns only the ones that responded
#
#  The threading model is identical to core.py: I/O bound
#  work runs much faster in parallel because we're mostly
#  waiting for timeouts on dead hosts.
# ─────────────────────────────────────────────────────────────

def sweep_network(
    cidr: str,
    threads: int = 50,
    timeout: float = 1.0,
    on_progress: Optional[callable] = None,
    on_found: Optional[callable] = None,
) -> list[HostResult]:
    """
    Sweep a subnet and discover live hosts.

    Args:
        cidr:        Network in CIDR notation e.g. "192.168.1.0/24"
        threads:     Max concurrent threads (default 50)
        timeout:     Per-host probe timeout in seconds (default 1.0)
        on_progress: Optional callback(probed, total) for progress updates
        on_found:    Optional callback(HostResult) when a live host is found

    Returns:
        List of HostResult objects for live hosts, sorted by IP address

    Raises:
        ValueError: If the CIDR string is invalid
    """
    # Parse the CIDR notation into a list of host IPs.
    # strict=False means "192.168.1.5/24" is treated as "192.168.1.0/24"
    # rather than raising an error about the host bits being set.
    try:
        network = ipaddress.ip_network(cidr, strict=False)
    except ValueError as e:
        raise ValueError(f"Invalid network address '{cidr}': {e}") from e

    # .hosts() returns all usable IPs: excludes network address (.0)
    # and broadcast address (.255)
    host_ips = [str(ip) for ip in network.hosts()]
    total = len(host_ips)
    probed = 0
    live_hosts: list[HostResult] = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:

        future_to_ip = {
            executor.submit(probe_host, ip, timeout): ip
            for ip in host_ips
        }

        for future in concurrent.futures.as_completed(future_to_ip):
            probed += 1
            result = future.result()

            if result.is_up:
                live_hosts.append(result)
                if on_found:
                    on_found(result)

            if on_progress:
                on_progress(probed, total)

    # Sort by IP address numerically (not lexicographically).
    # Without this, "192.168.1.10" sorts before "192.168.1.9"
    # because string sorting compares character by character.
    return sorted(live_hosts, key=lambda h: ipaddress.ip_address(h.ip))


# ─────────────────────────────────────────────────────────────
#  _reverse_dns
#
#  Attempts to resolve an IP address back to a hostname.
#  This is called a PTR record lookup or reverse DNS.
#  e.g. "192.168.1.1" → "router.local"
#
#  Many IPs won't have a PTR record: that's completely normal.
#  We return None silently rather than raising an error.
# ─────────────────────────────────────────────────────────────

def _reverse_dns(ip: str) -> Optional[str]:
    """
    Attempt a reverse DNS lookup on an IP address.

    Args:
        ip: IP address string

    Returns:
        Hostname string if found, None otherwise
    """
    try:
        # gethostbyaddr returns (hostname, aliases, addresses)
        # We only want the hostname: index [0]
        hostname, _, _ = socket.gethostbyaddr(ip)
        return hostname
    except (socket.herror, socket.gaierror, OSError):
        return None