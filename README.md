# brantsimpson.com

[![CI](https://github.com/Brant-100/Personal-Website/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/Brant-100/Personal-Website/actions/workflows/ci.yml)

Personal portfolio for **Brant Simpson**, Software Developer and cybersecurity professional.

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion + shadcn/ui
- **Backend:** FastAPI (Python)

The site ships with two visually distinct themes:

- **Dark:** sleek cyber/hacker aesthetic (slate/black backgrounds, neon cyan/purple/matrix-green accents, monospaced code feel).
- **Light:** bright and vibrant (electric orange, electric blue, vivid yellow accents on clean off-white).

## Project layout

```
brantsimpson.com/
  api/        FastAPI backend serving portfolio JSON
  client/     React (Vite) frontend
```

## Running locally

You'll want two terminals: one for the API, one for the frontend.

### 1. Backend (FastAPI)

```powershell
cd api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with endpoints:

- `GET /api/health`
- `GET /api/projects`
- `GET /api/services`
- `GET /api/credentials`
- `GET /api/experience`

### 2. Frontend (Vite)

```powershell
cd client
npm install
npm run dev
```

Dev server: `http://localhost:5173`.

The frontend expects the API at `http://localhost:8000` (configurable via `VITE_API_BASE_URL` in a `.env` file).

## First-time setup

If the `client/` directory doesn't yet have `node_modules`, after `npm install` you may also want to run the shadcn init once:

```powershell
cd client
npx shadcn@latest init
npx shadcn@latest add button card badge separator
```

Everything else (Tailwind config, theme tokens, components) is pre-wired.
