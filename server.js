const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { getCodingActivity } = require("./activity-service");

const root = __dirname;
const scorePath = path.join(root, "data", "snake-best.json");
const mimeTypes = { ".css": "text/css", ".js": "application/javascript", ".html": "text/html", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

const CLOUD_APP_KEY = "f0gviv8p";
const CLOUD_RECORD_KEY = "rishifishyy_snake_world_record";

function readLocalBestScore() {
  try { return Math.max(0, Number(JSON.parse(fs.readFileSync(scorePath, "utf8")).bestScore) || 0); } catch { return 0; }
}

let currentBestScore = readLocalBestScore();

function fetchCloudBestScore() {
  return new Promise((resolve) => {
    const req = https.get(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${CLOUD_APP_KEY}/${CLOUD_RECORD_KEY}`, {
      family: 4,
      timeout: 4000
    }, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        try {
          const val = Number(JSON.parse(d));
          if (Number.isFinite(val) && val >= 0) resolve(val);
          else resolve(0);
        } catch {
          resolve(0);
        }
      });
    });
    req.on("error", () => resolve(0));
    req.on("timeout", () => { req.destroy(); resolve(0); });
  });
}

function syncCloudBestScore(newScore) {
  return new Promise((resolve) => {
    const req = https.request(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${CLOUD_APP_KEY}/${CLOUD_RECORD_KEY}/${newScore}`, {
      method: "POST",
      family: 4,
      timeout: 4000
    }, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve(true));
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
    req.end();
  });
}

// Initial cloud sync
fetchCloudBestScore().then(cloudScore => {
  if (cloudScore > currentBestScore) {
    currentBestScore = cloudScore;
    try { fs.writeFileSync(scorePath, JSON.stringify({ bestScore: currentBestScore }, null, 2)); } catch {}
  } else if (currentBestScore > cloudScore && currentBestScore > 0) {
    syncCloudBestScore(currentBestScore);
  }
});

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 
    "Content-Type": "application/json", 
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  });
  response.end(JSON.stringify(payload));
}

http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === "/api/coding-activity") {
    if (request.method !== "GET") return sendJson(response, 405, { error: "Method not allowed" });
    try {
      const refresh = url.searchParams.get("refresh") === "true";
      const activityData = await getCodingActivity(refresh);
      return sendJson(response, 200, activityData);
    } catch (err) {
      return sendJson(response, 500, { error: "Failed to load activity data" });
    }
  }

  if (url.pathname === "/api/snake-best") {
    if (request.method === "GET") {
      // Periodically refresh from cloud
      fetchCloudBestScore().then(cloudScore => {
        if (cloudScore > currentBestScore) {
          currentBestScore = cloudScore;
          try { fs.writeFileSync(scorePath, JSON.stringify({ bestScore: currentBestScore }, null, 2)); } catch {}
        }
      });
      return sendJson(response, 200, { bestScore: currentBestScore });
    }
    if (request.method === "POST") {
      let body = "";
      request.on("data", chunk => { body += chunk; if (body.length > 1024) request.destroy(); });
      request.on("end", async () => {
        try {
          const submittedScore = Math.floor(Number(JSON.parse(body).score));
          if (!Number.isFinite(submittedScore) || submittedScore < 0 || submittedScore > 1000000) return sendJson(response, 400, { error: "Invalid score" });
          if (submittedScore > currentBestScore) {
            currentBestScore = submittedScore;
            try { fs.writeFileSync(scorePath, JSON.stringify({ bestScore: currentBestScore }, null, 2)); } catch {}
            syncCloudBestScore(currentBestScore);
          }
          return sendJson(response, 200, { bestScore: currentBestScore });
        } catch { return sendJson(response, 400, { error: "Invalid request" }); }
      });
      return;
    }
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.resolve(root, `.${requestedPath}`);
  if (!filePath.startsWith(root)) return response.end("Forbidden");
  fs.readFile(filePath, (error, content) => {
    if (error) { response.writeHead(error.code === "ENOENT" ? 404 : 500); return response.end("Not found"); }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream", "Cache-Control": "no-cache" });
    response.end(content);
  });
}).listen(4173, "0.0.0.0", () => console.log("Portfolio available at http://localhost:4173"));
