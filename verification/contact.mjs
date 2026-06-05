// Contact form behavior tests with Formspree fetch mocked.
// Run against a served build: node verification/contact.mjs  (PREVIEW_URL optional)
import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_URL || 'http://localhost:4173';
// the mailto fallback INSIDE the error alert (the page has other mailto links)
const mailtoInAlert = (page) =>
  page.getByRole('alert').locator('a[href="mailto:sumanth.techie9@gmail.com"]');
const b = await chromium.launch();

let pass = 0;
let fail = 0;
const row = (n, ok, d = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? `  — ${d}` : ''}`);
  ok ? pass++ : fail++;
};

// mock: 'ok' | 'bad' | 'reject' | 'slow'
async function open(mock) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const calls = { count: 0, bodies: [] };
  await page.route('**/formspree.io/**', async (route) => {
    calls.count++;
    calls.bodies.push(route.request().postData());
    if (mock === 'slow') {
      await new Promise((r) => setTimeout(r, 700));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    } else if (mock === 'ok') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    } else if (mock === 'bad') {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [{ message: 'That email looks invalid.' }] }),
      });
    } else {
      await route.abort('failed'); // network reject
    }
  });
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
  return { ctx, page, calls };
}

const fillValid = async (page) => {
  await page.fill('#firstName', 'Jane');
  await page.fill('#lastName', 'Doe');
  await page.fill('#email', 'jane@example.com');
  await page.fill('#message', 'Hello there, this is a test message.');
};
const submit = (page) => page.getByRole('button', { name: /^submit$/i }).click();

// 1) valid submit -> success + Send another -> empty form; payload correct
{
  const { ctx, page, calls } = await open('ok');
  await fillValid(page);
  await submit(page);
  await page.waitForTimeout(600);
  row('valid: fetch called exactly once', calls.count === 1, `calls=${calls.count}`);
  row('valid: success status region', await page.getByRole('status').isVisible());
  row('valid: confirmation text', await page.getByText(/your message is on its way/i).isVisible());
  const body = calls.bodies[0] || '';
  row(
    'valid: payload has email + _subject (JSON)',
    body.includes('jane@example.com') && body.includes('_subject'),
  );
  await page.getByRole('button', { name: /send another/i }).click();
  await page.waitForTimeout(300);
  const fn = await page.inputValue('#firstName');
  row('valid: Send another -> empty form', (await page.locator('form').isVisible()) && fn === '', `firstName="${fn}"`);
  await ctx.close();
}

// 2) required empty -> blocked, first invalid focused, NO fetch
{
  const { ctx, page, calls } = await open('ok');
  await page.fill('#email', 'jane@example.com');
  await page.fill('#message', 'Hello');
  await submit(page);
  await page.waitForTimeout(300);
  row('empty: fetch NOT called', calls.count === 0, `calls=${calls.count}`);
  const focused = await page.evaluate(`document.activeElement && document.activeElement.id`);
  row('empty: first invalid field (firstName) focused', focused === 'firstName', `focused=${focused}`);
  await ctx.close();
}

// 3) honeypot filled -> NO fetch, success path (bot dropped)
{
  const { ctx, page, calls } = await open('ok');
  await fillValid(page);
  await page.evaluate(`(() => {
    const el = document.getElementById('_gotcha');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, 'i-am-a-bot');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await submit(page);
  await page.waitForTimeout(400);
  row('honeypot: fetch NOT called', calls.count === 0, `calls=${calls.count}`);
  row('honeypot: success path shown', await page.getByText(/your message is on its way/i).isVisible());
  await ctx.close();
}

// 4) !ok response -> error alert + mailto fallback + submit re-enabled
{
  const { ctx, page } = await open('bad');
  await fillValid(page);
  await submit(page);
  await page.waitForTimeout(500);
  row('error(!ok): alert region shown', await page.getByRole('alert').isVisible());
  row('error(!ok): server message surfaced', await page.getByText(/that email looks invalid/i).isVisible());
  row('error(!ok): mailto fallback shown', await mailtoInAlert(page).isVisible());
  row('error(!ok): submit re-enabled', await page.getByRole('button', { name: /^submit$/i }).isEnabled());
  await ctx.close();
}

// 5) network reject -> error alert + mailto fallback
{
  const { ctx, page } = await open('reject');
  await fillValid(page);
  await submit(page);
  await page.waitForTimeout(500);
  row(
    'reject: alert + mailto fallback',
    (await page.getByRole('alert').isVisible()) && (await mailtoInAlert(page).isVisible()),
  );
  await ctx.close();
}

// 6) submit disabled + "Sending…" only while in flight (slow mock)
{
  const { ctx, page } = await open('slow');
  await fillValid(page);
  await submit(page);
  await page.waitForTimeout(150);
  const btn = page.getByRole('button', { name: /sending/i });
  row('sending: button disabled + "Sending…"', (await btn.isVisible()) && (await btn.isDisabled()));
  await page.waitForTimeout(900);
  row('sending: resolves to success', await page.getByText(/your message is on its way/i).isVisible());
  await ctx.close();
}

// 7) no horizontal overflow at 320 / 390 (honeypot must not push layout)
for (const w of [320, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
  const ov = await page.evaluate(
    `Math.max(0, (document.scrollingElement.scrollWidth) - (document.scrollingElement.clientWidth))`,
  );
  row(`contact no h-overflow @${w}`, ov <= 1, `${ov}px`);
  await ctx.close();
}

await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
