# Portfolio

A portfolio website I developed with the help of AI

The contribution chart displays exactly 365 days ending on today's date in
Asia/Kolkata. Platform calendar dates are preserved, and old/future dates are
excluded from both the chart and activity statistics.

### Live coding activity

The GitHub Pages frontend reads `window.PORTFOLIO_ACTIVITY_API` from
`portfolio-data.js`. A small Netlify function fetches LeetCode and GFG activity
on demand, with a five-minute cache. The frontend fetches on visits, every five
minutes while visible, and when returning to the tab. Its saved JSON snapshot
remains a fallback when the live service cannot be reached. Old data is labelled
"Saved activity"; each platform's fetch time is available in the status tooltip.

The function uses the same activity calculations as the local server and runs
without writing to the deployment filesystem. It allows browser reads from
`https://rishifishyy.github.io`. Netlify publishes only `netlify/public` plus the
function, while the portfolio keeps its existing GitHub Pages address.

To update the live service, authenticate with Netlify and run:
`npx netlify deploy --site 9ba4d8c2-ddd9-4b54-8ef8-95beaf5f264a --dir netlify/public --functions netlify/functions --no-build --prod`.
The public data endpoint is
`https://rishifishyy-portfolio-activity.netlify.app/api/coding-activity`.

### GitHub Pages setup

GitHub Pages cannot run `server.js`. The `pages.yml` workflow fetches public
LeetCode and GFG calendars and deploys a fresh static snapshot on each push to
`main`, on manual runs, and on a requested 15-minute schedule. GitHub can delay
or skip scheduled runs, so this schedule supplies fallback snapshots and does
not determine live chart freshness. The chart displays the data's fetch time.

1. Push these changes to `main`.
2. In the repository's **Settings → Pages → Build and deployment**, select
   **GitHub Actions** as the source.
3. Open **Actions → Refresh activity and deploy portfolio → Run workflow**
   to deploy immediately. Ensure Actions and scheduled workflows are enabled.

The generated snapshot is included in the deployment artifact; the workflow
does not commit generated data back to the repository. If one platform fails,
its saved counts and timestamp are preserved while the other platform updates.

For local use, run `node server.js` and open `http://localhost:4173`.
The learning section uses React and GSAP, bundled locally with esbuild. Run
`npm install` once, then `npm start` to rebuild the component and start the site.
After editing `learning-experience.jsx`, run `npm run build`. The generated
`learning.bundle.js` is included with the static GitHub Pages website.
The background and name reveal run automatically. Background rendering pauses
while the browser tab is hidden or a dialog is open, then resumes automatically.
TeamUP uses the supplied homepage screenshot cropped below the browser chrome,
with a smaller responsive image for mobile and the full image in project details.
Run `node activity-service.js` to refresh the saved snapshot, and
`node --test tests/*.test.js` to verify date boundaries and upstream failures.

### Snake global record

The game reads and submits scores to `PORTFOLIO_SNAKE_API` in `portfolio-data.js`.
A Netlify function stores one shared record in a site-wide Blobs store.
Conditional writes keep a lower simultaneous score from replacing a higher one.
The record survives deployments. An open game checks for updates every 10 seconds.

A failed upload stays pending and retries when the connection returns.
The displayed global record changes only after the server confirms it.

Deploy the Netlify service before publishing the frontend. The same deployment
command above includes `snake-best.mts`. GitHub Pages hosts the UI; Netlify hosts
the record API. `node server.js` proxies the API for local play. Set `PORT` to
change the local port, or `SNAKE_API_URL` to test a draft API.
