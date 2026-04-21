"""Network scanner package: discovery, port scan, banners, reporting."""

from scanner.core import ScanResult, parse_ports, resolve_target, scan_target
from scanner.discovery import sweep_network

__all__ = [
    "ScanResult",
    "parse_ports",
    "resolve_target",
    "scan_target",
    "sweep_network",
    "__version__",
]

__version__ = "0.1.0"
