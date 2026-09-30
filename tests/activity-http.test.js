const test = require('node:test');
const assert = require('node:assert/strict');
const { createActivityHandler } = require('../activity-http');

test('browser preflight and unsupported methods do not fetch upstream platforms', async () => {
  let calls = 0;
  const handle = createActivityHandler(() => { calls++; });
  const preflight = await handle(new Request('https://activity.example/api/coding-activity', { method: 'OPTIONS' }));
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), 'https://rishifishyy.github.io');
  assert.match(preflight.headers.get('Access-Control-Allow-Methods'), /GET/);
  const post = await handle(new Request('https://activity.example/api/coding-activity', { method: 'POST' }));
  assert.equal(post.status, 405);
  assert.equal(calls, 0);
});

test('fresh activity is CDN cached for five minutes and remains readable from the portfolio', async () => {
  const data = { sources: { leetcode: { status: 'live' }, gfg: { status: 'live' } }, days: { '2026-09-30': { leetcode: 1 } } };
  const response = await createActivityHandler(async () => data)(new Request('https://activity.example/api/coding-activity'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Netlify-CDN-Cache-Control'), /max-age=300/);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://rishifishyy.github.io');
  assert.deepEqual(await response.json(), data);
});

test('upstream failures are not CDN cached and stale platforms keep their status', async () => {
  const data = { stale: true, sources: { leetcode: { status: 'stale' }, gfg: { status: 'stale' } } };
  const response = await createActivityHandler(async () => data)(new Request('https://activity.example/api/coding-activity'));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Netlify-CDN-Cache-Control'), null);
  assert.deepEqual(await response.json(), data);
  const failure = await createActivityHandler(async () => { throw new Error('private details'); })(new Request('https://activity.example/api/coding-activity'));
  assert.equal(failure.status, 503);
  assert.doesNotMatch(await failure.text(), /private details/);
});
