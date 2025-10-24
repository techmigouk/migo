const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const AIHelper = require('./aiHelper');
require('dotenv').config();

/**
 * AI-Powered Test Runner
 * Runs Playwright tests, captures results, and uses GPT to analyze and provide suggestions
 */

class AITester {
  constructor() {
    this.aiHelper = new AIHelper();
    this.testLogs = [];
    this.resultsFile = path.join(__dirname, 'test-results', 'results.json');
  }

  /**
   * Run Playwright tests and collect results
   * @param {string} testFile - Specific test file to run (optional)
   * @returns {Promise<Object>}
   */
  async runTests(testFile = '') {
    return new Promise((resolve, reject) => {
      const testCommand = testFile 
        ? `npx playwright test ${testFile} --reporter=json`
        : `npx playwright test --reporter=json`;

      console.log('🎭 Running Playwright tests...\n');
      console.log(`Command: ${testCommand}\n`);

      const testProcess = exec(testCommand, { cwd: __dirname });

      let stdout = '';
      let stderr = '';

      testProcess.stdout.on('data', (data) => {
        stdout += data;
        process.stdout.write(data);
      });

      testProcess.stderr.on('data', (data) => {
        stderr += data;
        process.stderr.write(data);
      });

      testProcess.on('close', (code) => {
        console.log(`\n✅ Tests completed with exit code: ${code}\n`);
        
        resolve({
          exitCode: code,
          stdout,
          stderr,
          success: code === 0
        });
      });

      testProcess.on('error', (error) => {
        console.error('❌ Error running tests:', error);
        reject(error);
      });
    });
  }

  /**
   * Parse Playwright JSON results
   * @returns {Object}
   */
  parseResults() {
    try {
      if (!fs.existsSync(this.resultsFile)) {
        console.log('⚠️  No test results file found. Running tests without JSON reporter may not have generated results.');
        return null;
      }

      const resultsData = fs.readFileSync(this.resultsFile, 'utf8');
      const results = JSON.parse(resultsData);

      const stats = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0
      };

      const failures = [];
      const passes = [];

      // Parse test suites
      results.suites?.forEach(suite => {
        suite.specs?.forEach(spec => {
          stats.total++;

          spec.tests?.forEach(test => {
            const result = test.results?.[0];
            
            if (result) {
              stats.duration += result.duration || 0;

              if (result.status === 'passed') {
                stats.passed++;
                passes.push({
                  title: spec.title,
                  duration: result.duration
                });
              } else if (result.status === 'failed') {
                stats.failed++;
                failures.push({
                  title: spec.title,
                  error: result.error?.message || 'Unknown error',
                  stack: result.error?.stack,
                  location: spec.file
                });
              } else if (result.status === 'skipped') {
                stats.skipped++;
              }
            }
          });
        });
      });

      return {
        stats,
        failures,
        passes,
        testFile: results.suites?.[0]?.file || 'Unknown',
        rawResults: results
      };
    } catch (error) {
      console.error('❌ Error parsing test results:', error.message);
      return null;
    }
  }

  /**
   * Generate a summary report
   * @param {Object} testResults 
   */
  printSummary(testResults) {
    if (!testResults) {
      console.log('⚠️  No test results to summarize');
      return;
    }

    const { stats, failures } = testResults;

    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests:    ${stats.total}`);
    console.log(`✅ Passed:      ${stats.passed} (${((stats.passed / stats.total) * 100).toFixed(1)}%)`);
    console.log(`❌ Failed:      ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`);
    console.log(`⏭️  Skipped:     ${stats.skipped}`);
    console.log(`⏱️  Duration:    ${(stats.duration / 1000).toFixed(2)}s`);
    console.log('='.repeat(80));

    if (failures.length > 0) {
      console.log('\n❌ FAILED TESTS:\n');
      failures.forEach((failure, index) => {
        console.log(`${index + 1}. ${failure.title}`);
        console.log(`   Error: ${failure.error}`);
        console.log(`   Location: ${failure.location}\n`);
      });
    }
  }

  /**
   * Main execution flow
   */
  async run() {
    console.log('🚀 AI-Powered Test Runner for TechMigo Platform\n');

    try {
      // Step 1: Run tests
      const testExecution = await this.runTests('specs/registration.spec.js');

      // Step 2: Parse results
      console.log('📋 Parsing test results...\n');
      const testResults = this.parseResults();

      if (!testResults) {
        console.log('⚠️  Unable to parse test results. AI analysis skipped.');
        return;
      }

      // Step 3: Print summary
      this.printSummary(testResults);

      // Step 4: AI Analysis (only if there are failures or user wants analysis)
      if (testResults.stats.failed > 0 || process.env.AI_ALWAYS_ANALYZE === 'true') {
        console.log('\n🤖 Requesting AI analysis from GPT...\n');
        
        const aiAnalysis = await this.aiHelper.analyzeTestResults(
          testResults,
          this.testLogs
        );

        // Step 5: Display AI suggestions
        this.aiHelper.formatOutput(aiAnalysis);

        // Save AI analysis to file
        this.saveAnalysis(aiAnalysis, testResults);
      } else {
        console.log('\n✅ All tests passed! No AI analysis needed.\n');
        console.log('💡 Tip: Set AI_ALWAYS_ANALYZE=true to get AI insights even for passing tests.\n');
      }

      // Step 6: Generate additional test suggestions (optional)
      if (process.env.AI_SUGGEST_TESTS === 'true') {
        console.log('\n🔮 Generating additional test suggestions...\n');
        const suggestions = await this.aiHelper.generateTestCases(
          'Student Registration',
          'User signup flow with profile completion requirement'
        );
        
        if (suggestions.success) {
          console.log('\n' + '='.repeat(80));
          console.log('💡 SUGGESTED ADDITIONAL TEST CASES');
          console.log('='.repeat(80));
          console.log(suggestions.testCases);
          console.log('='.repeat(80) + '\n');
        }
      }

    } catch (error) {
      console.error('❌ Fatal error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Save AI analysis to file
   * @param {Object} analysis 
   * @param {Object} testResults 
   */
  saveAnalysis(analysis, testResults) {
    try {
      const analysisDir = path.join(__dirname, 'test-results', 'ai-analysis');
      if (!fs.existsSync(analysisDir)) {
        fs.mkdirSync(analysisDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `analysis-${timestamp}.md`;
      const filepath = path.join(analysisDir, filename);

      const content = `# AI Test Analysis Report
**Generated:** ${new Date().toLocaleString()}
**Model:** ${analysis.model || 'N/A'}
**Tokens Used:** ${analysis.tokensUsed || 0}

## Test Statistics
- Total: ${testResults.stats.total}
- Passed: ${testResults.stats.passed}
- Failed: ${testResults.stats.failed}
- Duration: ${(testResults.stats.duration / 1000).toFixed(2)}s

## AI Analysis

${analysis.analysis || analysis.error || 'No analysis available'}

---
*Generated by TechMigo AI Test Runner*
`;

      fs.writeFileSync(filepath, content);
      console.log(`\n💾 AI analysis saved to: ${filepath}\n`);
    } catch (error) {
      console.error('⚠️  Could not save AI analysis:', error.message);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const tester = new AITester();
  tester.run().catch(console.error);
}

module.exports = AITester;
