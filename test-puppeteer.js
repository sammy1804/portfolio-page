const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERR:', err.message));
  page.on('requestfailed', request => console.log('REQ FAIL:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:4173/ai-assets.html', { waitUntil: 'networkidle' });
  
  await browser.close();
})();
