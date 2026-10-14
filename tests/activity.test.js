const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const calendar = require('../activity-calendar');
class FixedDate extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-09-30T07:00:00Z'])); }
  static now() { return Date.parse('2026-09-30T07:00:00Z'); }
}

test('365 days includes today and excludes old/future activity, with bounded streaks', () => {
  const now = new Date('2026-09-30T07:00:00Z');
  const data = calendar.summarize({
    '2025-09-30': { leetcode: 50 }, '2025-10-01': { gfg: 2 },
    '2026-09-29': { leetcode: 1 }, '2026-09-30': { leetcode: 1, gfg: 1 },
    '2026-10-01': { leetcode: 50 }
  }, now);
  assert.deepEqual(data.range, { startDate: '2025-10-01', endDate: '2026-09-30', dayCount: 365 });
  assert.equal(Object.keys(data.days).length, 3);
  assert.equal(data.stats.currentStreak, 2);
  assert.equal(data.stats.maxStreak, 2);
  assert.equal(data.stats.totalActiveDaysPastYear, 3);
  assert.equal(data.stats.bothActiveDaysPastYear, 1);
  assert.equal(calendar.summarize({}, now).stats.currentStreak, 0);
});

test('range advances at Indian midnight and handles leap years', () => {
  assert.equal(calendar.range(new Date('2026-09-29T18:29:59Z')).endDate, '2026-09-29');
  assert.equal(calendar.range(new Date('2026-09-29T18:30:00Z')).endDate, '2026-09-30');
  const leap = calendar.range(new Date('2024-03-01T12:00:00Z'));
  assert.equal((leap.end - leap.start) / calendar.DAY_MS + 1, 365);
  const data = calendar.summarize({ '2026-09-29': { leetcode: 1 } }, new Date('2026-09-30T07:00:00Z'));
  assert.equal(data.stats.currentStreak, 1);
});

function serviceFixture(reply, savedData) {
  const writes = [], requests = [];
  const old = savedData || { updatedAt: '2026-09-28T12:00:00Z', days: {
    '2026-09-28': { leetcode: 2, gfg: 3 }, '2024-01-01': { leetcode: 99, gfg: 99 }
  } };
  const mockHttps = { request(url, options, callback) {
    const req = new EventEmitter();
    req.destroy = error => req.emit('error', error);
    req.end = body => {
      const payload = JSON.parse(body);
      requests.push({ url, payload });
      queueMicrotask(() => {
        const result = reply(url, payload);
        const res = new EventEmitter();
        res.statusCode = result.status || 200;
        callback(res);
        res.emit('data', JSON.stringify(result.body));
        res.emit('end');
      });
    };
    return req;
  } };
  const sandbox = { module: { exports: {} }, console: { warn() {}, error() {} },
    Buffer, URL, setTimeout, clearTimeout, Date: FixedDate,
    __dirname: process.cwd(), require(name) {
      if (name === 'https') return mockHttps;
      if (name === 'fs') return { readFileSync: () => JSON.stringify(old), mkdirSync() {}, writeFileSync: (_, data) => writes.push(JSON.parse(data)) };
      if (name === './activity-calendar') return { ...calendar,
        summarize: (days, now = new FixedDate()) => calendar.summarize(days, now) };
      return require(name);
    } };
  vm.runInNewContext(fs.readFileSync(require.resolve('../activity-service'), 'utf8'), sandbox);
  return { service: sandbox.module.exports, writes, requests };
}

