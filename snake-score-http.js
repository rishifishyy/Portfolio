const { validScore } = require('./snake-score-service');

function createScoreHandler(service) {
  return async request => {
    const origin = request.headers.get('Origin');
    const ownOrigin = new URL(request.url).origin;
    const allowed = !origin || origin === ownOrigin || origin === 'https://rishifishyy.github.io'
      || origin === 'https://rishifishyy-portfolio-activity.netlify.app'
      || /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Netlify-CDN-Cache-Control': 'no-store',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    if (origin && allowed) headers['Access-Control-Allow-Origin'] = origin;
    const json = (data, status = 200) => Response.json(data, { status, headers });
    if (!allowed) return json({ error: 'Origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (!['GET', 'HEAD', 'POST'].includes(request.method)) {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { ...headers, Allow: 'GET, HEAD, POST, OPTIONS' } });
    }
    let score;
    if (request.method === 'POST') {
      if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Expected JSON' }, 415);
      try {
        const body = await request.text();
        if (new TextEncoder().encode(body).length > 1024) return json({ error: 'Request too large' }, 413);
        score = JSON.parse(body)?.score;
        if (!validScore(score)) return json({ error: 'Invalid score' }, 400);
      } catch { return json({ error: 'Invalid request' }, 400); }
    }
    try {
      const result = request.method === 'POST' ? await service.submit(score) : await service.read();
      return request.method === 'HEAD' ? new Response(null, { headers }) : json(result);
    } catch {
      return json({ error: 'Shared record is temporarily unavailable' }, 503);
    }
  };
}

module.exports = { createScoreHandler };
