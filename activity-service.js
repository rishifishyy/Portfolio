const https = require("https");
const fs = require("fs");
const path = require("path");

const cachePath = path.join(__dirname, "data", "coding-activity.json");

let memoryCache = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

function formatDateStr(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fetchLeetCode(username = "rishifishyy") {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      query: `query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submissionCalendar
        }
      }`,
      variables: { username }
    });

    const req = https.request("https://leetcode.com/graphql", {
      method: "POST",
      family: 4,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Referer": `https://leetcode.com/u/${username}/`
      },
      timeout: 7000
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const rawCal = json.data?.matchedUser?.submissionCalendar;
          const parsedCal = rawCal ? JSON.parse(rawCal) : {};
          resolve({ ok: true, calendar: parsedCal });
        } catch (e) {
          resolve({ ok: false, error: e.message, calendar: {} });
        }
      });
    });

    req.on("error", (err) => resolve({ ok: false, error: err.message, calendar: {} }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, error: "timeout", calendar: {} }); });
    req.write(postData);
    req.end();
  });
}

function fetchGfgYear(handle, year) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      handle,
      requestType: "getYearwiseUserSubmissions",
      year: String(year),
      month: ""
    });

    const req = https.request("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
      method: "POST",
      family: 4,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Referer": "https://www.geeksforgeeks.org/",
        "Origin": "https://www.geeksforgeeks.org"
      },
      timeout: 7000
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.result || {});
        } catch (e) {
          resolve({});
        }
      });
    });

    req.on("error", () => resolve({}));
    req.on("timeout", () => { req.destroy(); resolve({}); });
    req.write(payload);
    req.end();
  });
}

function fetchGfgRecentSubmissions(handle = "rishifishyy") {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      handle,
      requestType: "getUserSubmissions",
      page: 1
    });

    const req = https.request("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
      method: "POST",
      family: 4,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Referer": "https://www.geeksforgeeks.org/",
        "Origin": "https://www.geeksforgeeks.org"
      },
      timeout: 7000
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const dateCounts = {};
          for (const diff of Object.keys(json.result || {})) {
            for (const pId of Object.keys(json.result[diff] || {})) {
              const sub = json.result[diff][pId];
              if (!sub?.user_subtime) continue;
              const utcDate = new Date(sub.user_subtime.replace(" ", "T") + "Z");
              if (isNaN(utcDate)) continue;
              // Map to IST date (UTC+5:30) for Indian competitive programming session alignment
              const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
              const y = istDate.getUTCFullYear();
              const m = String(istDate.getUTCMonth() + 1).padStart(2, "0");
              const d = String(istDate.getUTCDate()).padStart(2, "0");
              const istDateStr = `${y}-${m}-${d}`;
              dateCounts[istDateStr] = (dateCounts[istDateStr] || 0) + 1;
            }
          }
          resolve(dateCounts);
        } catch (e) {
          resolve({});
        }
      });
    });

    req.on("error", () => resolve({}));
    req.on("timeout", () => { req.destroy(); resolve({}); });
    req.write(payload);
    req.end();
  });
}

async function fetchGfg(handle = "rishifishyy") {
  const now = new Date();
  const currentYear = now.getFullYear();
  const pastYear = currentYear - 1;

  const [resCurrent, resPast] = await Promise.all([
    fetchGfgYear(handle, currentYear),
    fetchGfgYear(handle, pastYear)
  ]);

  return { ...resPast, ...resCurrent };
}

function readDiskCache() {
  try {
    if (fs.existsSync(cachePath)) {
      return JSON.parse(fs.readFileSync(cachePath, "utf8"));
    }
  } catch (e) {
    console.error("Error reading activity disk cache:", e.message);
  }
  return null;
}

