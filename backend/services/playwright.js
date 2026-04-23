/**
 * PROJECT AUTOMATION ENGINE
 * 
 * CORE MODULE: [playwright.js](file:///c:/Users/whoami/Desktop/playwrgiht%20-%20Copy%20(2)/backend/services/playwright.js)
 * RESPONSIBILITY: Orchestrates headless browser visits with advanced anti-detection.
 * 
 * FEATURES:
 * 1. Fingerprint Rotation (User Agents, Viewports, Timezones, Locales)
 * 2. Hardware Spoofing (WebGL, Navigator Platform, Geolocation)
 * 3. Human-like Behavior Simulation (Mouse, Scroll, Click, Focus/Blur)
 * 4. Multi-Mode Execution (Stealth, Storm, Search Engine)
 * 5. Concurrent Batch Processing
 */

const { chromium } = require('./stealth');

/**
 * USER_AGENTS: A pool of 30 realistic device identifiers.
 * Includes Windows, macOS, Linux, iPhone, and Android variants.
 */
const USER_AGENTS = {
  desktop: [
    // Windows 10 (2 variants)
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    
    // Windows 11 (3 variants)
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/120',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DuckDuckGo/7',
    
    // macOS (4 variants)
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.3; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/120',
    
    // Linux (4 variants - Ubuntu, Fedora, Arch)
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/120',
  ],
  mobile: [
    // iPhone iOS 17.x (4 variants)
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
    
    // Samsung Galaxy (3 variants)
    'Mozilla/5.0 (Linux; Android 14; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    
    // Google Pixel (3 variants)
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    
    // Other Android - Xiaomi, Motorola (2 variants)
    'Mozilla/5.0 (Linux; Android 14; V2310) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; moto g73 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 DuckDuckGo/7',
  ]
};

// Viewport configurations
// EXPANDED: 8 viewports covering desktop, laptop, tablet, and mobile devices
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  desktop_large: { width: 2560, height: 1440 },
  laptop: { width: 1366, height: 768 },
  laptop_small: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  tablet_pro: { width: 1024, height: 1366 },
  mobile: { width: 375, height: 812 },
  mobile_large: { width: 414, height: 896 }
};

const TIMEZONES = [
  // North America (7)
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Mexico_City',
  
  // South America (2)
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  
  // Europe (4)
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Moscow',
  
  // Asia (6)
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  
  // Oceania (2)
  'Australia/Sydney',
  'Pacific/Auckland',
  
  // Africa & Middle East (4) - NEW
  'Africa/Casablanca',      // Morocco
  'Indian/Maldives',        // Maldives
  'Africa/Algiers',         // Algeria
  'Asia/Gaza'               // Palestine
];

// EXPANDED: 10 locales covering major global markets
const LOCALES = [
  'en-US',
  'en-GB',
  'en-CA',
  'en-AU',
  'en-IN',
  'es-ES',
  'fr-FR',
  'de-DE',
  'ja-JP',
  'zh-CN'
];

// GEOLOCATIONS: Latitude/longitude coordinates mapped to timezones
// Each entry includes timezone, coordinates, and country for consistency
const GEOLOCATIONS = [
  // North America (7)
  { timezoneId: 'America/New_York', latitude: 40.7128, longitude: -74.0060, country: 'US', city: 'New York' },
  { timezoneId: 'America/Chicago', latitude: 41.8781, longitude: -87.6298, country: 'US', city: 'Chicago' },
  { timezoneId: 'America/Denver', latitude: 39.7392, longitude: -104.9903, country: 'US', city: 'Denver' },
  { timezoneId: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437, country: 'US', city: 'Los Angeles' },
  { timezoneId: 'America/Anchorage', latitude: 61.2181, longitude: -149.9003, country: 'US', city: 'Anchorage' },
  { timezoneId: 'Pacific/Honolulu', latitude: 21.3069, longitude: -157.8583, country: 'US', city: 'Honolulu' },
  { timezoneId: 'America/Mexico_City', latitude: 19.4326, longitude: -99.1332, country: 'MX', city: 'Mexico City' },
  
  // South America (2)
  { timezoneId: 'America/Sao_Paulo', latitude: -23.5505, longitude: -46.6333, country: 'BR', city: 'São Paulo' },
  { timezoneId: 'America/Argentina/Buenos_Aires', latitude: -34.6037, longitude: -58.3816, country: 'AR', city: 'Buenos Aires' },
  
  // Europe (4)
  { timezoneId: 'Europe/London', latitude: 51.5074, longitude: -0.1278, country: 'GB', city: 'London' },
  { timezoneId: 'Europe/Berlin', latitude: 52.5200, longitude: 13.4050, country: 'DE', city: 'Berlin' },
  { timezoneId: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522, country: 'FR', city: 'Paris' },
  { timezoneId: 'Europe/Moscow', latitude: 55.7558, longitude: 37.6173, country: 'RU', city: 'Moscow' },
  
  // Asia (6)
  { timezoneId: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708, country: 'AE', city: 'Dubai' },
  { timezoneId: 'Asia/Kolkata', latitude: 19.0760, longitude: 72.8777, country: 'IN', city: 'Mumbai' },
  { timezoneId: 'Asia/Bangkok', latitude: 13.7563, longitude: 100.5018, country: 'TH', city: 'Bangkok' },
  { timezoneId: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198, country: 'SG', city: 'Singapore' },
  { timezoneId: 'Asia/Shanghai', latitude: 31.2304, longitude: 121.4737, country: 'CN', city: 'Shanghai' },
  { timezoneId: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'JP', city: 'Tokyo' },
  
  // Oceania (2)
  { timezoneId: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093, country: 'AU', city: 'Sydney' },
  { timezoneId: 'Pacific/Auckland', latitude: -36.8485, longitude: 174.7633, country: 'NZ', city: 'Auckland' },
  
  // Africa & Middle East (4) - NEW
  { timezoneId: 'Africa/Casablanca', latitude: 33.5731, longitude: -7.5898, country: 'MA', city: 'Casablanca' },
  { timezoneId: 'Indian/Maldives', latitude: 4.1755, longitude: 73.5093, country: 'MV', city: 'Malé' },
  { timezoneId: 'Africa/Algiers', latitude: 36.7538, longitude: 3.0588, country: 'DZ', city: 'Algiers' },
  { timezoneId: 'Asia/Gaza', latitude: 31.5017, longitude: 34.4668, country: 'PS', city: 'Gaza' }
];

// Search engines for organic traffic simulation
const SEARCH_ENGINES = {
  google: {
    url: 'https://www.google.com',
    input: 'textarea[name="q"], input[name="q"]',
    name: 'Google',
    icon: '🔍'
  },
  bing: {
    url: 'https://www.bing.com',
    input: 'input[name="q"], #sb_form_q, input[type="search"]',
    name: 'Bing',
    icon: '🔎'
  },
  duckduckgo: {
    url: 'https://duckduckgo.com',
    input: 'input[name="q"], #searchbox_input, input[type="search"]',
    name: 'DuckDuckGo',
    icon: '🦆'
  }
};

