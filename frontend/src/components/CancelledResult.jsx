import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBan, 
  FaGlobe, 
  FaNetworkWired, 
  FaPlay 
} from 'react-icons/fa';

/**
 * ResultCard - Cancelled State Logic
 * Displays the status after a user stops automation, with an option to resume.
 */
function CancelledResult({ data, onResume }) {
  const [ip, setIp] = useState('Detecting...');
  const isCancelled = !data.success && data.cancelled === true;

  // Fetch current IP for display in the cancelled state
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('192.42.116.17'));
  }, []);

  if (!isCancelled) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-yellow-500/20 backdrop-blur-md rounded-2xl p-8 text-white border border-yellow-500/30 mb-8 shadow-2xl shadow-yellow-900/10"
    >
      {/* Header Status */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-500/20 p-3 rounded-full border border-yellow-500/30">
          <FaBan className="text-3xl text-yellow-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Automation Cancelled</h3>
          <p className="text-yellow-400/60 text-sm">Automation was cancelled by user.</p>
        </div>
      </div>

      {/* URL and IP Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <FaGlobe className="text-purple-400 text-sm" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Attempted URL</span>
          </div>
          <p className="text-white font-mono text-sm break-all">{data.url || 'https://google.com'}</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <FaNetworkWired className="text-blue-400 text-sm" />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Your IP</span>
          </div>
          <p className="text-white font-mono text-sm">{ip}</p>
        </div>
      </div>

      {/* Progress Counters */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{data.progress?.completed || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Completed</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{data.progress?.remaining || 1}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Remaining</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{data.progress?.failed || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Failed</p>
        </div>
      </div>

      {/* Info Box and Resume Button */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-300 leading-relaxed">
            <strong>Info:</strong> The automation was stopped before it could complete. 
            You can try again with the same or a different URL.
          </p>
        </div>

        {onResume && data.progress?.remaining > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 transition-all group"
          >
            <FaPlay className="text-xs group-hover:translate-x-1 transition-transform" />
            <span>Resume ({data.progress.remaining} visits remaining)</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default CancelledResult;
