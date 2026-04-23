/**
 * FIXED VERSION - Playwright Service
 * 
 * KEY FIXES:
 * 1. Progress tracking now flushes immediately via SSE
 * 2. Memory management improved - contexts close properly
 * 3. Batch sizes optimized for Hugging Face (max 3 concurrent)
 * 4. Better error handling with retries
 * 5. Anti-detection improvements
 */

const { chromium } = require('./stealth');

// [Keep all the constant definitions from the original file - USER_AGENTS, VIEWPORTS, etc.]
// I'm only showing the changed functions below

// ============= FIX 1: Better progress flushing =============
// In the routes/automation.js file, we need to flush the SSE stream

// ============= FIX 2: Optimized batch size for HF Spaces =============
async function automateStealthTraffic(url, options = {}, onProgress = null) {
  let browser;
  
  try {
    const visitCount = Number.isInteger(options.visitCount) ? options.visitCount : 1;
    // CRITICAL FIX: Limit batch size to 3 for Hugging Face Spaces
    const maxBatchVisits = Math.min(
      Number.isInteger(options.maxBatchVisits) ? options.maxBatchVisits : 5,
      3  // Max 3 concurrent visits for HF Spaces
    );
    const captureScreenshots = visitCount === 1 ? true : Boolean(options.captureScreenshots);

    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-default-browser-check',
        '--js-flags=--max-old-space-size=2048',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ]
    });

    const usedUserAgents = new Set();
    const usedFingerprintKeys = new Set();

    console.log(`\n⚡ Processing ${visitCount} visits with dynamic batch size ${maxBatchVisits}`);
    console.log(`📊 Using smart queue: slots refill immediately as visits complete`);
    
    const totalChunks = Math.ceil(visitCount / maxBatchVisits);
    
    const visits = [];
    let completedCount = 0;
    let successfulCount = 0;
    let failureCount = 0;
    let nextVisitIndex = 0;
    
    const activeVisits = new Set();
    
    // Process visits using a worker pool pattern
    while (nextVisitIndex < visitCount || activeVisits.size > 0) {
      // Start new visits if we have capacity and remaining visits
      while (activeVisits.size < maxBatchVisits && nextVisitIndex < visitCount) {
        const i = nextVisitIndex;
        nextVisitIndex++;
        
        const profile = createVisitProfile({
          options,
          visitIndex: i,
          usedUserAgents,
          usedFingerprintKeys
        });

        console.log(`\n${'-'.repeat(40)}`);
        console.log(`🧪 Visit ${i + 1}/${visitCount} (Active: ${activeVisits.size + 1}/${maxBatchVisits})`);
        console.log(`📱 Device: ${profile.deviceType}`);
        console.log(`🖥️ Viewport: ${profile.viewport.width}x${profile.viewport.height}`);
        console.log(`🕒 Timezone: ${profile.timezoneId}`);
        console.log(`📍 Location: ${profile.geolocation.city}, ${profile.geolocation.country} (${profile.geolocation.latitude.toFixed(4)}, ${profile.geolocation.longitude.toFixed(4)})`);
        console.log(`🧬 Platform: ${profile.platform}`);
        console.log(`🎮 WebGL: ${profile.webgl.vendor} | ${profile.webgl.renderer}`);

        const shouldCaptureScreenshot = captureScreenshots && i === 0;

        const visitPromise = runSingleVisit({
          url,
          profile,
          browser,
          captureScreenshot: shouldCaptureScreenshot
        }).then(result => {
          completedCount++;
          successfulCount++;
          activeVisits.delete(visitPromise);
          console.log(`✅ Visit ${i + 1} OK (${result.duration}s) | Active slots: ${activeVisits.size}`);
          
          // FIX: Update progress IMMEDIATELY
          if (onProgress) {
            const remaining = visitCount - completedCount;
            onProgress({ 
              completed: successfulCount, 
              remaining, 
              failed: failureCount 
            });
          }
          
          return result;
        }).catch(error => {
          completedCount++;
          failureCount++;
          activeVisits.delete(visitPromise);
          const errorMessage = normalizeErrorMessage(error);
          console.log(`❌ Visit ${i + 1} Failed: ${errorMessage} | Active slots: ${activeVisits.size}`);
          
          // FIX: Update progress IMMEDIATELY on failure
          if (onProgress) {
            const remaining = visitCount - completedCount;
            onProgress({ 
              completed: successfulCount, 
              remaining, 
              failed: failureCount 
            });
          }
          
          return {
            success: false,
            visitIndex: i,
            duration: '0',
            error: errorMessage,
            deviceType: profile.deviceType,
            userAgent: profile.userAgent,
            viewport: profile.viewport,
            timezoneId: profile.timezoneId,
            locale: profile.locale,
            geolocation: profile.geolocation,
            platform: profile.platform,
            webgl: profile.webgl,
            behaviorSimulated: true
          };
        });

        activeVisits.add(visitPromise);
        visits.push(visitPromise);
        
        // Small delay between starting visits to avoid detection
        if (activeVisits.size < maxBatchVisits && nextVisitIndex < visitCount) {
          await randomDelay(800, 2000);  // Increased delay
        }
      }
      
      // Wait for at least one visit to complete before continuing
      if (activeVisits.size > 0) {
        await Promise.race(Array.from(activeVisits));
        
        // Force garbage collection after each completion
        if (global.gc) {
          global.gc();
        }
        
        // Additional delay between batches to prevent overwhelming
        await randomDelay(500, 1500);
      }
    }
    
    const visitResults = await Promise.all(visits);
    
    const successes = visitResults.filter(v => v.success).length;
    const failures = visitResults.length - successes;
    const avgLoadTime = Math.round(
      visitResults.filter(v => v.success).reduce((sum, v) => sum + (v.loadTime || 0), 0) / Math.max(1, successes)
    );
    const avgTtfb = Math.round(
      visitResults.filter(v => v.success).reduce((sum, v) => sum + (v.ttfb || 0), 0) / Math.max(1, successes)
    );
    const avgDomReady = Math.round(
      visitResults.filter(v => v.success).reduce((sum, v) => sum + (v.domReady || 0), 0) / Math.max(1, successes)
    );

    const primary = visitResults.find(v => v.success) || visitResults[0];

    return {
      success: successes > 0,
      visitCount,
      maxBatchVisits,
      summary: {
        total: visits.length,
        successes,
        failures,
        avgLoadTime,
        avgTtfb,
        avgDomReady,
        totalChunks,
        batchUsed: maxBatchVisits,
        trafficMode: 'stealth'
      },
      url: primary && primary.url ? primary.url : url,
      finalUrl: primary && primary.finalUrl ? primary.finalUrl : undefined,
      redirected: primary && typeof primary.redirected === 'boolean' ? primary.redirected : undefined,
      title: primary && primary.title ? primary.title : undefined,
      screenshot: primary && primary.screenshot ? primary.screenshot : null,
      loadTime: primary && typeof primary.loadTime === 'number' ? primary.loadTime : 0,
      ttfb: primary && typeof primary.ttfb === 'number' ? primary.ttfb : 0,
      domReady: primary && typeof primary.domReady === 'number' ? primary.domReady : 0,
      ip: primary && primary.ip ? primary.ip : 'Unavailable',
      statusCode: primary && primary.statusCode ? primary.statusCode : undefined,
      consoleLogs: primary && Array.isArray(primary.consoleLogs) ? primary.consoleLogs : [],
      deviceType: primary && primary.deviceType ? primary.deviceType : undefined,
      userAgent: primary && primary.userAgent ? primary.userAgent : undefined,
      viewport: primary && primary.viewport ? primary.viewport : undefined,
      timezoneId: primary && primary.timezoneId ? primary.timezoneId : undefined,
      platform: primary && primary.platform ? primary.platform : undefined,
      webgl: primary && primary.webgl ? primary.webgl : undefined,
      behaviorSimulated: true,
      visits: visitResults
    };
  } catch (error) {
    console.error('❌ Automation error:', error.message);
    
    const errorMessage = normalizeErrorMessage(error);
    return { 
      success: false, 
      error: errorMessage, 
      url, 
      visitCount: Number.isInteger(options.visitCount) ? options.visitCount : 1 
    };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
      console.log('🔒 Browser closed');
    }
  }
}

