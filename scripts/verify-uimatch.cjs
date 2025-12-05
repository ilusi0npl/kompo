#!/usr/bin/env node
/**
 * UIMatch Verification Script (Generic)
 * Compares implementation with Figma design for pixel-perfect analysis
 *
 * Usage:
 *   node scripts/verify-uimatch.cjs --config=CONFIG_PATH [NODE_NAME|NODE_ID] [OPTIONS]
 *
 * Options:
 *   --config=PATH        Path to project config JSON (required)
 *   --url=URL            Override default URL from config
 *   --selector=CSS       Override selector for element to capture
 *   --profile=NAME       Override profile: component/strict, component/dev, lenient
 *   --size=MODE          Size handling: strict, pad, crop, scale (default: pad)
 *   --no-text            Disable text comparison
 *   --list               List available nodes from config
 *
 * Examples:
 *   node scripts/verify-uimatch.cjs --config=scripts_gadki/uimatch-config.json hero
 *   node scripts/verify-uimatch.cjs --config=scripts_gadki/uimatch-config.json title --profile=component/strict
 *   node scripts/verify-uimatch.cjs --config=scripts_gadki/uimatch-config.json 30-294 --selector="body"
 *   node scripts/verify-uimatch.cjs --config=scripts_gadki/uimatch-config.json --list
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  // sharp not installed - cropping won't work
}

// Parse arguments
const args = process.argv.slice(2);

// Extract options
const options = {
  config: null,
  url: null,
  selector: null,
  profile: null,
  size: 'pad',
  text: true,
  list: false,
  crop: null, // Format: "x,y,width,height" - crop Figma screenshot
};

let nodeArg = null;

args.forEach(arg => {
  if (arg.startsWith('--config=')) {
    options.config = arg.substring('--config='.length);
  } else if (arg.startsWith('--url=')) {
    options.url = arg.substring('--url='.length);
  } else if (arg.startsWith('--selector=')) {
    options.selector = arg.substring('--selector='.length);
  } else if (arg.startsWith('--profile=')) {
    options.profile = arg.substring('--profile='.length);
  } else if (arg.startsWith('--size=')) {
    options.size = arg.substring('--size='.length);
  } else if (arg === '--no-text') {
    options.text = false;
  } else if (arg === '--list') {
    options.list = true;
  } else if (arg.startsWith('--crop=')) {
    options.crop = arg.substring('--crop='.length);
  } else if (!arg.startsWith('--')) {
    nodeArg = arg;
  }
});

// Validate config path
if (!options.config) {
  console.error('❌ Config file is required!');
  console.error('   Usage: node scripts/verify-uimatch.cjs --config=PATH [NODE_NAME]');
  console.error('');
  console.error('   Example: node scripts/verify-uimatch.cjs --config=scripts_gadki/uimatch-config.json hero');
  process.exit(1);
}

// Load config
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

// Handle --list option
if (options.list) {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    Available Nodes                           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  for (const [name, node] of Object.entries(config.nodes || {})) {
    const aliases = Object.entries(config.aliases || {})
      .filter(([, target]) => target === name)
      .map(([alias]) => alias);
    const aliasStr = aliases.length > 0 ? ` (alias: ${aliases.join(', ')})` : '';
    console.log(`  ${name}${aliasStr}`);
    console.log(`    ID: ${node.id}`);
    console.log(`    ${node.name}`);
    if (node.note) console.log(`    Note: ${node.note}`);
    console.log('');
  }
  process.exit(0);
}

// Validate node argument
if (!nodeArg) {
  console.error('❌ Node name or ID is required!');
  console.error('   Usage: node scripts/verify-uimatch.cjs --config=PATH [NODE_NAME|NODE_ID]');
  console.error('');
  console.error('   Use --list to see available nodes');
  process.exit(1);
}

// Resolve node (by name, alias, or direct ID)
let resolvedNode = null;
let nodeName = nodeArg;

// Check if it's an alias
if (config.aliases && config.aliases[nodeArg]) {
  nodeName = config.aliases[nodeArg];
}

// Check if it's a named node
if (config.nodes && config.nodes[nodeName]) {
  resolvedNode = config.nodes[nodeName];
} else {
  // Treat as direct node ID
  resolvedNode = {
    id: nodeArg,
    name: `Custom node ${nodeArg}`,
    selector: options.selector || 'body',
  };
}

// Build final options
const figmaFileKey = config.figmaFileKey;
const figmaNodeId = resolvedNode.id.includes(':') ? resolvedNode.id.replace(':', '-') : resolvedNode.id;
const url = options.url || config.defaultUrl || 'http://localhost:5173';
const selector = options.selector || resolvedNode.selector || 'body';
const profile = options.profile || resolvedNode.profile || config.defaultProfile || 'component/dev';
const outputDir = path.resolve(config.outputDir || 'tmp/uimatch-reports');
const cropBounds = options.crop || resolvedNode.crop || null; // Format: "x,y,width,height"

// Check for FIGMA_ACCESS_TOKEN
if (!process.env.FIGMA_ACCESS_TOKEN) {
  // Try to load from .env file
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
    console.error('   Set it in .env file or export FIGMA_ACCESS_TOKEN=your_token');
    process.exit(1);
  }
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Display header
console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║              UIMatch Pixel-Perfect Verification              ║');
console.log('╠══════════════════════════════════════════════════════════════╣');
console.log(`║  Node:     ${resolvedNode.name.substring(0, 48).padEnd(48)} ║`);
console.log(`║  Node ID:  ${figmaNodeId.padEnd(48)} ║`);
console.log(`║  URL:      ${url.substring(0, 48).padEnd(48)} ║`);
console.log(`║  Selector: ${selector.substring(0, 48).padEnd(48)} ║`);
console.log(`║  Profile:  ${profile.padEnd(48)} ║`);
if (cropBounds) {
  console.log(`║  Crop:     ${cropBounds.padEnd(48)} ║`);
}
console.log('╚══════════════════════════════════════════════════════════════╝');

if (resolvedNode.note) {
  console.log(`   ℹ️  ${resolvedNode.note}`);
}
console.log('');

// Build UIMatch command
const uimatchArgs = [
  '-p', '@uimatch/cli',
  'uimatch', 'compare',
  `figma=${figmaFileKey}:${figmaNodeId}`,
  `story=${url}`,
  `selector=${selector}`,
  `outDir=${outputDir}`,
  `profile=${profile}`,
  `text=${options.text}`,
  `size=${options.size}`,
  'align=top-left',
];

console.log('🔍 Running UIMatch comparison...');
console.log(`   Command: npx ${uimatchArgs.join(' ')}`);
console.log('');

// Run UIMatch
const uimatch = spawn('npx', uimatchArgs, {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd(),
});

uimatch.on('close', (code) => {
  console.log('');

  if (code === 0) {
    console.log('✅ UIMatch comparison completed!');
  } else {
    console.log(`⚠️  UIMatch exited with code ${code}`);
  }

  // Check for report - UIMatch creates timestamped folders
  let reportPath = path.join(outputDir, 'report.json');
  let reportDir = outputDir;

  // Find latest timestamped folder if direct report doesn't exist
  if (!fs.existsSync(reportPath)) {
    try {
      const dirs = fs.readdirSync(outputDir)
        .filter(d => /^\d{8}-\d{6}$/.test(d))
        .sort()
        .reverse();
      if (dirs.length > 0) {
        reportDir = path.join(outputDir, dirs[0]);
        reportPath = path.join(reportDir, 'report.json');
      }
    } catch (e) {
      // Ignore errors reading directory
    }
  }

  if (fs.existsSync(reportPath)) {
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('                         RESULTS                                ');
      console.log('═══════════════════════════════════════════════════════════════');

      if (report.metrics) {
        console.log(`   Design Fidelity Score (DFS): ${report.metrics.dfs || 'N/A'}`);
        console.log(`   Pixel Diff Ratio:            ${(report.metrics.pixelDiffRatio * 100).toFixed(2)}%`);
      }

      if (report.qualityGate) {
        const passed = report.qualityGate.pass;
        console.log(`   Quality Gate:                ${passed ? '✅ PASSED' : '❌ FAILED'}`);
      }

      console.log('');
      console.log('📁 Output files:');
      console.log(`   Report:     ${reportPath}`);

      const diffPath = path.join(reportDir, 'diff.png');
      if (fs.existsSync(diffPath)) {
        console.log(`   Diff Image: ${diffPath}`);
      }

      const figmaPath = path.join(reportDir, 'figma.png');
      if (fs.existsSync(figmaPath)) {
        console.log(`   Figma:      ${figmaPath}`);
      }

      const implPath = path.join(reportDir, 'impl.png');
      if (fs.existsSync(implPath)) {
        console.log(`   Impl:       ${implPath}`);
      }

      // Crop images if crop bounds specified
      let croppedImages = null;
      if (cropBounds) {
        const bounds = parseCropBounds(cropBounds);
        if (bounds) {
          console.log('');
          console.log('✂️  Cropping images to specified bounds...');

          const figmaCroppedPath = path.join(reportDir, 'figma-cropped.png');
          const implCroppedPath = path.join(reportDir, 'impl-cropped.png');

          // Run async cropping
          (async () => {
            const figmaCropped = await cropImage(figmaPath, figmaCroppedPath, bounds);
            const implCropped = await cropImage(implPath, implCroppedPath, bounds);

            if (figmaCropped) console.log(`   Figma Cropped: ${figmaCroppedPath}`);
            if (implCropped) console.log(`   Impl Cropped:  ${implCroppedPath}`);

            // Create diff of cropped images using pixelmatch
            if (figmaCropped && implCropped) {
              try {
                const { PNG } = require('pngjs');
                let pixelmatch = require('pixelmatch');
                // Handle ESM default export
                if (pixelmatch.default) pixelmatch = pixelmatch.default;

                const figmaImg = PNG.sync.read(fs.readFileSync(figmaCroppedPath));
                const implImg = PNG.sync.read(fs.readFileSync(implCroppedPath));

                // Ensure same dimensions (pad if needed)
                const width = Math.max(figmaImg.width, implImg.width);
                const height = Math.max(figmaImg.height, implImg.height);

                const diff = new PNG({ width, height });

                // Pad images to same size if needed
                const padImage = (img, targetW, targetH) => {
                  if (img.width === targetW && img.height === targetH) return img.data;
                  const padded = new PNG({ width: targetW, height: targetH });
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

                const figmaData = padImage(figmaImg, width, height);
                const implData = padImage(implImg, width, height);

                const numDiffPixels = pixelmatch(figmaData, implData, diff.data, width, height, { threshold: 0.1 });
                const totalPixels = width * height;
                const croppedDiffRatio = numDiffPixels / totalPixels;

                const diffCroppedPath = path.join(reportDir, 'diff-cropped.png');
                fs.writeFileSync(diffCroppedPath, PNG.sync.write(diff));
                console.log(`   Diff Cropped:  ${diffCroppedPath}`);
                console.log('');
                console.log(`   📊 Cropped Pixel Diff: ${(croppedDiffRatio * 100).toFixed(2)}%`);

                croppedImages = {
                  figma: figmaCroppedPath,
                  impl: implCroppedPath,
                  diff: diffCroppedPath,
                  diffRatio: croppedDiffRatio
                };

                // Generate HTML report with cropped images
                generateAndSaveHtmlReport();
              } catch (e) {
                console.error(`   ⚠️  Could not create cropped diff: ${e.message}`);
                console.error('      Install: npm install pngjs pixelmatch');
                generateAndSaveHtmlReport();
              }
            } else {
              generateAndSaveHtmlReport();
            }
          })();
          return; // Async handling will call process.exit
        }
      }

      // Generate HTML Report function
      function generateAndSaveHtmlReport() {
        const htmlReport = generateHtmlReport({
          nodeName: resolvedNode.name,
          nodeId: figmaNodeId,
          figmaFileKey,
          url,
          selector,
          profile,
          sizeMode: options.size,
          textCompare: options.text,
          report,
          reportDir,
          timestamp: new Date().toISOString(),
          croppedImages,
          cropBounds,
        });

        const htmlPath = path.join(reportDir, 'report.html');
        fs.writeFileSync(htmlPath, htmlReport);
        console.log(`   HTML Report: ${htmlPath}`);

        console.log('');

        // Provide analysis tips
        if (report.qualityGate && !report.qualityGate.pass) {
          console.log('💡 Tips for fixing differences:');
          console.log('   1. Open diff.png to see highlighted differences');
          console.log('   2. Red areas = pixels that differ between Figma and implementation');
          console.log('   3. Font rendering differences (~5%) are usually acceptable');
          console.log('   4. Structural issues (position, size, missing elements) must be fixed');
          console.log('');
        }

        console.log('🌐 Open HTML report in browser:');
        console.log(`   file://${htmlPath}`);
        console.log('');

        process.exit(code);
      }

      // Call the function if not in async cropping path
      if (!cropBounds) {
        generateAndSaveHtmlReport();
      }

    } catch (e) {
      console.log(`   Could not parse report: ${e.message}`);
      process.exit(code);
    }
  } else {
    console.log('');
    console.log('⚠️  No report.json found. Check if UIMatch ran correctly.');
    process.exit(code);
  }
});

/**
 * Generate HTML report with all analysis details
 */
