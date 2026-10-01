const test = require('node:test');
const assert = require('node:assert/strict');
const { createScoreService } = require('../snake-score-service');
const { createScoreHandler } = require('../snake-score-http');
const { createSnakeScoreClient } = require('../snake-score-client');

function memoryStore() {
  let entry = null, version = 0, writes = 0;
  return {
    get writes() { return writes; },
    async getWithMetadata() { return entry ? structuredClone(entry) : null; },
    async setJSON(key, data, options) {
      if (options.onlyIfNew && entry || options.onlyIfMatch && options.onlyIfMatch !== entry?.etag) return { modified: false };
      entry = { data: structuredClone(data), etag: String(++version) }; writes++;
      return { modified: true, etag: entry.etag };
    }
  };
}
const storage = () => {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
};
const scoreRequest = (score, extra = {}) => new Request('https://record.example/api/snake-best', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ score }), ...extra
});

test('the previous record is preserved and smaller scores never replace it', async () => {
  const store = memoryStore();
  const service = createScoreService(store, { seed: 15 });
  assert.equal((await service.read()).bestScore, 15);
  assert.equal((await service.submit(9)).bestScore, 15);
  assert.equal(store.writes, 0);
  await service.submit(21);
  assert.equal((await createScoreService(store, { seed: 15 }).read()).bestScore, 21);
  assert.equal((await service.submit(19)).bestScore, 21);
});

test('simultaneous submissions from independent service instances keep the highest score', async () => {
  const store = memoryStore();
  const services = Array.from({ length: 8 }, () => createScoreService(store));
  await Promise.all([28, 49, 31, 27, 61, 53, 42, 57].map((score, i) => services[i].submit(score)));
  assert.equal((await services[0].read()).bestScore, 61);
});

test('a lower delayed writer retries instead of overwriting the winning record', async () => {
  const store = memoryStore();
  const original = store.setJSON;
  let conflict = true;
  store.setJSON = async (key, data, options) => {
    if (conflict) {
      conflict = false;
      await original(key, { bestScore: 75 }, { onlyIfNew: true });
    }
    return original(key, data, options);
  };
  assert.equal((await createScoreService(store).submit(50)).bestScore, 75);
});

test('unavailable storage returns an error instead of claiming the record was saved', async () => {
  const service = createScoreService({ getWithMetadata() { throw new Error('private storage details'); } });
  const response = await createScoreHandler(service)(scoreRequest(30));
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private storage details/);
});