test('LeetCode fetches both years and overlays recent submissions without double counting', async () => {
  const fixture = serviceFixture((url, payload) => {
    if (payload.query.includes('recentSubmissionList')) return { body: { data: { recentSubmissionList: [
      { id: '1', timestamp: String(Date.parse('2026-09-29T20:00:00Z') / 1000) },
      { id: '1', timestamp: String(Date.parse('2026-09-29T20:00:00Z') / 1000) },
      { id: '2', timestamp: String(Date.parse('2026-09-28T20:00:00Z') / 1000) }
    ] } } };
    const days = payload.variables.year === 2026 ? { [Date.parse('2026-09-28T00:00:00Z') / 1000]: 4 } : {};
    return { body: { data: { matchedUser: { userCalendar: { submissionCalendar: JSON.stringify(days) } } } } };
  });
  const days = await fixture.service.fetchLeetCode(new Date('2026-09-30T07:00:00Z'));
  assert.equal(days['2026-09-29'], 1);
  assert.equal(days['2026-09-28'], 4);
  assert.deepEqual(fixture.requests.filter(r => r.payload.variables.year).map(r => r.payload.variables.year), [2025, 2026]);
});

test('GraphQL failures preserve only the failed platform and report stale timestamps', async () => {
  const fixture = serviceFixture(url => url.includes('leetcode')
    ? { body: { errors: [{ message: 'Unavailable' }] } }
    : { body: { result: { '2026-09-29': 1 } } });
  const data = await fixture.service.getCodingActivity(true);
  assert.equal(data.stale, true);
  assert.equal(data.sources.leetcode.status, 'stale');
  assert.equal(data.sources.gfg.status, 'live');
  assert.equal(data.updatedAt, '2026-09-28T12:00:00Z');
  assert.equal(data.days['2026-09-28'].leetcode, 2);
  assert.equal(data.days['2026-09-28'].gfg, 0);
  assert.equal(data.days['2026-09-29'].gfg, 1);
  assert.equal(data.days['2024-01-01'], undefined);
  assert.equal(fixture.writes.length, 1);
});

test('GFG recent submissions fill calendar gaps without adding duplicates', async () => {
  const fixture = serviceFixture((url, payload) => payload.requestType === 'getUserSubmissions'
    ? { body: { result: { Easy: {
      a: { user_subtime: '2026-09-29 12:00:00' },
      b: { user_subtime: '2026-09-28 12:00:00' }
    } } } }
    : { body: { result: { '2026-09-28': 4 } } });
  const days = await fixture.service.fetchGfg(new Date('2026-09-30T07:00:00Z'));
  assert.equal(days['2026-09-29'], 1);
  assert.equal(days['2026-09-28'], 4);
});

test('solved questions use today in IST, deduplicate accepted questions, and exclude future solves', async () => {
  const seconds = value => String(Date.parse(value) / 1000);
  const fixture = serviceFixture((url, payload) => {
    if (url.includes('leetcode')) {
      if (payload.query.includes('recentSubmissionList')) return { body: { data: {
        recentSubmissionList: [{ id: 'failed', timestamp: seconds('2026-09-30T06:00:00Z') }],
        recentAcSubmissionList: [
          { title: 'Yesterday', titleSlug: 'yesterday', timestamp: seconds('2026-09-29T18:29:59Z') },
          { title: 'Rotate Image', titleSlug: 'rotate-image', timestamp: seconds('2026-09-29T18:30:00Z') },
          { title: 'Rotate Image', titleSlug: 'rotate-image', timestamp: seconds('2026-09-30T06:00:00Z') },
          { title: 'Future', titleSlug: 'future', timestamp: seconds('2026-09-30T08:00:00Z') }
        ]
      } } };
      return { body: { data: { matchedUser: { userCalendar: { submissionCalendar: '{}' } } } } };
    }
    return { body: { result: payload.requestType === 'getUserSubmissions' ? { Easy: {
      a: { pname: 'Power of Four', slug: 'power-of-four', user_subtime: '2026-09-29 19:00:00' },
      b: { pname: 'Yesterday', slug: 'old', user_subtime: '2026-09-29 18:29:59' }
    } } : {} } };
  });
  const data = await fixture.service.getCodingActivity(true);
  assert.equal(data.solvedToday.date, '2026-09-30');
  assert.equal(data.solvedToday.platforms.leetcode.status, 'live');
  assert.equal(data.solvedToday.platforms.leetcode.questions.length, 1);
  assert.equal(data.solvedToday.platforms.leetcode.questions[0].title, 'Rotate Image');
  assert.equal(data.solvedToday.platforms.leetcode.questions[0].solvedAt, '2026-09-30T06:00:00.000Z');
  assert.equal(data.solvedToday.platforms.gfg.questions.length, 1);
  assert.equal(data.solvedToday.platforms.gfg.questions[0].title, 'Power of Four');
});

