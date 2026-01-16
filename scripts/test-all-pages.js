#!/usr/bin/env node

/**
 * Test All Pages - Local Config vs Sanity CMS
 *
 * Tests all pages in both modes:
 * 1. VITE_USE_SANITY=false (local config)
 * 2. VITE_USE_SANITY=true (Sanity CMS)
 *
 * Verifies that pages load successfully and display content
 */

import { chromium } from 'playwright';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL = 'http://localhost:5173';
const TIMEOUT = 30000; // 30 seconds per page

// All pages to test
const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/bio', name: 'Bio' },
  { path: '/kalendarz', name: 'Kalendarz' },
  { path: '/archiwalne', name: 'Archiwalne' },
  { path: '/media', name: 'Media (Galeria)' },
  { path: '/media/wideo', name: 'Media (Wideo)' },
  { path: '/repertuar', name: 'Repertuar' },
  { path: '/specialne', name: 'Projekty Specjalne' },
  { path: '/kontakt', name: 'Kontakt' },
  { path: '/fundacja', name: 'Fundacja' },
];

/**
 * Update .env file with USE_SANITY flag
 */
function updateEnvFile(useSanity) {
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  // Replace VITE_USE_SANITY value
  envContent = envContent.replace(
    /VITE_USE_SANITY=.*/,
    `VITE_USE_SANITY=${useSanity}`
  );

  fs.writeFileSync(envPath, envContent);
  console.log(`  ✓ Updated .env: VITE_USE_SANITY=${useSanity}`);
}

/**
 * Wait for dev server to be ready
 */
async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('Dev server failed to start');
}

/**
 * Test a single page
 */
async function testPage(browser, pagePath, pageName) {
  const page = await browser.newPage();
  const results = {
    name: pageName,
    path: pagePath,
    success: false,
    loadTime: 0,
    errors: [],
    warnings: [],
  };

  try {
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        results.warnings.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      results.errors.push(error.message);
    });

    const startTime = Date.now();

    // Navigate to page
    const response = await page.goto(`${DEV_SERVER_URL}${pagePath}`, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT,
    });

    results.loadTime = Date.now() - startTime;

    // Check if page loaded successfully
    if (!response || !response.ok()) {
      results.errors.push(`HTTP ${response?.status() || 'unknown'}`);
      return results;
    }

    // Wait for main content to be visible
    await page.waitForSelector('section', { timeout: 5000 });

    // Check for loading/error states
    const hasLoadingText = await page.locator('text=/Ładowanie|Loading/i').count() > 0;
    const hasErrorText = await page.locator('text=/Błąd|Error/i').count() > 0;

    if (hasLoadingText) {
      results.warnings.push('Page still showing loading state');
    }

    if (hasErrorText) {
      results.errors.push('Page showing error message');
    }

    // Take screenshot
    const screenshotDir = path.join(__dirname, '../tmp/page-tests');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(
      screenshotDir,
      `${pageName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });

    results.success = results.errors.length === 0;
  } catch (error) {
    results.errors.push(error.message);
  } finally {
    await page.close();
  }

  return results;
}

/**
 * Test all pages in one mode
 */
async function testAllPages(mode) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing with ${mode === 'local' ? 'LOCAL CONFIG' : 'SANITY CMS'}`);
  console.log(`${'='.repeat(60)}\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const page of PAGES) {
    process.stdout.write(`Testing ${page.name}... `);
    const result = await testPage(browser, page.path, page.name);
    results.push(result);

    if (result.success) {
      console.log(`✅ OK (${result.loadTime}ms)`);
    } else {
      console.log(`❌ FAILED`);
      result.errors.forEach(err => console.log(`   - ${err}`));
    }
  }

  await browser.close();
  return results;
}

/**
 * Generate comparison report
 */
function generateReport(localResults, sanityResults) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('COMPARISON REPORT');
  console.log(`${'='.repeat(60)}\n`);

  const reportPath = path.join(__dirname, '../tmp/page-tests/report.txt');
  let report = '';

  report += '# Page Test Results - Local Config vs Sanity CMS\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  for (let i = 0; i < PAGES.length; i++) {
    const page = PAGES[i];
    const local = localResults[i];
    const sanity = sanityResults[i];

    console.log(`${page.name}:`);
    report += `## ${page.name} (${page.path})\n\n`;

    // Local config results
    const localStatus = local.success ? '✅ PASS' : '❌ FAIL';
    console.log(`  Local Config:  ${localStatus} (${local.loadTime}ms)`);
    report += `**Local Config:** ${localStatus} (${local.loadTime}ms)\n`;
    if (local.errors.length > 0) {
      console.log(`    Errors: ${local.errors.length}`);
      report += `- Errors: ${local.errors.join(', ')}\n`;
    }

    // Sanity CMS results
    const sanityStatus = sanity.success ? '✅ PASS' : '❌ FAIL';
    console.log(`  Sanity CMS:    ${sanityStatus} (${sanity.loadTime}ms)`);
    report += `**Sanity CMS:** ${sanityStatus} (${sanity.loadTime}ms)\n`;
    if (sanity.errors.length > 0) {
      console.log(`    Errors: ${sanity.errors.length}`);
      report += `- Errors: ${sanity.errors.join(', ')}\n`;
    }

    console.log('');
    report += '\n';
  }

  // Summary
  const localPassed = localResults.filter(r => r.success).length;
  const sanityPassed = sanityResults.filter(r => r.success).length;
  const total = PAGES.length;

  console.log(`${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}\n`);
  console.log(`Local Config:  ${localPassed}/${total} pages passed`);
  console.log(`Sanity CMS:    ${sanityPassed}/${total} pages passed\n`);

  report += '## Summary\n\n';
  report += `- **Local Config:** ${localPassed}/${total} pages passed\n`;
  report += `- **Sanity CMS:** ${sanityPassed}/${total} pages passed\n`;

  fs.writeFileSync(reportPath, report);
  console.log(`Report saved to: ${reportPath}\n`);

  return { localPassed, sanityPassed, total };
}