// Helper function to get random search engine
function getRandomSearchEngine() {
  const engineKeys = Object.keys(SEARCH_ENGINES);
  const randomKey = engineKeys[Math.floor(Math.random() * engineKeys.length)];
  return { key: randomKey, ...SEARCH_ENGINES[randomKey] };
}

// EXPANDED: 10 WebGL profiles covering Intel, NVIDIA, AMD, and Apple
const WEBGL_PROFILES = [
  // Intel Integrated Graphics (3)
  { vendor: 'Intel Inc.', renderer: 'Intel Iris OpenGL Engine' },
  { vendor: 'Intel Inc.', renderer: 'Intel Iris Plus Graphics' },
  { vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  
  // NVIDIA (4)
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  
  // AMD (2)
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 6600 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 7800 XT Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  
  // Apple Silicon (1)
  { vendor: 'Apple', renderer: 'Apple M1' }
];

// Helper: Random number in range
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne(list) {
  return list[randomBetween(0, list.length - 1)];
}

// Helper: Random delay for human-like behavior
function randomDelay(min = 500, max = 2000) {
  return new Promise(resolve => setTimeout(resolve, randomBetween(min, max)));
}

function mutateChromeUserAgent(baseUserAgent, visitSeed) {
  if (baseUserAgent.includes('Chrome/') && !baseUserAgent.includes('Brave/') && !baseUserAgent.includes('DuckDuckGo/')) {
    const build = 1000 + (visitSeed % 6000);
    const patch = randomBetween(0, 200);
    return baseUserAgent.replace(/Chrome\/120\.0\.0\.0/g, `Chrome/120.0.${build}.${patch}`);
  }

  // Brave browser - mutate Chrome version but keep Brave identifier
  if (baseUserAgent.includes('Brave/')) {
    const build = 1000 + (visitSeed % 6000);
    const patch = randomBetween(0, 200);
    return baseUserAgent
      .replace(/Chrome\/120\.0\.0\.0/g, `Chrome/120.0.${build}.${patch}`)
      .replace(/Brave\/120/g, `Brave/120.0.${build}.${patch}`);
  }

  // DuckDuckGo browser - mutate Chrome version but keep DuckDuckGo identifier
  if (baseUserAgent.includes('DuckDuckGo/')) {
    const build = 1000 + (visitSeed % 6000);
    const patch = randomBetween(0, 200);
    return baseUserAgent
      .replace(/Chrome\/120\.0\.0\.0/g, `Chrome/120.0.${build}.${patch}`)
      .replace(/DuckDuckGo\/7/g, `DuckDuckGo/7.${patch}`);
  }

  if (baseUserAgent.includes('iPhone') && baseUserAgent.includes('Version/') && baseUserAgent.includes('Safari/')) {
    const iosMinor = visitSeed % 4;
    const safariMinor = visitSeed % 4;
    return baseUserAgent
      .replace(/iPhone OS 17_[0-9]+/g, `iPhone OS 17_${iosMinor}`)
      .replace(/Version\/17\.[0-9]+/g, `Version/17.${safariMinor}`);
  }

  return baseUserAgent;
}

function getNavigatorPlatformForUserAgent(userAgent) {
  if (userAgent.includes('Android')) return 'Linux armv8l';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iPhone';
  if (userAgent.includes('Macintosh')) return 'MacIntel';
  if (userAgent.includes('Windows')) return 'Win32';
  if (userAgent.includes('Linux')) return 'Linux x86_64';
  return 'Win32';
}

function createBehaviorProfile(visitIndex) {
  const fast = visitIndex % 3 === 0;
  const cautious = visitIndex % 3 === 1;

  return {
    mouseMoves: fast ? [2, 5] : cautious ? [4, 9] : [3, 7],
    mouseSteps: fast ? [8, 18] : cautious ? [14, 34] : [10, 30],
    mousePause: fast ? [120, 450] : cautious ? [250, 950] : [200, 800],
    scrollTimes: fast ? [1, 3] : cautious ? [3, 6] : [2, 5],
    scrollAmount: fast ? [180, 520] : cautious ? [220, 780] : [200, 600],
    scrollPause: fast ? [450, 1200] : cautious ? [900, 2400] : [800, 2000],
    focusBlurCount: cautious ? [1, 2] : [0, 2],
    focusBlurPause: fast ? [150, 500] : [250, 900],
    safeClickCount: fast ? [0, 1] : [0, 2],
    clickDelay: fast ? [30, 90] : [60, 180],
    interactionHoverChance: cautious ? 0.75 : 0.55
  };
}

function createVisitProfile({ options, visitIndex, usedUserAgents, usedFingerprintKeys }) {
  const deviceType = options.deviceType || (Math.random() > 0.3 ? 'desktop' : 'mobile');
  const baseUserAgent = pickOne(USER_AGENTS[deviceType] || USER_AGENTS.desktop);

  let userAgent;
  let attempts = 0;
  do {
    userAgent = mutateChromeUserAgent(baseUserAgent, visitIndex * 100 + attempts);
    attempts += 1;
  } while (usedUserAgents.has(userAgent) && attempts < 25);
  usedUserAgents.add(userAgent);

  const viewport =
    deviceType === 'mobile'
      ? pickOne([VIEWPORTS.mobile, VIEWPORTS.mobile_large])
      : pickOne([VIEWPORTS.desktop, VIEWPORTS.desktop_large, VIEWPORTS.laptop, VIEWPORTS.laptop_small]);

  // Select timezone and matching geolocation for consistency
  const timezoneId = pickOne(TIMEZONES);
  const geolocation = GEOLOCATIONS.find(g => g.timezoneId === timezoneId) || GEOLOCATIONS[0];
  const locale = pickOne(LOCALES);
  const platform = getNavigatorPlatformForUserAgent(userAgent);
  const webgl = pickOne(WEBGL_PROFILES);
  const behavior = createBehaviorProfile(visitIndex);

  let fingerprintKey = `${userAgent}|${viewport.width}x${viewport.height}|${platform}|${timezoneId}|${webgl.vendor}|${webgl.renderer}`;
  let fingerprintAttempts = 0;
  while (usedFingerprintKeys.has(fingerprintKey) && fingerprintAttempts < 25) {
    fingerprintAttempts += 1;
    const nextTimezoneId = pickOne(TIMEZONES);
    const nextGeolocation = GEOLOCATIONS.find(g => g.timezoneId === nextTimezoneId) || GEOLOCATIONS[0];
    const nextWebgl = pickOne(WEBGL_PROFILES);
    fingerprintKey = `${userAgent}|${viewport.width}x${viewport.height}|${platform}|${nextTimezoneId}|${nextWebgl.vendor}|${nextWebgl.renderer}`;
  }
  usedFingerprintKeys.add(fingerprintKey);

  return {
    visitIndex,
    deviceType,
    userAgent,
    viewport,
    locale,
    timezoneId,
    geolocation: {
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
      country: geolocation.country,
      city: geolocation.city
    },
    platform,
    webgl,
    behavior
  };
}

async function simulateTabFocusBlur(page, behavior) {
  const [minCount, maxCount] = behavior.focusBlurCount;
  const total = randomBetween(minCount, maxCount);

  for (let i = 0; i < total; i++) {
    await page.evaluate(() => {
      try {
        window.dispatchEvent(new Event('blur'));
        document.dispatchEvent(new Event('visibilitychange'));
      } catch {}
    });
    await randomDelay(behavior.focusBlurPause[0], behavior.focusBlurPause[1]);
    await page.evaluate(() => {
      try {
        window.dispatchEvent(new Event('focus'));
        document.dispatchEvent(new Event('visibilitychange'));
      } catch {}
    });
    await randomDelay(behavior.focusBlurPause[0], behavior.focusBlurPause[1]);
  }
}

// Human-like mouse movement simulation
async function simulateHumanMouse(page, behavior) {
  try {
    const { width, height } = page.viewportSize() || { width: 1920, height: 1080 };

    const [minMoves, maxMoves] = behavior.mouseMoves;
    for (let i = 0; i < randomBetween(minMoves, maxMoves); i++) {
      await page.mouse.move(
        randomBetween(100, width - 100),
        randomBetween(100, height - 100),
        { steps: randomBetween(behavior.mouseSteps[0], behavior.mouseSteps[1]) }
      );
      await randomDelay(behavior.mousePause[0], behavior.mousePause[1]);
    }
  } catch (e) {
    console.log('⚠️ Mouse simulation skipped');
  }
}

// Human-like scrolling behavior
async function simulateHumanScroll(page, behavior) {
  try {
    const scrollTimes = randomBetween(behavior.scrollTimes[0], behavior.scrollTimes[1]);
    
    for (let i = 0; i < scrollTimes; i++) {
      const scrollAmount = randomBetween(behavior.scrollAmount[0], behavior.scrollAmount[1]);
      await page.evaluate((amount) => {
        window.scrollBy(0, amount);
      }, scrollAmount);
      
      await randomDelay(behavior.scrollPause[0], behavior.scrollPause[1]);
    }
    
    // Scroll back to top occasionally
    if (Math.random() > 0.5) {
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      await randomDelay(500, 1000);
    }
  } catch (e) {
    console.log('⚠️ Scroll simulation skipped');
  }
}

async function simulateSafeClicks(page, behavior) {
  try {
    const [minClicks, maxClicks] = behavior.safeClickCount;
    const total = randomBetween(minClicks, maxClicks);
    if (total <= 0) return;

    const viewport = page.viewportSize();
    if (!viewport) return;

    for (let i = 0; i < total; i++) {
      const clickDelay = randomBetween(behavior.clickDelay[0], behavior.clickDelay[1]);
      const point = await page.evaluate(({ width, height }) => {
        function isInteractive(el) {
          if (!el) return true;
          const tag = (el.tagName || '').toLowerCase();
          if (['a', 'button', 'input', 'select', 'textarea', 'label', 'summary'].includes(tag)) return true;
          const role = (el.getAttribute && el.getAttribute('role')) || '';
          if (role && role.toLowerCase().includes('button')) return true;
          if (typeof el.onclick === 'function') return true;
          return false;
        }

        for (let j = 0; j < 20; j++) {
          const x = Math.floor(80 + Math.random() * Math.max(1, width - 160));
          const y = Math.floor(120 + Math.random() * Math.max(1, height - 200));
          const el = document.elementFromPoint(x, y);
          if (!isInteractive(el)) return { x, y };
        }
        return null;
      }, { width: viewport.width, height: viewport.height });

      if (!point) return;
      await page.mouse.move(point.x, point.y, { steps: randomBetween(6, 20) });
      await randomDelay(150, 600);
      await page.mouse.click(point.x, point.y, { delay: clickDelay });
      await randomDelay(250, 900);
    }
  } catch (e) {
    console.log('⚠️ Safe click simulation skipped');
  }
}

// Random page interactions
async function simulatePageInteractions(page, behavior) {
  try {
    if (Math.random() > (1 - behavior.interactionHoverChance)) {
      const links = await page.$$('a[href]');
      if (links.length > 0) {
        const randomLink = links[randomBetween(0, Math.min(links.length - 1, 5))];
        const box = await randomLink.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await randomDelay(300, 800);
          // Don't actually click, just hover (to stay on page)
        }
      }
    }
  } catch (e) {
    console.log('⚠️ Interaction simulation skipped');
  }
}

