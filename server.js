const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { getCodingActivity } = require('./activity-service');

const mimeTypes = { '.css': 'text/css', '.js': 'application/javascript', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
const DEFAULT_SCORE_API = 'https://rishifishyy-portfolio-activity.netlify.app/api/snake-best';

function createPortfolioServer({ root = __dirname, scoreEndpoint = process.env.SNAKE_API_URL || DEFAULT_SCORE_API, loadActivity = getCodingActivity } = {}) {
  const sendJson = (response, status, payload) => {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(payload));
  };
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/api/coding-activity') {
      if (request.method !== 'GET') return sendJson(response, 405, { error: 'Method not allowed' });
      try { return sendJson(response, 200, await loadActivity(url.searchParams.get('refresh') === 'true', { persist: false })); }
      catch { return sendJson(response, 503, { error: 'Failed to load activity data' }); }
    }
    if (url.pathname === '/api/snake-best') {
      if (!['GET', 'HEAD', 'POST'].includes(request.method)) return sendJson(response, 405, { error: 'Method not allowed' });
      let body = '';
      try {
        if (request.method === 'POST') {
          for await (const chunk of request) {
            body += chunk;
            if (Buffer.byteLength(body) > 1024) return sendJson(response, 413, { error: 'Request too large' });
          }
        }
        const upstream = await fetch(scoreEndpoint, {
          method: request.method, cache: 'no-store', signal: AbortSignal.timeout(8000),
          ...(request.method === 'POST' ? { headers: { 'Content-Type': request.headers['content-type'] || '' }, body } : {})
        });
        const payload = request.method === 'HEAD' ? '' : await upstream.text();
        if (request.method !== 'HEAD') JSON.parse(payload);
        response.writeHead(upstream.status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        return response.end(payload);
      } catch { return sendJson(response, 503, { error: 'Shared record is temporarily unavailable' }); }
    }
    if (!['GET', 'HEAD'].includes(request.method)) return sendJson(response, 405, { error: 'Method not allowed' });
    let filePath;
    try { filePath = path.resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`); }
    catch { return sendJson(response, 400, { error: 'Invalid path' }); }
    if (!filePath.startsWith(path.resolve(root) + path.sep)) return sendJson(response, 403, { error: 'Forbidden' });
    fs.readFile(filePath, (error, content) => {
      if (error) return sendJson(response, error.code === 'ENOENT' ? 404 : 500, { error: 'Not found' });
      response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      response.end(request.method === 'HEAD' ? undefined : content);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || '127.0.0.1';
  createPortfolioServer().listen(port, host, () => console.log(`Portfolio available at http://localhost:${port}`));
}

module.exports = { createPortfolioServer };
