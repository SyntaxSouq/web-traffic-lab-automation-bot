/**
 * ROUTE: [automation.js](file:///c:/Users/whoami/Desktop/playwrgiht%20-%20Copy%20(2)/backend/routes/automation.js)
 * RESPONSIBILITY: Handles automation API requests, validates inputs, and monitors concurrent execution.
 * 
 * ENDPOINTS:
 * 1. POST /api/automate: Main automation entry point.
 * 2. GET /api/health: Service status check.
 */

const express = require('express');
const router = express.Router();
const dns = require('dns').promises;
const ipaddr = require('ipaddr.js');
const { automateWebsite } = require('../services/playwright');

/**
 * Robust SSRF validation: Resolves hostname and checks if IP is private/local.
 */
async function isSafeUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname;
    
    // 1. Basic string check for obvious local addresses
    const blockedStrings = ['localhost', '0.0.0.0', '::1'];
    if (blockedStrings.some(b => hostname.includes(b))) return false;

    // 2. DNS Resolution to catch hidden local/private IPs
    const addresses = await dns.resolve(hostname).catch(async () => {
      // Fallback to lookup for some environments
      const { address } = await dns.lookup(hostname);
      return [address];
    });

    for (const addr of addresses) {
      if (ipaddr.isValid(addr)) {
        const ip = ipaddr.parse(addr);
        const range = ip.range();
        if (range !== 'unicast' && range !== 'public') {
          return false; // Block private, loopback, link-local, etc.
        }
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * URL validation helper: Ensures proper format for target websites.
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

router.post('/automate', async (req, res) => {
  const { url, options = {} } = req.body;
  const safeOptions = options && typeof options === 'object' ? options : {};
  const maxVisitsFromEnv = process.env.MAX_VISITS === undefined ? 1000 : Number(process.env.MAX_VISITS);
  const MAX_VISITS = Number.isInteger(maxVisitsFromEnv) && maxVisitsFromEnv >= 1 ? maxVisitsFromEnv : 1000;
  
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }
  
  // Auto-prepend https if missing
  let processedUrl = url.trim();
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    processedUrl = 'https://' + processedUrl;
  }
  
  if (!isValidUrl(processedUrl)) {
    return res.status(400).json({ success: false, error: 'Invalid URL format' });
  }
  
  // Robust SSRF Protection
  if (!(await isSafeUrl(processedUrl))) {
    return res.status(400).json({ success: false, error: 'Access to local or private addresses is restricted for security' });
  }

  const visitCountRaw = safeOptions.visitCount;
  const visitCount = visitCountRaw === undefined ? 1 : Number(visitCountRaw);
  if (!Number.isInteger(visitCount) || visitCount < 1 || visitCount > MAX_VISITS) {
    return res.status(400).json({
      success: false,
      error: `visitCount must be an integer between 1 and ${MAX_VISITS}`
    });
  }

  // Validate loop count
  const loopCountRaw = safeOptions.loopCount;
  const loopCount = loopCountRaw === undefined ? 1 : Number(loopCountRaw);
  if (!Number.isInteger(loopCount) || loopCount < 1 || loopCount > 100) {
    return res.status(400).json({
      success: false,
      error: `loopCount must be an integer between 1 and 100`
    });
  }

  // Validate traffic mode
  const trafficMode = safeOptions.trafficMode || 'stealth';
  const validModes = ['stealth', 'storm', 'search'];
  if (!validModes.includes(trafficMode)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid traffic mode. Must be: stealth, storm, or search'
    });
  }

  // Validate batch size based on mode
  const maxBatchRaw = safeOptions.maxBatchVisits;
  const maxBatchLimit = trafficMode === 'storm' ? 10 : 20; // FIXED: Reduced from 100 to 10 for storm
  const maxBatchVisits = maxBatchRaw === undefined ? (trafficMode === 'storm' ? 10 : 5) : Math.min(Number(maxBatchRaw), trafficMode === 'storm' ? 10 : maxBatchLimit);
  if (!Number.isInteger(maxBatchVisits) || maxBatchVisits < 1 || maxBatchVisits > maxBatchLimit) {
    return res.status(400).json({
      success: false,
      error: `maxBatchVisits must be an integer between 1 and ${maxBatchLimit} for ${trafficMode} mode`
    });
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Automating: ${processedUrl}`);
  console.log(`📦 Options:`, { ...safeOptions, visitCount, loopCount, maxBatchVisits, trafficMode, maxVisits: MAX_VISITS });
  console.log(`${'='.repeat(50)}`);
  
  // Set up SSE headers for streaming progress
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  
  // FIXED: Send initial keepalive to establish connection
  res.write(':ok\n\n');
  
  const startTime = Date.now();
  
  // FIXED: Track if connection is still alive
  let connectionAlive = true;
  req.on('close', () => {
    connectionAlive = false;
    console.log('⚠️ Client disconnected');
  });
  
  req.on('error', (err) => {
    console.error('❌ Request error:', err.message);
    connectionAlive = false;
  });
  
  // Progress callback function with immediate flush
  const onProgress = (progressData) => {
    if (!connectionAlive) {
      console.log('⚠️ Cannot send progress - connection closed');
      return;
    }
    
    try {
      const data = `data: ${JSON.stringify({ type: 'progress', ...progressData })}\n\n`;
      res.write(data);
      console.log(`📡 Progress sent: ${progressData.completed}/${progressData.remaining}`);
      // Force flush if possible
      if (res.flush) {
        res.flush();
      }
    } catch (error) {
      console.error('Error writing progress:', error.message);
      connectionAlive = false;
    }
  };
  
  try {
    const result = await automateWebsite(processedUrl, { ...safeOptions, visitCount, loopCount, maxBatchVisits, trafficMode, maxVisits: MAX_VISITS }, onProgress);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`${'='.repeat(50)}`);
    console.log(result.success ? `✅ Success (${duration}s)` : `❌ Failed (${duration}s)`);
    console.log(`${'='.repeat(50)}\n`);
    
    // Send final result
    if (connectionAlive) {
      res.write(`data: ${JSON.stringify({ type: 'result', data: { ...result, duration } })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('❌ Automation error:', error.message);
    if (connectionAlive) {
      res.write(`data: ${JSON.stringify({ type: 'result', data: { success: false, error: error.message || 'Automation failed' } })}\n\n`);
      res.end();
    }
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
