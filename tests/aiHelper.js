const OpenAI = require('openai');
require('dotenv').config();

/**
 * AI Helper for Test Analysis
 * Uses OpenAI GPT to analyze Playwright test logs and provide suggestions
 */

class AIHelper {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.model = process.env.AI_MODEL || 'gpt-4-turbo-preview';
    this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.7;
    this.maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 2000;
  }

  /**
   * Analyze test logs and provide AI-powered suggestions
   * @param {Object} testResults - Playwright test results
   * @param {Array} testLogs - Array of log messages
   * @returns {Promise<Object>} AI analysis and suggestions
   */
  async analyzeTestResults(testResults, testLogs = []) {
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      return {
        error: 'OpenAI API key not configured',
        suggestions: ['Please set OPENAI_API_KEY in your .env file']
      };
    }

    const prompt = this.buildPrompt(testResults, testLogs);

    try {
      console.log('🤖 Sending test results to GPT for analysis...\n');

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert QA engineer and web application tester specializing in analyzing Playwright test results. 
Your task is to:
1. Analyze test failures and identify root causes
2. Suggest fixes for failed tests
3. Identify potential bugs in the application
4. Recommend additional test cases
5. Provide code examples when helpful
6. Consider security, accessibility, and UX issues

Be concise but thorough. Prioritize actionable suggestions.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const analysis = completion.choices[0].message.content;
      
      return {
        success: true,
        analysis,
        model: this.model,
        tokensUsed: completion.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('❌ Error calling OpenAI API:', error.message);
      return {
        error: error.message,
        suggestions: ['Check your OpenAI API key', 'Verify your internet connection', 'Check OpenAI API status']
      };
    }
  }

  /**
   * Build the prompt for GPT based on test results
   * @param {Object} testResults 
   * @param {Array} testLogs 
   * @returns {string}
   */
  buildPrompt(testResults, testLogs) {
    const { stats, failures, passes, testFile } = testResults;

    let prompt = `# Playwright Test Results Analysis

## Test Suite: ${testFile || 'Unknown'}

## Statistics:
- Total Tests: ${stats.total}
- Passed: ${stats.passed}
- Failed: ${stats.failed}
- Skipped: ${stats.skipped}
- Duration: ${stats.duration}ms

`;

    if (failures && failures.length > 0) {
      prompt += `## Failed Tests:\n\n`;
      failures.forEach((failure, index) => {
        prompt += `### ${index + 1}. ${failure.title}\n`;
        prompt += `**Error:** ${failure.error}\n`;
        prompt += `**Location:** ${failure.location || 'N/A'}\n`;
        if (failure.stack) {
          prompt += `**Stack Trace:**\n\`\`\`\n${failure.stack}\n\`\`\`\n`;
        }
        prompt += `\n`;
      });
    }

    if (passes && passes.length > 0) {
      prompt += `## Passed Tests:\n`;
      passes.forEach(pass => {
        prompt += `- ✓ ${pass.title} (${pass.duration}ms)\n`;
      });
      prompt += `\n`;
    }

    if (testLogs && testLogs.length > 0) {
      prompt += `## Test Logs:\n\`\`\`\n${testLogs.join('\n')}\n\`\`\`\n\n`;
    }

    prompt += `## Please Provide:

1. **Root Cause Analysis**: What likely caused the test failures?
2. **Bug Assessment**: Are these test failures or application bugs?
3. **Recommended Fixes**: Specific code changes or test improvements
4. **Additional Test Cases**: What other scenarios should be tested?
5. **Priority Level**: Rate the severity of issues found (Critical/High/Medium/Low)

Please be specific and actionable in your recommendations.`;

    return prompt;
  }

  /**
   * Generate test suggestions for a specific feature
   * @param {string} featureName 
   * @param {string} description 
   * @returns {Promise<Object>}
   */
  async generateTestCases(featureName, description) {
    if (!process.env.OPENAI_API_KEY) {
      return { error: 'OpenAI API key not configured' };
    }

    const prompt = `Generate comprehensive Playwright test cases for the following feature:

Feature: ${featureName}
Description: ${description}

Platform: TechMigo (E-Learning Platform)
Tech Stack: Next.js, React, TypeScript, MongoDB

Please provide:
1. Test case descriptions (Given/When/Then format)
2. Playwright test code examples
3. Edge cases to consider
4. Accessibility tests
5. Security considerations

Format the response with code examples that can be directly used.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert QA engineer specializing in web application testing with Playwright.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      return {
        success: true,
        testCases: completion.choices[0].message.content,
        tokensUsed: completion.usage?.total_tokens || 0
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Format AI response for console output
   * @param {Object} aiResponse 
   */
  formatOutput(aiResponse) {
    if (aiResponse.error) {
      console.log('\n❌ AI Analysis Error:');
      console.log(aiResponse.error);
      if (aiResponse.suggestions) {
        console.log('\nSuggestions:');
        aiResponse.suggestions.forEach(s => console.log(`  - ${s}`));
      }
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('🤖 AI ANALYSIS RESULTS');
    console.log('='.repeat(80));
    console.log('\n' + aiResponse.analysis);
    console.log('\n' + '='.repeat(80));
    console.log(`📊 Model: ${aiResponse.model} | Tokens Used: ${aiResponse.tokensUsed}`);
    console.log('='.repeat(80) + '\n');
  }
}

module.exports = AIHelper;
