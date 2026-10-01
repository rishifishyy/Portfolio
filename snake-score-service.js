const MAX_SCORE = 1000000;

function validScore(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= MAX_SCORE;
}

function createScoreService(store, { seed = 0, key = 'world-record' } = {}) {
  if (!validScore(seed)) throw new Error('Invalid initial record');
  const readEntry = async () => {
    const entry = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });
    if (entry && !validScore(entry.data?.bestScore)) throw new Error('Invalid stored record');
    return entry;
  };
  const recordFrom = entry => ({
    bestScore: Math.max(seed, entry?.data.bestScore ?? 0),
    updatedAt: entry?.data.updatedAt ?? null
  });
  return {
    async read() { return recordFrom(await readEntry()); },
    async submit(score) {
      if (!validScore(score)) throw new TypeError('Invalid score');
      for (let attempt = 0; attempt < 12; attempt++) {
        const entry = await readEntry();
        const record = recordFrom(entry);
        if (score <= record.bestScore) return { ...record, updated: false };
        const next = { bestScore: score, updatedAt: new Date().toISOString() };
        const result = await store.setJSON(key, next, entry ? { onlyIfMatch: entry.etag } : { onlyIfNew: true });
        if (result.modified) return { ...next, updated: true };
      }
      throw new Error('Record is busy; retry the submission');
    }
  };
}

module.exports = { createScoreService, validScore };
