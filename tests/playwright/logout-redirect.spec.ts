import { test, expect } from '@playwright/test';

const CANDIDATE_BASES = [
  'http://localhost:5000',
  'http://localhost:3004',
  'http://127.0.0.1:5000',
];

test.describe('Logout redirect / chain checks', () => {
  test('reproduce logout redirect and capture chain (GET /api/logout, GET /api/admin/logout, POST /api/auth/logout)', async ({ page, request, playwright }) => {
    // 1) Find first responsive base URL
    let base: string | null = null;
    for (const candidate of CANDIDATE_BASES) {
      try {
        const r = await request.get(`${candidate}/`, { timeout: 3000 });
        if (r.status() >= 200 && r.status() < 400) {
          base = candidate;
          break;
        }
      } catch (e) {
        // ignore and try next
      }
    }

    test.skip(!base, `No responsive base URL found among: ${CANDIDATE_BASES.join(', ')}`);

    // helper to capture responses and console messages during a navigation
    const responseLog: Array<any> = [];
    const consoleLog: Array<any> = [];

    page.on('console', (msg) => {
      consoleLog.push({ type: msg.type(), text: msg.text() });
    });

    page.on('response', async (resp) => {
      try {
        const u = resp.url();
        const s = resp.status();
        const h = resp.headers();
        // only capture logout-related + >=400 for noise control
        if (u.includes('/logout') || s >= 400) {
          let bodySnippet = null;
          try {
            const ct = (h['content-type'] || '').toLowerCase();
            if (ct.includes('text') || ct.includes('html') || ct.includes('json')) {
              const text = await resp.text();
              bodySnippet = text ? text.slice(0, 300) : null;
            }
          } catch (err) {
            bodySnippet = `<failed to read body: ${err}>`;
          }
          responseLog.push({ url: u, status: s, location: h['location'] || null, bodySnippet });
        }
      } catch (err) {
        // swallow
      }
    });

    async function checkGetEndpoint(path: string, screenshotName: string) {
      const start = Date.now();
      const navResponse = await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(e => null);
      const end = Date.now();

      // Collect redirect chain from captured responses that happened during the navigation window
      const chain = responseLog
        .filter(r => r && r.url && r.url.startsWith(base) && r.url.includes(path.split('/').pop() || 'logout'))
        .map(r => ({ url: r.url, status: r.status, location: r.location }));

      // If we didn't capture specific responses for the endpoint, also include any >=300 responses that occurred during the window
      const otherChain = responseLog.filter(r => r && r.url && (r.url.includes('/logout') || r.status >= 300));

      const finalUrl = page.url();
      const finalStatus = navResponse ? navResponse.status() : null;
      const title = await page.title().catch(() => '');
      const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 300);

      // screenshot (saved to test-results by Playwright runner)
      const screenshotPath = `logout-${screenshotName}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });

      return {
        path,
        start,
        end,
        capturedChain: chain.length ? chain : otherChain,
        finalUrl,
        finalStatus,
        pageTitle: title,
        bodySnippet: bodyText,
        screenshotPath,
      };
    }

    // 3) GET /api/logout
    const logoutResult = await checkGetEndpoint('/api/logout', 'api-logout');

    // 4) GET /api/admin/logout
    const adminLogoutResult = await checkGetEndpoint('/api/admin/logout', 'api-admin-logout');

    // 5) POST /api/auth/logout
    let postAuthLogout = { status: null as number | null, json: null as any };
    try {
      const apiReq = await playwright.request.newContext({ baseURL: base });
      const r = await apiReq.post('/api/auth/logout');
      postAuthLogout.status = r.status();
      try { postAuthLogout.json = await r.json(); } catch (e) { postAuthLogout.json = await r.text().catch(() => null); }
      await apiReq.dispose();
    } catch (err) {
      postAuthLogout = { status: null, json: `request failed: ${String(err)}` };
    }

    // 6) Gather console / network errors that include 'logout' or status >= 400
    const consoleErrors = consoleLog;
    const networkErrors = responseLog.filter(r => r.url.includes('logout') || (r.status && r.status >= 400));

    // Save a JSON summary file to the test-results directory (Playwright will pick it up)
    const summary = {
      usedBase: base,
      logoutResult,
      adminLogoutResult,
      postAuthLogout,
      consoleErrors,
      networkErrors,
    };

    // attach summary as test info for quick access
    test.info().attach('logout-redirect-summary.json', { body: JSON.stringify(summary, null, 2), contentType: 'application/json' });

    // Basic assertions so failures are visible in CI
    // We don't assert a specific redirect — just record and surface anomalies
    expect(summary.usedBase).toBeTruthy();

    // Helpful debugging output in the test log
    console.log('Logout redirect summary:', JSON.stringify(summary, null, 2));
  });
});