function normalizeErrorMessage(error) {
  if (!error || !error.message) return 'Unknown error';
  if (error.message.includes('timeout')) {
    return 'Website load timed out. The site may be slow or blocking automated access.';
  }
  if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
    return 'Website not found. Please check the URL and try again.';
  }
  if (error.message.includes('authentication') || error.message.includes('login')) {
    return 'This website requires authentication (login).';
  }
  if (error.message.includes('blocking') || error.message.includes('automated')) {
    return 'This website has strong anti-bot protection and blocks automation.';
  }
  return error.message;
}

async function runSingleVisit({ url, profile, browser, captureScreenshot }) {
  const visitStartTime = Date.now();
  let context;
  
  try {
    console.log('   Creating browser context...');
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
    console.log('   Context created successfully');

  } catch (contextError) {
    console.error('   ❌ Failed to create context:', contextError.message);
    throw contextError;
  }

  try {
    await context.addInitScript((fp) => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

      Object.defineProperty(navigator, 'plugins', {
        get: () => ([
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          { name: 'Native Client', filename: 'internal-nacl-plugin' }
        ])
      });

      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en', 'es']
      });

      try {
        Object.defineProperty(navigator, 'platform', { get: () => fp.platform });
      } catch {}

      try {
        const sw = fp.viewport?.width || 1920;
        const sh = fp.viewport?.height || 1080;
        Object.defineProperty(window.screen, 'width', { get: () => sw });
        Object.defineProperty(window.screen, 'height', { get: () => sh });
        Object.defineProperty(window.screen, 'availWidth', { get: () => sw });
        Object.defineProperty(window.screen, 'availHeight', { get: () => Math.max(1, sh - 80) });
        Object.defineProperty(window, 'devicePixelRatio', { get: () => fp.deviceType === 'mobile' ? 3 : 1 });
      } catch {}

      // Geolocation API Override - Spoof GPS coordinates
      if (fp.geolocation) {
        const mockGeolocation = {
          getCurrentPosition: (success, error) => {
            success({
              coords: {
                latitude: fp.geolocation.latitude,
                longitude: fp.geolocation.longitude,
                accuracy: randomBetween(50, 150),
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
              },
              timestamp: Date.now()
            });
          },
          watchPosition: (success, error, options) => {
            // Return a watcher ID and immediately provide location
            setTimeout(() => {
              success({
                coords: {
                  latitude: fp.geolocation.latitude,
                  longitude: fp.geolocation.longitude,
                  accuracy: randomBetween(50, 150),
                  altitude: null,
                  altitudeAccuracy: null,
                  heading: null,
                  speed: null
                },
                timestamp: Date.now()
              });
            }, 0);
            return Math.floor(Math.random() * 10000); // Return watcher ID
          },
          clearWatch: (watchId) => {
            // No-op, just clear the watcher
          }
        };

        // Override navigator.geolocation
        Object.defineProperty(navigator, 'geolocation', {
          get: () => mockGeolocation
        });
      }

      try {
        const UNMASKED_VENDOR_WEBGL = 37445;
        const UNMASKED_RENDERER_WEBGL = 37446;
        const VENDOR = 7936;
        const RENDERER = 7937;

        function patchWebgl(proto) {
          if (!proto || !proto.getParameter) return;
          const original = proto.getParameter;
          proto.getParameter = function (param) {
            if (param === UNMASKED_VENDOR_WEBGL) return fp.webgl.vendor;
            if (param === UNMASKED_RENDERER_WEBGL) return fp.webgl.renderer;
            if (param === VENDOR) return fp.webgl.vendor;
            if (param === RENDERER) return fp.webgl.renderer;
            return original.apply(this, arguments);
          };
        }

        patchWebgl(window.WebGLRenderingContext && window.WebGLRenderingContext.prototype);
        patchWebgl(window.WebGL2RenderingContext && window.WebGL2RenderingContext.prototype);
      } catch {}

      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => Math.floor(Math.random() * 8) + 4
      });

      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => [4, 6, 8, 16][Math.floor(Math.random() * 4)]
      });

      try {
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) =>
          parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters);
      } catch {}

      try {
        window.chrome = {
          runtime: {},
          loadTimes: () => ({}),
          csi: () => ({})
        };
      } catch {}

      try {
        window._consoleLogs = [];
        const originalConsole = { ...console };
        ['log', 'warn', 'error', 'info'].forEach(method => {
          console[method] = (...args) => {
            window._consoleLogs.push({
              method,
              args: args.map(a => {
                try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
                catch { return String(a); }
              }),
              timestamp: Date.now()
            });
            if (originalConsole[method]) {
              originalConsole[method].apply(console, args);
            }
          };
        });
      } catch {}
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
      console.log(`   Navigating to: ${url}`);
      response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      console.log(`   Page reached with status: ${response ? response.status() : 'No response'}`);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log('   Wait for networkidle timed out (continuing anyway)');
      });
    } catch (error) {
      console.log(`   ⚠️ Initial navigation failed: ${error.message}. Retrying with longer timeout...`);
      response = await page.goto(url, {
        waitUntil: 'load',
        timeout: 45000
      }).catch((e) => {
        console.log(`   ❌ Retry navigation failed: ${e.message}`);
        return null;
      });
      
      if (!response) {
        throw new Error('Website failed to load. It may be blocking automated browsers or requires authentication. Try using Stealth mode or a different URL.');
      }
      await page.waitForTimeout(5000);
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

    if (statusCode >= 400) {
      console.log(`   ❌ Website returned error status: ${statusCode}`);
      if (statusCode === 403 || statusCode === 401) {
        throw new Error(`Website blocked access (Status ${statusCode}). This site may have strong anti-bot protection or requires a login.`);
      }
      throw new Error(`Website returned an error status: ${statusCode}`);
    }

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
  } finally {
    if (context) {
      await context.close().catch(() => {});
    }
  }
}

