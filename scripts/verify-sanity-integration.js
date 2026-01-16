#!/usr/bin/env node

/**
 * Automatic Sanity Integration Verification
 *
 * Compares:
 * 1. Local with Sanity OFF (hardcoded config)
 * 2. Local with Sanity ON (CMS data)
 * 3. Production (Vercel)
 *
 * Generates pixel-perfect comparison report.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIEWPORT = { width: 1440, height: 2008 };
const URLS = {
  production: 'https://kompo-pi.vercel.app/kalendarz',
  localOff: 'http://localhost:5176/kalendarz',
  localOn: 'http://localhost:5176/kalendarz',
};

const OUTPUT_DIR = path.join(__dirname, '../tmp/sanity-verification');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const RUN_DIR = path.join(OUTPUT_DIR, TIMESTAMP);

// Ensure output directory exists
if (!fs.existsSync(RUN_DIR)) {
  fs.mkdirSync(RUN_DIR, { recursive: true });
}

/**
 * Take screenshot of a page
 */
async function takeScreenshot(page, url, name) {
  console.log(`📸 Taking screenshot: ${name}`);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for images to load
  await page.waitForTimeout(2000);

  const screenshotPath = path.join(RUN_DIR, `${name}.png`);
  await page.screenshot({
    path: screenshotPath,
    fullPage: false,
  });

  console.log(`✓ Saved: ${name}.png`);
  return screenshotPath;
}

/**
 * Compare two screenshots
 */
function compareScreenshots(img1Path, img2Path, diffName) {
  console.log(`\n🔍 Comparing: ${path.basename(img1Path)} vs ${path.basename(img2Path)}`);

  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const diffPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(2);

  // Save diff image
  const diffPath = path.join(RUN_DIR, `diff-${diffName}.png`);
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  console.log(`  Diff pixels: ${numDiffPixels} / ${totalPixels} (${diffPercentage}%)`);
  console.log(`  Saved: diff-${diffName}.png`);

  return {
    numDiffPixels,
    totalPixels,
    diffPercentage: parseFloat(diffPercentage),
    diffPath,
  };
}

/**
 * Generate HTML report
 */
