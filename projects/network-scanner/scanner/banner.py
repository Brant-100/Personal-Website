"""Best-effort TCP banner grabbing."""

# services aren't consistent. SSH immediately shouts its version at you the moment you connect. HTTP says nothing until you ask it something. 
# Unknown services might respond to a nudge or might stay silent. One approach doesn't work for all of them.
# so we need to be able to grab the banner from the service so that we can identify the service

"""
This tells us the software name and
often the version running on an open port.
 
Examples of banners:
    SSH:   "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3"
    FTP:   "220 ProFTPD 1.3.5 Server"
    HTTP:  "HTTP/1.1 200 OK ... Server: Apache/2.4.7"
    SMTP:  "220 mail.example.com ESMTP Postfix"
"""



import socket
# ─────────────────────────────────────────────────────────────
#  PORTS THAT SPEAK FIRST
#
#  Most services wait for YOU to say something before they
#  respond. But some services send a banner the moment you
#  connect, without waiting for input: we call these
#  "banner-first" services.
#
# banner: a banner is the first thing that a service sends when you connect to it example: "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3"
#  For everything else (like HTTP) we need to send a request
#  before the service will reply with anything useful.
# ─────────────────────────────────────────────────────────────
 
BANNER_FIRST_PORTS: set[int] = {
    21,   # FTP   : sends "220 Welcome" on connect
    22,   # SSH   : sends protocol version on connect
    25,   # SMTP  : sends "220 hostname ESMTP" on connect
    110,  # POP3  : sends "+OK" on connect
    143,  # IMAP  : sends "* OK" on connect
    993,  # IMAPS : sends "* OK" on connect
    995,  # POP3S : sends "+OK" on connect
}
 
# HTTP-based ports: we send a HEAD request to get the
# Server header back, which tells us the web server software
HTTP_PORTS: set[int] = {80, 443, 8080, 8443, 8888}
 
 
# ─────────────────────────────────────────────────────────────
#  MAIN FUNCTION: grab
#
#  Takes an already-open socket (passed in from core.py after
#  a successful connect_ex) and tries to read a banner from it.
#
#  Three strategies depending on the port:
#    1. Banner-first ports  → just read, service will send first
#    2. HTTP ports          → send HEAD request, read response
#    3. Everything else     → send a newline nudge, then read
#
#  We always return a string or None: never raise exceptions
#  here because a failed banner grab shouldn't crash the scan.
# ─────────────────────────────────────────────────────────────
 
def grab(sock: socket.socket, port: int, timeout: float = 2.0) -> str | None:
    """
    Attempt to read a service banner from an open socket.
 
    The socket has already completed a TCP handshake (from core.py).
    We just need to read or prompt the service to identify itself.
 
    Args:
        sock:    An open, connected TCP socket
        port:    The port number: used to decide our approach
        timeout: How long to wait for a response (default 2.0s)
 
    Returns:
        First line of the banner as a string, or None if nothing received
    """
    try:
        sock.settimeout(timeout)
 
        if port in BANNER_FIRST_PORTS:
            # Service will send something immediately on connect.
            # Just read whatever comes back.
            banner = _read(sock)
 
        elif port in HTTP_PORTS:
            # HTTP servers won't send anything until we make a request.
            # HEAD asks for headers only (no body): faster and lighter
            # than GET. The Server header tells us the web server name.
            request = b"HEAD / HTTP/1.0\r\nHost: target\r\n\r\n"
            sock.sendall(request)
            banner = _read(sock)
 
        else:
            # Unknown service: send a blank line as a nudge.
            # Some services respond to any input with their banner.
            # Many won't respond at all: that's fine, we return None.
            sock.sendall(b"\r\n")
            banner = _read(sock)
 
        return _clean(banner)
 
    except (socket.timeout, OSError, UnicodeDecodeError):
        # Timed out or connection dropped: not an error, just no banner
        return None
    finally:
        # Always close the socket when we're done
        # (core.py passed ownership of it to us)
        sock.close()
 
 
# ─────────────────────────────────────────────────────────────
#  _read
#
#  Reads raw bytes from the socket and decodes to a string.
#  We read up to 1024 bytes: enough to capture any banner,
#  but not so much that a chatty service slows us down.
# ─────────────────────────────────────────────────────────────
 
def _read(sock: socket.socket) -> str:
    """Read up to 1024 bytes from the socket and decode to string."""
    data = sock.recv(1024)
    # errors="ignore" drops any bytes that aren't valid UTF-8
    # so a weird character in a banner won't crash everything
    return data.decode("utf-8", errors="ignore")
 
 
# ─────────────────────────────────────────────────────────────
#   _clean
#
#  Banners often contain newlines, carriage returns, and extra
#  whitespace. We strip all that down to a single clean line
#  that's easy to display in a terminal or save to a report.
# ─────────────────────────────────────────────────────────────
 
def _clean(banner: str) -> str | None:
    """
    Strip whitespace and return just the first meaningful line.
 
    Returns None if the banner is empty after cleaning.
    """
    if not banner:
        return None
 
    # Split on newlines, grab the first non-empty line
    lines = [line.strip() for line in banner.splitlines()]
    first_line = next((line for line in lines if line), None)
 
    if not first_line:
        return None
 
    # Truncate to 120 chars: some banners are very long
    return first_line[:120]
 