/**
 * Main test function
 */
async function main() {
  console.log('🚀 Starting Page Tests - Local Config vs Sanity CMS\n');

  let devServer = null;

  try {
    // Test 1: Local Config (VITE_USE_SANITY=false)
    console.log('📝 Phase 1: Testing with LOCAL CONFIG\n');
    updateEnvFile('false');

    console.log('  Starting dev server...');
    devServer = exec('npm run dev', { cwd: path.join(__dirname, '..') });

    console.log('  Waiting for server to be ready...');
    await waitForServer(DEV_SERVER_URL);
    console.log('  ✓ Dev server ready\n');

    const localResults = await testAllPages('local');

    // Kill dev server
    devServer.kill();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Sanity CMS (VITE_USE_SANITY=true)
    console.log('\n📝 Phase 2: Testing with SANITY CMS\n');
    updateEnvFile('true');

    console.log('  Starting dev server...');
    devServer = exec('npm run dev', { cwd: path.join(__dirname, '..') });

    console.log('  Waiting for server to be ready...');
    await waitForServer(DEV_SERVER_URL);
    console.log('  ✓ Dev server ready\n');

    const sanityResults = await testAllPages('sanity');

    // Generate comparison report
    const { localPassed, sanityPassed, total } = generateReport(localResults, sanityResults);

    // Restore original .env setting
    updateEnvFile('false');

    // Exit with status code
    if (localPassed === total && sanityPassed === total) {
      console.log('✅ All tests passed!\n');
      process.exit(0);
    } else {
      console.log('❌ Some tests failed\n');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}\n`);
    updateEnvFile('false'); // Restore original setting
    process.exit(1);
  } finally {
    if (devServer) {
      devServer.kill();
    }
  }
}

// Run tests
main();
