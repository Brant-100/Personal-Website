"""
scanner/report.py

All output lives here — terminal printing, color coding,
progress display, and saving results to a file.

Design principle:
    Nothing else in the scanner prints directly to the terminal.
    core.py, banner.py, and discovery.py are pure logic — they
    return data. This file is the only place that decides how
    that data looks to the user.

    This separation means I can swap out the terminal UI
    for a web dashboard or a GUI later without touching any
    of the scanning logic.
"""

import sys
from datetime import datetime
from typing import Optional

from scanner.core import ScanResult
from scanner.discovery import HostResult


# ─────────────────────────────────────────────────────────────
#  ANSI COLOR CODES
#
#  These are escape sequences that tell the terminal to change
#  text color. \033[ starts the sequence, the number picks the
#  color, and m ends it. \033[0m resets back to default.
#
#  We check sys.stdout.isatty() before using them — if output
#  is being piped to a file or another program, color codes
#  would show up as garbage characters, so we disable them.
# ─────────────────────────────────────────────────────────────

def _supports_color() -> bool:
    """Return True if the terminal supports ANSI color codes."""
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()


class Color:
    """ANSI color codes for terminal output."""
    _on = _supports_color()

    GREEN  = "\033[92m" if _on else ""
    YELLOW = "\033[93m" if _on else ""
    CYAN   = "\033[96m" if _on else ""
    RED    = "\033[91m" if _on else ""
    BOLD   = "\033[1m"  if _on else ""
    DIM    = "\033[2m"  if _on else ""
    RESET  = "\033[0m"  if _on else ""


# ─────────────────────────────────────────────────────────────
#  BANNER
#
#  Printed once at startup. Purely cosmetic — but it makes
#  the tool look professional and signals what mode it's in.
# ─────────────────────────────────────────────────────────────

BANNER = f"""
{Color.CYAN}{Color.BOLD}
  ███╗   ██╗███████╗████████╗███████╗ ██████╗ █████╗ ███╗   ██╗
  ████╗  ██║██╔════╝╚══██╔══╝██╔════╝██╔════╝██╔══██╗████╗  ██║
  ██╔██╗ ██║█████╗     ██║   ███████╗██║     ███████║██╔██╗ ██║
  ██║╚██╗██║██╔══╝     ██║   ╚════██║██║     ██╔══██║██║╚██╗██║
  ██║ ╚████║███████╗   ██║   ███████║╚██████╗██║  ██║██║ ╚████║
  ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝
{Color.RESET}{Color.DIM}  Reconnaissance Phase Tool  |  Cybersecurity Portfolio
  For authorized use only — never scan systems you don't own :)
{Color.RESET}"""


def print_banner() -> None:
    """Print the startup banner."""
    print(BANNER)


# ─────────────────────────────────────────────────────────────
#  SCAN START / END MESSAGES
# ─────────────────────────────────────────────────────────────

def print_scan_start(target: str, ip: str, port_count: int) -> None:
    """Print information about the scan before it begins."""
    print(f"\n{Color.CYAN}[*]{Color.RESET} Target   : {Color.BOLD}{target}{Color.RESET}", end="")
    if ip != target:
        print(f"  {Color.DIM}({ip}){Color.RESET}", end="")
    print()
    print(f"{Color.CYAN}[*]{Color.RESET} Ports     : {port_count} ports to scan")
    print(f"{Color.CYAN}[*]{Color.RESET} Started   : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")


def print_scan_end(open_count: int, total_ports: int, elapsed: float) -> None:
    """Print a summary line after the scan completes."""
    print(f"\n{Color.CYAN}[*]{Color.RESET} Scanned  : {total_ports} ports in {elapsed:.2f}s")
    if open_count > 0:
        print(f"{Color.GREEN}[+]{Color.RESET} Found    : {Color.BOLD}{Color.GREEN}{open_count} open port(s){Color.RESET}")
    else:
        print(f"{Color.YELLOW}[-]{Color.RESET} Found    : no open ports")


# ─────────────────────────────────────────────────────────────
#  LIVE PORT RESULT
#
#  Called by the on_open callback in core.py immediately when
#  a port is found open — so results stream to the terminal
#  in real time rather than waiting for the full scan to finish.
# ─────────────────────────────────────────────────────────────

def print_open_port(result: ScanResult) -> None:
    """
    Print a single open port result to the terminal.

    Called live during scanning via the on_open callback,
    so the user sees results as they're discovered.
    """
    port_col    = f"{Color.BOLD}{Color.CYAN}{result.port:<6}{Color.RESET}"
    state_col   = f"{Color.GREEN}open{Color.RESET}"
    service_col = f"{Color.YELLOW}{result.service:<14}{Color.RESET}"
    banner_col  = f"{Color.DIM}{result.banner}{Color.RESET}" if result.banner else ""

    print(f"  {port_col}/tcp  {state_col}  {service_col}  {banner_col}")


# ─────────────────────────────────────────────────────────────
#  PROGRESS BAR
#
#  Printed on a single line that gets overwritten with \r
#  so it updates in place rather than spamming new lines.
#
#  \r moves the cursor back to the start of the current line.
#  The next print overwrites what was there.
#  We flush immediately so the update shows up in real time.
# ─────────────────────────────────────────────────────────────

def print_progress(scanned: int, total: int) -> None:
    """
    Print an in-place progress bar on the current terminal line.

    Uses \\r to overwrite the same line rather than printing new ones.
    Call print_progress_clear() when done to clean up the line.
    """
    pct = scanned / total if total > 0 else 0
    filled = int(pct * 30)
    bar = "█" * filled + "░" * (30 - filled)
    print(
        f"\r  {Color.DIM}[{bar}] {scanned}/{total} ({pct:.0%}){Color.RESET}",
        end="",
        flush=True,
    )