async function automateWebsite(url, options = {}, onProgress = null) {
  const trafficMode = options.trafficMode || 'stealth';
  const loopCount = Math.max(1, Number(options.loopCount) || 1);
  const totalVisitsPerLoop = Number(options.visitCount) || 1;
  
  let allSuccesses = 0;
  let allFailures = 0;
  let lastResult = null;

  for (let l = 1; l <= loopCount; l++) {
    console.log(`\n🔄 LOOP ${l} of ${loopCount} starting...`);
    
    // Track progress within this loop
    let loopCompleted = 0;
    let loopSuccessful = 0;
    let loopFailed = 0;
    
    // Create a specific progress wrapper for this loop to track global progress
    const loopOnProgress = (loopProgress) => {
      // Update loop tracking
      loopCompleted = (loopProgress.completed || 0) + (loopProgress.failed || 0);
      loopSuccessful = loopProgress.completed || 0;
      loopFailed = loopProgress.failed || 0;
      
      if (onProgress) {
        // Calculate global progress: previous loops + current loop
        const previousLoopsVisits = totalVisitsPerLoop * (l - 1);
        const globalCompleted = previousLoopsVisits + loopCompleted;
        const globalRemaining = (totalVisitsPerLoop * (loopCount - l)) + (loopProgress.remaining || 0);
        const globalFailed = allFailures + loopFailed;
        
        onProgress({
          completed: globalCompleted,
          remaining: globalRemaining,
          failed: globalFailed,
          currentLoop: l,
          totalLoops: loopCount
        });
      }
    };

    let result;
    try {
      switch (trafficMode) {
        case 'storm':
          result = await automateStormTraffic(url, options, loopOnProgress);
          break;
        case 'search':
          result = await automateSearchEngineTraffic(url, options, loopOnProgress);
          break;
        case 'stealth':
        default:
          result = await automateStealthTraffic(url, options, loopOnProgress);
          break;
      }

      // CRITICAL FIX: Check if result has summary before accessing it
      if (!result || !result.summary) {
        console.error('❌ Automation returned invalid result:', result);
        result = {
          success: false,
          error: result?.error || 'Automation failed to execute',
          summary: { successes: 0, failures: 1, total: 1 }
        };
      }

      allSuccesses += result.summary?.successes || 0;
      allFailures += result.summary?.failures || 0;
      lastResult = result;
    } catch (loopError) {
      console.error('❌ Loop execution error:', loopError.message);
      lastResult = {
        success: false,
        error: loopError.message,
        summary: { successes: allSuccesses, failures: allFailures + 1, total: allSuccesses + allFailures + 1 }
      };
      allFailures += 1;
    }

    if (l < loopCount) {
      console.log(`\n🧹 Cleaning up after loop ${l}...`);
      if (global.gc) global.gc();
      // Optional: Add a small delay between loops to be more "human"
      await randomDelay(2000, 5000);
    }
  }

  // Update final summary to include all loops
  if (lastResult && lastResult.summary) {
    lastResult.summary.total = allSuccesses + allFailures;
    lastResult.summary.successes = allSuccesses;
    lastResult.summary.failures = allFailures;
    lastResult.loopCount = loopCount;
    // If we have at least one success, we can consider the overall operation a partial success
    if (allSuccesses > 0) {
      lastResult.success = true;
    } else {
      lastResult.success = false;
    }
  }

  return lastResult;
}

