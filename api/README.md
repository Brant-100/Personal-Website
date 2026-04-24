# brantsimpson.com (api)

FastAPI service that serves the portfolio data (projects, services, credentials, experience).

## Setup

```powershell
cd api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8765
```

- Interactive docs: http://localhost:8765/docs
- OpenAPI spec:    http://localhost:8765/openapi.json

## Environment variables (Railway)

| Variable              | Required | Description                                                      |
|-----------------------|----------|------------------------------------------------------------------|
| `RESEND_API_KEY`      | Yes      | Resend API key — get from resend.com dashboard                   |
| `CONTACT_TO_EMAIL`    | Yes      | Where inquiry emails are sent (`brant@brantsimpson.com`)         |
| `CONTACT_FROM_EMAIL`  | Yes      | Sender address (`contact@brantsimpson.com`)                      |
| `TURNSTILE_SECRET_KEY`| Yes      | Cloudflare Turnstile secret key                                  |
| `TURNSTILE_BYPASS`    | Dev only | Set to `1` to skip Turnstile verification in tests               |

Set `TURNSTILE_BYPASS=1` locally (or in pytest) to test the inquiry endpoint without real keys.

## Endpoints

| Method | Path                 | Returns                                           |
|--------|----------------------|---------------------------------------------------|
| GET    | `/api/health`        | `{ status, service, version }`                    |
| GET    | `/api/projects`      | List of `Project` (Project Nexus, etc.)           |
| GET    | `/api/services`      | List of `Service` (Web Dev, UI/UX, ...)           |
| GET    | `/api/credentials`   | List of `Credential` (Sec+, LSSBB, ...)           |
| GET    | `/api/experience`    | List of `ExperienceEntry` (timeline)              |
| POST   | `/api/contact`       | Legacy contact form endpoint (kept for compat)    |
| POST   | `/api/inquiry`       | Full inquiry form — rate-limited, Turnstile, email |

## Editing data

All seed content lives in [`api/data/`](./data/):

- `projects.py`
- `services.py`
- `credentials.py`
- `experience.py`

Add an entry to the relevant list. Pydantic models in `main.py` enforce the schema.

## CORS

The API allows Vite dev origins (`http://localhost:5173`, `http://127.0.0.1:5173`) and
their preview counterparts. Adjust `ALLOWED_ORIGINS` in `main.py` for production.
