const { chromium } = require('@playwright/test');
(async() => {
 const b=await chromium.launch({headless:true}); const p=await b.newPage({viewport:{width:390,height:844}});
 await p.goto('https://eblock-production.up.railway.app/', {waitUntil:'networkidle'});
 await p.locator('input').fill('1034657945'); await p.getByRole('button',{name:'Ingresar'}).click(); await p.waitForTimeout(500);
 console.log('URL',p.url()); console.log((await p.locator('body').innerText()).slice(0,10000));
 console.log('BUTTONS',await p.locator('button').allTextContents()); console.log('LINKS',await p.locator('a').allTextContents());
 await b.close();
})();
