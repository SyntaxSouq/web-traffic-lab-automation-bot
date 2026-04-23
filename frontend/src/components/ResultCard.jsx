import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock, FaBolt, FaGlobe, FaShieldAlt, FaExternalLinkAlt, FaHistory, FaMobile, FaDesktop, FaTablet, FaRobot, FaNetworkWired, FaMapMarkerAlt } from 'react-icons/fa';

function ResultCard({ data }) {
  const visits = Array.isArray(data.visits) ? data.visits : null;
  const isMulti = Boolean(visits && visits.length > 1);
  const [activeVisitIndex, setActiveVisitIndex] = useState(0);
  const [ip, setIp] = useState('Detecting...');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setIp(data.ip || 'Unavailable');
      })
      .catch(() => {
        fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => setIp(data.ip))
          .catch(() => setIp('Unavailable'));
      });
  }, []);

  useEffect(() => {
    setActiveVisitIndex(0);
  }, [data]);

  const safeActiveIndex = visits ? Math.min(activeVisitIndex, visits.length - 1) : 0;
  const active = visits ? visits[safeActiveIndex] : data;

  if (!data.success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-500/20 border-red-500/30 backdrop-blur-md rounded-2xl p-8 text-white border mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <FaTimesCircle className="text-3xl text-red-400" />
          <h3 className="text-2xl font-bold">Automation Failed</h3>
        </div>
        <p className="text-gray-300 mb-4">{data.error}</p>
        {data.url && (
          <div className="bg-black/30 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <FaGlobe className="text-purple-400 text-sm" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Attempted URL</span>
            </div>
            <p className="text-sm font-mono text-gray-300 break-all">{data.url}</p>
          </div>
        )}
        <div className="bg-black/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <FaNetworkWired className="text-purple-400 text-sm" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Your IP</span>
          </div>
          <p className="text-sm font-mono text-white">{ip}</p>
        </div>
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-300">
            <strong>Tip:</strong> Some websites block automated browsers or require login. 
            Try a different website or check if the URL is correct.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-3xl text-green-400" />
          <h3 className="text-2xl font-bold text-white">Automation Successful</h3>
        </div>
        <div className="flex items-center gap-3">
          {data.summary?.trafficMode && (
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
              <p className="text-xs text-gray-400">Traffic Mode</p>
              <p className="text-sm font-bold text-blue-300">
                {data.summary.trafficMode === 'stealth' && '🛡️ Stealth'}
                {data.summary.trafficMode === 'storm' && '⚡ Storm'}
                {data.summary.trafficMode === 'search' && '🔍 Search'}
              </p>
            </div>
          )}
          {data.duration && (
            <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
              <p className="text-sm text-gray-400">Total Time</p>
              <p className="text-xl font-bold text-purple-300">{data.duration}s</p>
            </div>
          )}
        </div>
      </div>

      {isMulti && data.summary && (
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <p className="text-white font-semibold mb-1">
            Visits: {data.summary.total} • Success: {data.summary.successes} • Failed: {data.summary.failures}
          </p>
          {!data.summary.trafficMode || data.summary.trafficMode === 'stealth' ? (
            <p className="text-gray-400 text-sm mb-2">
              Averages (successful visits): {data.summary.avgLoadTime}ms load • {data.summary.avgTtfb}ms TTFB • {data.summary.avgDomReady}ms DOM ready
            </p>
          ) : null}
          {data.summary.batchUsed && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <FaBolt className="text-yellow-400" />
                <span className="text-sm text-gray-300">
                  Batch: <span className="text-white font-semibold">{data.summary.batchUsed}</span>
                </span>
              </div>
              {data.summary.totalChunks && (
                <span className="text-sm text-gray-300">
                  Chunks: <span className="text-white font-semibold">{data.summary.totalChunks}</span>
                </span>
              )}
              {data.summary.trafficMode === 'search' && data.summary.engineUsage && (
                <span className="text-sm text-blue-300">
                  🔍 Engines: <span className="text-white font-semibold">{Object.entries(data.summary.engineUsage).map(([engine, count]) => `${engine} (${count})`).join(', ')}</span>
                </span>
              )}
              {data.duration && (
                <span className="text-sm text-green-300">
                  ⚡ Speed: <span className="font-semibold">{(data.visitCount / parseFloat(data.duration)).toFixed(2)} visits/sec</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatBox 
          icon={<FaClock />} 
          label="Load Time" 
          value={`${(active.loadTime || 0).toFixed(0)}ms`} 
          color="blue"
        />
        <StatBox 
          icon={<FaBolt />} 
          label="TTFB" 
          value={`${(active.ttfb || 0).toFixed(0)}ms`} 
          color="yellow"
        />
        <StatBox 
          icon={<FaClock />} 
          label="DOM Ready" 
          value={`${(active.domReady || 0).toFixed(0)}ms`} 
          color="cyan"
        />
        <StatBox 
          icon={<FaGlobe />} 
          label="IP Address" 
          value={active.ip || 'Unavailable'} 
          color="green"
        />
        <StatBox 
          icon={<FaShieldAlt />} 
          label="Status" 
          value={`${active.statusCode || ''}`} 
          color="purple"
        />
      </div>
      
      {active.behaviorSimulated && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 mb-6 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <FaRobot className="text-blue-400" />
            <h4 className="text-white font-semibold">Human Behavior Simulation</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Device Type</p>
              <div className="flex items-center gap-2">
                {active.deviceType === 'mobile' ? <FaMobile className="text-green-400" /> : 
                 active.deviceType === 'tablet' ? <FaTablet className="text-yellow-400" /> : 
                 <FaDesktop className="text-blue-400" />}
                <p className="text-white text-sm capitalize">{active.deviceType || 'Desktop'}</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Viewport</p>
              <p className="text-white text-sm">{active.viewport ? `${active.viewport.width}×${active.viewport.height}` : '1920×1080'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 col-span-2">
              <p className="text-gray-400 text-xs mb-1">User Agent</p>
              <p className="text-white text-xs font-mono truncate" title={active.userAgent}>{active.userAgent || 'Chrome 120'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Timezone</p>
              <p className="text-white text-sm">{active.timezoneId || '—'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Platform</p>
              <p className="text-white text-sm">{active.platform || '—'}</p>
            </div>
            {active.geolocation && (
              <div className="bg-white/5 rounded-lg p-3 col-span-2">
                <p className="text-gray-400 text-xs mb-1">
                  <FaMapMarkerAlt className="inline mr-1 text-red-400" />
                  Geolocation
                </p>
                <p className="text-white text-sm">
                  {active.geolocation.city}, {active.geolocation.country}
                </p>
                <p className="text-gray-400 text-xs font-mono mt-1">
                  {active.geolocation.latitude.toFixed(4)}, {active.geolocation.longitude.toFixed(4)}
                </p>
              </div>
            )}
            <div className="bg-white/5 rounded-lg p-3 col-span-2">
              <p className="text-gray-400 text-xs mb-1">WebGL</p>
              <p className="text-white text-xs font-mono truncate" title={active.webgl ? `${active.webgl.vendor} | ${active.webgl.renderer}` : ''}>
                {active.webgl ? `${active.webgl.vendor} | ${active.webgl.renderer}` : '—'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
              ✓ Mouse Movements
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
              ✓ Scroll Behavior
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
              ✓ Page Interactions
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
              ✓ Focus/Blur + Timing
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
              ✓ GPS Spoofed
            </span>
          </div>
        </div>
      )}

      {isMulti && visits && (
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <h4 className="text-white font-semibold mb-3">Audit Log</h4>
          <div className="flex flex-wrap gap-2">
            {visits.map((v, idx) => (
              <button
                key={idx}
                onClick={() => setActiveVisitIndex(idx)}
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                  idx === safeActiveIndex
                    ? 'bg-purple-500/30 border-purple-500/40 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className={v.success ? 'text-green-300' : 'text-red-300'}>
                  {v.success ? '✓' : '✕'}
                </span>{' '}
                Visit {idx + 1}
                {v.searchEngine && (
                  <span className="ml-2 text-xs text-blue-300">
                    {v.searchEngineIcon || '🔍'} {v.searchEngine}
                  </span>
                )}
              </button>
            ))}
          </div>
          {active && (
            <div className="mt-4 bg-black/20 rounded-lg p-4 border border-white/5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Duration</p>
                  <p className="text-white font-semibold">{active.duration}s</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Status</p>
                  <p className="text-white font-semibold">{active.statusCode || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">IP Address</p>
                  <p className="text-white font-semibold font-mono text-sm">{active.ip || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Device</p>
                  <p className="text-white font-semibold text-sm capitalize">{active.deviceType || '—'}</p>
                </div>
                {active.searchEngine && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Search Engine</p>
                    <p className="text-white font-semibold text-sm">
                      {active.searchEngineIcon || '🔍'} {active.searchEngine}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-xs mb-1">URL</p>
              <p className="text-gray-300 text-sm break-all">
                {active.url}
              </p>
              {!active.success && active.error && (
                <p className="text-red-300 text-sm mt-2">{active.error}</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <h4 className="text-white text-lg font-semibold mb-2">{active.title}</h4>
        <div className="flex items-start gap-2">
          <p className="text-gray-400 text-sm break-all flex-1">{active.url}</p>
          <a 
            href={active.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 flex-shrink-0"
          >
            <FaExternalLinkAlt />
          </a>
        </div>
        {active.redirected && active.finalUrl !== active.url && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-xs text-yellow-400">
              <FaHistory className="inline mr-1" />
              Redirected to: {active.finalUrl}
            </p>
          </div>
        )}
      </div>
      
      {(active.screenshot || data.screenshot) && (
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Screenshot</h4>
          <div className="relative group">
            <img 
              src={`data:image/jpeg;base64,${active.screenshot || data.screenshot}`} 
              alt="Website Screenshot"
              className="rounded-xl border border-white/20 w-full"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <p className="text-white text-lg font-semibold">Screenshot captured successfully</p>
            </div>
          </div>
        </div>
      )}
      
      {active.consoleLogs && active.consoleLogs.length > 0 && (
        <div>
          <h4 className="text-white font-semibold mb-3">
            Console Logs ({active.consoleLogs.length})
          </h4>
          <div className="bg-black/30 rounded-xl p-4 max-h-64 overflow-y-auto">
            {active.consoleLogs.map((log, idx) => (
              <div key={idx} className="text-sm font-mono text-gray-300 mb-2 border-b border-white/5 pb-2">
                <span className={`inline-block px-2 py-1 rounded mr-2 text-xs ${
                  log.method === 'error' ? 'bg-red-500/30 text-red-300' :
                  log.method === 'warn' ? 'bg-yellow-500/30 text-yellow-300' :
                  log.method === 'info' ? 'bg-green-500/30 text-green-300' :
                  'bg-blue-500/30 text-blue-300'
                }`}>
                  {log.method}
                </span>
                <span className="text-gray-400 text-xs mr-2">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                {log.args.join(' ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatBox({ icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur-md rounded-xl p-4 text-center border`}>
      <div className="text-2xl mb-2 flex justify-center">{icon}</div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white text-lg font-bold break-words">{value}</p>
    </div>
  );
}

export default ResultCard;
