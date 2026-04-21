"""Tests for port scanning core."""

from unittest import mock

from scanner.core import ScanResult, scan_port, scan_target


def test_scan_port_closed():
    with mock.patch("scanner.core.socket.socket") as m_sock:
        instance = m_sock.return_value
        instance.connect_ex.return_value = 111  # connection refused-ish
        r = scan_port("127.0.0.1", 65534, timeout=0.5)
        assert r.state == "closed"
        assert r.port == 65534
        instance.close.assert_called_once()


def test_scan_port_open():
    with mock.patch("scanner.core.socket.socket") as m_sock:
        instance = m_sock.return_value
        instance.connect_ex.return_value = 0
        r = scan_port("127.0.0.1", 80, timeout=0.5)
        assert r.state == "open"


def test_scan_target_sorts_by_port():
    ports = [443, 22, 100]

    def fake_scan(ip, port, timeout, grab_banner=False):
        return ScanResult(
            port=port,
            state="open" if port in (22, 443) else "closed",
            service="test",
        )

    with mock.patch("scanner.core.scan_port", side_effect=fake_scan):
        results = scan_target("10.0.0.1", ports, threads=3, timeout=0.1)

    assert [r.port for r in results] == [22, 443]


def test_scan_target_empty():
    assert scan_target("127.0.0.1", [], threads=1, timeout=0.1) == []