function generateHtmlReport(data) {
  const { nodeName, nodeId, figmaFileKey, url, selector, profile, sizeMode, textCompare, report, reportDir, timestamp, croppedImages, cropBounds } = data;

  const metrics = report.metrics || {};
  const qualityGate = report.qualityGate || {};
  const passed = qualityGate.pass;

  const pixelDiffPercent = metrics.pixelDiffRatio ? (metrics.pixelDiffRatio * 100).toFixed(2) : 'N/A';
  const dfs = metrics.dfs || 'N/A';

  // Convert images to base64 for embedding
  const figmaImg = encodeImageToBase64(path.join(reportDir, 'figma.png'));
  const implImg = encodeImageToBase64(path.join(reportDir, 'impl.png'));
  const diffImg = encodeImageToBase64(path.join(reportDir, 'diff.png'));

  // Cropped images if available
  const figmaCroppedImg = croppedImages ? encodeImageToBase64(croppedImages.figma) : null;
  const implCroppedImg = croppedImages ? encodeImageToBase64(croppedImages.impl) : null;
  const diffCroppedImg = croppedImages ? encodeImageToBase64(croppedImages.diff) : null;
  const croppedDiffPercent = croppedImages ? (croppedImages.diffRatio * 100).toFixed(2) : null;

  const figmaUrl = `https://www.figma.com/design/${figmaFileKey}?node-id=${nodeId.replace('-', ':')}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UIMatch Report - ${nodeName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a2e;
      color: #eee;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }

    header {
      background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid #2a2a4a;
    }
    h1 { font-size: 24px; margin-bottom: 10px; }
    .subtitle { color: #888; font-size: 14px; }

    .status-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
      margin-top: 15px;
    }
    .status-pass { background: #10b981; color: #fff; }
    .status-fail { background: #ef4444; color: #fff; }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .metric-card {
      background: #16213e;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #2a2a4a;
    }
    .metric-label { color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .metric-value { font-size: 28px; font-weight: bold; }
    .metric-value.good { color: #10b981; }
    .metric-value.bad { color: #ef4444; }
    .metric-value.warning { color: #f59e0b; }

    .config-section {
      background: #16213e;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      border: 1px solid #2a2a4a;
    }
    .config-section h2 { font-size: 16px; margin-bottom: 15px; color: #888; }
    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 10px;
    }
    .config-item {
      display: flex;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #2a2a4a;
    }
    .config-item:last-child { border-bottom: none; }
    .config-label { color: #888; min-width: 100px; }
    .config-value { color: #eee; word-break: break-all; }
    .config-value a { color: #60a5fa; text-decoration: none; }
    .config-value a:hover { text-decoration: underline; }

    .images-section { margin-bottom: 20px; }
    .images-section h2 { font-size: 18px; margin-bottom: 15px; }

    .image-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }
    .tab-btn {
      padding: 10px 20px;
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 8px;
      color: #888;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn:hover { background: #1e2a4a; }
    .tab-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }

    .image-container {
      background: #16213e;
      border-radius: 10px;
      padding: 20px;
      border: 1px solid #2a2a4a;
      text-align: center;
    }
    .image-container img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .image-panel { display: none; }
    .image-panel.active { display: block; }

    .comparison-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .comparison-view .image-container h3 {
      margin-bottom: 15px;
      color: #888;
      font-size: 14px;
    }

    .raw-data {
      background: #16213e;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #2a2a4a;
    }
    .raw-data h2 { font-size: 16px; margin-bottom: 15px; color: #888; }
    .raw-data pre {
      background: #0d1117;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 12px;
      color: #7ee787;
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
      <h1>UIMatch Verification Report</h1>
      <div class="subtitle">${nodeName}</div>
      <div class="status-badge ${passed ? 'status-pass' : 'status-fail'}">
        ${passed ? '✓ QUALITY GATE PASSED' : '✗ QUALITY GATE FAILED'}
      </div>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Design Fidelity Score</div>
        <div class="metric-value ${dfs >= 90 ? 'good' : dfs >= 80 ? 'warning' : 'bad'}">${dfs}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Pixel Diff Ratio</div>
        <div class="metric-value ${parseFloat(pixelDiffPercent) <= 8 ? 'good' : parseFloat(pixelDiffPercent) <= 15 ? 'warning' : 'bad'}">${pixelDiffPercent}%</div>
      </div>
      ${croppedDiffPercent ? `<div class="metric-card">
        <div class="metric-label">Cropped Pixel Diff</div>
        <div class="metric-value ${parseFloat(croppedDiffPercent) <= 8 ? 'good' : parseFloat(croppedDiffPercent) <= 15 ? 'warning' : 'bad'}">${croppedDiffPercent}%</div>
      </div>` : ''}
      <div class="metric-card">
        <div class="metric-label">Quality Gate</div>
        <div class="metric-value ${passed ? 'good' : 'bad'}">${passed ? 'PASS' : 'FAIL'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Profile</div>
        <div class="metric-value" style="font-size: 16px; color: #888;">${profile}</div>
      </div>
      ${cropBounds ? `<div class="metric-card">
        <div class="metric-label">Crop Bounds</div>
        <div class="metric-value" style="font-size: 14px; color: #60a5fa;">${cropBounds}</div>
      </div>` : ''}
    </div>

    <div class="config-section">
      <h2>Configuration</h2>
      <div class="config-grid">
        <div>
          <div class="config-item">
            <span class="config-label">Node Name</span>
            <span class="config-value">${nodeName}</span>
          </div>
          <div class="config-item">
            <span class="config-label">Node ID</span>
            <span class="config-value">${nodeId}</span>
          </div>
          <div class="config-item">
            <span class="config-label">Figma File</span>
            <span class="config-value"><a href="${figmaUrl}" target="_blank">${figmaFileKey}</a></span>
          </div>
        </div>
        <div>
          <div class="config-item">
            <span class="config-label">URL</span>
            <span class="config-value"><a href="${url}" target="_blank">${url}</a></span>
          </div>
          <div class="config-item">
            <span class="config-label">Selector</span>
            <span class="config-value"><code>${selector}</code></span>
          </div>
          <div class="config-item">
            <span class="config-label">Size Mode</span>
            <span class="config-value">${sizeMode}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="images-section">
      <h2>Visual Comparison${croppedDiffPercent ? ' (Full Images)' : ''}</h2>
      <div class="image-tabs">
        <button class="tab-btn active" onclick="showTab('diff')">Diff</button>
        <button class="tab-btn" onclick="showTab('sidebyside')">Side by Side</button>
        <button class="tab-btn" onclick="showTab('figma')">Figma Only</button>
        <button class="tab-btn" onclick="showTab('impl')">Implementation Only</button>
      </div>

      <div id="panel-diff" class="image-panel active">
        <div class="image-container">
          ${diffImg ? `<img src="${diffImg}" alt="Diff visualization">` : '<p>Diff image not available</p>'}
        </div>
      </div>

      <div id="panel-sidebyside" class="image-panel">
        <div class="comparison-view">
          <div class="image-container">
            <h3>Figma Design</h3>
            ${figmaImg ? `<img src="${figmaImg}" alt="Figma design">` : '<p>Image not available</p>'}
          </div>
          <div class="image-container">
            <h3>Implementation</h3>
            ${implImg ? `<img src="${implImg}" alt="Implementation">` : '<p>Image not available</p>'}
          </div>
        </div>
      </div>

      <div id="panel-figma" class="image-panel">
        <div class="image-container">
          ${figmaImg ? `<img src="${figmaImg}" alt="Figma design">` : '<p>Image not available</p>'}
        </div>
      </div>

      <div id="panel-impl" class="image-panel">
        <div class="image-container">
          ${implImg ? `<img src="${implImg}" alt="Implementation">` : '<p>Image not available</p>'}
        </div>
      </div>
    </div>

    ${croppedDiffPercent ? `
    <div class="images-section">
      <h2>Cropped Comparison (${cropBounds})</h2>
      <p style="color: #888; margin-bottom: 15px; font-size: 14px;">
        Cropped to specified bounds for focused comparison. Pixel Diff: <strong style="color: ${parseFloat(croppedDiffPercent) <= 8 ? '#10b981' : '#ef4444'}">${croppedDiffPercent}%</strong>
      </p>
      <div class="image-tabs">
        <button class="tab-btn active" onclick="showTab('cropped-diff')">Cropped Diff</button>
        <button class="tab-btn" onclick="showTab('cropped-sidebyside')">Cropped Side by Side</button>
        <button class="tab-btn" onclick="showTab('cropped-figma')">Cropped Figma</button>
        <button class="tab-btn" onclick="showTab('cropped-impl')">Cropped Implementation</button>
      </div>

      <div id="panel-cropped-diff" class="image-panel active">
        <div class="image-container">
          ${diffCroppedImg ? `<img src="${diffCroppedImg}" alt="Cropped diff visualization">` : '<p>Cropped diff not available</p>'}
        </div>
      </div>

      <div id="panel-cropped-sidebyside" class="image-panel">
        <div class="comparison-view">
          <div class="image-container">
            <h3>Figma Design (Cropped)</h3>
            ${figmaCroppedImg ? `<img src="${figmaCroppedImg}" alt="Cropped Figma design">` : '<p>Image not available</p>'}
          </div>
          <div class="image-container">
            <h3>Implementation (Cropped)</h3>
            ${implCroppedImg ? `<img src="${implCroppedImg}" alt="Cropped Implementation">` : '<p>Image not available</p>'}
          </div>
        </div>
      </div>

      <div id="panel-cropped-figma" class="image-panel">
        <div class="image-container">
          ${figmaCroppedImg ? `<img src="${figmaCroppedImg}" alt="Cropped Figma design">` : '<p>Image not available</p>'}
        </div>
      </div>

      <div id="panel-cropped-impl" class="image-panel">
        <div class="image-container">
          ${implCroppedImg ? `<img src="${implCroppedImg}" alt="Cropped Implementation">` : '<p>Image not available</p>'}
        </div>
      </div>
    </div>
    ` : ''}

    <div class="raw-data">
      <h2>Raw Report Data</h2>
      <pre>${JSON.stringify(report, null, 2)}</pre>
    </div>

    <footer>
      Generated: ${timestamp}<br>
      UIMatch Verification System
    </footer>
  </div>

  <script>
    function showTab(tabName) {
      // Determine which section this tab belongs to (cropped or full)
      const isCropped = tabName.startsWith('cropped-');
      const section = event.target.closest('.images-section');

      // Hide panels and deactivate buttons only in this section
      section.querySelectorAll('.image-panel').forEach(p => p.classList.remove('active'));
      section.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

      // Show selected panel
      document.getElementById('panel-' + tabName).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>`;
}

