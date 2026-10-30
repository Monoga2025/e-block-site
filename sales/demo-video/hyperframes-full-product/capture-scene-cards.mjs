import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const chrome = 'C:/Users/Monoga/.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--allow-file-access-from-files', '--disable-gpu'],
});
const page = await browser.newPage();
page.on('console', (message) => console.log('browser:', message.type(), message.text()));
page.on('pageerror', (error) => console.error('pageerror:', error.message));
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve('index.html')).href, { waitUntil: 'networkidle0', timeout: 120000 });
console.log(await page.evaluate(() => ({ gsap: typeof window.gsap, timelines: Object.keys(window.__timelines || {}) })));
await fs.mkdir('render-cards', { recursive: true });
for (const t of [0.8, 2.8, 14.8, 26.8, 40.8, 57.8, 72]) {
  await page.evaluate((time) => {
    const tl = window.__timelines['eblock-full-product-walkthrough'];
    tl.pause().seek(time, false);
    for (const media of document.querySelectorAll('video[data-start]')) {
      const start = Number(media.dataset.start || 0);
      const duration = Number(media.dataset.duration || media.duration || 0);
      media.currentTime = Math.max(0, Math.min(time - start, Math.max(0, duration - 0.04)));
    }
  }, t);
  await new Promise((resolve) => setTimeout(resolve, 400));
  await page.screenshot({ path: `render-cards/card-${String(t).replace('.', '_')}.jpg`, type: 'jpeg', quality: 92 });
}
await browser.close();
