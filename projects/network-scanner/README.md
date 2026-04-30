# network-scanner

<!-- CI badge will activate once extracted to standalone repo Brant-100/network-scanner -->
<!-- [![CI](https://github.com/Brant-100/network-scanner/actions/workflows/ci.yml/badge.svg)](https://github.com/Brant-100/network-scanner/actions/workflows/ci.yml) -->

Python toolkit for host discovery (ping sweep), TCP port scanning, banner grabbing, and simple text/JSON reporting.

## Extraction instructions

This tool currently lives in `projects/network-scanner/` inside the Personal-Website monorepo. To extract it to a standalone repository:

```bash
# 1. Create a new repo: Brant-100/network-scanner on GitHub
# 2. From the Personal-Website root:
git subtree split --prefix projects/network-scanner -b network-scanner-branch
git push git@github.com:Brant-100/network-scanner.git network-scanner-branch:main
# 3. Enable GitHub Actions CI in the new repo (copy .github/workflows/ci.yml)
# 4. Uncomment the CI badge above
# 5. Pin the repo on your GitHub profile
```

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
