"""
main.py

The entry point for the network scanner.
Handles all command line arguments and wires together:
    discovery.py  →  find live hosts on a subnet
    core.py       →  scan ports on a target
    banner.py     →  called automatically by core.py
    report.py     →  display and save results

Usage examples:
    python main.py -t scanme.nmap.org
    python main.py -t 192.168.1.1 -p 1-1024
    python main.py -t 192.168.1.1 -p top100 --banners
    python main.py -t 192.168.1.0/24 --discover
    python main.py -t 192.168.1.1 -p 22,80,443 -o results.txt
"""

import argparse
import sys
import time

from scanner.core import scan_target, resolve_target, parse_ports
from scanner.discovery import sweep_network
from scanner import report


# ─────────────────────────────────────────────────────────────
#  ARGUMENT PARSER
#
#  argparse turns sys.argv (the raw command line strings) into
#  a clean Namespace object we can access like args.target.
#
#  Each add_argument call defines one flag:
#    flags       e.g. "-t" and "--target" are the same flag
#    required    whether the user must provide it
#    default     value used if the flag isn't provided
#    help        shown when the user runs --help
# ─────────────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    """Build and return the argument parser."""

    parser = argparse.ArgumentParser(
        prog="network-scanner",
        description="TCP network scanner — reconnaissance phase tool",
        epilog="Example: python main.py -t scanme.nmap.org -p top100 --banners",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "-t", "--target",
        required=True,
        metavar="HOST",
        help="IP address, hostname, or CIDR subnet (e.g. 192.168.1.0/24)",
    )

    parser.add_argument(
        "-p", "--ports",
        default="1-1024",
        metavar="PORTS",
        help="Ports to scan: '1-1024', '80,443', '22,80-90,443', or 'top100' (default: 1-1024)",
    )

    parser.add_argument(
        "--banners",
        action="store_true",       # flag only — no value, just True/False
        help="Attempt banner grabbing on open ports",
    )

    parser.add_argument(
        "--discover",
        action="store_true",
        help="Host discovery mode — sweep a subnet for live hosts (use with CIDR target)",
    )

    parser.add_argument(
        "-T", "--threads",
        type=int,
        default=100,
        metavar="N",
        help="Number of concurrent threads (default: 100)",
    )

    parser.add_argument(
        "--timeout",
        type=float,
        default=1.0,
        metavar="SECS",
        help="Per-port timeout in seconds (default: 1.0)",
    )

    parser.add_argument(
        "-o", "--output",
        default=None,
        metavar="FILE",
        help="Save report to file e.g. results.txt",
    )

    return parser


# ─────────────────────────────────────────────────────────────
#  MODE: HOST DISCOVERY
#
#  Sweeps a subnet to find live hosts.
#  Called when --discover flag is set OR target contains "/"
#  (e.g. "192.168.1.0/24" is clearly a subnet, not a host).
# ─────────────────────────────────────────────────────────────

def run_discovery(args: argparse.Namespace) -> None:
    """Run host discovery mode on a subnet."""
    import ipaddress

    # Validate the CIDR before we start
    try:
        network = ipaddress.ip_network(args.target, strict=False)
    except ValueError:
        report.print_error(f"'{args.target}' is not a valid network address.")
        report.print_error("Example: 192.168.1.0/24")
        sys.exit(1)

    host_count = network.num_addresses - 2  # exclude network + broadcast
    report.print_discovery_start(args.target, host_count)

    start = time.perf_counter()

    live_hosts = sweep_network(
        cidr=args.target,
        threads=args.threads,
        timeout=args.timeout,
        on_progress=lambda probed, total: report.print_progress(probed, total),
        on_found=lambda host: (report.print_progress_clear(), report.print_live_host(host)),
    )

    report.print_progress_clear()
    elapsed = time.perf_counter() - start
    report.print_discovery_end(len(live_hosts), host_count, elapsed)

    # Save results if --output was specified
    if args.output and live_hosts:
        with open(args.output, "w") as f:
            f.write(f"Host Discovery — {args.target}\n")
            f.write("=" * 40 + "\n")
            for host in live_hosts:
                hostname = f"  ({host.hostname})" if host.hostname else ""
                f.write(f"{host.ip}{hostname}\n")
        report.print_error(f"Hosts saved → {args.output}")


# ─────────────────────────────────────────────────────────────
#  MODE: PORT SCAN
#
#  Scans ports on a single target host.
#  This is the main mode — called when target is a hostname or IP.
# ─────────────────────────────────────────────────────────────

def run_port_scan(args: argparse.Namespace) -> None:
    """Run a port scan on a single target."""

    # Step 1 — resolve the target hostname to an IP address
    try:
        target, ip = resolve_target(args.target)
    except ValueError as e:
        report.print_error(str(e))
        sys.exit(1)

    # Step 2 — parse the port specification into a list of ints
    try:
        ports = parse_ports(args.ports)
    except ValueError as e:
        report.print_error(str(e))
        sys.exit(1)

    report.print_scan_start(target, ip, len(ports))

    # Step 3 — run the scan
    # We pass two callbacks:
    #   on_open     → print each open port immediately as it's found
    #   on_progress → update the progress bar after each port is checked
    #
    # The lambda for on_open clears the progress bar first, then prints
    # the result — otherwise the open port line would appear on top of
    # the progress bar and look garbled.
    start = time.perf_counter()

    results = scan_target(
        ip=ip,
        ports=ports,
        threads=args.threads,
        timeout=args.timeout,
        grab_banners=args.banners,
        on_open=lambda r: (
            report.print_progress_clear(),
            report.print_open_port(r),
        ),
        on_progress=lambda scanned, total: report.print_progress(scanned, total),
    )

    report.print_progress_clear()
    elapsed = time.perf_counter() - start

    # Step 4 — print the summary report
    report.print_scan_end(len(results), len(ports), elapsed)
    report.print_report(target, results, elapsed, len(ports))

    # Step 5 — save to file if --output was specified
    if args.output:
        report.save_report(target, results, elapsed, len(ports), args.output)


# ─────────────────────────────────────────────────────────────
#  MAIN
#
#  Entry point — parse args, print the banner, then route to
#  the correct mode based on the flags the user provided.
# ─────────────────────────────────────────────────────────────

def main() -> None:
    parser = build_parser()

    # Print help if no arguments are given instead of crashing
    if len(sys.argv) == 1:
        report.print_banner()
        parser.print_help()
        sys.exit(0)

    args = parser.parse_args()

    report.print_banner()

    # Route to discovery mode if --discover flag is set
    # OR if the target looks like a subnet (contains "/")
    if args.discover or "/" in args.target:
        run_discovery(args)
    else:
        run_port_scan(args)


if __name__ == "__main__":
    main()