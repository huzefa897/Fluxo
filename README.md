# Fluxo (Pearl Dental Care Inventory) — Run Locally with Docker

Fluxo is a simple inventory management app with:

- **Frontend** (React)
- **Backend** (Spring Boot)
- **Database** (PostgreSQL)

This repo is set up so anyone can run the full app locally on **any machine** using Docker.

---

## Prerequisites

Install:

- **Docker Desktop** (includes Docker Compose)

Verify:

```bash
docker --version
docker compose version
```

---

## Quick Start (Recommended)

### 1) Clone the repo

```bash
gitclone https://github.com/huzefa897/Fluxo.gitcd Fluxo
```

### 2) Create env file

Create a `.env` file in the **repo root** (same folder as `docker-compose.yml`).

You can copy from an example if present:

```bash
cp .env.example .env
```

If you don’t have an example yet, create `.env` manually with:

```
POSTGRES_DB=fluxo
POSTGRES_USER=fluxo
POSTGRES_PASSWORD=fluxo

BACKEND_PORT=8080
FRONTEND_PORT=5173

VITE_API_URL=http://localhost:8080
VITE_API_PREFIX=
FRONTEND_URL=http://localhost:5173
```

> If your backend routes are under `/api`, set:
> 
> 
> `VITE_API_PREFIX=/api`
> 

---

### 3) Build and run everything

```bash
docker compose up --build
```

Open:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080

To stop:

```bash
docker compose down
```

---

## Data Persistence (Local Database Storage)

Your database is stored locally using a Docker volume, so data stays even after restart.

- Stop containers (keeps data):

```bash
docker compose down
```

- Stop containers and **wipe database**:

```bash
docker compose down -v
```

---

## Useful Commands

### View running containers

```bash
docker ps
```

### View backend logs

```bash
docker logs -f fluxo_backend
```

### View frontend logs

```bash
docker logs -f fluxo_frontend
```

### View database logs

```bash
docker logs -f fluxo_db
```

### Rebuild everything from scratch

```bash
docker compose down -v
docker compose up --build
```

---

## Troubleshooting

### 1) Frontend shows API “Not Found” (404)

This usually means the frontend is calling the wrong API base URL.

Check your `.env`:

- `VITE_API_URL` should be:
    - `http://localhost:8080`
- If your backend endpoints are prefixed (example `/api/products`), set:
    - `VITE_API_PREFIX=/api`

Then rebuild:

```bash
docker compose up --build
```

---

### 2) CORS error in browser

Backend must allow requests from the frontend origin:

- `http://localhost:5173`

Make sure `.env` contains:

```
FRONTEND_URL=http://localhost:5173
```

---

### 3) Port already in use

If you already have something running on 8080 or 5173, change ports in `.env`:

```
BACKEND_PORT=8081
FRONTEND_PORT=5174
VITE_API_URL=http://localhost:8081
FRONTEND_URL=http://localhost:5174
```

Then run:

```bash
docker compose up --build
```

---

## Project Structure (High Level)

```
Fluxo/
  Backend/# Spring Boot API
  Frontend/# React UI
  docker-compose.yml
  .env / .env.example
```

---

## Notes

- This setup is meant for **local** usage on any machine via Docker.
- Database runs locally and stores data locally using Docker volumes.

---