/**
 * Encode image file to base64 data URI
 */
function encodeImageToBase64(imagePath) {
  if (!fs.existsSync(imagePath)) return null;
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString('base64');
  return `data:image/png;base64,${base64}`;
}

/**
 * Crop image using sharp
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to output image
 * @param {object} bounds - { x, y, width, height }
 */
async function cropImage(inputPath, outputPath, bounds) {
  if (!sharp) {
    console.error('   ⚠️  sharp not installed - cannot crop images');
    console.error('      Run: npm install sharp');
    return false;
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`   ⚠️  Image not found: ${inputPath}`);
    return false;
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Ensure crop bounds don't exceed image dimensions
    const cropX = Math.max(0, Math.min(bounds.x, metadata.width - 1));
    const cropY = Math.max(0, Math.min(bounds.y, metadata.height - 1));
    const cropWidth = Math.min(bounds.width, metadata.width - cropX);
    const cropHeight = Math.min(bounds.height, metadata.height - cropY);

    await image
      .extract({ left: cropX, top: cropY, width: cropWidth, height: cropHeight })
      .toFile(outputPath);

    return true;
  } catch (e) {
    console.error(`   ⚠️  Failed to crop image: ${e.message}`);
    return false;
  }
}

/**
 * Parse crop bounds string "x,y,width,height"
 */
function parseCropBounds(cropString) {
  if (!cropString) return null;
  const parts = cropString.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.length !== 4 || parts.some(isNaN)) {
    console.error(`   ⚠️  Invalid crop format: "${cropString}"`);
    console.error('      Expected: "x,y,width,height" (e.g., "0,0,1728,865")');
    return null;
  }
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

uimatch.on('error', (err) => {
  console.error('❌ Failed to run UIMatch:', err.message);
  console.error('');
  console.error('Make sure UIMatch is installed:');
  console.error('   npm install -D @uimatch/cli playwright');
  console.error('   npx playwright install chromium');
  process.exit(1);
});