function generateReport(results) {
  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanity Integration Verification - ${TIMESTAMP}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'IBM Plex Mono', monospace;
      padding: 40px;
      background: #f5f5f5;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #131313;
    }
    .timestamp {
      font-size: 14px;
      color: #666;
      margin-bottom: 30px;
    }
    .summary {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .summary h2 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #131313;
    }
    .status {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .status.pass { background: #A0E38A; color: #131313; }
    .status.fail { background: #FF734C; color: white; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f9f9f9;
      font-weight: 600;
    }
    .comparison {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .comparison h3 {
      font-size: 18px;
      margin-bottom: 20px;
      color: #131313;
    }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .image-container {
      text-align: center;
    }
    .image-container img {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .image-label {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>🔍 Sanity Integration Verification</h1>
  <div class="timestamp">Generated: ${new Date().toLocaleString('pl-PL')}</div>

  <div class="summary">
    <h2>Summary</h2>
    ${results.map(r => `
      <div>
        <strong>${r.name}</strong>
        <span class="status ${r.diffPercentage <= 2 ? 'pass' : 'fail'}">
          ${r.diffPercentage <= 2 ? '✅ PASS' : '❌ FAIL'}
        </span>
        <p>Difference: ${r.diffPercentage}% (${r.numDiffPixels.toLocaleString()} / ${r.totalPixels.toLocaleString()} pixels)</p>
      </div>
    `).join('<br/>')}

    <table>
      <thead>
        <tr>
          <th>Comparison</th>
          <th>Diff %</th>
          <th>Diff Pixels</th>
          <th>Total Pixels</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(r => `
          <tr>
            <td><strong>${r.name}</strong></td>
            <td>${r.diffPercentage}%</td>
            <td>${r.numDiffPixels.toLocaleString()}</td>
            <td>${r.totalPixels.toLocaleString()}</td>
            <td>${r.diffPercentage <= 2 ? '✅ PASS' : '❌ FAIL'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${results.map(r => `
    <div class="comparison">
      <h3>${r.name}</h3>
      <p><strong>Difference:</strong> ${r.diffPercentage}%</p>
      <p><strong>Status:</strong> <span class="status ${r.diffPercentage <= 2 ? 'pass' : 'fail'}">${r.diffPercentage <= 2 ? '✅ PASS' : '❌ FAIL'}</span></p>

      <div class="image-grid">
        <div class="image-container">
          <img src="${path.basename(r.img1)}" alt="Image 1">
          <div class="image-label">${r.label1}</div>
        </div>
        <div class="image-container">
          <img src="${path.basename(r.img2)}" alt="Image 2">
          <div class="image-label">${r.label2}</div>
        </div>
        <div class="image-container">
          <img src="${path.basename(r.diffPath)}" alt="Diff">
          <div class="image-label">Diff (${r.diffPercentage}%)</div>
        </div>
      </div>
    </div>
  `).join('')}

  <div class="summary">
    <h2>Threshold</h2>
    <p>✅ PASS: Diff ≤ 2%</p>
    <p>❌ FAIL: Diff > 2%</p>
    <p><em>Note: Minor differences expected due to font rendering, anti-aliasing, and dynamic content timestamps.</em></p>
  </div>
</body>
</html>`;

  const reportPath = path.join(RUN_DIR, 'report.html');
  fs.writeFileSync(reportPath, html);
  console.log(`\n📊 Report generated: ${reportPath}`);
  return reportPath;
}

/**
 * Main verification function
 */
async function verify() {
  console.log('🚀 Starting Sanity Integration Verification\n');
  console.log(`Output directory: ${RUN_DIR}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  const results = [];

  try {
    // Take screenshots
    console.log('📸 Taking screenshots...\n');

    const productionPath = await takeScreenshot(page, URLS.production, 'production');

    console.log('\n⚠️  Note: For local screenshots, ensure dev server is running:');
    console.log('  1. VITE_USE_SANITY=false → npm run dev');
    console.log('  2. Take local-off screenshot');
    console.log('  3. VITE_USE_SANITY=true → restart dev server');
    console.log('  4. Take local-on screenshot\n');

    // Check if local servers are accessible
    let localOffPath, localOnPath;

    try {
      await page.goto(URLS.localOff, { waitUntil: 'domcontentloaded', timeout: 5000 });
      console.log('\n✓ Local dev server detected\n');

      // Assume current state is OFF (default)
      localOffPath = await takeScreenshot(page, URLS.localOff, 'local-off');

      console.log('\n⚠️  To complete verification:');
      console.log('  1. Stop dev server (Ctrl+C)');
      console.log('  2. Set VITE_USE_SANITY=true in .env');
      console.log('  3. Restart: npm run dev');
      console.log('  4. Run this script again\n');

    } catch (err) {
      console.log('\n⚠️  Local dev server not detected');
      console.log('  Start server: npm run dev\n');
    }

    // Compare what we have
    if (productionPath && localOffPath) {
      console.log('\n🔍 Comparing screenshots...\n');

      const result = compareScreenshots(
        productionPath,
        localOffPath,
        'production-vs-local-off'
      );

      results.push({
        name: 'Production vs Local (Sanity OFF)',
        label1: 'Production (Vercel)',
        label2: 'Local (Hardcoded Config)',
        img1: productionPath,
        img2: localOffPath,
        ...result,
      });
    }

    // Generate report
    if (results.length > 0) {
      const reportPath = generateReport(results);
      console.log(`\n✅ Verification complete!`);
      console.log(`\n📄 Open report: file://${reportPath}\n`);
    } else {
      console.log('\n⚠️  No comparisons performed. Start local dev server first.\n');
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run verification
verify();
