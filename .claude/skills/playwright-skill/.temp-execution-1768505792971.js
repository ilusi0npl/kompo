const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Mobile viewport (390px)
  await page.setViewportSize({ width: 390, height: 844 });

  // Screenshot MobileKalendarz header
  await page.goto(`${TARGET_URL}/kalendarz`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: '/tmp/mobile-kalendarz-fixed.png',
    clip: { x: 0, y: 0, width: 390, height: 350 }
  });
  console.log('📸 Kalendarz: /tmp/mobile-kalendarz-fixed.png');

  // Screenshot MobileArchiwalne header
  await page.goto(`${TARGET_URL}/archiwalne`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: '/tmp/mobile-archiwalne-fixed.png',
    clip: { x: 0, y: 0, width: 390, height: 350 }
  });
  console.log('📸 Archiwalne: /tmp/mobile-archiwalne-fixed.png');

  await browser.close();
})();
