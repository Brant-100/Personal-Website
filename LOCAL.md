# Local dev — quick start

Run **two terminals** from the repo root: **API** first, then **client** (Vite).

Local API port is **8765** (not 8000) so Windows is less likely to hit **WinError 10013** when binding the socket.

| Service | URL |
|--------|-----|
| API | http://localhost:8765 |
| Frontend | http://localhost:5173 |

`client/.env.development` sets `VITE_API_BASE_URL` for `npm run dev`. Override with `client/.env` or `client/.env.local` if you use a different API port.

---

## First time only

**API**

```powershell
cd api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Client** (pick one)

```powershell
# From repo root — also runs npm ci in client/
npm install
```

```powershell
cd client
npm install
```

---

## Every session

**Terminal 1 — API** (no venv activation needed)

```powershell
cd api
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8765
```

**Terminal 2 — client**

```powershell
cd client
npm run dev
```

If `npm` is not recognized (Node installed but PATH not updated), use the full path:

```powershell
cd client
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Smoke check: http://localhost:8765/api/health

---

## Troubleshooting

**`Activate.ps1` is not recognized**

The `api\.venv` folder only exists after you run `python -m venv .venv` from `api` (first-time setup). If you never did that, there is no `Scripts\Activate.ps1` yet — run the **First time only → API** block, then try **Every session** again.

**`localhost` cannot reach the API (connection failed / timed out)**

On some Windows setups, `localhost` resolves to IPv6 (`::1`) while uvicorn listens on `127.0.0.1`. The client uses `http://127.0.0.1:8765` via `client/.env.development`. After changing env files, restart `npm run dev`.

**Execution policy blocks activation**

PowerShell may refuse `Activate.ps1` with "running scripts is disabled". You do **not** need to activate the venv — use the **Every session → API** command (`python -m uvicorn ...`) instead.

Optional fix if you want activation to work:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Avoid `venv\Scripts\...`**

That path is wrong here: `venv` is a Python *module*, not your env folder. This project uses the folder name **`.venv`**.

**`pip install` fails with WinError 32 (file in use)**

Another process (antivirus, IDE, an old Python process) may be locking files under `.venv`. Close other terminals using that env, wait a few seconds, then run `pip install -r requirements.txt` again inside the activated venv.

**`uvicorn` fails with WinError 10013 (socket / access permissions)**

The port is **already taken** or **blocked/reserved** on Windows.

1. Check the port you are using (default **8765**):

   ```powershell
   netstat -ano | findstr ":8765"
   ```

   If something is listening, stop that process or pick a new port.

2. Run the API on another port and point the client at it.

   **API terminal:**

   ```powershell
   uvicorn main:app --reload --host 127.0.0.1 --port 8080
   ```

   **Client:** set `VITE_API_BASE_URL` in `client/.env.local` (gitignored) or edit `client/.env.development`:

   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

   Restart `npm run dev` after changing env files.

3. On some PCs, **Hyper-V / WSL** reserves ranges of ports; if your chosen port conflicts, try a high port (e.g. `9888`) the same way as in step 2.

**`python -m venv .venv` says it cannot copy `venvlauncher.exe`**

The folder may be locked (antivirus, sync, another Python). Close extra apps, delete `api\.venv` if it is half-created, wait a moment, then run `python -m venv .venv` again.

---

## Optional

- **shadcn** (only if you are regenerating UI primitives): see the “First-time setup” section in [README.md](./README.md).
- **Lint (client):** `cd client` → `npm run lint`
