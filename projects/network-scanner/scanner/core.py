""" scanner/core.py 
this handles the port scanning core functionality withch tcp connect and muilti-threading
"""
import socket
import concurrent.futures
from dataclasses import dataclass
from typing import Optional

#-------------------------------------------------------------  
#
#  service map
# this is a dictonary mapping of the common port numbers
# when the scanner finds (useign top_ports) an open port we will look it up in the dictionary instead of makeing an extra network call everytime 
# this also makes it faster as it dosent have to have the operating system scan thousands of ports everytime 
# however if theres a port that is not in the dictionary we will still make a network call to the operating system to get the service name
# :) this is my first cyber project so exited to see how it turns out lol
#-------------------------------------------------------------


# can add more later to allow more ports to be found quicker but this will do for now
#also this dosent do any scanning its just so we can match ports to names so that its eaier to read the output
#-------------------------------------------------------------
SERVICE_MAP: dict[int, str] = {
    21:    "FTP",
    22:    "SSH",
    23:    "Telnet",
    25:    "SMTP",
    53:    "DNS",
    80:    "HTTP",
    110:   "POP3",
    135:   "MSRPC",
    139:   "NetBIOS",
    143:   "IMAP",
    443:   "HTTPS",
    445:   "SMB",
    993:   "IMAPS",
    995:   "POP3S",
    3306:  "MySQL",
    3389:  "RDP",
    5432:  "PostgreSQL",
    5900:  "VNC",
    6379:  "Redis",
    8080:  "HTTP-Alt",
    8443:  "HTTPS-Alt",
    27017: "MongoDB",
}

#this is a list of the most commonly open ports in a network 
# this is so that we can scan the most common ports first to get a quick idea of what is open on the network    
#
TOP_PORTS: list[int] = [
    21, 22, 23, 25, 53, 80, 110, 111, 135, 139,
    143, 443, 445, 993, 995, 1723, 3306, 3389, 5432,
    5900, 6379, 8080, 8443, 8888, 9200, 10250, 27017,
    2375, 4848, 7001, 3000, 5000, 5001, 9000, 9001,
]
 
  
# ─────────────────────────────────────────────────────────────
#  DATA CLASS: ScanResult
#
#  A clean container for everything we learn about one port.
#  Using @dataclass saves us writing __init__ manually.
#  We'll build a list of these and pass it to the reporter.
# this gives us a clean way to actua;;y scan ports and get the results in a clean way
# ─────────────────────────────────────────────────────────────

@dataclass
class ScanResult:
    port:    int
    state:   str                  # "open" or "closed"
    service: str  = "unknown"
    banner:  Optional[str] = None # Only populated if --banners flag is set
 
 # ─────────────────────────────────────────────────────────────
#  get_service
#
#  Look up a port number and return a human-readable name.
#  First checks our local SERVICE_MAP (fast, no network).
#  Falls back to socket.getservbyport() for anything not in
#  our map: this queries the OS's /etc/services file.
# ─────────────────────────────────────────────────────────────
 
def get_service(port: int) -> str:
    if port in SERVICE_MAP:
        return SERVICE_MAP[port]
    try:
        return socket.getservbyport(port)
    except OSError:
        return "unknown :("
 

 # ─────────────────────────────────────────────────────────────
#  scan_port
#
#  Try to connect to a single ip:port using TCP.
#  This is done over and over (in parallel) by scan_target.
#
#  How the TCP connect scan actually works:
#    1. Make a socket (IPv4 + TCP).
#    2. Use connect_ex() to poke the port: this fires off a SYN:
#         - Our computer sends SYN →
#         - If the target replies with SYN-ACK, it means the port is open.
#         - RST = closed. 
#         - We finish the handshake (ACK) only if it’s open.
#    3. connect_ex returns 0 if handshake succeeded (port open),
#       anything else if closed, filtered, or just not reachable.
#    4. No matter what, close the socket right after: just checking, not staying.
#
#  Why connect_ex and not connect?
#    connect() would raise exceptions everywhere.
#    connect_ex() just gives an error code. Way easier for blasting through
#    hundreds of ports at once, no constant try/except needed.
# ─────────────────────────────────────────────────────────────
 
def scan_port(
    ip: str,
    port: int,
    timeout: float = 1.0,
    grab_banner: bool = False,
) -> ScanResult:
    """
    Scan a single TCP port on the given IP address.
 
    Args:
        ip:          Target IP address (already resolved)
        port:        Port number to scan (1–65535)
        timeout:     Seconds to wait before giving up (default 1.0)
        grab_banner: If True, attempt to read the service banner
 
    Returns:
        ScanResult with state "open" or "closed"
    """
    result = ScanResult(port=port, state="closed", service=get_service(port))
 
    try:
        # Create a new TCP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
 
        # Don't wait forever: if nothing responds in `timeout` seconds, move on
        sock.settimeout(timeout)
 
        # Attempt the TCP handshake
        # connect_ex returns 0 on success, errno code on failure
        response = sock.connect_ex((ip, port))
 
        if response == 0:
            # Port is open: connection succeeded
            result.state = "open"
 
            if grab_banner:
                # Import here to avoid circular imports
                from scanner.banner import grab
                result.banner = grab(sock, port)
            else:
                sock.close()
        else:
            sock.close()
 
    except socket.timeout:
        # connect_ex timed out: port is likely filtered by a firewall
        pass
    except OSError:
        # Socket-level error (e.g. network unreachable)
        pass
 
    return result

    # ─────────────────────────────────────────────────────────────
