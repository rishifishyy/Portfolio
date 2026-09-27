const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const scorePath = path.join(root, "data", "snake-best.json");
const mimeTypes = { ".css": "text/css", ".js": "application/javascript", ".html": "text/html", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

function readBestScore() {
  try { return Math.max(0, Number(JSON.parse(fs.readFileSync(scorePath, "utf8")).bestScore) || 0); } catch { return 0; }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === "/api/snake-best") {
    if (request.method === "GET") return sendJson(response, 200, { bestScore: readBestScore() });
    if (request.method === "POST") {
      let body = "";
      request.on("data", chunk => { body += chunk; if (body.length > 1024) request.destroy(); });
      request.on("end", () => {
        try {
          const submittedScore = Math.floor(Number(JSON.parse(body).score));
          if (!Number.isFinite(submittedScore) || submittedScore < 0 || submittedScore > 1000000) return sendJson(response, 400, { error: "Invalid score" });
          const bestScore = Math.max(readBestScore(), submittedScore);
          fs.writeFileSync(scorePath, JSON.stringify({ bestScore }, null, 2));
          return sendJson(response, 200, { bestScore });
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
