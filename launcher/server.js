const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.LAUNCHER_PORT || 4000;

// Fluxo repo root: launcher/ is inside repo
const FLUXO_ROOT = path.resolve(__dirname, "..");

// Basic JSON + CORS (if you open setup via file:// it may need CORS)
app.use(cors());
app.use(express.json());

// Serve the setup UI from /setup
app.use("/", express.static(path.join(FLUXO_ROOT, "setup")));

/**
 * Runs: docker compose <args...> in repo root.
 * If stream=true, streams output to response (text/plain).
 * Otherwise collects output and returns it.
 */
function dockerCompose(args, { stream = false, res = null } = {}) {
  const proc = spawn("docker", ["compose", ...args], {
    cwd: FLUXO_ROOT,
    shell: process.platform === "win32", // helps Windows PATH resolution
  });

  if (stream && res) {
    proc.stdout.on("data", (d) => res.write(d.toString()));
    proc.stderr.on("data", (d) => res.write(d.toString()));
    return new Promise((resolve) => {
      proc.on("close", (code) => resolve({ code }));
    });
  }

  return new Promise((resolve) => {
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (out += d.toString()));
    proc.on("close", (code) => resolve({ code, out }));
  });
}

function writeEnvFile(envObj) {
  const required = [
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "BACKEND_PORT",
    "FRONTEND_PORT",
    "VITE_API_URL",
    "VITE_API_PREFIX",
    "FRONTEND_URL",
  ];

  for (const key of required) {
    if (envObj[key] === undefined || envObj[key] === null) {
      throw new Error(`Missing field: ${key}`);
    }
  }

  const envText = `POSTGRES_DB=${envObj.POSTGRES_DB}
POSTGRES_USER=${envObj.POSTGRES_USER}
POSTGRES_PASSWORD=${envObj.POSTGRES_PASSWORD}

BACKEND_PORT=${envObj.BACKEND_PORT}
FRONTEND_PORT=${envObj.FRONTEND_PORT}

VITE_API_URL=${envObj.VITE_API_URL}
VITE_API_PREFIX=${envObj.VITE_API_PREFIX}
FRONTEND_URL=${envObj.FRONTEND_URL}
`;

  fs.writeFileSync(path.join(FLUXO_ROOT, ".env"), envText, "utf-8");
}

async function getComposePs() {
  // Use JSON output if available; fallback to plain if not
  // docker compose ps --format json (supported on recent versions)
  const { code, out } = await dockerCompose(["ps", "--format", "json"]);
  if (code === 0) {
    try {
      return JSON.parse(out || "[]");
    } catch {
      // fall through
    }
  }
  const fallback = await dockerCompose(["ps"]);
  return { raw: fallback.out, code: fallback.code };
}

function extractRunningInfo(psResult) {
  // If psResult is array, parse statuses
  if (Array.isArray(psResult)) {
    const services = psResult.map((s) => ({
      name: s?.Name || s?.Service || "unknown",
      service: s?.Service,
      state: s?.State,
      status: s?.Status,
      ports: s?.Publishers || s?.Ports || [],
    }));

    const anyRunning = services.some((s) => {
      const state = (s.state || "").toLowerCase();
      const status = (s.status || "").toLowerCase();
      return state.includes("running") || status.includes("running");
    });

    return { anyRunning, services };
  }

  // fallback raw text
  const raw = psResult?.raw || "";
  const anyRunning = /Up\s|running/i.test(raw);
  return { anyRunning, services: [], raw };
}

// ---------- Health ----------
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    launcher: "running",
    repoRoot: FLUXO_ROOT,
  });
});

// ---------- Status (friendly) ----------
app.get("/status", async (_req, res) => {
  const ps = await getComposePs();
  const info = extractRunningInfo(ps);

  res.json({
    ok: true,
    running: info.anyRunning,
    services: info.services,
    raw: info.raw,
    urls: {
      frontend: "http://localhost:" + (process.env.FRONTEND_PORT || "5173"),
      backend: "http://localhost:" + (process.env.BACKEND_PORT || "8080"),
    },
    tip: info.anyRunning
      ? "Fluxo appears to be running. Use /logs or click Logs in the UI."
      : "Fluxo is not running. Click Start to bring it up.",
  });
});