def print_progress_clear() -> None:
    """Clear the progress bar line after scanning completes."""
    print("\r" + " " * 60 + "\r", end="", flush=True)


# ─────────────────────────────────────────────────────────────
#  HOST DISCOVERY OUTPUT
# ─────────────────────────────────────────────────────────────

def print_discovery_start(cidr: str, host_count: int) -> None:
    """Print information before a host discovery sweep begins."""
    print(f"\n{Color.CYAN}[*]{Color.RESET} Network  : {Color.BOLD}{cidr}{Color.RESET}")
    print(f"{Color.CYAN}[*]{Color.RESET} Probing  : {host_count} possible hosts\n")


def print_live_host(host: HostResult) -> None:
    """
    Print a single live host result during discovery.

    Called live via the on_found callback in discovery.py.
    """
    ip_col       = f"{Color.BOLD}{Color.GREEN}{host.ip:<18}{Color.RESET}"
    hostname_col = f"{Color.DIM}{host.hostname}{Color.RESET}" if host.hostname else ""
    print(f"  {Color.GREEN}[UP]{Color.RESET}  {ip_col}  {hostname_col}")


def print_discovery_end(live_count: int, total: int, elapsed: float) -> None:
    """Print a summary after host discovery completes."""
    print(f"\n{Color.CYAN}[*]{Color.RESET} Probed  : {total} hosts in {elapsed:.2f}s")
    if live_count > 0:
        print(f"{Color.GREEN}[+]{Color.RESET} Live    : {Color.BOLD}{Color.GREEN}{live_count} host(s) found{Color.RESET}\n")
    else:
        print(f"{Color.YELLOW}[-]{Color.RESET} Live    : no hosts responded\n")


# ─────────────────────────────────────────────────────────────
#  FULL SCAN REPORT (terminal)
#
#  Printed after the scan is complete — a clean summary table
#  of all open ports. Complements the live output above.
# ─────────────────────────────────────────────────────────────

def print_report(
    target: str,
    results: list[ScanResult],
    elapsed: float,
    total_ports: int,
) -> None:
    """
    Print a formatted summary report to the terminal.

    Args:
        target:      Original target string (hostname or IP)
        results:     List of open ScanResult objects
        elapsed:     Total scan time in seconds
        total_ports: Total number of ports that were scanned
    """
    divider = f"{Color.DIM}{'─' * 56}{Color.RESET}"

    print(f"\n{divider}")
    print(f"  {Color.BOLD}SCAN REPORT{Color.RESET}  {Color.DIM}—  {target}{Color.RESET}")
    print(divider)
    print(f"  Duration   : {elapsed:.2f}s")
    print(f"  Ports      : {total_ports} scanned")
    print(f"  Open       : {len(results)}")
    print(f"  Timestamp  : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(divider)

    if results:
        # Column headers
        print(f"  {'PORT':<8} {'STATE':<8} {'SERVICE':<16} BANNER")
        print(f"  {Color.DIM}{'─'*6}   {'─'*6}   {'─'*14}   {'─'*28}{Color.RESET}")

        for r in results:
            port_col    = f"{Color.CYAN}{r.port:<8}{Color.RESET}"
            state_col   = f"{Color.GREEN}{'open':<8}{Color.RESET}"
            service_col = f"{Color.YELLOW}{r.service:<16}{Color.RESET}"
            banner_col  = f"{Color.DIM}{r.banner or ''}{Color.RESET}"
            print(f"  {port_col} {state_col} {service_col} {banner_col}")
    else:
        print(f"\n  {Color.YELLOW}No open ports found in scanned range.{Color.RESET}")

    print(divider)
    print(f"  {Color.DIM}⚠  Authorized use only.{Color.RESET}\n")


# ─────────────────────────────────────────────────────────────
#  SAVE TO FILE
#
#  Writes a plain text version of the report to disk.
#  No ANSI color codes in the file — they'd show as garbage
#  in a text editor. Plain text is readable anywhere.
# ─────────────────────────────────────────────────────────────

def save_report(
    target: str,
    results: list[ScanResult],
    elapsed: float,
    total_ports: int,
    filepath: str,
) -> None:
    """
    Save scan results to a plain text file.

    Args:
        target:      Original target string
        results:     List of open ScanResult objects
        elapsed:     Total scan time in seconds
        total_ports: Total number of ports scanned
        filepath:    Path to write the output file
    """
    with open(filepath, "w") as f:
        f.write("NETWORK SCAN REPORT\n")
        f.write("=" * 50 + "\n")
        f.write(f"Target     : {target}\n")
        f.write(f"Duration   : {elapsed:.2f}s\n")
        f.write(f"Ports      : {total_ports} scanned\n")
        f.write(f"Open       : {len(results)}\n")
        f.write(f"Timestamp  : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 50 + "\n\n")

        if results:
            f.write(f"{'PORT':<8} {'STATE':<8} {'SERVICE':<16} BANNER\n")
            f.write("-" * 60 + "\n")
            for r in results:
                banner = r.banner or ""
                f.write(f"{r.port:<8} {'open':<8} {r.service:<16} {banner}\n")
        else:
            f.write("No open ports found.\n")

        f.write("\nAuthorized use only.\n")

    print(f"\n{Color.CYAN}[+]{Color.RESET} Report saved → {Color.BOLD}{filepath}{Color.RESET}\n")


# ─────────────────────────────────────────────────────────────
#  ERROR MESSAGES
# ─────────────────────────────────────────────────────────────

def print_error(message: str) -> None:
    """Print a formatted error message to stderr."""
    print(f"{Color.RED}[!]{Color.RESET} Error: {message}", file=sys.stderr)