# network-scanner

Python toolkit for host discovery (ping sweep), TCP port scanning, banner grabbing, and simple text/JSON reporting.

## Layout

```
scanner/          # package
  core.py         # port scanning engine
  discovery.py    # host discovery (CIDR ping sweep)
  banner.py       # banner grabbing
  report.py       # output & reporting helpers
tests/
  test_core.py
main.py           # CLI
requirements.txt
README.md
```

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

## CLI

```bash
python main.py discover 192.168.1.0/24
python main.py scan 192.168.1.1 -p 22,80,443,8000-8010
python main.py banner 192.168.1.1 22
```

Add `--json` on `discover` or `scan` for JSON output.

## Tests

```bash
pytest tests/ -q
```

## Notes

- Discovery uses the system `ping` command; behavior and privileges depend on the OS.
- Port scans are TCP connect scans; respect network policy and only scan networks you are allowed to test.