// ---------- Logs (tail) ----------
app.get("/logs", async (req, res) => {
  const tail = String(req.query.tail || "200");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  await dockerCompose(["logs", "--tail", tail], { stream: true, res });
  res.end();
});

// ---------- Start (safe) ----------
/**
 * POST /start
 * Body: env object (your fields)
 * Query:
 *   ?rebuild=1  -> forces --build
 *   ?forceEnv=1 -> overwrites .env even if already running
 */
app.post("/start", async (req, res) => {
  const rebuild = req.query.rebuild === "1";
  const forceEnv = req.query.forceEnv === "1";

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // Check current status first
  const ps = await getComposePs();
  const info = extractRunningInfo(ps);

  if (info.anyRunning && !forceEnv) {
    res.write("✅ Fluxo is already running.\n");
    res.write("Tip: Use Stop if you want to restart it.\n\n");
    res.write("Showing current status:\n");
    await dockerCompose(["ps"], { stream: true, res });
    res.end();
    return;
  }

  // Only write .env when starting or if forced
  try {
    writeEnvFile(req.body || {});
    res.write("✅ Wrote .env in repo root\n");
  } catch (e) {
    res.statusCode = 400;
    res.end(`❌ ${e.message}\n`);
    return;
  }

  // Bring up without rebuild by default
  const args = rebuild ? ["up", "-d", "--build"] : ["up", "-d"];

  res.write(`\n🚀 Starting Fluxo (${rebuild ? "with rebuild" : "no rebuild"})...\n\n`);
  await dockerCompose(args, { stream: true, res });

  res.write("\n\n✅ Done.\n");
  res.write("Frontend: http://localhost:" + (req.body?.FRONTEND_PORT || "5173") + "\n");
  res.write("Backend:  http://localhost:" + (req.body?.BACKEND_PORT || "8080") + "\n");
  res.end();
});

// ---------- Stop (safe) ----------
/**
 * POST /stop
 * Query:
 *   ?removeVolumes=1 -> will run down -v (dangerous)
 *   You must also pass header: X-CONFIRM-RESET: YES to actually remove volumes.
 */
app.post("/stop", async (req, res) => {
  const removeVolumes = req.query.removeVolumes === "1";
  const confirm = (req.header("X-CONFIRM-RESET") || "").toUpperCase() === "YES";

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (removeVolumes && !confirm) {
    res.status(400).end(
      "❌ Refusing to delete database volume.\n" +
        "If you really want to wipe DB, call:\n" +
        "POST /stop?removeVolumes=1 with header X-CONFIRM-RESET: YES\n"
    );
    return;
  }

  res.write(`🛑 Stopping Fluxo${removeVolumes ? " (and removing volumes!)" : ""}...\n\n`);
  const args = removeVolumes ? ["down", "-v"] : ["down"];
  await dockerCompose(args, { stream: true, res });
  res.end("\n✅ Stopped.\n");
});

// ---------- Reset DB (separate endpoint, extra safe) ----------
/**
 * POST /reset-db
 * Requires header: X-CONFIRM-RESET: YES
 * Runs: docker compose down -v
 */
app.post("/reset-db", async (req, res) => {
  const confirm = (req.header("X-CONFIRM-RESET") || "").toUpperCase() === "YES";
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (!confirm) {
    res.status(400).end(
      "❌ Reset blocked.\n" +
        "This deletes your local database volume.\n" +
        "To confirm, call POST /reset-db with header X-CONFIRM-RESET: YES\n"
    );
    return;
  }

  res.write("💥 Resetting DB (docker compose down -v)...\n\n");
  await dockerCompose(["down", "-v"], { stream: true, res });
  res.end("\n✅ Database volume deleted.\n");
});

// ---------- Nice 404 ----------
app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    endpoints: ["/health", "/status", "/start", "/stop", "/logs", "/reset-db"],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Fluxo Launcher running at http://localhost:${PORT}`);
  console.log(`Serving setup UI from: ${path.join(FLUXO_ROOT, "setup")}`);
});
