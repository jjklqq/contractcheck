# contractcheck

## Structure

```
contractcheck/
  frontend/   # Vite + React + Tailwind CSS  (port 3000)
  backend/    # Python FastAPI               (port 8000)
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
