import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import scoreService from '../../snake-score-service.js';
import scoreHttp from '../../snake-score-http.js';
import previousRecord from '../../data/snake-best.json' with { type: 'json' };

export default async function handler(request: Request) {
  const store = getStore({ name: 'portfolio-snake-scores', consistency: 'strong' });
  const service = scoreService.createScoreService(store, { seed: previousRecord.bestScore });
  return scoreHttp.createScoreHandler(service)(request);
}

export const config: Config = { path: '/api/snake-best' };
