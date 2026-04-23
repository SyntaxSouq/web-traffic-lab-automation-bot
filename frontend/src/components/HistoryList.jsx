import { motion } from 'framer-motion';
import { FaHistory, FaRedo, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

function HistoryList({ history, onSelect }) {
  const clearHistory = () => {
    localStorage.removeItem('history');
    window.location.reload();
  };

  if (history.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="max-w-4xl mx-auto mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaHistory className="text-2xl text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          <span className="bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm">
            {history.length}
          </span>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all"
        >
          <FaTrash />
          <span>Clear</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(item.url, { visitCount: item.visitCount || 1 })}
            className="w-full bg-white/5 backdrop-blur-md rounded-xl p-4 text-left hover:bg-white/10 border border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {item.success ? (
                    <FaCheck className="text-green-400" />
                  ) : (
                    <FaTimes className="text-red-400" />
                  )}
                  <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                    {item.title || item.url}
                  </p>
                </div>
                <p className="text-gray-400 text-sm ml-6 truncate">{item.url}</p>
              </div>
              <div className="text-right">
                <FaRedo className="text-gray-500 group-hover:text-purple-400 transition-colors mb-1" />
                <p className="text-gray-500 text-xs">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default HistoryList;
