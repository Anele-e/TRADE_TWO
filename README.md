# TRADE TWO

TRADE TWO is a simple trade-work matching app. Workers register with their trade skills, clients search for the type of work they need, and the app shows nearby people around the Stellenbosch and Paarl areas.

## What The Project Does

- Register as a client or worker.
- Workers choose trade skills like plumbing, electrical work, painting, tiling, and carpentry.
- Clients can search for workers by skill.
- Workers can see nearby clients.
- Clients can see nearby workers.
- Logged-in users can edit their profile.

## Tech Stack

- Frontend: React with Vite
- Backend: FastAPI
- Data: temporary in-memory data inside the backend

## Setup On Your Own Device

### 1. Clone The Project

```bash
git clone https://github.com/Anele-e/TRADE_TWO.git
cd TRADE_TWO
```

### 2. Start The Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend should run at:

```text
http://127.0.0.1:8000
```

### 3. Start The Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend should run at:

```text
http://127.0.0.1:5173
```

If your backend is running on another port, start the frontend like this:

```bash
VITE_API_URL=http://127.0.0.1:8001 npm run dev
```

## Demo Logins

```text
Worker: neo_plumber / password
Worker: ama_electric / password
Client: thabo_client / password
Client: lerato_home / password
```

## Note

The backend currently stores data in memory. New registrations and profile edits will reset when the backend server restarts.
