#!/usr/bin/env node
/**
 * Figma Sections Verification Tool
 *
 * Takes full page screenshot from Figma, cuts into sections,
 * compares each section with implementation using Playwright + pixelmatch.
 *
 * Usage:
 *   node scripts/verify-figma-sections.cjs --config=CONFIG_PATH [OPTIONS]
 *
 * Options:
 *   --config=PATH        Path to sections config JSON (required)
 *   --url=URL            Implementation URL (default: http://localhost:5173)
 *   --output=DIR         Output directory (default: tmp/figma-sections)
 *   --section=NAME       Run only specific section
 *   --threshold=N        Pixel diff threshold 0-1 (default: 0.1)
 *
 * Config format:
 *   {
 *     "figmaFileKey": "...",
 *     "figmaNodeId": "21-2",
 *     "pageWidth": 1728,
 *     "sections": {
 *       "hero": { "y": 0, "height": 865 },
 *       "about": { "y": 865, "height": 600 },
 *       ...
 *     }
 *   }
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Try to load optional dependencies
let sharp, playwright, PNG, pixelmatch;

try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ sharp not installed. Run: npm install sharp');
  process.exit(1);
}

try {
  playwright = require('playwright');
} catch (e) {
  console.error('❌ playwright not installed. Run: npm install playwright && npx playwright install chromium');
  process.exit(1);
}

try {
  PNG = require('pngjs').PNG;
  pixelmatch = require('pixelmatch');
  if (pixelmatch.default) pixelmatch = pixelmatch.default;
} catch (e) {
  console.error('❌ pngjs/pixelmatch not installed. Run: npm install pngjs pixelmatch');
  process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2);
const options = {
  config: null,
  url: 'http://localhost:5173',
  output: 'tmp/figma-sections',
  section: null,
  threshold: 0.1,
};

args.forEach(arg => {
  if (arg.startsWith('--config=')) {
    options.config = arg.substring('--config='.length);
  } else if (arg.startsWith('--url=')) {
    options.url = arg.substring('--url='.length);
  } else if (arg.startsWith('--output=')) {
    options.output = arg.substring('--output='.length);
  } else if (arg.startsWith('--section=')) {
    options.section = arg.substring('--section='.length);
  } else if (arg.startsWith('--threshold=')) {
    options.threshold = parseFloat(arg.substring('--threshold='.length));
  }
});

// Validate config
if (!options.config) {
  console.error('❌ Config file is required!');
  console.error('   Usage: node scripts/verify-figma-sections.cjs --config=PATH');
  process.exit(1);
}

const configPath = path.resolve(options.config);
if (!fs.existsSync(configPath)) {
  console.error(`❌ Config file not found: ${configPath}`);
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error(`❌ Failed to parse config: ${e.message}`);
  process.exit(1);
}

// Use devServerUrl from config if not overridden via CLI
if (config.devServerUrl && options.url === 'http://localhost:5173') {
  options.url = config.devServerUrl;
}

// Load Figma token
if (!process.env.FIGMA_ACCESS_TOKEN) {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/FIGMA_ACCESS_TOKEN=(.+)/);
    if (match) {
      process.env.FIGMA_ACCESS_TOKEN = match[1].trim();
    }
  }
  if (!process.env.FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN not found!');
    process.exit(1);
  }
}

// Create output directory
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
const outputDir = path.resolve(options.output, timestamp);
fs.mkdirSync(outputDir, { recursive: true });

/**
 * Fetch image from Figma API
 */