test('question failures preserve only same-day saved questions independently of calendar success', async () => {
  for (const savedDate of ['2026-09-30', '2026-09-29']) {
    const fixture = serviceFixture((url, payload) => {
      if (url.includes('leetcode')) return payload.query.includes('recentSubmissionList')
        ? { body: { errors: [{ message: 'Recent feed unavailable' }] } }
        : { body: { data: { matchedUser: { userCalendar: { submissionCalendar: '{}' } } } } };
      return { status: payload.requestType === 'getUserSubmissions' ? 503 : 200, body: { result: {} } };
    }, { days: {}, solvedToday: { date: savedDate, platforms: {
      leetcode: { status: 'live', updatedAt: '2026-09-30T06:00:00Z', questions: [
        { title: 'Rotate Image', slug: 'rotate-image', solvedAt: '2026-09-30T06:00:00Z' }
      ] }
    } } });
    const data = await fixture.service.getCodingActivity(true);
    assert.equal(data.sources.leetcode.status, 'live');
    assert.equal(data.solvedToday.platforms.leetcode.status, savedDate === '2026-09-30' ? 'stale' : 'unavailable');
    assert.equal(data.solvedToday.platforms.leetcode.questions.length, savedDate === '2026-09-30' ? 1 : 0);
    assert.equal(data.solvedToday.platforms.gfg.status, 'unavailable');
  }
});

test('serverless refresh preserves fresh data without writing to a read-only deployment', async () => {
  const fixture = serviceFixture((url, payload) => url.includes('leetcode')
    ? { body: { errors: [{ message: 'Unavailable' }] } }
    : { body: { result: { '2026-09-29': 1 } } });
  const data = await fixture.service.getCodingActivity(true, { persist: false, fallbackData: {
    updatedAt: '2026-09-29T08:00:00Z', days: { '2026-09-29': { leetcode: 7 } }
  } });
  assert.equal(data.days['2026-09-29'].leetcode, 7);
  assert.equal(data.days['2026-09-29'].gfg, 1);
  assert.equal(data.sources.leetcode.status, 'stale');
  assert.equal(data.updatedAt, '2026-09-29T08:00:00Z');
  assert.equal(fixture.writes.length, 0);
});

test('HTTP failures keep the saved cache and concurrent refreshes share one fetch', async () => {
  const fixture = serviceFixture(() => ({ status: 403, body: {} }));
  const [first, second] = await Promise.all([fixture.service.getCodingActivity(true), fixture.service.getCodingActivity(true)]);
  assert.equal(first, second);
  assert.equal(first.sources.leetcode.status, 'stale');
  assert.equal(first.sources.gfg.status, 'stale');
  assert.equal(fixture.writes.length, 0);
  assert.equal(fixture.requests.length, 4);
});

