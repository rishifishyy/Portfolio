import type { Config } from "@netlify/functions";
import activityService from "../../activity-service.js";
import httpService from "../../activity-http.js";
import savedActivity from "../../data/coding-activity.json" with { type: "json" };

export default async function handler(request: Request) {
  return httpService.createActivityHandler(() => activityService.getCodingActivity(false, {
    persist: false, fallbackData: savedActivity
  }))(request);
}

export const config: Config = { path: "/api/coding-activity" };