async function fetchFigmaScreenshot(fileKey, nodeId) {
  const nodeIdFormatted = nodeId.replace('-', ':');
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeIdFormatted}&format=png&scale=1`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.err) {
            reject(new Error(json.err));
            return;
          }
          const imageUrl = json.images[nodeIdFormatted];
          if (!imageUrl) {
            reject(new Error('No image URL in response'));
            return;
          }
          resolve(imageUrl);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

/**
 * Download image from URL
 */
async function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(imageUrl, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

/**
 * Crop image to bounds
 */
async function cropImage(inputPath, outputPath, bounds) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const x = Math.max(0, Math.min(bounds.x || 0, metadata.width - 1));
  const y = Math.max(0, Math.min(bounds.y, metadata.height - 1));
  const width = Math.min(bounds.width || metadata.width, metadata.width - x);
  const height = Math.min(bounds.height, metadata.height - y);

  await sharp(inputPath)
    .extract({ left: x, top: y, width, height })
    .toFile(outputPath);

  return { width, height };
}

/**
 * Compare two images using pixelmatch
 */
function compareImages(img1Path, img2Path, diffPath, threshold = 0.1) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  // Use max dimensions
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  const diff = new PNG({ width, height });

  // Pad images to same size
  const padImage = (img, targetW, targetH) => {
    if (img.width === targetW && img.height === targetH) return img.data;
    const padded = new PNG({ width: targetW, height: targetH });
    // Fill with white background
    for (let i = 0; i < padded.data.length; i += 4) {
      padded.data[i] = 255;
      padded.data[i + 1] = 255;
      padded.data[i + 2] = 255;
      padded.data[i + 3] = 255;
    }
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const srcIdx = (y * img.width + x) * 4;
        const dstIdx = (y * targetW + x) * 4;
        padded.data[dstIdx] = img.data[srcIdx];
        padded.data[dstIdx + 1] = img.data[srcIdx + 1];
        padded.data[dstIdx + 2] = img.data[srcIdx + 2];
        padded.data[dstIdx + 3] = img.data[srcIdx + 3];
      }
    }
    return padded.data;
  };

  const data1 = padImage(img1, width, height);
  const data2 = padImage(img2, width, height);

  const numDiffPixels = pixelmatch(data1, data2, diff.data, width, height, {
    threshold,
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0]
  });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const diffRatio = numDiffPixels / totalPixels;

  return {
    width,
    height,
    diffPixels: numDiffPixels,
    totalPixels,
    diffRatio,
    diffPercent: (diffRatio * 100).toFixed(2)
  };
}

/**
 * Generate HTML report
 */
function generateHtmlReport(results, config) {
  const encodeImage = (imgPath) => {
    if (!fs.existsSync(imgPath)) return null;
    const data = fs.readFileSync(imgPath);
    return `data:image/png;base64,${data.toString('base64')}`;
  };

  const sectionsHtml = results.map(r => {
    const figmaImg = encodeImage(r.figmaPath);
    const implImg = encodeImage(r.implPath);
    const diffImg = encodeImage(r.diffPath);
    const statusClass = r.diffRatio <= 0.08 ? 'pass' : r.diffRatio <= 0.15 ? 'warning' : 'fail';
    const statusText = r.diffRatio <= 0.08 ? 'PASS' : r.diffRatio <= 0.15 ? 'WARNING' : 'FAIL';

    return `
    <div class="section-card">
      <div class="section-header">
        <h2>${r.name}</h2>
        <span class="status ${statusClass}">${statusText} - ${r.diffPercent}%</span>
      </div>
      <div class="section-info">
        <span>Bounds: y=${r.bounds.y}, h=${r.bounds.height}</span>
        <span>Figma: ${r.figmaSize?.width || '?'}x${r.figmaSize?.height || '?'}</span>
        <span>Impl: ${r.implSize?.width || '?'}x${r.implSize?.height || '?'}</span>
      </div>
      <div class="images-grid">
        <div class="image-box">
          <h3>Figma</h3>
          ${figmaImg ? `<img src="${figmaImg}" alt="Figma ${r.name}">` : '<p>Not available</p>'}
        </div>
        <div class="image-box">
          <h3>Implementation</h3>
          ${implImg ? `<img src="${implImg}" alt="Impl ${r.name}">` : '<p>Not available</p>'}
        </div>
        <div class="image-box">
          <h3>Diff</h3>
          ${diffImg ? `<img src="${diffImg}" alt="Diff ${r.name}">` : '<p>Not available</p>'}
        </div>
      </div>
    </div>`;
  }).join('\n');

  const passCount = results.filter(r => r.diffRatio <= 0.08).length;
  const totalCount = results.length;
  const overallStatus = passCount === totalCount ? 'pass' : passCount >= totalCount / 2 ? 'warning' : 'fail';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Sections Verification Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a2e;
      color: #eee;
      padding: 20px;
    }
    .container { max-width: 1600px; margin: 0 auto; }

    header {
      background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid #2a2a4a;
    }
    h1 { font-size: 24px; margin-bottom: 10px; }
    .summary {
      display: flex;
      gap: 20px;
      margin-top: 15px;
    }
    .summary-item {
      background: #2a2a4a;
      padding: 15px 25px;
      border-radius: 8px;
    }
    .summary-item .label { color: #888; font-size: 12px; }
    .summary-item .value { font-size: 24px; font-weight: bold; margin-top: 5px; }
    .summary-item .value.pass { color: #10b981; }
    .summary-item .value.warning { color: #f59e0b; }
    .summary-item .value.fail { color: #ef4444; }

    .section-card {
      background: #16213e;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #2a2a4a;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .section-header h2 { font-size: 18px; }
    .status {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .status.pass { background: #10b981; color: white; }
    .status.warning { background: #f59e0b; color: white; }
    .status.fail { background: #ef4444; color: white; }

    .section-info {
      display: flex;
      gap: 20px;
      color: #888;
      font-size: 12px;
      margin-bottom: 15px;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .image-box {
      background: #0d1117;
      border-radius: 8px;
      padding: 15px;
    }
    .image-box h3 {
      font-size: 14px;
      color: #888;
      margin-bottom: 10px;
    }
    .image-box img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }

    footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Figma Sections Verification Report</h1>
      <div class="summary">
        <div class="summary-item">
          <div class="label">Sections Passed</div>
          <div class="value ${overallStatus}">${passCount}/${totalCount}</div>
        </div>
        <div class="summary-item">
          <div class="label">Threshold</div>
          <div class="value" style="color: #888;">≤8%</div>
        </div>
        <div class="summary-item">
          <div class="label">URL</div>
          <div class="value" style="font-size: 14px; color: #60a5fa;">${options.url}</div>
        </div>
      </div>
    </header>

    ${sectionsHtml}

    <footer>
      Generated: ${new Date().toISOString()}<br>
      Figma Sections Verification Tool
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           Figma Sections Verification Tool                   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  const { figmaFileKey, figmaNodeId, pageWidth, sections } = config;

  if (!figmaFileKey || !figmaNodeId || !sections) {
    console.error('❌ Config missing required fields: figmaFileKey, figmaNodeId, sections');
    process.exit(1);
  }

  // Filter sections if --section specified
  const sectionNames = options.section
    ? [options.section]
    : Object.keys(sections);

  console.log(`📋 Sections to verify: ${sectionNames.join(', ')}`);
  console.log(`🔗 URL: ${options.url}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log('');

  // Step 1: Fetch full page screenshot from Figma
  console.log('📥 Fetching Figma screenshot...');
  let figmaImageUrl;
  try {
    figmaImageUrl = await fetchFigmaScreenshot(figmaFileKey, figmaNodeId);
    console.log('   ✅ Got image URL from Figma API');
  } catch (e) {
    console.error(`   ❌ Failed to fetch from Figma: ${e.message}`);
    process.exit(1);
  }

  const figmaFullPath = path.join(outputDir, 'figma-full.png');
  try {
    await downloadImage(figmaImageUrl, figmaFullPath);
    console.log(`   ✅ Downloaded: ${figmaFullPath}`);
  } catch (e) {
    console.error(`   ❌ Failed to download: ${e.message}`);
    process.exit(1);
  }

  // Get Figma image dimensions
  const figmaMetadata = await sharp(figmaFullPath).metadata();
  console.log(`   📐 Figma size: ${figmaMetadata.width}x${figmaMetadata.height}`);
  console.log('');

  // Step 2: Launch browser for implementation screenshots
  console.log('🌐 Launching browser...');
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: pageWidth || 1728, height: 1080 }
  });
  const page = await context.newPage();

  try {
    await page.goto(options.url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('   ✅ Page loaded');
  } catch (e) {
    console.error(`   ❌ Failed to load page: ${e.message}`);
    await browser.close();
    process.exit(1);
  }
  console.log('');

  // Step 3: Process each section
  const results = [];

  for (const sectionName of sectionNames) {
    const sectionConfig = sections[sectionName];
    if (!sectionConfig) {
      console.log(`⚠️  Section "${sectionName}" not found in config, skipping`);
      continue;
    }

    console.log(`📦 Processing section: ${sectionName}`);

    const sectionDir = path.join(outputDir, sectionName);
    fs.mkdirSync(sectionDir, { recursive: true });

    const bounds = {
      x: sectionConfig.x || 0,
      y: sectionConfig.y,
      width: sectionConfig.width || pageWidth || figmaMetadata.width,
      height: sectionConfig.height
    };

    // Crop Figma screenshot to section bounds
    const figmaSectionPath = path.join(sectionDir, 'figma.png');
    let figmaSize;
    try {
      figmaSize = await cropImage(figmaFullPath, figmaSectionPath, bounds);
      console.log(`   ✅ Figma cropped: ${figmaSize.width}x${figmaSize.height}`);
    } catch (e) {
      console.error(`   ❌ Failed to crop Figma: ${e.message}`);
      continue;
    }

    // Screenshot implementation section
    const implSectionPath = path.join(sectionDir, 'impl.png');
    let implSize;
    try {
      const selector = sectionConfig.selector || `[data-section="${sectionName}"]`;
      const element = await page.$(selector);
      if (element) {
        await element.screenshot({ path: implSectionPath });
        const implMetadata = await sharp(implSectionPath).metadata();
        implSize = { width: implMetadata.width, height: implMetadata.height };
        console.log(`   ✅ Impl captured: ${implSize.width}x${implSize.height}`);
      } else {
        console.log(`   ⚠️  Selector not found: ${selector}`);
        // Fallback: capture by scrolling to Y position and taking viewport screenshot
        await page.evaluate((y) => window.scrollTo(0, y), bounds.y);
        await page.waitForTimeout(100);
        await page.screenshot({
          path: implSectionPath,
          clip: { x: 0, y: 0, width: bounds.width, height: bounds.height }
        });
        const implMetadata = await sharp(implSectionPath).metadata();
        implSize = { width: implMetadata.width, height: implMetadata.height };
        console.log(`   ✅ Impl captured (viewport): ${implSize.width}x${implSize.height}`);
      }
    } catch (e) {
      console.error(`   ❌ Failed to capture impl: ${e.message}`);
      continue;
    }

    // Compare images
    const diffPath = path.join(sectionDir, 'diff.png');
    let comparison;
    try {
      comparison = compareImages(figmaSectionPath, implSectionPath, diffPath, options.threshold);
      console.log(`   📊 Diff: ${comparison.diffPercent}% (${comparison.diffPixels} pixels)`);
    } catch (e) {
      console.error(`   ❌ Failed to compare: ${e.message}`);
      continue;
    }

    results.push({
      name: sectionName,
      bounds,
      figmaPath: figmaSectionPath,
      implPath: implSectionPath,
      diffPath: diffPath,
      figmaSize,
      implSize,
      ...comparison
    });

    console.log('');
  }

  await browser.close();

  // Step 4: Generate report
  console.log('📝 Generating HTML report...');
  const htmlReport = generateHtmlReport(results, config);
  const htmlPath = path.join(outputDir, 'report.html');
  fs.writeFileSync(htmlPath, htmlReport);
  console.log(`   ✅ Report: ${htmlPath}`);

  // Save JSON results
  const jsonPath = path.join(outputDir, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
  console.log(`   ✅ JSON: ${jsonPath}`);

  // Summary
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                         SUMMARY                                ');
  console.log('═══════════════════════════════════════════════════════════════');

  const passed = results.filter(r => r.diffRatio <= 0.08).length;
  const warned = results.filter(r => r.diffRatio > 0.08 && r.diffRatio <= 0.15).length;
  const failed = results.filter(r => r.diffRatio > 0.15).length;

  console.log(`   ✅ Passed (≤8%):  ${passed}`);
  console.log(`   ⚠️  Warning (≤15%): ${warned}`);
  console.log(`   ❌ Failed (>15%): ${failed}`);
  console.log('');

  results.forEach(r => {
    const status = r.diffRatio <= 0.08 ? '✅' : r.diffRatio <= 0.15 ? '⚠️' : '❌';
    console.log(`   ${status} ${r.name}: ${r.diffPercent}%`);
  });

  console.log('');
  console.log('🌐 Open HTML report:');
  console.log(`   file://${htmlPath}`);
  console.log('');

  // Exit with error if any failed
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error('❌ Fatal error:', e.message);
  process.exit(1);
});
