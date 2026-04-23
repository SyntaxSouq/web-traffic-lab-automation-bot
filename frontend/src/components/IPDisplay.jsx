import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNetworkWired } from 'react-icons/fa';

function IPDisplay() {
  const [ip, setIp] = useState('Detecting...');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip || 'Unavailable'))
      .catch(() => setIp('Unavailable'));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
        <FaNetworkWired className="text-purple-400" />
        <p className="text-white text-sm">
          Your IP: <span className="font-mono font-bold text-purple-300">{ip}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default IPDisplay;