// Stealth Anti-Bot Mode - Original implementation with full stealth features
async function automateStealthTraffic(url, options = {}, onProgress = null) {
  let browser;
  
  try {
    const visitCount = Number.isInteger(options.visitCount) ? options.visitCount : 1;
    // CRITICAL FIX: Limit batch size to 3 for Hugging Face Spaces to prevent memory issues
    const maxBatchVisits = Math.min(
      Number.isInteger(options.maxBatchVisits) ? options.maxBatchVisits : 5,
      3  // Max 3 concurrent visits for HF Spaces stability
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
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--no-zygote',
        '--single-process',
        '--hide-scrollbars',
        '--mute-audio'
      ]
    });

    // Verify browser is actually running
    console.log('✅ Browser launched successfully');
    console.log('   Browser version:', await browser.version());

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
    
    // Track active slots to ensure we don't exceed memory limits
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

        // Capture screenshot only for first visit if enabled
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
          
          // Update progress
          if (onProgress) {
            const remaining = visitCount - completedCount;
            onProgress({ completed: successfulCount, remaining, failed: failureCount });
          }
          
          return result;
        }).catch(error => {
          completedCount++;
          failureCount++;
          activeVisits.delete(visitPromise);
          const errorMessage = normalizeErrorMessage(error);
          console.log(`❌ Visit ${i + 1} Failed: ${errorMessage} | Active slots: ${activeVisits.size}`);
          
          // Update progress
          if (onProgress) {
            const remaining = visitCount - completedCount;
            onProgress({ completed: successfulCount, remaining, failed: failureCount });
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
          await randomDelay(800, 2000);  // Increased delay for better stability
        }
      }
      
      // Wait for at least one visit to complete before continuing
      if (activeVisits.size > 0) {
        await Promise.race(Array.from(activeVisits));
        
        // Force garbage collection after each completion if available
        if (global.gc) {
          global.gc();
        }
        
        // Additional delay between batches to prevent overwhelming the server
        await randomDelay(500, 1500);
      }
    }
    
    // Wait for all visits to complete
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
    return { success: false, error: errorMessage, url, visitCount: Number.isInteger(options.visitCount) ? options.visitCount : 1 };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
      console.log('🔒 Browser closed');
    }
  }
}

// Storm Traffic Mode - Maximum speed, minimal stealth
async function automateStormTraffic(url, options = {}, onProgress = null) {
  let browser;
  
  try {
    const visitCount = Number.isInteger(options.visitCount) ? options.visitCount : 1;
    // FIXED: Reduced default batch size from 20 to 10 to prevent memory overflow
    const maxBatchVisits = Number.isInteger(options.maxBatchVisits) ? Math.min(options.maxBatchVisits, 10) : 10;
    const captureScreenshots = visitCount === 1 ? true : Boolean(options.captureScreenshots);

    // Launch browser optimized for speed but with JS support and memory limits
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
        '--disable-plugins',
        '--js-flags=--max-old-space-size=2048' // Reduced from 4096 to limit memory
      ]
    });

    console.log(`\n⚡ STORM MODE: Processing ${visitCount} visits with batch size ${maxBatchVisits}`);
    const totalChunks = Math.ceil(visitCount / maxBatchVisits);
    console.log(`📊 Total chunks: ${totalChunks}`);
    
    // FIXED: Restart browser every 5 chunks to prevent memory leak
    const chunksBeforeRestart = 5;
    let chunkCountSinceRestart = 0;
    
    const visits = [];
    let completedCount = 0;
    let successfulCount = 0;
    let failureCount = 0;
    
    // FIXED: Add progress lock to prevent race conditions with concurrent updates
    let progressLock = false;
    const progressQueue = [];
    
    const safeOnProgress = (data) => {
      if (!onProgress) return;
      
      if (progressLock) {
        // Queue the update if lock is held
        progressQueue.push(data);
        return;
      }
      
      progressLock = true;
      try {
        onProgress(data);
      } finally {
        progressLock = false;
        // Process any queued updates
        if (progressQueue.length > 0) {
          const latest = progressQueue.pop(); // Only process the latest
          progressQueue.length = 0; // Clear queue
          safeOnProgress(latest);
        }
      }
    };

    // Process visits in chunks - NO delays between chunks
    for (let chunkStart = 0; chunkStart < visitCount; chunkStart += maxBatchVisits) {
      const chunkEnd = Math.min(chunkStart + maxBatchVisits, visitCount);
      const chunkSize = chunkEnd - chunkStart;
      const currentChunkNumber = Math.floor(chunkStart / maxBatchVisits) + 1;
      
      console.log(`\n🌪️ Storm chunk ${currentChunkNumber}/${totalChunks} (${chunkSize} visits)`);
      
      // FIXED: Restart browser periodically to prevent memory exhaustion
      chunkCountSinceRestart++;
      if (chunkCountSinceRestart >= chunksBeforeRestart && chunkStart > 0) {
        console.log('🔄 Restarting browser to free memory...');
        try {
          await browser.close().catch(() => {});
          await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause
          browser = await chromium.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-web-security',
              '--disable-features=IsolateOrigins,site-per-process',
              '--disable-dev-shm-usage',
              '--no-first-run',
              '--no-default-browser-check',
              '--disable-extensions',
              '--disable-plugins',
              '--js-flags=--max-old-space-size=2048'
            ]
          });
          console.log('✅ Browser restarted successfully');
        } catch (error) {
          console.error('❌ Browser restart failed:', error.message);
        }
        chunkCountSinceRestart = 0;
      }
      
      // NO delay between chunks in storm mode

      // Create all visits in this chunk
      const chunkPromises = [];
      for (let i = chunkStart; i < chunkEnd; i++) {
        const userAgent = pickOne(USER_AGENTS.desktop);
        
        const visitPromise = runStormVisit({
          url,
          userAgent,
          browser,
          captureScreenshot: captureScreenshots && i === 0
        }).then(result => {
          completedCount++;
          successfulCount++;
          console.log(`✅ Storm Visit ${i + 1} OK (${result.duration}s)`);
          
          if (onProgress) {
            const remaining = visitCount - completedCount;
            safeOnProgress({ completed: successfulCount, remaining, failed: failureCount });
          }
          
          return result;
        }).catch(error => {
          completedCount++;
          failureCount++;
          const errorMessage = normalizeErrorMessage(error);
          console.log(`❌ Storm Visit ${i + 1} Failed: ${errorMessage}`);
          
          if (onProgress) {
            const remaining = visitCount - completedCount;
            safeOnProgress({ completed: successfulCount, remaining, failed: failureCount });
          }
          
          return {
            success: false,
            visitIndex: i,
            duration: '0',
            error: errorMessage
          };
        });

        chunkPromises.push(visitPromise);
      }

      // Execute chunk concurrently
      const chunkResults = await Promise.all(chunkPromises);
      visits.push(...chunkResults);
      
      console.log(`\n✅ Storm chunk ${currentChunkNumber} complete: ${chunkResults.filter(r => r.success).length}/${chunkSize} successful`);
      
      // FIXED: Force garbage collection hint and brief pause between chunks
      if (global.gc) {
        global.gc();
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms pause between chunks
    }

    const successes = visits.filter(v => v.success).length;
    const failures = visits.length - successes;

    const primary = visits.find(v => v.success) || visits[0];

    return {
      success: successes > 0,
      visitCount,
      maxBatchVisits,
      summary: {
        total: visits.length,
        successes,
        failures,
        totalChunks,
        batchUsed: maxBatchVisits,
        trafficMode: 'storm'
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
      visits
    };
  } catch (error) {
    console.error('❌ Storm automation error:', error.message);
    
    const errorMessage = normalizeErrorMessage(error);
    return { success: false, error: errorMessage, url, visitCount: Number.isInteger(options.visitCount) ? options.visitCount : 1 };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
      console.log('🔒 Browser closed');
    }
  }
}