test('rendered chart has exactly 365 selectable dates and includes latest saved submission', async () => {
  const container = { innerHTML: '', addEventListener() {}, querySelectorAll: () => [], classList: { add() {} } };
  const tooltip = { classList: { remove() {} } };
  const status = {};
  const document = { getElementById(id) {
    return { 'activity-calendar': container, 'activity-tooltip': tooltip, 'activity-status': status }[id] || null;
  }, addEventListener() {} };
  const data = { updatedAt: '2026-09-30T07:00:00Z', days: {
    '2026-09-29': { leetcode: 1 }, '2025-09-30': { leetcode: 99 }, '2026-10-01': { leetcode: 99 }
  } };
  const script = fs.readFileSync(require.resolve('../script.js'), 'utf8');
  const calls = [];
  vm.runInNewContext(script.slice(script.indexOf('function initCodingActivity()')) + '\ninitCodingActivity();', {
    document, window: { addEventListener() {} }, ActivityCalendar: calendar, setInterval() {}, console, Date: FixedDate,
    fetch: async (url, options) => { calls.push({ url, options }); return {
      ok: !url.startsWith('/api/'), json: async () => data
    }; }
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal((container.innerHTML.match(/tabindex="0"/g) || []).length, 365);
  assert.match(container.innerHTML, /data-date="2026-09-29"\s+data-count="1"/);
  assert.match(container.innerHTML, /cell-today/);
  assert.equal(calls[1].options.cache, 'no-store');
});

test('GitHub Pages renders live submissions on browsers without AbortSignal.timeout', async () => {
  const container = { innerHTML: '', addEventListener() {}, querySelectorAll: () => [], classList: { add() {} } };
  const tooltip = { classList: { remove() {} } };
  const status = {}, calls = [];
  const document = { getElementById(id) {
    return { 'activity-calendar': container, 'activity-tooltip': tooltip, 'activity-status': status }[id] || null;
  }, addEventListener() {} };
  const data = { updatedAt: '2026-09-30T07:00:00Z', sources: {
    leetcode: { status: 'live', updatedAt: '2026-09-30T07:00:00Z' }
  }, days: { '2026-09-30': { leetcode: 1 } } };
  const script = fs.readFileSync(require.resolve('../script.js'), 'utf8');
  vm.runInNewContext(script.slice(script.indexOf('function initCodingActivity()')) + '\ninitCodingActivity();', {
    document, window: { addEventListener() {}, location: { hostname: 'rishifishyy.github.io' },
      PORTFOLIO_ACTIVITY_API: 'https://activity.example/api/coding-activity' },
    ActivityCalendar: calendar, setInterval() {}, console, Date: FixedDate, AbortSignal: {},
    fetch: async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => data }; }
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://activity.example/api/coding-activity');
  assert.match(container.innerHTML, /data-date="2026-09-30"\s+data-count="1"/);
});

test('a failed live service displays activity from the saved deployment', async () => {
  const container = { innerHTML: '', addEventListener() {}, querySelectorAll: () => [], classList: { add() {} } };
  const tooltip = { classList: { remove() {} } };
  const status = {}, calls = [];
  const document = { getElementById(id) {
    return { 'activity-calendar': container, 'activity-tooltip': tooltip, 'activity-status': status }[id] || null;
  }, addEventListener() {} };
  const data = { updatedAt: '2026-09-30T06:00:00Z', days: { '2026-09-29': { leetcode: 1 } } };
  const script = fs.readFileSync(require.resolve('../script.js'), 'utf8');
  vm.runInNewContext(script.slice(script.indexOf('function initCodingActivity()')) + '\ninitCodingActivity();', {
    document, window: { addEventListener() {}, location: { hostname: 'rishifishyy.github.io' },
      PORTFOLIO_ACTIVITY_API: 'https://activity.example/api/coding-activity' },
    ActivityCalendar: calendar, setInterval() {}, console, Date: FixedDate,
    fetch: async url => { calls.push(url); return { ok: url.startsWith('data/'), json: async () => data }; }
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls[0], 'https://activity.example/api/coding-activity');
  assert.match(calls[1], /^data\/coding-activity.json/);
  assert.match(container.innerHTML, /data-date="2026-09-29"\s+data-count="1"/);
});

test('today panel renders safe problem links and excludes yesterday from current-day details', async () => {
  const container = { innerHTML: '', addEventListener() {}, querySelectorAll: () => [], classList: { add() {} } };
  const content = {};
  const document = { getElementById(id) {
    return { 'activity-calendar': container, 'activity-tooltip': { classList: { remove() {} } },
      'today-solved-content': content }[id] || null;
  }, addEventListener() {} };
  const data = { days: {}, solvedToday: { date: '2026-09-30', platforms: {
    leetcode: { status: 'live', updatedAt: '2026-09-30T07:00:00Z', questions: [
      { title: '<img onerror="bad">', slug: 'rotate-image', solvedAt: '2026-09-29T18:30:00Z' },
      { title: 'Yesterday', slug: 'yesterday', solvedAt: '2026-09-29T18:29:59Z' }
    ] }, gfg: { status: 'unavailable', questions: [] }
  } } };
  const script = fs.readFileSync(require.resolve('../script.js'), 'utf8');
  vm.runInNewContext(script.slice(script.indexOf('function initCodingActivity()')) + '\ninitCodingActivity();', {
    document, window: { addEventListener() {}, location: { hostname: 'localhost' } },
    ActivityCalendar: calendar, setInterval() {}, console, Date: FixedDate,
    fetch: async () => ({ ok: true, json: async () => data })
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.match(content.innerHTML, /https:\/\/leetcode.com\/problems\/rotate-image\//);
  assert.match(content.innerHTML, /&lt;img onerror=&quot;bad&quot;&gt;/);
  assert.doesNotMatch(content.innerHTML, /<img|Yesterday/);
  assert.match(content.innerHTML, /30 Sept 2026/);
  assert.doesNotMatch(content.innerHTML, /IST|LeetCode|GeeksforGeeks|unavailable|<time|<h3/);
});

test('activity reuses fresh data and unchanged markup, but clears yesterday at IST midnight', async () => {
  let clock = Date.parse('2026-09-29T18:20:00Z'), calls = 0, chartWrites = 0, html = '';
  class TickDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const events = {}, timers = {}, cellEvents = {};
  const content = {};
  const container = {
    get innerHTML() { return html; }, set innerHTML(value) { chartWrites++; html = value; },
    addEventListener(name, callback) { cellEvents[name] = callback; }, classList: { add() {} }
  };
  const document = { hidden: false, getElementById(id) {
    return { 'activity-calendar': container, 'activity-tooltip': { classList: { remove() {} } },
      'today-solved-content': content }[id] || null;
  }, addEventListener(name, callback) { events[name] = callback; } };
  const script = fs.readFileSync(require.resolve('../script.js'), 'utf8');
  vm.runInNewContext(script.slice(script.indexOf('function initCodingActivity()')) + '\ninitCodingActivity();', {
    document, window: { addEventListener() {}, location: { hostname: 'localhost' } },
    ActivityCalendar: calendar, Date: TickDate, console,
    setInterval(callback, delay) { timers[delay] = callback; },
    fetch: async () => {
      calls++;
      const date = calendar.range(new TickDate()).endDate;
      return { ok: true, json: async () => ({ days: {
        '2026-09-29': { leetcode: 1 }, '2026-09-30': { leetcode: 1 }
      }, solvedToday: { date, platforms: { leetcode: { status: 'live', questions: [
        { title: `Question ${date}`, slug: 'question', solvedAt: new TickDate().toISOString() }
      ] } } } }) };
    }
  });
  const settled = () => new Promise(resolve => setImmediate(resolve));
  await settled();
  events.visibilitychange(); events.visibilitychange();
  await settled();
  assert.equal(calls, 1, 'returning to the tab should reuse fresh data');
  clock += 6 * 60 * 1000;
  timers[5 * 60 * 1000]();
  await settled();
  assert.equal(calls, 2);
  assert.equal(chartWrites, 1, 'unchanged dates should preserve the existing chart');
  assert.equal(Object.keys(cellEvents).length, 5, 'listeners should be shared across dates');
  clock = Date.parse('2026-09-29T18:30:00Z');
  timers[60000]();
  assert.doesNotMatch(content.innerHTML, /Question 2026-09-29/);
  await settled();
  assert.equal(calls, 3);
  assert.equal(chartWrites, 2);
  assert.match(content.innerHTML, /Question 2026-09-30/);
  document.hidden = true;
  clock += 10 * 60 * 1000;
  timers[5 * 60 * 1000]();
  await settled();
  assert.equal(calls, 3, 'hidden tabs should not poll');
});
