const https = require("https");
const fs = require("fs");
const path = require("path");
const { dateKey, range, summarize } = require("./activity-calendar");
const cachePath = path.join(__dirname, "data", "coding-activity.json");
const username = "rishifishyy";
const profiles = {
  leetcode: { username, url: `https://leetcode.com/u/${username}/` },
  gfg: { username, url: `https://www.geeksforgeeks.org/profile/${username}?tab=activity` }
};
let memoryCache = null, lastFetchTime = 0, pendingFetch = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

function postJson(url, payload, referer) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(url, {
      method: "POST", family: 4,
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body),
        "User-Agent": "Mozilla/5.0", Referer: referer, Origin: new URL(referer).origin }
    }, res => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("error", reject);
      res.on("end", () => {
        clearTimeout(deadline);
        try {
          if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
          const json = JSON.parse(data);
          if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join("; "));
          resolve(json);
        } catch (error) { reject(error); }
      });
    });
    const deadline = setTimeout(() => req.destroy(new Error("Activity request timed out")), 12000);
    req.on("error", error => { clearTimeout(deadline); reject(error); });
    req.end(body);
  });
}

async function fetchLeetCode(now) {
  const window = range(now);
  const years = [...new Set([window.start.getUTCFullYear(), window.end.getUTCFullYear()])];
  const calendars = await Promise.all(years.map(async year => {
    const json = await postJson("https://leetcode.com/graphql", {
      query: `query($username: String!, $year: Int!) {
        matchedUser(username: $username) { userCalendar(year: $year) { submissionCalendar } }
      }`, variables: { username, year }
    }, profiles.leetcode.url);
    const raw = json.data?.matchedUser?.userCalendar?.submissionCalendar;
    if (typeof raw !== "string") throw new Error("Missing LeetCode calendar");
    return JSON.parse(raw);
  }));
  const days = {};
  for (const calendar of calendars) {
    for (const [timestamp, count] of Object.entries(calendar)) {
      const date = new Date(Number(timestamp) * 1000);
      if (!Number.isNaN(date.getTime()) && Number(count) > 0) days[dateKey(date)] = Number(count);
    }
  }
  // Recent submissions may appear before the daily calendar catches up.
  // Calendar buckets are UTC; keep recent timestamps in UTC too. Max prevents double counting.
  try {
    const json = await postJson("https://leetcode.com/graphql", {
      query: `query($username: String!) {
        recentSubmissionList(username: $username, limit: 20) { id timestamp }
      }`, variables: { username }
    }, profiles.leetcode.url);
    const recent = {}, seen = new Set();
    for (const sub of json.data?.recentSubmissionList || []) {
      if (seen.has(sub.id)) continue;
      seen.add(sub.id);
      const date = new Date(Number(sub.timestamp) * 1000);
      if (Number.isNaN(date.getTime())) continue;
      const key = dateKey(date);
      recent[key] = (recent[key] || 0) + 1;
    }
    for (const [key, count] of Object.entries(recent)) days[key] = Math.max(days[key] || 0, count);
  } catch (error) { console.warn("LeetCode recent submissions:", error.message); }
  return days;
}

async function fetchGfg(now) {
  const window = range(now);
  const years = [...new Set([window.start.getUTCFullYear(), window.end.getUTCFullYear()])];
  const calendars = await Promise.all(years.map(async year => {
    const json = await postJson("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
      handle: username, requestType: "getYearwiseUserSubmissions", year: String(year), month: ""
    }, "https://www.geeksforgeeks.org/");
    if (!json.result || typeof json.result !== "object" || Array.isArray(json.result)) {
      throw new Error("Missing GFG calendar");
    }
    return json.result;
  }));
  const days = Object.assign({}, ...calendars);
  try {
    const json = await postJson("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
      handle: username, requestType: "getUserSubmissions", page: 1
    }, "https://www.geeksforgeeks.org/");
    const recent = {};
    for (const group of Object.values(json.result || {})) {
      for (const sub of Object.values(group || {})) {
        if (!sub?.user_subtime) continue;
        const raw = sub.user_subtime.replace(" ", "T");
        const date = new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw) ? raw : raw + "Z");
        if (Number.isNaN(date.getTime())) continue;
        const key = dateKey(date);
        recent[key] = (recent[key] || 0) + 1;
      }
    }
    for (const [key, count] of Object.entries(recent)) days[key] = Math.max(Number(days[key]) || 0, count);
  } catch (error) { console.warn("GFG recent submissions:", error.message); }
  return days;
}

function readDiskCache() {
  try { return JSON.parse(fs.readFileSync(cachePath, "utf8")); }
  catch { return null; }
}

async function fetchAndCalculate(now = new Date(), { persist = true, fallbackData = null } = {}) {
  const previous = memoryCache || fallbackData || readDiskCache();
  const results = await Promise.allSettled([fetchLeetCode(now), fetchGfg(now)]);
  const days = {}, sources = {};
  ["leetcode", "gfg"].forEach((platform, index) => {
    const result = results[index], ok = result.status === "fulfilled";
    const counts = ok ? result.value : Object.fromEntries(
      Object.entries(previous?.days || {}).map(([key, day]) => [key, day[platform] || 0])
    );
    sources[platform] = {
      status: ok ? "live" : "stale",
      updatedAt: ok ? now.toISOString() : (previous?.sources?.[platform]?.updatedAt || previous?.updatedAt || null),
      ...(ok ? {} : { error: result.reason.message })
    };
    for (const [key, count] of Object.entries(counts)) {
      if (!days[key]) days[key] = { leetcode: 0, gfg: 0 };
      days[key][platform] = count;
    }
  });
  const stale = Object.values(sources).some(source => source.status !== "live");
  const payload = {
    updatedAt: stale ? previous?.updatedAt || null : now.toISOString(),
    checkedAt: now.toISOString(), profiles, sources, stale, ...summarize(days, now)
  };
  if (persist && results.some(result => result.status === "fulfilled")) {
    try {
      fs.mkdirSync(path.dirname(cachePath), { recursive: true });
      fs.writeFileSync(cachePath, JSON.stringify(payload, null, 2) + "\n");
    } catch (error) { console.error("Activity cache write failed:", error.message); }
  }
  return payload;
}

async function getCodingActivity(forceRefresh = false, options = {}) {
  if (pendingFetch) return pendingFetch;
  const ttl = memoryCache?.stale ? 30000 : CACHE_TTL_MS;
  if (!forceRefresh && memoryCache && Date.now() - lastFetchTime < ttl) {
    return { ...memoryCache, ...summarize(memoryCache.days) };
  }
  pendingFetch = fetchAndCalculate(new Date(), options).then(payload => {
    memoryCache = payload;
    lastFetchTime = Date.now();
    return payload;
  }).finally(() => { pendingFetch = null; });
  return pendingFetch;
}

module.exports = { getCodingActivity, fetchLeetCode, fetchGfg };
if (require.main === module) {
  getCodingActivity(true).then(data => {
    console.log(JSON.stringify({ updatedAt: data.updatedAt, range: data.range, sources: data.sources,
      latest: Object.entries(data.days).slice(-5) }, null, 2));
    if (data.stale) process.exitCode = 1;
  }).catch(error => { console.error(error); process.exitCode = 1; });
}
