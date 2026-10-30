const { chromium } = require('../sales/demo-video/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

const baseURL = process.env.EBLOCK_URL || 'http://127.0.0.1:8012';
const sizes = [320, 390];
const outputDir = path.join(__dirname, '..', 'sales', 'demo-video', 'review-frames');
fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const width of sizes) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('console', message => { if (message.type() === 'error' && !message.text().includes('401 (Unauthorized)')) errors.push(message.text()); });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.getByLabel('Cédula').fill('1034657945');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.getByRole('button', { name: /Lavandería/ }).first().click();
    await page.getByText('Lavado + secado · 90 minutos').waitFor();
    const occupied = await page.getByRole('button', { name: /08:00–09:30/ }).isDisabled();
    const free = page.getByRole('button', { name: /09:30–11:00/ });
    await free.click();
    await page.screenshot({ path: path.join(outputDir, `laundry-bundle-${width}.png`), fullPage: true });
    results.push({ width, occupied, selected: await free.getAttribute('class'), consoleErrors: errors });
    await page.close();
  }
  const adminContext = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const admin = await adminContext.newPage();
  await admin.goto(baseURL, { waitUntil: 'networkidle' });
  await admin.getByLabel('Cédula').fill('1034657946');
  await admin.getByRole('button', { name: 'Ingresar' }).click();
  await admin.getByRole('button', { name: /Lavandería/ }).first().click();
  await admin.getByText('Control de lavandería').waitFor();
  const actionCount = await admin.getByRole('button', { name: 'Marcar pago recibido' }).count();
  await admin.screenshot({ path: path.join(outputDir, 'laundry-bundle-admin-390.png'), fullPage: true });
  await admin.close();
  await adminContext.close();
  await browser.close();
  console.log(JSON.stringify({ results, actionCount }, null, 2));
  if (results.some(result => !result.occupied || !result.selected?.includes('eblock-slot-selected') || result.consoleErrors.length) || actionCount < 1) process.exit(1);
})();
