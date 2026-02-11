## Run Fluxo Locally (Beginner-Friendly)

### Option A: Setup Wizard + Start/Stop Buttons (Recommended)

1. Install Docker Desktop
2. Start the launcher:

```bash
cd launcher
npm install
npm start
```

1. Open the wizard:
- http://localhost:4000
1. Click **Start** inside the wizard.

---

### Option B: Plain Docker (No wizard)

```bash
cp .env.example .env
docker compose up --build
```

Frontend: [http://localhost:5173](http://localhost:5173/)

Backend: [http://localhost:8080](http://localhost:8080/)

 **Reset DB warning**:

```markdown
docker compose down -v
```