// app/page.tsx (LENGKAP dengan semua fungsionalitas original + Cyberpunk Theme)
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Loader2, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  Trash2, 
  LayoutTemplate, 
  Layers, 
  Cpu, 
  Code, 
  Hexagon,
  Zap,
  Activity,
  Terminal,
  Shield,
  Network,
  Eye,
  Maximize2
} from 'lucide-react';
import MatrixBackground from '@/components/MatrixBackground';
import Sidebar from '@/components/Sidebar';

interface HistoryItem {
  id: string;
  appName: string;
  websiteUrl: string;
  date: number;
  status: string;
  androidUrl?: string | null;
  iosUrl?: string | null;
}

export default function Home() {
  // Original state
  const [appName, setAppName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [buildStatus, setBuildStatus] = useState<any>(null);
  const [isDone, setIsDone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeView, setActiveView] = useState('builder'); // 'builder', 'monitor', 'logs', 'system'
  const videoRef = useRef<HTMLVideoElement>(null);

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('web2native_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveHistory = (items: HistoryItem[]) => {
    setHistory(items);
    localStorage.setItem('web2native_history', JSON.stringify(items));
  };

  const updateHistoryItem = (id: string, updates: Partial<HistoryItem>) => {
    setHistory(prev => {
      const newHistory = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      localStorage.setItem('web2native_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    if (confirm('Yakin ingin menghapus semua history?')) {
      saveHistory([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !websiteUrl) {
      setError('App Name and Website URL are required.');
      return;
    }
    
    let formattedUrl = websiteUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsLoading(true);
    setError(null);
    setBuildStatus(null);
    setIsDone(false);
    setRequestId(null);
    
    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName, websiteUrl: formattedUrl }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to initiate application build.');
      }
      
      const newId = result.data.requestId;
      setRequestId(newId);
      
      const newItem: HistoryItem = {
        id: newId,
        appName,
        websiteUrl: formattedUrl,
        date: Date.now(),
        status: 'PROCESSING'
      };
      saveHistory([newItem, ...history]);
      
    } catch (err: any) {
      setError(err.message || 'System error occurred.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!requestId) return;

      try {
        const response = await fetch(`/api/status?requestId=${requestId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          const data = result.data;
          setBuildStatus(data);

          if (data.isDone) {
            setIsDone(true);
            setIsLoading(false);
            clearInterval(interval);
            updateHistoryItem(requestId, {
              status: 'DONE',
              androidUrl: data.android_url,
              iosUrl: data.ios_url
            });
          }
        }
      } catch (err) {
        console.error('Failed to check status', err);
      }
    };

    if (requestId && !isDone) {
      checkStatus();
      interval = setInterval(checkStatus, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [requestId, isDone]);

  // Sidebar navigation items for cyberpunk theme
  const navItems = [
    { id: 'builder', label: 'BUILDER', icon: Zap },
    { id: 'monitor', label: 'MONITOR', icon: Activity },
    { id: 'logs', label: 'LOGS', icon: Terminal },
    { id: 'system', label: 'SYSTEM', icon: Shield },
  ];

  return (
    <>
      {/* Splash Screen Loading Overlay - Original */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, visibility: 'hidden' }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div className="text-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-32 h-32 object-cover rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.5)] mx-auto mb-6"
              >
                <source src="https://i.imgur.com/NRDIp63.mp4" type="video/mp4" />
              </video>
              <div className="text-neon-cyan font-mono text-sm animate-pulse">INITIALIZING NEXUS...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Cyberpunk Theme */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showSplash ? 0 : 0.3 }}
        className="relative min-h-screen bg-black overflow-hidden"
      >
        <MatrixBackground />
        
        <div className="relative z-10 flex h-screen">
          {/* Cyberpunk Sidebar */}
          <div className="w-72 bg-black/60 backdrop-blur-md border-r border-neon-cyan/30 flex flex-col">
            <div className="p-6 border-b border-neon-cyan/20">
              <div className="flex items-center gap-3 mb-2">
                <Hexagon className="w-8 h-8 text-neon-cyan animate-pulse" />
                <div>
                  <h1 className="text-xl font-mono font-bold text-neon-cyan">JhonNative</h1>
                  <p className="text-xs font-mono text-gray-500">PRO // v2.0</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-xs font-mono text-neon-green">API: ACTIVE</span>
              </div>
            </div>
            
            <div className="flex-1 py-8">
              <div className="px-4 mb-4">
                <div className="text-[10px] font-mono text-gray-500 tracking-wider">CONTROL PANEL</div>
                <div className="h-px bg-gradient-to-r from-neon-cyan/50 to-transparent mt-1"></div>
              </div>
              
              <nav className="space-y-2 px-4">
                {navItems.map((item) => {
                  const isActive = activeView === item.id;
                  const Icon = item.icon;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        if (item.id !== 'builder') setShowHistory(false);
                      }}
                      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                        isActive 
                          ? 'bg-neon-cyan/10 border border-neon-cyan/50 shadow-glow' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-1 h-full bg-neon-cyan rounded-r"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-neon-cyan' : 'text-gray-500 group-hover:text-neon-cyan'}`} />
                      
                      <span className={`text-sm font-mono font-bold transition-colors ${
                        isActive ? 'text-neon-cyan' : 'text-gray-400 group-hover:text-neon-cyan'
                      }`}>
                        {item.label}
                      </span>
                      
                      {isActive && (
                        <motion.div
                          className="absolute right-3 w-1 h-1 rounded-full bg-neon-cyan"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
              
              <div className="px-4 mt-8">
                <div className="text-[10px] font-mono text-gray-500 tracking-wider">SYSTEM NODES</div>
                <div className="h-px bg-gradient-to-r from-neon-cyan/50 to-transparent mt-1"></div>
              </div>
              
              <div className="mt-4 px-4 space-y-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-cyan/20 bg-black/40">
                  <Cpu className="w-3 h-3 text-neon-cyan" />
                  <span className="text-xs font-mono text-neon-cyan">BUILD_NODE: ONLINE</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-cyan/20 bg-black/40">
                  <Network className="w-3 h-3 text-neon-green" />
                  <span className="text-xs font-mono text-neon-green">API_GATEWAY: ACTIVE</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-neon-cyan/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                <div className="text-[10px] font-mono text-neon-green">WEB2NATIVE STATUS</div>
              </div>
              <div className="text-xs font-mono text-gray-500">
                <div>READY TO BUILD</div>
                <div>API: CONNECTED</div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="h-14 border-b border-neon-cyan/20 bg-black/40 backdrop-blur-sm flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse"></div>
                  <span className="text-xs font-mono text-neon-red">REC</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                  <span className="text-xs font-mono text-neon-green">API ONLINE</span>
                </div>
                <div className="h-4 w-px bg-neon-cyan/30 mx-2"></div>
                <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan">
                  <Cpu className="w-3 h-3" />
                  <span>BUILD ENGINE: STANDBY</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 rounded-lg hover:bg-neon-cyan/10 transition-colors relative group"
                >
                  <History className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors" />
                </button>
                <span className="text-xs font-mono text-gray-500">UPTIME: 23:59:42</span>
                <span className="text-neon-cyan animate-pulse">&gt;_</span>
              </div>
            </div>
            
            {/* Content Panel */}
            <div className="flex-1 overflow-auto p-6">
              <AnimatePresence mode="wait">
                {showHistory ? (
                  <motion.div 
                    key="history"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-neon-cyan" />
                        <h2 className="text-xl font-mono font-bold text-neon-cyan">BUILD HISTORY</h2>
                      </div>
                      {history.length > 0 && (
                        <button 
                          onClick={clearHistory}
                          className="text-xs font-mono text-neon-red hover:text-neon-red/80 border border-neon-red/30 px-3 py-1.5 rounded-lg transition-colors hover:shadow-glow"
                        >
                          CLEAR ALL
                        </button>
                      )}
                    </div>

                    {history.length === 0 ? (
                      <div className="border border-neon-cyan/20 rounded-lg p-12 text-center">
                        <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="font-mono text-sm text-gray-500">No build history found.</p>
                        <p className="font-mono text-xs text-gray-600 mt-2">Start a new build to see results here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {history.map((item) => (
                          <div key={item.id} className="border border-neon-cyan/20 rounded-lg p-4 hover:border-neon-cyan/50 transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-mono font-bold text-neon-cyan">{item.appName}</h3>
                                <p className="text-xs font-mono text-gray-500 mt-1 flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {item.websiteUrl}
                                </p>
                              </div>
                              <span className={`text-[10px] font-mono px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                                item.status === 'DONE' 
                                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                                  : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 animate-pulse'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              {item.status === 'DONE' ? (
                                <>
                                  {item.androidUrl && (
                                    <a href={item.androidUrl} target="_blank" rel="noreferrer" className="flex-1 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center">
                                      DOWNLOAD APK
                                    </a>
                                  )}
                                  {item.iosUrl && (
                                    <a href={item.iosUrl} target="_blank" rel="noreferrer" className="flex-1 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all text-center">
                                      DOWNLOAD IPA
                                    </a>
                                  )}
                                </>
                              ) : (
                                <div className="w-full bg-black/60 border border-neon-cyan/30 px-4 py-2 rounded-lg text-xs font-mono text-neon-cyan text-center flex items-center justify-center gap-2">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> PROCESSING...
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-6"
                  >
                    {activeView === 'builder' && (
                      <>
                        {/* Hero Section */}
                        <div className="text-center mb-8">
                          <h1 className="text-4xl font-mono font-bold text-neon-cyan mb-3 tracking-tight">
                            Web2Native Builder
                          </h1>
                          <p className="text-sm font-mono text-gray-400 max-w-md mx-auto">
                            Transform any website into native Android & iOS applications instantly.
                          </p>
                        </div>

                        {/* Main Build Form */}
                        <div className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 rounded-lg overflow-hidden">
                          <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                              <div>
                                <label htmlFor="appName" className="block text-xs font-mono text-neon-cyan mb-2">APP IDENTIFIER</label>
                                <input
                                  id="appName"
                                  type="text"
                                  placeholder="MyApp"
                                  value={appName}
                                  onChange={(e) => setAppName(e.target.value)}
                                  disabled={isLoading || isDone || !!requestId}
                                  className="w-full bg-black/80 border border-neon-cyan/30 rounded-lg px-4 py-3 text-sm font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan focus:shadow-glow transition-all disabled:opacity-50 placeholder:text-gray-600"
                                />
                              </div>

                              <div>
                                <label htmlFor="websiteUrl" className="block text-xs font-mono text-neon-cyan mb-2">TARGET URL</label>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                  <input
                                    id="websiteUrl"
                                    type="text"
                                    placeholder="https://example.com"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    disabled={isLoading || isDone || !!requestId}
                                    className="w-full bg-black/80 border border-neon-cyan/30 rounded-lg pl-10 pr-4 py-3 text-sm font-mono text-neon-cyan focus:outline-none focus:border-neon-cyan focus:shadow-glow transition-all disabled:opacity-50 placeholder:text-gray-600"
                                  />
                                </div>
                              </div>

                              {error && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="flex items-start gap-2 text-neon-red bg-neon-red/10 border border-neon-red/30 p-3 rounded-lg text-xs font-mono"
                                >
                                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                  <p>{error}</p>
                                </motion.div>
                              )}

                              {!requestId && !isDone && (
                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan text-neon-cyan font-mono font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-glow disabled:opacity-50"
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      INITIATING BUILD...
                                    </>
                                  ) : (
                                    "DEPLOY TO NATIVE"
                                  )}
                                </button>
                              )}

                              <AnimatePresence>
                                {(requestId || isLoading || isDone) && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 overflow-hidden"
                                  >
                                    <div className="border border-neon-cyan/30 rounded-lg p-4 bg-black/40">
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-mono text-gray-400">BUILD STATUS</span>
                                        <span className="text-xs font-mono text-neon-cyan flex items-center gap-2">
                                          {isDone ? (
                                            <><CheckCircle2 className="w-3 h-3 text-neon-green" /> COMPLETE</>
                                          ) : (
                                            <><Loader2 className="w-3 h-3 animate-spin" /> PROCESSING</>
                                          )}
                                        </span>
                                      </div>
                                      
                                      {buildStatus && (
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-xs font-mono">
                                            <span className="text-gray-500">ANDROID</span>
                                            <span className={buildStatus.android_status === 'DONE' ? 'text-neon-green' : 'text-neon-cyan'}>
                                              {buildStatus.android_status || 'PENDING'}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-xs font-mono">
                                            <span className="text-gray-500">IOS</span>
                                            <span className={buildStatus.ios_status === 'DONE' ? 'text-neon-green' : 'text-neon-cyan'}>
                                              {buildStatus.ios_status || 'PENDING'}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {isDone && buildStatus && (
                                      <motion.div 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                      >
                                        {buildStatus.android_url && (
                                          <a 
                                            href={buildStatus.android_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan text-neon-cyan py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-mono text-sm hover:shadow-glow"
                                          >
                                            <Download className="w-4 h-4" /> DOWNLOAD ANDROID APK
                                          </a>
                                        )}
                                        {buildStatus.ios_url && (
                                          <a 
                                            href={buildStatus.ios_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-mono text-sm"
                                          >
                                            <Download className="w-4 h-4" /> DOWNLOAD IOS IPA
                                          </a>
                                        )}

                                        <button 
                                          onClick={() => {
                                            setIsDone(false);
                                            setBuildStatus(null);
                                            setRequestId(null);
                                            setAppName('');
                                            setWebsiteUrl('');
                                          }}
                                          className="mt-4 text-xs font-mono text-gray-500 hover:text-neon-cyan transition-colors text-center w-full"
                                        >
                                          NEW BUILD SEQUENCE
                                        </button>
                                      </motion.div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </form>
                          </div>
                        </div>

                        {/* Documentation Section */}
                        <div className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-6">
                          <h3 className="text-lg font-mono font-bold text-neon-cyan mb-6 flex items-center justify-center gap-2">
                            <LayoutTemplate className="w-4 h-4" /> BUILD PROCESS
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                              <div className="w-8 h-8 rounded-lg border border-neon-cyan/30 flex items-center justify-center shrink-0">
                                <Code className="w-4 h-4 text-neon-cyan" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-mono font-bold text-neon-cyan">1. CONFIGURE</h4>
                                <p className="text-xs font-mono text-gray-400 mt-1">Enter your app name and website URL to begin the wrapping process.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 items-start">
                              <div className="w-8 h-8 rounded-lg border border-neon-cyan/30 flex items-center justify-center shrink-0">
                                <Layers className="w-4 h-4 text-neon-cyan" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-mono font-bold text-neon-cyan">2. NATIVE WRAPPING</h4>
                                <p className="text-xs font-mono text-gray-400 mt-1">We generate native Android and iOS configurations optimized for your website.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 items-start">
                              <div className="w-8 h-8 rounded-lg border border-neon-cyan/30 flex items-center justify-center shrink-0">
                                <Cpu className="w-4 h-4 text-neon-cyan" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-mono font-bold text-neon-cyan">3. CLOUD COMPILATION</h4>
                                <p className="text-xs font-mono text-gray-400 mt-1">Our cloud runners sign, compile, and prepare both APK and IPA packages.</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 border border-neon-cyan/20 rounded-lg text-center bg-neon-cyan/5">
                            <CheckCircle2 className="w-5 h-5 text-neon-green mx-auto mb-2" />
                            <p className="text-xs font-mono text-gray-400">UNLIMITED ACCESS • NO RESTRICTIONS • FREE TIER ACTIVE</p>
                          </div>

                          <div className="mt-6 text-center">
                            <div className="text-[10px] font-mono text-gray-600 mb-1">POWERED BY</div>
                            <div className="text-sm font-mono font-bold text-neon-cyan">JNATIVE ENGINE v2.0</div>
                          </div>
                        </div>
                      </>
                    )}

                    {activeView === 'monitor' && (
                      <div className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Activity className="w-5 h-5 text-neon-cyan" />
                          <h2 className="text-xl font-mono font-bold text-neon-cyan">SYSTEM MONITOR</h2>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">BUILD QUEUE</div>
                            <div className="text-2xl font-mono text-neon-green">0</div>
                          </div>
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">ACTIVE BUILDS</div>
                            <div className="text-2xl font-mono text-neon-cyan">0</div>
                          </div>
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-1">COMPLETED</div>
                            <div className="text-2xl font-mono text-neon-green">{history.length}</div>
                          </div>
                        </div>
                        
                        <div className="border border-neon-cyan/20 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-2">API STATUS</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                            <span className="text-xs font-mono text-neon-green">CONNECTED</span>
                            <span className="text-xs font-mono text-gray-500 ml-auto">LATENCY: 45ms</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeView === 'logs' && (
                      <div className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Terminal className="w-5 h-5 text-neon-cyan" />
                          <h2 className="text-xl font-mono font-bold text-neon-cyan">ACTIVITY LOGS</h2>
                        </div>
                        
                        <div className="h-96 bg-black/80 border border-neon-cyan/20 rounded-lg p-4 font-mono text-xs space-y-1 overflow-y-auto">
                          <div className="text-neon-green">[SYSTEM] &gt; Web2Native interface initialized</div>
                          <div className="text-gray-400">[API] &gt; Gateway connection established</div>
                          <div className="text-neon-cyan">[BUILDER] &gt; Ready to accept build requests</div>
                          <div className="text-gray-400">[STORAGE] &gt; History cache loaded</div>
                          <div className="text-neon-green">[STATUS] &gt; All systems operational</div>
                          <div className="animate-pulse text-neon-cyan mt-2">[WAITING] &gt; _</div>
                        </div>
                      </div>
                    )}

                    {activeView === 'system' && (
                      <div className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Shield className="w-5 h-5 text-neon-cyan" />
                          <h2 className="text-xl font-mono font-bold text-neon-cyan">SYSTEM CONFIGURATION</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-2">WEB2NATIVE CORE</div>
                            <div className="text-sm font-mono text-neon-cyan">v2.0.0</div>
                          </div>
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-2">API VERSION</div>
                            <div className="text-sm font-mono text-neon-cyan">v1.0.0</div>
                          </div>
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-2">ENVIRONMENT</div>
                            <div className="text-sm font-mono text-neon-green">PRODUCTION</div>
                          </div>
                          <div className="border border-neon-cyan/20 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-2">STATUS</div>
                            <div className="text-sm font-mono text-neon-green">OPERATIONAL</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </motion.div>
    </>
  );
}