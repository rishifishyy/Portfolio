# Portfolio

A portfolio website I developed with the help of AI

The contribution chart displays exactly 365 days ending on today's date in
Asia/Kolkata. Platform calendar dates are preserved, and old/future dates are
excluded from both the chart and activity statistics.

### GitHub Pages setup

GitHub Pages cannot run `server.js`. The `pages.yml` workflow fetches public
LeetCode and GFG calendars and deploys a fresh static snapshot on each push to
`main`, on manual runs, and approximately every 15 minutes. GitHub can delay
scheduled runs; this is periodic refresh, not a live request to the coding
platforms when a visitor opens the page. The chart displays the snapshot time.

1. Push these changes to `main`.
2. In the repository's **Settings → Pages → Build and deployment**, select
   **GitHub Actions** as the source.
3. Open **Actions → Refresh activity and deploy portfolio → Run workflow**
   to deploy immediately. Ensure Actions and scheduled workflows are enabled.

The generated snapshot is included in the deployment artifact; the workflow
does not commit generated data back to the repository. If one platform fails,
its saved counts and timestamp are preserved while the other platform updates.

For local use, run `node server.js` and open `http://localhost:4173`.
Run `node activity-service.js` to refresh the saved snapshot, and
`node --test tests/*.test.js` to verify date boundaries and upstream failures.
