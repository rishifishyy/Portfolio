(function (root, factory) {
  const calendar = factory();
  if (typeof module === "object" && module.exports) module.exports = calendar;
  else root.ActivityCalendar = calendar;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DAY_MS = 86400000;
  function dateKey(date) { return date.toISOString().slice(0, 10); }
  function range(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(now);
    const part = type => parts.find(p => p.type === type).value;
    const end = new Date(`${part("year")}-${part("month")}-${part("day")}T00:00:00Z`);
    const start = new Date(end.getTime() - 364 * DAY_MS);
    return { start, end, startDate: dateKey(start), endDate: dateKey(end) };
  }
  function summarize(input, now = new Date()) {
    const window = range(now), days = {};
    const stats = { totalActiveDaysPastYear: 0, leetcodeActiveDaysPastYear: 0,
      gfgActiveDaysPastYear: 0, bothActiveDaysPastYear: 0, currentStreak: 0, maxStreak: 0 };
    let streak = 0;
    for (let t = window.start.getTime(); t <= window.end.getTime(); t += DAY_MS) {
      const key = dateKey(new Date(t)), raw = input[key] || {};
      const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
      const leetcode = count(raw.leetcode), gfg = count(raw.gfg);
      if (leetcode + gfg) {
        days[key] = { count: leetcode + gfg, leetcode, gfg };
        stats.totalActiveDaysPastYear++;
        if (leetcode) stats.leetcodeActiveDaysPastYear++;
        if (gfg) stats.gfgActiveDaysPastYear++;
        if (leetcode && gfg) stats.bothActiveDaysPastYear++;
        stats.maxStreak = Math.max(stats.maxStreak, ++streak);
      } else streak = 0;
    }
    let t = window.end.getTime();
    if (!days[dateKey(new Date(t))]) t -= DAY_MS;
    while (t >= window.start.getTime() && days[dateKey(new Date(t))]) {
      stats.currentStreak++;
      t -= DAY_MS;
    }
    return { days, stats, range: { startDate: window.startDate, endDate: window.endDate, dayCount: 365 } };
  }
  return { DAY_MS, dateKey, range, summarize };
});
