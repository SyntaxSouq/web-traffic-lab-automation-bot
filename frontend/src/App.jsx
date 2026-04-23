import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import URLInput from './components/URLInput';
import ResultCard from './components/ResultCard';
import CancelledResult from './components/CancelledResult';
import HistoryList from './components/HistoryList';
import IPDisplay from './components/IPDisplay';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const progressRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('history') || '[]');
    } catch {
      return [];
    }
  });

  const [abortController, setAbortController] = useState(null);
  const [lastAutomationState, setLastAutomationState] = useState(null);

  const handleAutomate = async (url, options = {}) => {
    setLoading(true);
    setResult(null);
    setProgress(null);
    setCurrentUrl(url);
    
    const controller = new AbortController();
    setAbortController(controller);
    
    const totalVisits = (options.visitCount || 1) * (options.loopCount || 1);
    progressRef.current = { 
      completed: 0, 
      remaining: totalVisits, 
      failed: 0,
      currentLoop: 1,
      totalLoops: options.loopCount || 1
    };
    setProgress(progressRef.current);
    
    try {
      const apiUrl = '/api/automate';
        
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, options }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setResult({ success: false, error: errorData.error || 'Server error' });
        return;
      }

      // Handle SSE streaming
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          
          // Process full lines from the buffer
          let lines = buffer.split('\n');
          // Keep the last partial line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
            
            try {
              const data = JSON.parse(trimmedLine.slice(6));
              console.log('📡 Received SSE:', data.type, data);
              if (data.type === 'progress') {
                const newProgress = {
                  completed: data.completed,
                  remaining: data.remaining,
                  failed: data.failed,
                  currentLoop: data.currentLoop,
                  totalLoops: data.totalLoops
                };
                progressRef.current = newProgress;
                setProgress(newProgress);
              } else if (data.type === 'result') {
                const resultData = data.data;
                setResult(resultData);
                const newHistory = [
                  { url, timestamp: Date.now(), title: resultData.title, success: resultData.success, visitCount: options.visitCount || 1 },
                  ...history
                ].slice(0, 10);
                
                setHistory(newHistory);
                localStorage.setItem('history', JSON.stringify(newHistory));
              }
            } catch (e) {
              console.error('Error parsing stream data', e, trimmedLine);
            }
          }
        }
      }
    } catch (error) {
      console.error('Automation error:', error);
      if (error.name === 'AbortError') {
        const currentProgress = progressRef.current || { completed: 0, remaining: options.visitCount || 1, failed: 0 };
        
        // Save the state for potential resume
        setLastAutomationState({
          url,
          options,
          progress: currentProgress,
          totalVisits: options.visitCount || 1
        });
        
        setResult({ 
          success: false, 
          error: 'Automation was cancelled by user.',
          cancelled: true,
          url,
          visitCount: options.visitCount || 1,
          progress: currentProgress
        });
      } else {
        setResult({ success: false, error: error.message || 'Connection failed. The server might be restarting.' });
      }
    } finally {
      setLoading(false);
      setProgress(null);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleResume = () => {
    if (lastAutomationState) {
      const { url, options, progress, totalVisits } = lastAutomationState;
      const remainingVisits = progress.remaining || 1;
      
      // Update options with remaining visits
      const resumeOptions = {
        ...options,
        visitCount: remainingVisits
      };
      
      // Clear the state and restart automation
      setLastAutomationState(null);
      handleAutomate(url, resumeOptions);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <IPDisplay />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web Automation
            </span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-12">
            Advanced browser automation with anti-detection
          </p>
        </motion.div>
        
        <URLInput onSubmit={handleAutomate} />
        
        {loading && <LoadingScreen progress={progress} onStop={handleStop} url={currentUrl} />}
        
        {result && result.cancelled && <CancelledResult data={result} onResume={handleResume} />}
        {result && !result.cancelled && <ResultCard data={result} />}
        
        <HistoryList history={history} onSelect={handleAutomate} />
        
        {/* Usage Guide Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 mb-8"
        >
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                📖 Usage Guide
              </span>
            </h2>
            
            {/* Getting Started */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">🚀 Getting Started</h3>
              <p className="text-gray-300 mb-3">1. Enter your target URL in the input field (e.g., https://example.com)</p>
              <p className="text-gray-300 mb-3">2. Select a traffic mode from the dropdown (Stealth, Storm, or Search Engine)</p>
              <p className="text-gray-300 mb-3">3. Configure settings like number of visits and batch size</p>
              <p className="text-gray-300">4. Click "Start Automation" and watch the progress in real-time!</p>
            </div>

            {/* Mode 1: Stealth Anti-Bot Mode */}
            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 rounded-xl border border-indigo-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-indigo-200 mb-3">🛡️ Mode 1: Stealth Anti-Bot Mode</h3>
              <p className="text-indigo-100/80 mb-3 font-medium">Best for: Evading detection and mimicking real human behavior</p>
              
              <div className="space-y-2 text-indigo-100/70">
                <p><strong className="text-indigo-200">What it does:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Simulates realistic human browsing behavior</li>
                  <li>Random mouse movements, scrolls, and clicks</li>
                  <li>Unique fingerprint for each visit (user agent, timezone, geolocation, WebGL)</li>
                  <li>Anti-detection techniques to bypass bot protection</li>
                  <li>Tab focus/blur simulation and keyboard interactions</li>
                </ul>
                
                <p className="mt-3"><strong className="text-indigo-200">Settings:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Visit Count:</strong> Number of automated visits (1-200)</li>
                  <li><strong>Batch Size:</strong> How many visits run concurrently (1-10)</li>
                  <li><strong>Screenshots:</strong> Optional screenshots of visited pages</li>
                </ul>
                
                <p className="mt-3"><strong className="text-indigo-200">When to use:</strong></p>
                <p className="ml-2">• Testing websites with anti-bot protection</p>
                <p className="ml-2">• Simulating organic traffic patterns</p>
                <p className="ml-2">• When you need maximum stealth and realism</p>
              </div>
            </div>

            {/* Mode 2: Storm Traffic Mode */}
            <div className="mb-8 p-6 bg-gradient-to-br from-orange-900/60 to-red-900/60 rounded-xl border border-orange-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-orange-200 mb-3">⚡ Mode 2: Storm Traffic Mode</h3>
              <p className="text-orange-100/80 mb-3 font-medium">Best for: Maximum speed and high-volume traffic generation</p>
              
              <div className="space-y-2 text-orange-100/70">
                <p><strong className="text-orange-200">What it does:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Fastest automation mode with minimal delays</li>
                  <li>Processes up to 20 visits simultaneously</li>
                  <li>Optimized for speed while maintaining JavaScript execution</li>
                  <li>Allows analytics and tracking scripts to load</li>
                  <li>Minimal anti-detection measures (prioritizes speed)</li>
                </ul>
                
                <p className="mt-3"><strong className="text-orange-200">Settings:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Visit Count:</strong> Number of visits (1-200)</li>
                  <li><strong>Batch Size:</strong> Concurrent visits (5-50 recommended)</li>
                  <li><strong>Screenshots:</strong> Optional (disabled by default for speed)</li>
                </ul>
                
                <p className="mt-3"><strong className="text-orange-200">When to use:</strong></p>
                <p className="ml-2">• Load testing and stress testing</p>
                <p className="ml-2">• Generating high-volume traffic quickly</p>
                <p className="ml-2">• When speed is more important than stealth</p>
                <p className="ml-2">• Testing server capacity and performance</p>
              </div>
            </div>

            {/* Mode 3: Search Engine Traffic Mode */}
            <div className="mb-8 p-6 bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-xl border border-cyan-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-cyan-200 mb-3">🔍 Mode 3: Search Engine Traffic Mode</h3>
              <p className="text-cyan-100/80 mb-3 font-medium">Best for: Simulating organic search traffic from Google, Bing, and DuckDuckGo</p>
              
              <div className="space-y-2 text-cyan-100/70">
                <p><strong className="text-cyan-200">What it does:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Opens search engines (Google, Bing, DuckDuckGo) randomly</li>
                  <li>Searches for your domain name in the search engine</li>
                  <li>Scrolls through search results like a real user</li>
                  <li>Finds and clicks on your website link in the results</li>
                  <li>Simulates browsing behavior after reaching your site</li>
                  <li>If link not found, quickly skips to next visit (no wasted time)</li>
                </ul>
                
                <p className="mt-3"><strong className="text-cyan-200">Settings:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Visit Count:</strong> Number of search attempts (1-100)</li>
                  <li><strong>Batch Size:</strong> Concurrent searches (1-10)</li>
                  <li><strong>Search Engines:</strong> Automatically rotates between Google, Bing, DuckDuckGo</li>
                </ul>
                
                <p className="mt-3"><strong className="text-cyan-200">When to use:</strong></p>
                <p className="ml-2">• Simulating organic search traffic</p>
                <p className="ml-2">• Improving search engine analytics</p>
                <p className="ml-2">• Testing SEO and search visibility</p>
                <p className="ml-2">• Creating realistic referral traffic patterns</p>
                
                <p className="mt-3 text-amber-300"><strong>⚠️ Important Notes:</strong></p>
                <p className="ml-2 text-amber-200">• Your website must be indexed by the search engine to be found</p>
                <p className="ml-2 text-amber-200">• Google typically has the best coverage, Bing/DuckDuckGo may not find all sites</p>
                <p className="ml-2 text-amber-200">• If your site isn't found, that visit will be skipped (fast fail)</p>
              </div>
            </div>

            {/* Tips & Best Practices */}
            <div className="mb-6 p-6 bg-gradient-to-br from-emerald-900/60 to-teal-900/60 rounded-xl border border-emerald-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-emerald-200 mb-3">💡 Tips & Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-100/80 font-medium mb-2">General Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100/70">
                    <li>Start with small visit counts to test</li>
                    <li>Use Stealth mode for sensitive websites</li>
                    <li>Use Storm mode for quick, high-volume tests</li>
                    <li>Use Search mode for organic traffic simulation</li>
                  </ul>
                </div>
                <div>
                  <p className="text-emerald-100/80 font-medium mb-2">Configuration Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100/70">
                    <li>Batch size 3-5 is optimal for most cases</li>
                    <li>Higher batch = faster but more detectable</li>
                    <li>Monitor the progress bar in real-time</li>
                    <li>Check results for success/failure rates</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="p-6 bg-gradient-to-br from-amber-900/60 to-orange-900/60 rounded-xl border border-amber-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-amber-200 mb-3">🔧 Troubleshooting</h3>
              <div className="space-y-3 text-amber-100/70">
                <div>
                  <p className="text-amber-100/80 font-medium">❌ Visits are failing?</p>
                  <p className="ml-2">• Website may block automated browsers</p>
                  <p className="ml-2">• Try Stealth mode for better evasion</p>
                  <p className="ml-2">• Check if the URL is correct and accessible</p>
                </div>
                <div>
                  <p className="text-amber-100/80 font-medium">❌ Search mode not finding my site?</p>
                  <p className="ml-2">• Your site may not be indexed by that search engine</p>
                  <p className="ml-2">• Try searching manually to verify it appears</p>
                  <p className="ml-2">• Google typically has the best coverage</p>
                </div>
                <div>
                  <p className="text-amber-100/80 font-medium">❌ Automation is slow?</p>
                  <p className="ml-2">• Increase batch size for parallel processing</p>
                  <p className="ml-2">• Use Storm mode for maximum speed</p>
                  <p className="ml-2">• Stealth mode is intentionally slower (more realistic)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-gray-400 text-sm">
              <div className="mb-4 space-y-2">
                <p className="text-gray-300 font-medium">👨‍💻 Developer: <span className="text-purple-400">Syntax Souq</span></p>
                <p className="text-gray-300">📧 Email: <a href="mailto:eaten-copy-pasty@duck.com" className="text-blue-400 hover:text-blue-300 transition-colors">eaten-copy-pasty@duck.com</a></p>
                <p className="text-gray-300">✈️ Telegram: <a href="https://t.me/SyntaxSouq" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">@SyntaxSouq</a> <span className="text-green-400 text-xs">(fastest reply)</span></p>
              </div>
              <p>For more information, check the project documentation or contact the developer.</p>
              <p className="mt-2">Made with ❤️</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