// Single storm visit - fast, minimal overhead
async function runStormVisit({ url, userAgent, browser, captureScreenshot }) {
  const visitStartTime = Date.now();

  // FIXED: Add browser crash detection
  try {
    const context = await browser.newContext({
      userAgent,
      viewport: { width: 1920, height: 1080 },
      // Enable JavaScript execution for analytics tracking
      javaScriptEnabled: true,
      // Set realistic headers
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    try {
      const page = await context.newPage();
      
      // Allow time for JavaScript and analytics to execute
      let response;
      try {
        response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 10000
        });
        // Wait for network idle to ensure JS and analytics scripts load
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      } catch (error) {
        // Fallback to load if domcontentloaded fails
        response = await page.goto(url, {
          waitUntil: 'load',
          timeout: 15000
        }).catch(() => null);
      }

      // Additional wait for analytics scripts to execute (critical for GA tracking)
      await page.waitForTimeout(1500);

      // Capture performance metrics (fast, non-blocking)
      const [title, screenshot, performance, ipData] = await Promise.allSettled([
        page.title().catch(() => 'Unknown'),
        captureScreenshot ? page.screenshot({ type: 'jpeg', quality: 60 }).catch(() => null) : Promise.resolve(null),
        page.evaluate(() => {
          try {
            const perf = performance.getEntriesByType('navigation')[0];
            // Use responseEnd for load time if loadEventEnd is not available
            const loadTime = perf.loadEventEnd > 0 
              ? perf.loadEventEnd - perf.startTime 
              : perf.responseEnd - perf.startTime;
            return {
              loadTime: loadTime || 0,
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
        }).catch(() => ({ ip: 'Unavailable' }))
      ]);

      const statusCode = response ? response.status() : 200;
      const visitDuration = ((Date.now() - visitStartTime) / 1000).toFixed(2);
      
      const perf = performance.status === 'fulfilled' ? performance.value : { loadTime: 0, ttfb: 0, domReady: 0 };
      const visitIp = ipData.status === 'fulfilled' ? (ipData.value.ip || 'Unavailable') : 'Unavailable';

      return {
        success: true,
        visitIndex: 0,
        duration: visitDuration,
        url,
        title: title.status === 'fulfilled' ? title.value : 'Unknown',
        screenshot: screenshot.status === 'fulfilled' && screenshot.value ? screenshot.value.toString('base64') : null,
        loadTime: perf.loadTime || 0,
        ttfb: perf.ttfb || 0,
        domReady: perf.domReady || 0,
        ip: visitIp,
        statusCode,
        trafficMode: 'storm'
      };
    } finally {
      await context.close().catch(() => {});
    }
  } catch (contextError) {
    // FIXED: Handle browser crash during context creation
    throw new Error(`Browser context failed: ${contextError.message}`);
  }
}

// Search Engine Traffic Mode - Organic visits via Google
async function automateSearchEngineTraffic(url, options = {}, onProgress = null) {
  let browser;
  
  try {
    const visitCount = Number.isInteger(options.visitCount) ? options.visitCount : 1;
    const maxBatchVisits = Number.isInteger(options.maxBatchVisits) ? options.maxBatchVisits : 5;
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
        '--js-flags=--max-old-space-size=4096'
      ]
    });

    const usedUserAgents = new Set();
    const usedFingerprintKeys = new Set();
    const visits = [];
    let completedCount = 0;
    let successfulCount = 0;
    let failureCount = 0;

    console.log(`\n🔍 SEARCH MODE: Processing ${visitCount} visits via multiple search engines`);
    console.log(`📊 Available engines: ${Object.keys(SEARCH_ENGINES).map(k => SEARCH_ENGINES[k].name).join(', ')}`);
    const totalChunks = Math.ceil(visitCount / maxBatchVisits);
    console.log(`📊 Total chunks: ${totalChunks}`);

    // Process visits in chunks
    for (let chunkStart = 0; chunkStart < visitCount; chunkStart += maxBatchVisits) {
      const chunkEnd = Math.min(chunkStart + maxBatchVisits, visitCount);
      const chunkSize = chunkEnd - chunkStart;
      const currentChunkNumber = Math.floor(chunkStart / maxBatchVisits) + 1;
      
      console.log(`\n🔄 Processing search chunk ${currentChunkNumber}/${totalChunks} (${chunkSize} visits)`);
      
      // Add delay between chunks
      if (chunkStart > 0) {
        const chunkDelay = randomBetween(1000, 3000);
        console.log(`⏸️ Chunk delay: ${(chunkDelay / 1000).toFixed(1)}s`);
        await randomDelay(chunkDelay, chunkDelay);
      }

      // Create all visits in this chunk
      const chunkPromises = [];
      for (let i = chunkStart; i < chunkEnd; i++) {
        const profile = createVisitProfile({
          options,
          visitIndex: i,
          usedUserAgents,
          usedFingerprintKeys
        });

        // Randomly select a search engine for this visit
        const selectedEngine = getRandomSearchEngine();

        console.log(`\n${'-'.repeat(40)}`);
        console.log(`🔍 Search Visit ${i + 1}/${visitCount} (Chunk ${currentChunkNumber})`);
        console.log(`${selectedEngine.icon} Engine: ${selectedEngine.name}`);
        console.log(`📱 Device: ${profile.deviceType}`);
        console.log(`🖥️ Viewport: ${profile.viewport.width}x${profile.viewport.height}`);
        console.log(`🕒 Timezone: ${profile.timezoneId}`);
        console.log(`📍 Location: ${profile.geolocation.city}, ${profile.geolocation.country}`);

        const visitPromise = runSearchEngineVisit({
          targetUrl: url,
          searchEngine: selectedEngine,
          profile,
          browser,
          captureScreenshot: captureScreenshots && i === 0
        }).then(result => {
          completedCount++;
          successfulCount++;
          console.log(`✅ Search Visit ${i + 1} OK (${result.duration}s)`);
          
          if (onProgress) {
            const remaining = visitCount - completedCount;
            onProgress({ completed: successfulCount, remaining, failed: failureCount });
          }
          
          return result;
        }).catch(error => {
          completedCount++;
          failureCount++;
          const errorMessage = normalizeErrorMessage(error);
          console.log(`❌ Search Visit ${i + 1} Failed: ${errorMessage}`);
          
          if (onProgress) {
            const remaining = visitCount - completedCount;
            onProgress({ completed: successfulCount, remaining, failed: failureCount });
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
            trafficMode: 'search',
            searchEngine: selectedEngine.name,
            searchEngineIcon: selectedEngine.icon
          };
        });

        chunkPromises.push(visitPromise);
      }

      // Execute chunk concurrently
      const chunkResults = await Promise.all(chunkPromises);
      visits.push(...chunkResults);
      
      console.log(`\n✅ Search chunk ${currentChunkNumber} complete: ${chunkResults.filter(r => r.success).length}/${chunkSize} successful`);
    }

    const successes = visits.filter(v => v.success).length;
    const failures = visits.length - successes;

    // Count search engine usage
    const engineUsage = {};
    visits.forEach(v => {
      if (v.success && v.searchEngine) {
        engineUsage[v.searchEngine] = (engineUsage[v.searchEngine] || 0) + 1;
      }
    });

    const primary = visits.find(v => v.success) || visits[0];

    return {
      success: successes > 0,
      visitCount,
      maxBatchVisits,
      summary: {
        total: visits.length,
        successes,
        failures,
        totalChunks,
        batchUsed: maxBatchVisits,
        trafficMode: 'search',
        engineUsage // Distribution of search engines used
      },
      url: primary && primary.url ? primary.url : url,
      title: primary && primary.title ? primary.title : undefined,
      screenshot: primary && primary.screenshot ? primary.screenshot : null,
      visits
    };
  } catch (error) {
    console.error('❌ Search automation error:', error.message);
    
    const errorMessage = normalizeErrorMessage(error);
    return { success: false, error: errorMessage, url, visitCount: Number.isInteger(options.visitCount) ? options.visitCount : 1 };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
      console.log('🔒 Browser closed');
    }
  }
}