test('the API accepts GitHub Pages and local preflight and never caches the shared record', async () => {
  const handle = createScoreHandler(createScoreService(memoryStore(), { seed: 15 }));
  for (const origin of ['https://rishifishyy.github.io', 'http://127.0.0.1:4174', 'http://localhost:3000']) {
    const response = await handle(new Request('https://record.example/api/snake-best', { method: 'OPTIONS', headers: { Origin: origin } }));
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
    assert.match(response.headers.get('Access-Control-Allow-Methods'), /POST/);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  const response = await handle(new Request('https://record.example/api/snake-best'));
  assert.equal((await response.json()).bestScore, 15);
  assert.equal(response.headers.get('Netlify-CDN-Cache-Control'), 'no-store');
  assert.equal((await handle(new Request('https://record.example/api/snake-best', { method: 'HEAD' }))).status, 200);
});

test('the API rejects malformed, oversized, fractional and out-of-range submissions', async () => {
  const store = memoryStore(), handle = createScoreHandler(createScoreService(store));
  for (const value of [-1, 1.5, '40', null, {}, 1000001]) assert.equal((await handle(scoreRequest(value))).status, 400);
  assert.equal((await handle(scoreRequest(1, { body: '{' }))).status, 400);
  assert.equal((await handle(scoreRequest(1, { body: ' '.repeat(1025) }))).status, 413);
  assert.equal((await handle(scoreRequest(1, { headers: { 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await handle(scoreRequest(1, { headers: { Origin: 'https://unrelated.example', 'Content-Type': 'application/json' } }))).status, 403);
  assert.equal(store.writes, 0);
});

test('two players with separate browser storage receive one global record', async () => {
  const handler = createScoreHandler(createScoreService(memoryStore(), { seed: 15 }));
  const fetchImpl = (url, options) => handler(new Request(url, options));
  const options = { endpoint: 'https://record.example/api/snake-best', fetchImpl, onChange() {} };
  const india = createSnakeScoreClient({ ...options, storage: storage() });
  const usa = createSnakeScoreClient({ ...options, storage: storage() });
  await Promise.all([india.refresh(), usa.refresh()]);
  assert.equal(india.getState().bestScore, 15);
  await india.submit(31);
  await usa.refresh();
  assert.equal(usa.getState().bestScore, 31);
  await usa.submit(42);
  await india.refresh();
  assert.equal(india.getState().bestScore, 42);
});

test('failed submissions remain pending across reload and sync when the service returns', async () => {
  let online = true;
  const handler = createScoreHandler(createScoreService(memoryStore(), { seed: 15 }));
  const data = storage();
  const options = { endpoint: 'https://record.example/api/snake-best', storage: data,
    fetchImpl: (url, opts) => { if (!online) throw new Error('offline'); return handler(new Request(url, opts)); } };
  const first = createSnakeScoreClient(options); await first.refresh();
  online = false; await first.submit(32);
  assert.equal(first.getState().bestScore, 15);
  assert.equal(first.getState().pending, 32);
  assert.equal(first.getState().connected, false);
  const reloaded = createSnakeScoreClient(options);
  assert.equal(reloaded.getState().pending, 32);
  online = true; await reloaded.refresh();
  assert.equal(reloaded.getState().bestScore, 32);
  assert.equal(reloaded.getState().pending, 0);
  assert.equal(data.getItem('portfolio_snake_pending_score'), null);
});

test('local cache and legacy local highs are never uploaded as global records', async () => {
  const data = storage(); data.setItem('portfolio_snake_global_best', '9999');
  data.setItem('portfolio_snake_record_cache', JSON.stringify({ bestScore: 80 }));
  const handler = createScoreHandler(createScoreService(memoryStore(), { seed: 15 }));
  let posts = 0;
  const client = createSnakeScoreClient({ endpoint: 'https://record.example/api/snake-best', storage: data,
    fetchImpl: (url, opts) => { if (opts.method === 'POST') posts++; return handler(new Request(url, opts)); } });
  await client.refresh();
  assert.equal(client.getState().bestScore, 15);
  assert.equal(posts, 0);
});

test('a stale read cannot erase a newer acknowledged record', async () => {
  let finishRead;
  const client = createSnakeScoreClient({ endpoint: 'https://record.example/api/snake-best', storage: storage(),
    fetchImpl: (url, opts) => opts.method === 'GET' ? new Promise(resolve => { finishRead = resolve; })
      : Promise.resolve(Response.json({ bestScore: 40 })) });
  const read = client.refresh();
  await client.submit(40);
  finishRead(Response.json({ bestScore: 15 })); await read;
  assert.equal(client.getState().bestScore, 40);
});

test('polling runs only while the game is active and uses a ten-second interval', async () => {
  let interval, callback, cleared = 0, reads = 0;
  const client = createSnakeScoreClient({ endpoint: 'https://record.example/api/snake-best',
    fetchImpl: async () => { reads++; return Response.json({ bestScore: 15 }); },
    setIntervalImpl: (fn, ms) => { callback = fn; interval = ms; return 7; },
    clearIntervalImpl: () => cleared++ });
  client.setActive(true); await client.refresh();
  assert.equal(interval, 10000); await callback(); assert.equal(reads, 2);
  client.setActive(false); assert.equal(cleared, 1);
});

test('blocked browser storage does not prevent shared score reads or writes', async () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  const handler = createScoreHandler(createScoreService(memoryStore(), { seed: 15 }));
  const client = createSnakeScoreClient({ endpoint: 'https://record.example/api/snake-best', storage: blocked,
    fetchImpl: (url, opts) => handler(new Request(url, opts)) });
  await client.refresh(); await client.submit(22);
  assert.equal(client.getState().bestScore, 22);
});
