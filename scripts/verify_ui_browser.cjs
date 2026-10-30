const { chromium } = require('../sales/demo-video/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

const baseURL = process.env.EBLOCK_URL || 'http://127.0.0.1:8012';
const sizes = [320, 390, 768, 1024, 1440];
const outputDir = path.join(__dirname, '..', 'sales', 'demo-video', 'review-frames');
fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const width of sizes) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.getByLabel('Cédula').fill('1034657945');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.getByRole('button', { name: /Lavandería/ }).first().click();
    await page.waitForLoadState('networkidle');
    await page.getByText('Estado en tiempo real').waitFor();
    const pageText = await page.locator('body').innerText();
    const disabled = await page.locator('button:disabled').allTextContents();
    const iconColors = await page.evaluate(() => {
      const probe = (label) => {
        const button = document.querySelector(`button[aria-label="${label}"]`);
        const svg = button?.querySelector('svg');
        return { button: button ? getComputedStyle(button).color : null, stroke: svg ? getComputedStyle(svg).stroke : null };
      };
      return { back: probe('Volver'), bell: probe('Notificaciones próximamente') };
    });
    await page.getByRole('checkbox', { name: /Secadora/ }).click();
    const dryerDisabled = await page.locator('button:disabled').allTextContents();
    const file = path.join(outputDir, `ui-refresh-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    results.push({ width, hasReplacementCharacter: pageText.includes('\uFFFD'), occupied08: disabled.some((text) => text.includes('08:00') && text.includes('Ocupado')), occupied11: disabled.some((text) => text.includes('11:00') && text.includes('Ocupado')), occupied14: dryerDisabled.some((text) => text.includes('14:00') && text.includes('Ocupado')), headerIconColors: iconColors, screenshot: file });
    await page.close();
  }
  await browser.close();
  const failed = results.filter((result) => result.hasReplacementCharacter || !result.occupied08 || !result.occupied11 || !result.occupied14 || result.headerIconColors.back.stroke !== 'rgb(255, 248, 244)' || result.headerIconColors.bell.stroke !== 'rgb(255, 248, 244)');
  console.log(JSON.stringify(results, null, 2));
  if (failed.length) process.exit(1);
})();
