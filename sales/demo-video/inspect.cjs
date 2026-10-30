const { chromium } = require('@playwright/test');
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:1 });
  await page.goto('https://eblock-production.up.railway.app/', {waitUntil:'networkidle'});
  console.log('URL', page.url());
  console.log((await page.locator('body').innerText()).slice(0,5000));
  console.log('BUTTONS', await page.locator('button').allTextContents());
  console.log('INPUTS', await page.locator('input').evaluateAll(xs=>xs.map(x=>({type:x.type,placeholder:x.placeholder,name:x.name,aria:x.getAttribute('aria-label')}))));
  await browser.close();
})();
