const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({
    viewport: { width: 390, height: 3500 }
  });

  console.log('📱 Testing Fundacja mobile page with expanded declaration...');
  await page.goto('http://localhost:5173/fundacja', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click to expand declaration
  console.log('🖱️ Clicking to expand declaration...');
  await page.click('button:has-text("DEKLARACJA DOSTĘPNOŚCI")');
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: '/tmp/fundacja-mobile-expanded.png',
    fullPage: true
  });

  console.log('✅ Screenshot saved to /tmp/fundacja-mobile-expanded.png');

  await browser.close();
})();
