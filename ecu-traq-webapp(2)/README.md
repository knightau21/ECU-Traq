# ECU Pitching Program Manager — Web App (FastAPI + React + PWA)

This is a production‑ready starter to run a **TRAQ‑style** system for ECU in a browser and as an **installable app** (PWA).

## What you get
- **Backend**: FastAPI + SQLite (SQLAlchemy), JWT auth, CORS
- **Frontend**: React (Vite + TypeScript), PWA (Add to Home Screen), jsPDF export
- **Features**: Roster, Week Templates, Assignments, Daily Log, Readiness, simple dashboard
- **PDF**: Per‑player weekly plan export
- **Docker**: `docker compose up` for local or server deploy
- **Mobile App**: Wrap the PWA with **Capacitor** to ship iOS/Android

## Quick start (Docker)
```bash
docker compose up --build
# Frontend at http://localhost:5173
# Backend at  http://localhost:8000
```

## Manual start (dev)
Backend:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm i
npm run dev
```

## Deploy options
- **All‑Docker server** (e.g., a $5–$10 VPS): `docker compose up -d --build`
- **Managed**: Render/Fly/Heroku for backend + Vercel/Netlify for frontend (set VITE_API_URL to backend URL).

## Make it an app
This project ships as a **PWA** (installable). To ship to App Store/Play Store:
1. `cd frontend && npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`
2. `npx cap init ecu-traq com.ecu.traq`
3. Set `server.url` in `capacitor.config.ts` to your deployed frontend URL (https).
4. `npx cap add ios && npx cap add android`
5. `npm run build && npx cap copy`
6. Open Xcode/Android Studio for signing & store submission.

## Importing from the Excel system
Use the **Import** buttons in the UI to upload CSVs exported from your Excel sheets (Roster, Week_Templates, Assignments).

## Admin user
On first run, an **admin** user is created:
- Email: `admin@ecu.local`
- Password: `admin123`  (change immediately in Settings)

