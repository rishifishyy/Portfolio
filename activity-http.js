function createActivityHandler(loadActivity) {
  return async function handle(request) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "https://rishifishyy.github.io",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Cache-Control": "no-store",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (!["GET", "HEAD"].includes(request.method)) {
      return Response.json({ error: "Method not allowed" }, {
        status: 405, headers: { ...headers, Allow: "GET, HEAD, OPTIONS" }
      });
    }
    try {
      const data = await loadActivity();
      const allStale = !Object.values(data.sources || {}).some(source => source.status === "live");
      if (!allStale) {
        headers["Netlify-CDN-Cache-Control"] = `public, max-age=${data.stale ? 30 : 300}, must-revalidate`;
      }
      return new Response(request.method === "HEAD" ? null : JSON.stringify(data), {
        status: allStale ? 503 : 200, headers
      });
    } catch {
      return Response.json({ error: "Coding activity is temporarily unavailable" }, { status: 503, headers });
    }
  };
}

module.exports = { createActivityHandler };
