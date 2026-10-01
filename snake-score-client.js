(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.createSnakeScoreClient = factory().createSnakeScoreClient;
})(typeof window === 'undefined' ? globalThis : window, function () {
  const CACHE_KEY = 'portfolio_snake_record_cache';
  const PENDING_KEY = 'portfolio_snake_pending_score';
  const valid = value => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 1000000;

  function createSnakeScoreClient({ endpoint, onChange, fetchImpl = fetch, storage, setIntervalImpl = setInterval, clearIntervalImpl = clearInterval }) {
    const read = key => { try { return JSON.parse(storage?.getItem(key) ?? 'null'); } catch { return null; } };
    const write = (key, value) => { try { value === null ? storage?.removeItem(key) : storage?.setItem(key, JSON.stringify(value)); } catch {} };
    const cached = read(CACHE_KEY);
    let bestScore = valid(cached?.bestScore) ? cached.bestScore : null;
    let confirmedBest = null, pending = read(PENDING_KEY), connected = false, attempted = false;
    let loadPromise = null, submitPromise = null, timer = null;
    if (!valid(pending)) pending = 0;
    const snapshot = () => ({
      bestScore, pending, connected,
      state: pending ? 'pending' : connected ? 'live' : 'offline',
      status: pending ? (connected ? 'Syncing your record…' : 'Record waiting to sync')
        : connected ? '' : bestScore === null ? (attempted ? 'Global record unavailable' : 'Connecting to global record…') : 'Last synced record · offline'
    });
    const notify = () => onChange?.(snapshot());
    function accept(data) {
      if (!valid(data?.bestScore)) throw new Error('Invalid record response');
      confirmedBest = Math.max(confirmedBest ?? 0, data.bestScore);
      bestScore = confirmedBest; connected = true; attempted = true;
      write(CACHE_KEY, { bestScore, updatedAt: data.updatedAt ?? null });
      if (pending <= confirmedBest) { pending = 0; write(PENDING_KEY, null); }
    }
    async function request(method, score) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetchImpl(endpoint, {
          method, cache: 'no-store', signal: controller.signal,
          ...(method === 'POST' ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ score }) } : {})
        });
        if (!response.ok) throw new Error('Record request failed');
        return await response.json();
      } finally { clearTimeout(timeout); }
    }
    function flush() {
      if (submitPromise) return submitPromise;
      if (!pending) return Promise.resolve(snapshot());
      submitPromise = (async () => {
        try {
          while (pending) {
            const score = pending;
            const data = await request('POST', score);
            if (!valid(data?.bestScore) || data.bestScore < score) throw new Error('Record was not saved');
            accept(data); notify();
          }
        } catch { connected = false; attempted = true; notify(); }
        finally { submitPromise = null; }
        return snapshot();
      })();
      return submitPromise;
    }
    function refresh() {
      if (loadPromise) return loadPromise;
      loadPromise = (async () => {
        try { accept(await request('GET')); notify(); }
        catch { connected = false; attempted = true; notify(); }
        finally { loadPromise = null; }
        if (pending) await flush();
        return snapshot();
      })();
      return loadPromise;
    }
    function submit(score) {
      if (!valid(score) || score <= (confirmedBest ?? 0)) return Promise.resolve(snapshot());
      pending = Math.max(pending, score); write(PENDING_KEY, pending); notify();
      return flush();
    }
    function setActive(active) {
      if (timer !== null) { clearIntervalImpl(timer); timer = null; }
      if (active) { void refresh(); timer = setIntervalImpl(refresh, 10000); }
    }
    notify();
    return { refresh, submit, setActive, getState: snapshot };
  }
  return { createSnakeScoreClient };
});
