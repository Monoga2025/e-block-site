# E-block

A residential building app for residents and admins: sign-in, a dashboard, and bookings for shared amenities such as laundry machines and the kitchen. It pairs a FastAPI + SQLite backend with a React (Vite, TypeScript, Tailwind) frontend, and includes a sales funnel page and a generated demo video pipeline.

## Features

- Cookie-based session login and logout (`/api/auth/*`), with a `/api/auth/me` check.
- Resident dashboard and rent status (`/api/dashboard`, `/api/rent/status`).
- Laundry: machine list, availability, reservations, and an admin "mark as paid" step.
- Kitchen: availability and reservations.
- Sales funnel page (`sales/eblock-sales-funnel.html`) and a scripted demo-video project.

## Stack

- Backend: Python, FastAPI, Uvicorn, Pydantic, SQLite (`app.py`).
- Frontend: React, TypeScript, Vite, Tailwind CSS (`frontend/app/`).
- Demo video: Node.js, Playwright, text-to-speech narration, HyperFrames compositions (`sales/demo-video/`).
- Deployment: Railway (`railway.toml`, `Procfile`, Railpack build).

## Structure

- `app.py`: API server, database setup and business rules.
- `frontend/app/`: React single-page app.
- `scripts/`: browser checks and a laundry-bundle test.
- `sales/`: sales funnel page and demo-video project.
- `design-reference/`, `docs/product/`: design approval notes and product documentation.

## How to run

```bash
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

cd frontend/app
npm ci
npm run dev
```

The SQLite file (`eblock.db`) is created locally and is not included.

## Honest status

- Working prototype. The API server, the frontend and the laundry flow exist in the code. Real production data and payment processing are not included.
- The demo video assets (rendered video and voice files) were removed to keep the repository small; the generator scripts remain.
- Seed and sample data should be reviewed before any real deployment.
