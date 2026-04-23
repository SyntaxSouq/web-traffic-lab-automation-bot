import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSpinner, 
  FaGlobe, 
  FaNetworkWired,
  FaStop 
} from 'react-icons/fa';

/**
 * LoadingScreen Component
 * Displays the automation status, target URL, detected IP, and progress counters.
 */
function LoadingScreen({ progress, onStop, url }) {
  const [ip, setIp] = useState('Detecting...');

  // Effect to fetch and periodically update the public IP address
  useEffect(() => {
    const fetchIp = () => {
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setIp(data.ip))
        .catch(() => setIp('192.42.116.17'));
    };

    fetchIp();
    const interval = setInterval(fetchIp, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center p-8 bg-gray-900/80 rounded-2xl border border-white/10 shadow-2xl min-w-[320px] max-w-md">
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <FaSpinner className="text-2xl text-purple-400" />
        </motion.div>

        {/* Status Text */}
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white text-2xl font-semibold mb-1"
        >
          Automating Website...
        </motion.p>
        <p className="text-gray-400 text-sm mb-4">Please wait while we process your request</p>
        
        {progress?.totalLoops > 1 && (
          <div className="mb-6 inline-block px-4 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">
              Loop {progress.currentLoop || 1} of {progress.totalLoops}
            </span>
          </div>
        )}
        
        {/* Target URL Card */}
        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <FaGlobe className="text-purple-400 text-sm" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Target URL</span>
          </div>
          <p className="text-white font-mono text-sm break-all">{url || 'https://google.com'}</p>
        </div>
        
        {/* IP Address Card */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <FaNetworkWired className="text-blue-400 text-sm" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Your IP</span>
          </div>
          <p className="text-white font-mono text-sm">{ip}</p>
        </div>
        
        {/* Progress Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-2xl font-bold text-green-400">{progress?.completed || 0}</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold mt-1">Completed</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-2xl font-bold text-yellow-400">{progress?.remaining || 1}</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold mt-1">Remaining</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-2xl font-bold text-red-400">{progress?.failed || 0}</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold mt-1">Failed</span>
          </div>
        </div>
        
        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStop}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-all"
        >
          <FaStop className="text-xs" />
          Stop Automation
        </motion.button>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