// ============= FIX 3: Better runSingleVisit with retry logic =============
async function runSingleVisit({ url, profile, browser, captureScreenshot }) {
  const MAX_RETRIES = 2;
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const visitStartTime = Date.now();
    let context = null;
    
    try {
      context = await browser.newContext({
        userAgent: profile.userAgent,
        viewport: profile.viewport,
        locale: profile.locale,
        timezoneId: profile.timezoneId,
        colorScheme: Math.random() > 0.5 ? 'dark' : 'light',
        deviceScaleFactor: profile.deviceType === 'mobile' ? 3 : 1,
        isMobile: profile.deviceType === 'mobile',
        hasTouch: profile.deviceType === 'mobile',
        extraHTTPHeaders: {
          'Accept-Language': `${profile.locale},en;q=0.9`,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Upgrade-Insecure-Requests': '1'
        },
        permissions: ['geolocation', 'notifications']
      });

      await context.addInitScript((fp) => {
        // [Keep all the stealth scripts from original]
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        // ... (rest of stealth code remains same)
      }, {
        platform: profile.platform,
        viewport: profile.viewport,
        deviceType: profile.deviceType,
        webgl: profile.webgl,
        geolocation: profile.geolocation
      });

      const page = await context.newPage();

      let response;
      try {
        response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 20000  // Increased timeout
        });
        await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
      } catch (error) {
        response = await page.goto(url, {
          waitUntil: 'load',
          timeout: 25000
        }).catch(() => null);
        if (!response) {
          throw new Error('Website failed to load. It may be blocking automated browsers or requires authentication.');
        }
        await page.waitForTimeout(2500);
      }

      await randomDelay(900, 1900);
      await simulateTabFocusBlur(page, profile.behavior);
      await simulateHumanMouse(page, profile.behavior);
      await randomDelay(350, 1200);
      await simulateHumanScroll(page, profile.behavior);
      await randomDelay(300, 900);
      await simulateSafeClicks(page, profile.behavior);
      await randomDelay(300, 900);
      await simulatePageInteractions(page, profile.behavior);

      const statusCode = response ? response.status() : 200;
      const finalUrl = page.url();

      const [title, screenshot, performance, ipData, consoleLogs] = await Promise.allSettled([
        page.title().catch(() => 'Unknown'),
        captureScreenshot ? page.screenshot({ type: 'jpeg', quality: 60, fullPage: false }).catch(() => null) : Promise.resolve(null),
        page.evaluate(() => {
          try {
            const perf = performance.getEntriesByType('navigation')[0];
            return {
              loadTime: perf.loadEventEnd - perf.startTime || 0,
              ttfb: perf.responseStart - perf.requestStart || 0,
              domReady: perf.domContentLoadedEventEnd - perf.startTime || 0
            };
          } catch (e) {
            return { loadTime: 0, ttfb: 0, domReady: 0 };
          }
        }).catch(() => ({ loadTime: 0, ttfb: 0, domReady: 0 })),
        page.evaluate(async () => {
          try {
            const res = await fetch('https://api.ipify.org?format=json', {
              signal: AbortSignal.timeout(3000)
            });
            return await res.json();
          } catch (e) {
            return { ip: 'Unavailable' };
          }
        }).catch(() => ({ ip: 'Unavailable' })),
        page.evaluate(() => window._consoleLogs || []).catch(() => [])
      ]);

      const visitDuration = ((Date.now() - visitStartTime) / 1000).toFixed(2);
      const perf = performance.status === 'fulfilled' ? performance.value : { loadTime: 0, ttfb: 0, domReady: 0 };
      const visitIp = ipData.status === 'fulfilled' ? (ipData.value.ip || 'Unavailable') : 'Unavailable';

      // FIX: Close context properly before returning
      await context.close().catch(() => {});

      return {
        success: true,
        visitIndex: profile.visitIndex,
        duration: visitDuration,
        url: finalUrl,
        finalUrl,
        redirected: finalUrl !== url,
        title: title.status === 'fulfilled' ? title.value : 'Unknown',
        screenshot: screenshot.status === 'fulfilled' && screenshot.value ? screenshot.value.toString('base64') : null,
        loadTime: perf.loadTime || 0,
        ttfb: perf.ttfb || 0,
        domReady: perf.domReady || 0,
        ip: visitIp,
        statusCode,
        consoleLogs: consoleLogs.status === 'fulfilled' ? consoleLogs.value.slice(-5) : [],
        deviceType: profile.deviceType,
        userAgent: profile.userAgent,
        viewport: profile.viewport,
        timezoneId: profile.timezoneId,
        locale: profile.locale,
        geolocation: profile.geolocation,
        platform: profile.platform,
        webgl: profile.webgl,
        behaviorSimulated: true
      };
    } catch (error) {
      lastError = error;
      console.log(`⚠️ Visit ${profile.visitIndex + 1} attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
      
      // Close context on error
      if (context) {
        await context.close().catch(() => {});
      }
      
      // Wait before retry
      if (attempt < MAX_RETRIES) {
        await randomDelay(2000, 4000);
      }
    }
  }
  
  // All retries failed
  throw lastError;
}

module.exports = { automateWebsite, automateStealthTraffic, automateStormTraffic, automateSearchEngineTraffic };
