import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaBolt, FaChevronDown } from 'react-icons/fa';

function URLInput({ onSubmit }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [visitCount, setVisitCount] = useState('1');
  const [visitCountError, setVisitCountError] = useState('');
  const [loopCount, setLoopCount] = useState('1');
  const [loopError, setLoopError] = useState('');
  const [maxBatch, setMaxBatch] = useState('3');
  const [batchError, setBatchError] = useState('');
  const [trafficMode, setTrafficMode] = useState('stealth');
  const MAX_VISITS = 1000;

  const validateUrl = (input) => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let processedUrl = url.trim();
    
    if (!processedUrl) {
      setError('Please enter a URL');
      return;
    }

    const parsedVisitCount = Number(visitCount);
    if (!Number.isInteger(parsedVisitCount) || parsedVisitCount < 1 || parsedVisitCount > MAX_VISITS) {
      setVisitCountError(`Visit count must be an integer between 1 and ${MAX_VISITS}`);
      return;
    }

    const parsedLoopCount = Number(loopCount);
    if (!Number.isInteger(parsedLoopCount) || parsedLoopCount < 1 || parsedLoopCount > 100) {
      setLoopError(`Loops must be between 1 and 100`);
      return;
    }

    const maxBatchLimit = 20; // FIXED: Consistent limit of 20
    const parsedBatch = Number(maxBatch);
    if (!Number.isInteger(parsedBatch) || parsedBatch < 1 || parsedBatch > maxBatchLimit) {
      setBatchError(`Batch size must be between 1 and ${maxBatchLimit}`);
      return;
    }
    
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    if (!validateUrl(processedUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setError('');
    setVisitCountError('');
    setLoopError('');
    setBatchError('');
    onSubmit(processedUrl, { 
      visitCount: parsedVisitCount, 
      loopCount: parsedLoopCount,
      maxBatchVisits: parsedBatch,
      trafficMode: trafficMode
    });
  };

  const quickTests = [
    { url: 'example.com', label: 'Example' },
    { url: 'wikipedia.org', label: 'Wikipedia' },
    { url: 'github.com', label: 'GitHub' },
    { url: 'news.ycombinator.com', label: 'Hacker News' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter website URL (e.g., example.com)"
              className={`w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border ${
                error ? 'border-red-500' : 'border-white/20'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
          <div className="md:w-36 relative">
            <input
              type="number"
              min="1"
              max={MAX_VISITS}
              step="1"
              value={visitCount}
              onChange={(e) => {
                setVisitCount(e.target.value);
                if (visitCountError) setVisitCountError('');
              }}
              className={`w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border ${
                visitCountError ? 'border-red-500' : 'border-white/20'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Visits"
            />
            <p className="text-gray-400 text-xs mt-2">Visits (1–{MAX_VISITS})</p>
            {visitCountError && (
              <p className="text-red-400 text-sm mt-2">{visitCountError}</p>
            )}
          </div>
          <div className="md:w-32 relative">
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={loopCount}
              onChange={(e) => {
                setLoopCount(e.target.value);
                if (loopError) setLoopError('');
              }}
              className={`w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border ${
                loopError ? 'border-red-500' : 'border-white/20'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Loops"
            />
            <p className="text-gray-400 text-xs mt-2">Loops (1–100)</p>
            {loopError && (
              <p className="text-red-400 text-sm mt-2">{loopError}</p>
            )}
          </div>
          <div className="md:w-56 relative group">
            <select
              value={trafficMode}
              onChange={(e) => {
                const newMode = e.target.value;
                setTrafficMode(newMode);
                if (batchError) setBatchError('');
              }}
              className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer group-hover:bg-white/20 pr-10"
            >
              <option value="stealth" className="bg-gray-800">🛡️ Stealth Anti-Bot</option>
              <option value="storm" className="bg-gray-800">⚡ Storm Traffic</option>
              <option value="search" className="bg-gray-800">🔍 Search Engine</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors">
              <FaChevronDown size={14} />
            </div>
            <p className="text-gray-400 text-xs mt-2">Traffic Mode</p>
          </div>
          <div className="md:w-36 relative">
            <input
              type="number"
              min="1"
              max="20"
              step="1"
              value={maxBatch}
              onChange={(e) => {
                setMaxBatch(e.target.value);
                if (batchError) setBatchError('');
              }}
              className={`w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border ${
                batchError ? 'border-red-500' : 'border-white/20'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Batch"
            />
            <p className="text-gray-400 text-xs mt-2">Batch (1–20)</p>
            {batchError && (
              <p className="text-red-400 text-sm mt-2">{batchError}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
          >
            <FaRocket />
            <span>Automate</span>
          </motion.button>
        </div>
      </form>
      
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <FaBolt className="text-yellow-400" />
        <span className="text-gray-400 text-sm">Quick tests:</span>
        {quickTests.map((test, idx) => (
          <button
            key={idx}
            onClick={() => {
              setUrl(test.url);
              setError('');
            }}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
          >
            {test.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-300 mb-2">
          <strong>🎯 Active Mode: {trafficMode === 'stealth' ? '🛡️ Stealth Anti-Bot' : trafficMode === 'storm' ? '⚡ Storm Traffic' : '🔍 Search Engine'}</strong>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-300">
          {trafficMode === 'stealth' && (
            <>
              <div>✓ Random User Agents</div>
              <div>✓ Device Spoofing</div>
              <div>✓ Mouse Simulation</div>
              <div>✓ Scroll Behavior</div>
              <div>✓ Random Delays</div>
              <div>✓ Fingerprint Masking</div>
              <div>✓ Chrome Runtime Mock</div>
              <div>✓ Human Interactions</div>
              <div>✓ Batch Processing</div>
              <div>✓ Anti-Detection</div>
            </>
          )}
          {trafficMode === 'storm' && (
            <>
              <div>⚡ Maximum Speed</div>
              <div>⚡ High Concurrency</div>
              <div>⚡ Fast Page Loads</div>
              <div>⚡ Minimal Delays</div>
              <div>⚡ Volume Focus</div>
              <div>✓ User Agent Rotation</div>
              <div>✓ Batch Processing</div>
              <div>⚠️ Reduced Stealth</div>
              <div>⚠️ No Human Sim</div>
              <div>⚠️ Higher Detection Risk</div>
            </>
          )}
          {trafficMode === 'search' && (
            <>
              <div>🔍 Google Search</div>
              <div>🔍 Bing Search</div>
              <div>🔍 DuckDuckGo</div>
              <div>✓ Organic Traffic</div>
              <div>✓ Human Behavior</div>
              <div>✓ Search & Click</div>
              <div>✓ Result Scanning</div>
              <div>✓ Anti-Detection</div>
              <div>✓ Fingerprint Masking</div>
              <div>✓ Realistic Flow</div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default URLInput;
