const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

// Enhanced stealth configuration
// We keep some evasions that might be useful for modern sites
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('media.codecs');

// Add more custom evasions or configurations if needed
// For Playwright, the stealth plugin works by injecting scripts into the browser context

chromium.use(stealth);

module.exports = { chromium };