// Single search engine visit - organic flow (Simplified & Improved)
async function runSearchEngineVisit({ targetUrl, searchEngine, profile, browser, captureScreenshot }) {
  const visitStartTime = Date.now();

  const context = await browser.newContext({
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

  try {
    // Apply stealth scripts
    await context.addInitScript((fp) => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

      Object.defineProperty(navigator, 'plugins', {
        get: () => ([
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          { name: 'Native Client', filename: 'internal-nacl-plugin' }
        ])
      });

      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en', 'es']
      });

      try {
        Object.defineProperty(navigator, 'platform', { get: () => fp.platform });
      } catch {}

      try {
        const sw = fp.viewport?.width || 1920;
        const sh = fp.viewport?.height || 1080;
        Object.defineProperty(window.screen, 'width', { get: () => sw });
        Object.defineProperty(window.screen, 'height', { get: () => sh });
        Object.defineProperty(window.screen, 'availWidth', { get: () => sw });
        Object.defineProperty(window.screen, 'availHeight', { get: () => Math.max(1, sh - 80) });
        Object.defineProperty(window, 'devicePixelRatio', { get: () => fp.deviceType === 'mobile' ? 3 : 1 });
      } catch {}

      // Geolocation API Override - Spoof GPS coordinates
      if (fp.geolocation) {
        const mockGeolocation = {
          getCurrentPosition: (success, error) => {
            success({
              coords: {
                latitude: fp.geolocation.latitude,
                longitude: fp.geolocation.longitude,
                accuracy: randomBetween(50, 150),
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
              },
              timestamp: Date.now()
            });
          },
          watchPosition: (success, error, options) => {
            // Return a watcher ID and immediately provide location
            setTimeout(() => {
              success({
                coords: {
                  latitude: fp.geolocation.latitude,
                  longitude: fp.geolocation.longitude,
                  accuracy: randomBetween(50, 150),
                  altitude: null,
                  altitudeAccuracy: null,
                  heading: null,
                  speed: null
                },
                timestamp: Date.now()
              });
            }, 0);
            return Math.floor(Math.random() * 10000); // Return watcher ID
          },
          clearWatch: (watchId) => {
            // No-op, just clear the watcher
          }
        };

        // Override navigator.geolocation
        Object.defineProperty(navigator, 'geolocation', {
          get: () => mockGeolocation
        });
      }

      try {
        const UNMASKED_VENDOR_WEBGL = 37445;
        const UNMASKED_RENDERER_WEBGL = 37446;
        const VENDOR = 7936;
        const RENDERER = 7937;

        function patchWebgl(proto) {
          if (!proto || !proto.getParameter) return;
          const original = proto.getParameter;
          proto.getParameter = function (param) {
            if (param === UNMASKED_VENDOR_WEBGL) return fp.webgl.vendor;
            if (param === UNMASKED_RENDERER_WEBGL) return fp.webgl.renderer;
            if (param === VENDOR) return fp.webgl.vendor;
            if (param === RENDERER) return fp.webgl.renderer;
            return original.apply(this, arguments);
          };
        }

        patchWebgl(window.WebGLRenderingContext && window.WebGLRenderingContext.prototype);
        patchWebgl(window.WebGL2RenderingContext && window.WebGL2RenderingContext.prototype);
      } catch {}

      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => Math.floor(Math.random() * 8) + 4
      });

      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => [4, 6, 8, 16][Math.floor(Math.random() * 4)]
      });

      try {
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) =>
          parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters);
      } catch {}

      try {
        window.chrome = {
          runtime: {},
          loadTimes: () => ({}),
          csi: () => ({})
        };
      } catch {}

      try {
        window._consoleLogs = [];
        const originalConsole = { ...console };
        ['log', 'warn', 'error', 'info'].forEach(method => {
          console[method] = (...args) => {
            window._consoleLogs.push({
              method,
              args: args.map(a => {
                try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
                catch { return String(a); }
              }),
              timestamp: Date.now()
            });
            if (originalConsole[method]) {
              originalConsole[method].apply(console, args);
            }
          };
        });
      } catch {}
    }, {
      platform: profile.platform,
      viewport: profile.viewport,
      deviceType: profile.deviceType,
      webgl: profile.webgl,
      geolocation: profile.geolocation
    });

    const page = await context.newPage();

    try {
      // STEP 1: Normalize target domain (remove www. prefix and extract base domain)
      const parsedUrl = new URL(targetUrl);
      const fullHostname = parsedUrl.hostname;              // "www.google.com"
      const baseDomain = fullHostname.replace(/^www\./, ''); // "google.com"
      
      console.log(`   🎯 Target: ${fullHostname} (normalized: ${baseDomain})`);
      
      // Step 2: Open search engine homepage
      console.log(`   📍 Opening ${searchEngine.name}...`);
      await page.goto(searchEngine.url);
      await page.waitForTimeout(randomBetween(1000, 2000));

      // Step 3: Type query in search box (using normalized base domain, not full URL)
      console.log(`   ⌨️ Typing query: ${baseDomain}...`);
      
      // Try to fill search input with fallback logic
      let inputFilled = false;
      const inputSelectors = searchEngine.input.split(', ').filter(s => s.trim());
      
      for (const selector of inputSelectors) {
        try {
          const isVisible = await page.isVisible(selector, { timeout: 5000 });
          if (isVisible) {
            await page.fill(selector, baseDomain);
            inputFilled = true;
            console.log(`   ✅ Found input: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`   ⚠️ Selector failed: ${selector}`);
        }
      }
      
      // Fallback: Try common search input selectors
      if (!inputFilled) {
        console.log(`   ⚠️ Primary selectors failed, trying fallbacks...`);
        const fallbackSelectors = [
          'input[type="search"]',
          'input[type="text"]',
          'textarea',
          'input[name="q"]',
          'input[name="p"]',
          'input[placeholder*="search" i]'
        ];
        
        for (const selector of fallbackSelectors) {
          try {
            const isVisible = await page.isVisible(selector, { timeout: 3000 });
            if (isVisible) {
              await page.fill(selector, baseDomain);
              inputFilled = true;
              console.log(`   ✅ Fallback input found: ${selector}`);
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }
      }
      
      if (!inputFilled) {
        throw new Error(`Could not find search input on ${searchEngine.name}`);
      }
      
      await page.waitForTimeout(randomBetween(1000, 2000));

      // Step 3: Press Enter
      console.log(`   ⏎ Pressing Enter...`);
      await page.keyboard.press('Enter');

      // Step 4: Wait for results page to load
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(randomBetween(2000, 4000));

      // Step 5: Scroll to simulate human behavior
      console.log(`   📜 Scrolling through results...`);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(randomBetween(1000, 2000));

      // Step 6: Find and click target link with EXACT DOMAIN MATCHING
      console.log(`   🔍 Finding EXACT target link: ${baseDomain}...`);
      const links = await page.$$('a');
      
      console.log(`   📊 Found ${links.length} total links, checking first 50...`);
      
      let clicked = false;
      let checkedCount = 0;
      const maxLinksToCheck = 50; // Only check first 50 links for performance
      
      for (let link of links) {
        if (checkedCount >= maxLinksToCheck) {
          console.log(`   ⏹️ Checked ${maxLinksToCheck} links, stopping`);
          break;
        }
        
        try {
          const href = await link.getAttribute('href');
          if (!href) continue;
          
          checkedCount++;
          
          // Skip search engine internal links
          const isSearchInternalLink = href.includes('/search?') || 
                                      href.includes('/webhp?') || 
                                      href.includes('/?q=') || 
                                      href.includes('udm=') || 
                                      href.includes('ved=') ||
                                      href.includes('/copilotsearch?') ||
                                      href.includes('/aclick?') ||
                                      href.includes('&form=') ||
                                      href.includes('?form=');
          
          if (isSearchInternalLink) {
            console.log(`   ⏭️ Skip search internal: ${href.substring(0, 80)}...`);
            continue;
          }
          
          // EXACT DOMAIN MATCHING: Parse the href and check if hostname EXACTLY matches
          let hrefHostname = null;
          let actualUrl = href;
          
          try {
            // Handle relative URLs
            if (!href.startsWith('http')) {
              continue; // Skip non-absolute URLs
            }
            
            const hrefUrl = new URL(href);
            hrefHostname = hrefUrl.hostname.replace(/^www\./, ''); // Normalize
            
            // Check for EXACT hostname match
            if (hrefHostname !== baseDomain) {
              // Not an exact match, skip
              continue;
            }
            
            // EXACT MATCH FOUND!
            console.log(`   🎯 EXACT MATCH: ${hrefHostname}`);
            
            // Handle search engine redirect URLs (Google, Bing, DuckDuckGo)
            if (href.includes('/url?') || href.includes('/duckduckgo/?')) {
              try {
                const urlObj = new URL(href);
                
                // Google: ?q= or ?url=
                const qParam = urlObj.searchParams.get('q') || urlObj.searchParams.get('url');
                if (qParam) {
                  const redirectUrl = new URL(qParam);
                  const redirectHostname = redirectUrl.hostname.replace(/^www\./, '');
                  if (redirectHostname === baseDomain) {
                    actualUrl = qParam;
                    console.log(`   🔗 Google redirect detected`);
                    console.log(`   🎯 Actual URL: ${actualUrl}`);
                  } else {
                    console.log(`   ⚠️ Redirect to different domain: ${redirectHostname}, skipping`);
                    continue;
                  }
                }
                
                // DuckDuckGo: ?uddg=
                const uddgParam = urlObj.searchParams.get('uddg');
                if (uddgParam) {
                  const redirectUrl = new URL(uddgParam);
                  const redirectHostname = redirectUrl.hostname.replace(/^www\./, '');
                  if (redirectHostname === baseDomain) {
                    actualUrl = uddgParam;
                    console.log(`   🔗 DuckDuckGo redirect detected`);
                    console.log(`   🎯 Actual URL: ${actualUrl}`);
                  } else {
                    console.log(`   ⚠️ Redirect to different domain: ${redirectHostname}, skipping`);
                    continue;
                  }
                }
              } catch (e) {
                console.log(`   ⚠️ Failed to parse redirect, using original href`);
              }
            }
            
            console.log(`   ✅ Clicking EXACT match: ${actualUrl.substring(0, 100)}...`);
            await link.click();
            clicked = true;
            break;
            
          } catch (e) {
            // Invalid URL, skip
            console.log(`   ⚠️ Invalid URL: ${href.substring(0, 80)}...`);
            continue;
          }
          
        } catch (e) {
          // Skip if link is not clickable
        }
      }

      if (!clicked) {
        console.log(`   ❌ Target "${baseDomain}" NOT found in first ${checkedCount} links`);
        throw new Error(`Target link not found in ${searchEngine.name} results`);
      }

      // Wait for navigation to target website
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      await page.waitForTimeout(randomBetween(3000, 6000));

      // Step 7: Simulate browsing on target website
      await simulateTabFocusBlur(page, profile.behavior);
      await simulateHumanMouse(page, profile.behavior);
      await randomDelay(350, 1200);
      await simulateHumanScroll(page, profile.behavior);
      await randomDelay(300, 900);
      await simulateSafeClicks(page, profile.behavior);

      // Capture data
      const finalUrl = page.url();
      const title = await page.title().catch(() => 'Unknown');
      const screenshot = captureScreenshot
        ? await page.screenshot({ type: 'jpeg', quality: 80 }).catch(() => null)
        : null;

      const visitDuration = ((Date.now() - visitStartTime) / 1000).toFixed(2);

      return {
        success: true,
        visitIndex: profile.visitIndex,
        duration: visitDuration,
        url: finalUrl,
        title,
        screenshot: screenshot ? screenshot.toString('base64') : null,
        trafficMode: 'search',
        searchEngine: searchEngine.name,
        searchEngineIcon: searchEngine.icon,
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
      throw error;
    }
  } finally {
    await context.close().catch(() => {});
  }
}

module.exports = { automateWebsite };

