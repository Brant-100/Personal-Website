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
uvicorn main:app --reload --port 8000
```

- Interactive docs: http://localhost:8000/docs
- OpenAPI spec:    http://localhost:8000/openapi.json

## Endpoints

| Method | Path                | Returns                                  |
|--------|---------------------|------------------------------------------|
| GET    | `/api/health`       | `{ status, service, version }`           |
| GET    | `/api/projects`     | List of `Project` (Project Nexus, etc.)  |
| GET    | `/api/services`     | List of `Service` (Web Dev, UI/UX, ...)  |
| GET    | `/api/credentials`  | List of `Credential` (Sec+, LSSBB, ...)  |
| GET    | `/api/experience`   | List of `ExperienceEntry` (timeline)     |

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
