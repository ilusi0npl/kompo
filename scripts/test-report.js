#!/usr/bin/env node

/**
 * Generate comprehensive test report
 * Runs all tests and generates coverage report
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runTests() {
  console.log('🧪 Running Test Suite\n')
  console.log('═'.repeat(60))

  try {
    // Run unit tests with coverage
    console.log('\n📊 Running Unit Tests with Coverage...\n')
    const { stdout: unitOutput } = await execAsync('npm run test:coverage', {
      cwd: path.join(__dirname, '..'),
    })
    console.log(unitOutput)

    // Run E2E tests
    console.log('\n🌐 Running E2E Tests...\n')
    const { stdout: e2eOutput } = await execAsync('npm run test:e2e', {
      cwd: path.join(__dirname, '..'),
    })
    console.log(e2eOutput)

    console.log('\n✅ All Tests Completed Successfully!\n')
    console.log('═'.repeat(60))
    console.log('\n📈 Coverage Report:')
    console.log('   HTML: ./coverage/index.html')
    console.log('\n📊 E2E Report:')
    console.log('   HTML: ./tmp/playwright-report/index.html\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Tests Failed!\n')
    console.error(error.stdout || error.message)
    process.exit(1)
  }
}

runTests()
