// Diagnostic script to check Playwright installation
// Run this on Leapcell to debug issues

const { chromium } = require('./stealth');

async function checkPlaywright() {
  console.log('🔍 Checking Playwright installation...\n');
  
  console.log('Environment:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', process.env.PORT);
  console.log('- PLAYWRIGHT_BROWSERS_PATH:', process.env.PLAYWRIGHT_BROWSERS_PATH || 'default');
  console.log('- Platform:', process.platform);
  console.log('- Node version:', process.version);
  console.log('');

  try {
    console.log('🚀 Attempting to launch browser...');
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox']
    });
    
    const version = await browser.version();
    console.log('✅ Browser launched successfully!');
    console.log('- Browser version:', version);
    
    await browser.close();
    console.log('✅ Browser closed successfully');
    console.log('\n✅ PLAYWRIGHT IS WORKING!');
    
  } catch (error) {
    console.error('❌ Failed to launch browser!');
    console.error('Error:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('1. Check if browsers are installed: ls -la ~/.cache/ms-playwright/');
    console.error('2. Install browsers: npx playwright install chromium');
    console.error('3. Install deps: npx playwright install-deps chromium');
    console.error('\n❌ PLAYWRIGHT IS NOT WORKING - needs fix!');
  }
}

checkPlaywright();