async function fetchAndCalculate() {
  const [lcRes, gfgCal, gfgRecent] = await Promise.all([
    fetchLeetCode("rishifishyy"),
    fetchGfg("rishifishyy"),
    fetchGfgRecentSubmissions("rishifishyy")
  ]);

  const lcCount = Object.keys(lcRes.calendar || {}).length;
  const gfgCount = Object.keys(gfgCal || {}).length;

  if (lcCount === 0 && gfgCount === 0) {
    const diskFallback = readDiskCache();
    if (diskFallback) return diskFallback;
  }

  const lcDays = {};
  for (const [timestampStr, count] of Object.entries(lcRes.calendar || {})) {
    const ts = parseInt(timestampStr, 10);
    if (!ts || count <= 0) continue;
    const d = new Date(ts * 1000);
    const dStr = formatDateStr(d);
    lcDays[dStr] = (lcDays[dStr] || 0) + Number(count);
  }

  const gfgDays = {};
  for (const [dateStr, count] of Object.entries(gfgCal || {})) {
    if (count > 0) gfgDays[dateStr] = (gfgDays[dateStr] || 0) + Number(count);
  }
  for (const [dateStr, count] of Object.entries(gfgRecent || {})) {
    gfgDays[dateStr] = Math.max(gfgDays[dateStr] || 0, Number(count));
  }

  const allDates = new Set([...Object.keys(lcDays), ...Object.keys(gfgDays)]);
  const days = {};
  for (const date of allDates) {
    const lc = lcDays[date] || 0;
    const gfg = gfgDays[date] || 0;
    days[date] = {
      count: lc + gfg,
      leetcode: lc,
      gfg: gfg
    };
  }

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - 365);

  let totalActivePastYear = 0;
  let leetcodeActivePastYear = 0;
  let gfgActivePastYear = 0;
  let bothActivePastYear = 0;

  for (let d = new Date(oneYearAgo); d <= now; d.setUTCDate(d.getUTCDate() + 1)) {
    const dStr = formatDateStr(d);
    const info = days[dStr];
    if (info) {
      totalActivePastYear++;
      if (info.leetcode && info.gfg) bothActivePastYear++;
      if (info.leetcode) leetcodeActivePastYear++;
      if (info.gfg) gfgActivePastYear++;
    }
  }

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  const todayStr = formatDateStr(now);
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = formatDateStr(yesterday);

  let checkDate = new Date(days[todayStr] ? now : (days[yesterdayStr] ? yesterday : null));
  if (checkDate && !isNaN(checkDate)) {
    while (true) {
      const s = formatDateStr(checkDate);
      if (days[s]) {
        currentStreak++;
        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
      } else {
        break;
      }
    }
  }

  for (let d = new Date(oneYearAgo); d <= now; d.setUTCDate(d.getUTCDate() + 1)) {
    const dStr = formatDateStr(d);
    if (days[dStr]) {
      tempStreak++;
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    profiles: {
      leetcode: {
        username: "rishifishyy",
        url: "https://leetcode.com/u/rishifishyy/"
      },
      gfg: {
        username: "rishifishyy",
        url: "https://www.geeksforgeeks.org/profile/rishifishyy?tab=activity"
      }
    },
    stats: {
      totalActiveDaysPastYear: totalActivePastYear,
      leetcodeActiveDaysPastYear: leetcodeActivePastYear,
      gfgActiveDaysPastYear: gfgActivePastYear,
      bothActiveDaysPastYear: bothActivePastYear,
      currentStreak,
      maxStreak
    },
    days
  };

  try {
    fs.writeFileSync(cachePath, JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error("Failed to write activity cache file:", err.message);
  }

  return payload;
}

async function getCodingActivity(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && memoryCache && (now - lastFetchTime < CACHE_TTL_MS)) {
    return memoryCache;
  }

  try {
    const data = await fetchAndCalculate();
    if (data) {
      memoryCache = data;
      lastFetchTime = now;
      return memoryCache;
    }
  } catch (err) {
    console.error("Error in getCodingActivity live fetch:", err.message);
  }

  const diskData = readDiskCache();
  if (diskData) {
    memoryCache = diskData;
    lastFetchTime = now;
    return diskData;
  }

  return {
    updatedAt: new Date().toISOString(),
    stats: { totalActiveDaysPastYear: 0, currentStreak: 0, maxStreak: 0 },
    days: {}
  };
}

module.exports = { getCodingActivity };
