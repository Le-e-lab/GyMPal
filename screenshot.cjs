const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ 
    headless: true, 
    executablePath: '/home/lee/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/home/lee/Documents/Github/GyMPal/gympal-viewport.png', fullPage: false });
  await page.screenshot({ path: '/home/lee/Documents/Github/GyMPal/gympal-fullpage.png', fullPage: true });
  console.log('Screenshots saved!');
  await browser.close();
})();