# -------------------------------------------------------------
#  scan_target
#
#  Scans a list of ports on a single host using a thread pool.
# this is the main function that will scan the target and return the results
# it will use a thread pool to scan the ports simultaneously
# this is so that we can scan a lot of ports quickly
# 
# threading is faster due to it being able to scan hudrads of ports at once instead of one at a time 
# -------------------------------------------------------------
# ─────────────────────────────────────────────────────────────
 
def scan_target(
    ip: str,
    ports: list[int],
    threads: int = 100,
    timeout: float = 1.0,
    grab_banners: bool = False,
    on_progress: Optional[callable] = None,
    on_open: Optional[callable] = None,
) -> list[ScanResult]:
    """
    Scan multiple ports on a single host using a thread pool.
 
    Args:
        ip:           Target IP address (already resolved)
        ports:        List of port numbers to scan
        threads:      Max concurrent threads (default 100)
        timeout:      Per-port timeout in seconds (default 1.0)
        grab_banners: Attempt banner grabbing on open ports
        on_progress:  Optional callback(scanned, total) for progress updates
        on_open:      Optional callback(ScanResult) called when open port found
 
    Returns:
        List of ScanResult objects for open ports only, sorted by port number
    """
    open_ports: list[ScanResult] = []
    total = len(ports)
    scanned = 0
 
    with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
 
        # Submit all jobs at once: executor queues them and runs up to
        # `threads` simultaneously. Each future maps to one port.
        future_to_port = {
            executor.submit(scan_port, ip, port, timeout, grab_banners): port
            for port in ports
        }
 
        # as_completed() yields each future the moment its thread finishes.
        # Results finish out of order; we sort before returning.

        for future in concurrent.futures.as_completed(future_to_port):
            scanned += 1
            result = future.result()
 
            if result.state == "open":
                open_ports.append(result)
                if on_open:
                    on_open(result)  # e.g. print to terminal immediately
 
            if on_progress:
                on_progress(scanned, total)  # e.g. update a progress bar
 
    # Sort results by port number for clean output
    return sorted(open_ports, key=lambda r: r.port)
 
 
# ─────────────────────────────────────────────────────────────
#   resolve_target
#
#  Converts a hostname like "scanme.nmap.org" to an IP address.
#  We resolve once upfront so every scan_port() call gets a raw
#  IP: faster than re-resolving on every connection attempt.
# ─────────────────────────────────────────────────────────────
 
def resolve_target(target: str) -> tuple[str, str]:
    """
    Resolve a hostname or IP string to an IP address.
 
    Args:
        target: Hostname or IP string
 
    Returns:
        Tuple of (original_target, resolved_ip)
 
    Raises:
        ValueError: If the hostname cannot be resolved
    """
    try:
        ip = socket.gethostbyname(target)
        return target, ip
    except socket.gaierror as e:
        raise ValueError(f"Cannot resolve '{target}': {e}") from e
 
 
# ─────────────────────────────────────────────────────────────
# parse_ports
#
#  Converts user input like "1-1024" or "80,443" into a
#  plain list of integers that scan_target() can use.
# essentially it allows us to list a range of ports or a single port this makes useing ti not such a pain
# ─────────────────────────────────────────────────────────────
 
def parse_ports(ports_str: str) -> list[int]:
    """
    Parse a port specification string into a list of port numbers.
 
    Supported formats:
        "top100"        → built-in top ports list
        "80"            → single port
        "1-1024"        → inclusive range
        "80,443,8080"   → comma-separated list
        "22,80-90,443"  → mixed (ranges + singles)
 
    Args:
        ports_str: Port specification string
 
    Returns:
        Sorted list of unique port numbers
 
    Raises:
        ValueError: If the string can't be parsed or ports are out of range
    """
    if ports_str.strip().lower() == "top100":
        return TOP_PORTS
 
    ports: set[int] = set()
 
    for part in ports_str.split(","):
        part = part.strip()
        if "-" in part:
            # It's a range like "1-1024"
            try:
                start, end = part.split("-", 1)
                start, end = int(start.strip()), int(end.strip())
            except ValueError:
                raise ValueError(f"Invalid port range: '{part}'")
 
            if not (1 <= start <= 65535 and 1 <= end <= 65535):
                raise ValueError(f"Ports must be between 1 and 65535, got: '{part}'")
            if start > end:
                raise ValueError(f"Range start must be <= end: '{part}'")
 
            ports.update(range(start, end + 1))
        else:
            # It's a single port
            try:
                port = int(part)
            except ValueError:
                raise ValueError(f"Invalid port number: '{part}'")
 
            if not (1 <= port <= 65535):
                raise ValueError(f"Port must be between 1 and 65535, got: {port}")
 
            ports.add(port)
 
    return sorted(ports)
 