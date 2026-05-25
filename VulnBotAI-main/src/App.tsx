import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ShieldAlert, 
  Terminal, 
  LayoutDashboard, 
  Search, 
  FileText, 
  Settings as SettingsIcon,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe as GlobeIcon,
  Cpu,
  Lock,
  ChevronRight,
  Loader2,
  BarChart3,
  ExternalLink,
  Download,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Send
} from 'lucide-react';
import Globe from './components/Globe';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import AuthPage from './components/AuthPage';
import MaintenancePage from './components/MaintenancePage';
import SettingsPage from './components/SettingsPage';
import DocumentationPage from './components/DocumentationPage';
import SafetyGuidelinesPage from './components/SafetyGuidelinesPage';
import AdminPanel from './components/AdminPanel';
import AcademicReportPage from './components/AcademicReportPage';

// --- Types ---
type Page = 'landing' | 'dashboard' | 'scanner' | 'results' | 'reports' | 'settings' | 'documentation' | 'safety' | 'admin';

// --- Components ---

const Navbar = ({ 
  currentPage, 
  setPage,
  currentUser,
  onLogout,
  isOperatorAdmin
}: { 
  currentPage: Page; 
  setPage: (p: Page) => void;
  currentUser: string | null;
  onLogout: () => void;
  isOperatorAdmin: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Scanner', icon: Search },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setPage('landing')}
      >
        <div className="w-10 h-10 bg-vuln-accent rounded-lg flex items-center justify-center shadow-neon">
          <ShieldAlert className="text-vuln-bg w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tighter text-glow">VULNBOT <span className="text-vuln-accent">AI</span></span>
      </div>

      {/* Desktop Nav */}
      {currentUser && (
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${currentPage === item.id ? 'text-vuln-accent' : 'text-vuln-muted hover:text-white'}`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="h-5 w-[1px] bg-white/15" />

          {/* User info & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-vuln-muted max-w-[120px] truncate" title={currentUser}>
              OP: {currentUser.split('@')[0].toUpperCase()}
            </span>
            <button 
              onClick={onLogout}
              className="text-xs font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {currentUser && (
        <button className="md:hidden text-white cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      )}

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass p-6 flex flex-col gap-4 md:hidden border-b border-white/10"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id as Page);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-4 py-2 text-left cursor-pointer ${currentPage === item.id ? 'text-vuln-accent' : 'text-vuln-muted'}`}
              >
                <item.icon size={20} />
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}
            <div className="h-[1px] bg-white/10 my-1" />

            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-mono text-vuln-muted truncate">
                OP: {currentUser}
              </span>
              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="text-xs font-bold uppercase py-2 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-vuln-accent/10 border border-vuln-accent/20 rounded-full text-vuln-accent text-sm font-medium mb-6">
            <Cpu size={14} />
            <span>Next-Gen Security Analysis</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-6">
            AI-POWERED <br />
            <span className="text-vuln-accent text-glow">VULNERABILITY</span> <br />
            SCANNER
          </h1>
          <p className="text-vuln-muted text-xl max-w-xl mb-10 leading-relaxed">
            Automated reconnaissance and professional penetration testing in minutes. 
            Powered by Gemini AI to transform raw technical data into executive-grade findings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-vuln-accent text-vuln-bg font-bold rounded-xl shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2 group"
            >
              START FREE SCAN
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-white/10 hover:bg-white/5 font-bold rounded-xl transition-all">
              VIEW SAMPLE REPORT
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square"
        >
          <div className="absolute inset-0 bg-vuln-accent/5 blur-[120px] rounded-full" />
          <Globe />
        </motion.div>
      </div>

      <section className="mt-20 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Enterprise Grade Tools</h2>
          <p className="text-vuln-muted">Integrated with the world's most trusted security analysis tools.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { title: 'Nmap', desc: 'Industry standard port scanning & service discovery.', icon: Terminal },
            { title: 'SQLMap', desc: 'Automatic SQL injection and database takeover tool.', icon: ShieldAlert },
            { title: 'Subfinder', desc: 'Passive subdomain discovery tool.', icon: Search },
            { title: 'Wappalyzer', desc: 'Technology stack and CMS profiling.', icon: GlobeIcon },
            { title: 'WHOIS', desc: 'Domain registration and ownership records.', icon: FileText },
            { title: 'DNS Analysis', desc: 'Comprehensive DNS record verification.', icon: Zap },
            { title: 'SSL/TLS', desc: 'Certificate health and cipher suite audit.', icon: Lock },
            { title: 'Gemini AI', desc: 'Intelligent findings analysis and reporting.', icon: Cpu },
          ].map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 glass rounded-2xl hover:border-vuln-accent/30 transition-all cursor-default"
            >
              <tool.icon className="text-vuln-accent mb-4" size={24} />
              <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
              <p className="text-vuln-muted text-sm">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ScannerPage = ({ onScanStart }: { onScanStart: (target: string, targetType: string, mode: string, confirmed: boolean) => void }) => {
  const [target, setTarget] = useState('');
  const [type, setType] = useState('domain');
  const [mode, setMode] = useState('Basic Scan');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const scanModes = [
    { name: 'Quick Recon', desc: 'Robots, DNS, WHOIS, Headers' },
    { name: 'Basic Scan', desc: 'Recon + Ports + Subdomains' },
    { name: 'Medium Scan', desc: 'Basic + Services + VirusTotal' },
    { name: 'Advanced Scan', desc: 'Medium + SQLMap + Files' },
    { name: 'Full Pentest', desc: 'Comprehensive Audit + AI' },
  ];

  const validateTarget = () => {
    if (!target) return 'Target is required';
    if (type === 'domain') {
       if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(target)) return 'Invalid domain name';
    } else if (type === 'ipv4') {
       if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(target)) return 'Invalid IPv4 address';
    }
    return '';
  };

  const handleStart = () => {
    const err = validateTarget();
    if (err) {
      setError(err);
      return;
    }
    if (!confirmed) {
      setError('You must confirm authorization');
      return;
    }
    onScanStart(target, type, mode, confirmed);
  };

  return (
    <div className="pt-24 min-h-screen px-6 flex items-center justify-center pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Search size={120} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-4xl font-bold mb-1">New Security Scan</h2>
            <p className="text-vuln-muted text-lg">Initialize automated reconnaissance pipeline.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-vuln-muted mb-3 uppercase tracking-wider">Target Type</label>
                <div className="flex gap-2">
                  {['domain', 'ipv4', 'ipv6'].map((t) => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setError(''); }}
                      className={`flex-1 py-2 rounded-lg border transition-all font-bold uppercase text-[10px] ${type === t ? 'bg-vuln-accent/10 border-vuln-accent text-vuln-accent shadow-neon' : 'border-white/10 hover:bg-white/5 text-vuln-muted'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-vuln-muted mb-3 uppercase tracking-wider">Target Address</label>
                <div className="relative font-mono">
                  <input
                    type="text"
                    placeholder={type === 'domain' ? 'example.com' : '192.168.1.1'}
                    value={target}
                    onChange={(e) => { setTarget(e.target.value); setError(''); }}
                    className="w-full bg-vuln-bg/50 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-vuln-accent transition-all placeholder:text-white/20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-vuln-accent/10 rounded-lg text-vuln-accent">
                    <Search size={18} />
                  </div>
                </div>
                {error && <p className="text-red-400 mt-2 text-sm flex items-center gap-1"><AlertTriangle size={14} /> {error}</p>}
              </div>

              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2 text-xs">
                  <AlertTriangle size={14} />
                  LEGAL DISCLAIMER
                </h4>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="w-4 h-4 rounded border-red-500/40 bg-transparent text-red-500 focus:ring-red-500"
                    />
                  </div>
                  <span className="text-[10px] text-vuln-muted leading-relaxed group-hover:text-white transition-colors">
                    I confirm that I own this target or have explicit written permission to test it. Unauthorized scanning may violate laws.
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vuln-muted mb-3 uppercase tracking-wider">Scan Mode</label>
              <div className="space-y-2">
                {scanModes.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMode(m.name)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${mode === m.name ? 'bg-vuln-accent/10 border-vuln-accent shadow-neon' : 'border-white/10 hover:bg-white/5'}`}
                  >
                    <p className={`font-bold ${mode === m.name ? 'text-vuln-accent' : 'text-white'}`}>{m.name}</p>
                    <p className="text-[10px] text-vuln-muted">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleStart}
            disabled={!target || !confirmed}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${(!target || !confirmed) ? 'bg-white/5 border border-white/5 text-white/20' : 'bg-vuln-accent text-vuln-bg shadow-neon hover:shadow-neon-strong'}`}
          >
            <Zap size={24} />
            INITIALIZE VULNBOT PIPELINE
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const LiveScanPage = ({ scanId, onFinish }: { scanId: string, onFinish: (id: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/scan/${scanId}/status`);
        if (!res.ok) {
          setData({ status: 'error', progress: 0, logs: ['[ERROR] Scan session lost.'] });
          clearInterval(interval);
          return;
        }
        const json = await res.json();
        setData(json);
        if (json.status === 'completed' || json.status === 'error') {
          clearInterval(interval);
          if (json.status === 'completed') setTimeout(() => onFinish(scanId), 2000);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [scanId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data?.logs]);

  if (!data) return (
    <div className="pt-24 flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-vuln-accent" size={64} />
    </div>
  );

  const modeToolsMap: Record<string, number> = {
    "Quick Recon": 7,
    "Basic Scan": 11,
    "Medium Scan": 16,
    "Advanced Scan": 20,
    "Full Pentest": 24
  };

  const totalToolsCount = data.totalTools || modeToolsMap[data.mode] || 11;
  const completedToolsCount = data.completedTools || 0;

  return (
    <div className="pt-24 min-h-screen px-6 max-w-7xl mx-auto pb-20">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-vuln-accent font-bold uppercase tracking-widest text-sm mb-2">Operation Active</p>
                <h2 className="text-4xl font-bold">Scanning Pipeline</h2>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-mono text-vuln-accent font-bold">{data.progress}%</span>
                  <span className="text-xs font-bold text-vuln-muted uppercase tracking-widest mt-1">
                    {completedToolsCount}/{totalToolsCount} Tools Completed
                  </span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.progress}%` }}
                className="h-full bg-vuln-accent rounded-full shadow-neon"
              />
            </div>

            <div className="mt-8 flex justify-between items-center px-2">
              <div className="flex gap-1">
                {Array.from({ length: totalToolsCount }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i < completedToolsCount ? 'bg-vuln-accent shadow-neon' : 'bg-white/10'}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-vuln-muted uppercase">Engine Coverage</span>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Status', value: data.status, color: 'text-vuln-accent' },
                { label: 'Completion', value: `${Math.round((completedToolsCount / totalToolsCount) * 100)}%`, color: 'text-white' },
                { label: 'Findings', value: data.findingsCount || 0, color: 'text-red-400' },
                { label: 'Scan ID', value: scanId.slice(0, 8), color: 'text-vuln-muted' },
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-vuln-muted uppercase font-bold mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold truncate ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Terminal size={18} className="text-vuln-accent" />
              <span className="font-mono text-sm font-bold">LIVE_SERVER_LOGS.EXE</span>
            </div>
            <div 
              ref={scrollRef}
              className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2"
            >
              {data.logs.map((log: string, i: number) => (
                <div key={i} className="text-vuln-muted border-l-2 border-white/10 pl-4 py-1 hover:text-white hover:border-vuln-accent transition-all">
                  <span className="text-vuln-accent/50 mr-2">[{i.toString().padStart(3, '0')}]</span>
                  {log}
                </div>
              ))}
              {data.status === 'running' && (
                <div className="flex items-center gap-2 text-vuln-accent">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Awaiting next batch...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-vuln-accent/10 rounded-xl text-vuln-accent">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-bold">AI Analysis</h3>
            </div>
            <p className="text-vuln-muted leading-relaxed mb-6">
              Gemini is monitoring live tool outputs to synthesize vulnerabilities in real-time. Results will be mapped to OWASP categories.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-sm font-medium">Model</span>
                <span className="text-sm font-mono text-vuln-accent">Gemini 3 Flash</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-sm font-medium">Mode</span>
                <span className="text-sm font-mono text-vuln-accent">Deep Security</span>
              </div>
            </div>
          </div>

          <div className="h-full border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-50 relative overflow-hidden">
             <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1],
                 opacity: [0.1, 0.3, 0.1]
               }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute inset-0 bg-vuln-accent rounded-full blur-[100px]"
             />
             <BarChart3 size={48} className="mb-4" />
             <p className="text-sm font-bold uppercase tracking-widest mb-1 font-mono">Visualization Engine</p>
             <p className="text-xs text-vuln-muted">Compiling data structures for 3D mapping...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chunk text by lines to support clean pagination across PDF pages
const chunkText = (text: string, maxLines = 45): string[] => {
  if (!text) return [""];
  const lines = text.split('\n');
  const chunks: string[] = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join('\n'));
  }
  return chunks;
};

const ResultsPage = ({ results }: { results: any }) => {
  const [activeTab, setActiveTab ] = useState('summary');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handleVoiceExportPDF = () => {
      if (!isExporting) {
        handleDownloadPDF();
      }
    };
    const handleVoiceExportJSON = () => {
      handleDownloadJSON();
    };

    window.addEventListener('trigger-voice-export-pdf', handleVoiceExportPDF);
    window.addEventListener('trigger-voice-export-json', handleVoiceExportJSON);

    return () => {
      window.removeEventListener('trigger-voice-export-pdf', handleVoiceExportPDF);
      window.removeEventListener('trigger-voice-export-json', handleVoiceExportJSON);
    };
  }, [results, isExporting]);

  const stats = [
    { label: 'Critical', value: results.findings.filter((f:any) => f.severity === 'Critical').length, color: '#ef4444' },
    { label: 'High', value: results.findings.filter((f:any) => f.severity === 'High').length, color: '#f97316' },
    { label: 'Medium', value: results.findings.filter((f:any) => f.severity === 'Medium').length, color: '#eab308' },
    { label: 'Low', value: results.findings.filter((f:any) => f.severity === 'Low').length, color: '#22c55e' },
  ];

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `VULNBOT_REPORT_${results.target.replace(/\./g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById('pdf-source');
    if (!element) {
      setIsExporting(false);
      return;
    }
    
    try {
      const pages = element.querySelectorAll('.pdf-page');
      if (pages.length === 0) {
        setIsExporting(false);
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;

        // Render each page individually with high scaling factor of 3 to make text crystal clear
        const canvas = await html2canvas(pageEl, {
          backgroundColor: '#020617',
          scale: 3, // High DPI scaling for vector crispness
          logging: false,
          useCORS: true,
          allowTaint: true,
          width: 1200,
          height: 1697, // Force standard A4 proportions exactly
          windowWidth: 1200,
          windowHeight: 1697,
          onclone: (clonedDoc) => {
            const cleanCSS = (css: string) => {
              return css
                .replace(/oklab\([^)]+\)/gi, '#cbd5e1')
                .replace(/oklch\([^)]+\)/gi, '#00E5FF')
                .replace(/color-mix\([^)]+\)/gi, 'rgba(255,255,255,0.1)')
                .replace(/--[\w-]+:\s*(oklab|oklch)[^;}]*/gi, '');
            };

            clonedDoc.querySelectorAll('style').forEach(styleTag => {
               styleTag.innerHTML = cleanCSS(styleTag.innerHTML);
            });

            clonedDoc.querySelectorAll('[style]').forEach((el: any) => {
              if (el.style.cssText) {
                el.style.cssText = cleanCSS(el.style.cssText);
              }
            });

            // Make sure target page is beautifully padded and styled
            const clonedPages = clonedDoc.querySelectorAll('.pdf-page');
            clonedPages.forEach((cl: any) => {
              cl.style.width = '1200px';
              cl.style.height = '1697px';
              cl.style.padding = '90px 80px';
              cl.style.boxSizing = 'border-box';
              cl.style.backgroundColor = '#020617';
            });

            // Inject high-contrast styles, text-smoothing, and font definitions
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
              
              .pdf-page, .pdf-page * {
                font-family: "Space Grotesk", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                text-rendering: optimizeLegibility !important;
              }
              pre, code, .font-mono, pre *, code * {
                font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace !important;
              }
              pre {
                background-color: #05070f !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                padding: 24px !important;
                border-radius: 16px !important;
                overflow: hidden !important;
                white-space: pre-wrap !important;
                word-break: break-all !important;
                display: block !important;
                font-size: 11px !important;
                line-height: 1.6 !important;
                max-width: 100% !important;
                opacity: 1 !important;
              }
              code {
                color: #00E5FF !important;
                background: transparent !important;
                opacity: 1 !important;
              }
              .text-vuln-accent {
                color: #00E5FF !important;
                opacity: 1 !important;
              }
              .text-vuln-muted {
                color: #94A3B8 !important;
                opacity: 1 !important;
              }
              .text-white {
                color: #ffffff !important;
                opacity: 1 !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });

        if (i > 0) {
          pdf.addPage();
        }

        // Fill background with same dark twilights
        pdf.setFillColor(2, 6, 23);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        const imgData = canvas.toDataURL('image/png', 1.0);
        // Omit downsampling by using default standard compression for clear embedding
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'NONE');
      }
      
      pdf.save(`VULNBOT_REPORT_${results.target.replace(/\./g, '_')}_${results.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const chartData = stats.map(s => ({ name: s.label, value: s.value || 0, fill: s.color }));

  return (
    <div className="pt-24 min-h-screen px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-vuln-accent mb-2">
            <CheckCircle2 size={18} />
            <span className="font-bold uppercase tracking-tighter text-sm">Scan Completed</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter">Security Results</h1>
          <p className="text-vuln-muted mt-2">Detailed audit for <span className="text-white font-mono">{results.target}</span></p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadJSON}
            className="px-6 py-3 glass rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <Download size={18} />
            EXPORT JSON
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-6 py-3 bg-vuln-accent text-vuln-bg rounded-xl font-bold flex items-center gap-2 shadow-neon hover:shadow-neon-strong transition-all disabled:opacity-50 no-print"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
            {isExporting ? 'GENERATING...' : 'GENERATE PDF'}
          </button>
        </div>
      </div>

      {/* Hidden high-fidelity report source for PDF generation - positioned inside viewport with -z-50 and sub-opacity to trigger hardware-accelerated crisp font antialiasing */}
      <div 
        id="pdf-source" 
        className="absolute top-0 left-0 w-[1200px] bg-[#020617] p-0 flex flex-col gap-0 pointer-events-none select-none"
        style={{ opacity: 0.01, zIndex: -100, overflow: 'hidden' }}
      >
        
        {/* PAGE 1: COVER & EXECUTIVE SUMMARY */}
        <div className="pdf-page">
          <div>
            <div className="border-b-4 border-vuln-accent pb-8 mb-12 flex justify-between items-end">
              <div>
                <p className="text-vuln-accent font-black tracking-[0.2em] text-sm mb-2">SECURITY AUDIT REPORT</p>
                <h1 className="text-6xl font-black text-white italic">VULNBOT <span className="text-vuln-accent">AI</span></h1>
                <p className="text-vuln-muted mt-2 font-mono italic">CONFIDENTIAL // AI-GENERATED CYBER INTELLIGENCE</p>
              </div>
              <div className="text-right">
                <p className="text-vuln-muted text-xs font-bold mb-1">TARGET INFRASTRUCTURE</p>
                <p className="text-2xl font-mono text-white">{results.target}</p>
                <p className="text-vuln-muted text-xs mt-2 uppercase font-bold tracking-widest">{new Date(results.timestamp).toUTCString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-12">
              {stats.map(stat => (
                <div key={stat.label} className="p-8 border-2 rounded-3xl" style={{ borderColor: stat.color + '44', backgroundColor: stat.color + '11' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-vuln-muted mb-2">{stat.label} RISK</p>
                  <p className="text-6xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <section className="mb-0">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-vuln-accent" />
                01. EXECUTIVE SUMMARY
              </h2>
              <div className="p-10 bg-white/5 rounded-3xl border border-white/10 leading-relaxed text-vuln-muted text-lg">
                <p className="mb-6">
                  VULNBOT AI has completed a comprehensive security assessment of <span className="text-white font-bold">{results.target}</span>. 
                  The audit utilized advanced pattern matching and heuristic analysis to identify <span className="text-red-400 font-bold">{results.findings.length}</span> vulnerabilities across the attack surface.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-vuln-accent/10 border border-vuln-accent/20 rounded-2xl">
                    <p className="text-xs font-bold text-vuln-accent mb-1 uppercase tracking-widest">Overall Risk Profile</p>
                    <p className="text-3xl font-black text-white tracking-tighter uppercase">
                      {stats[0].value > 0 ? 'CRITICAL EXPOSURE' : stats[1].value > 0 ? 'HIGH EXPOSURE' : 'MODERATE EXPOSURE'}
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-xs font-bold text-vuln-muted mb-1 uppercase tracking-widest">Assessment Scope</p>
                    <p className="text-3xl font-black text-white tracking-tighter uppercase">EXTERNAL_BLACKBOX</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="pt-8 border-t border-white/10 flex justify-between items-center text-vuln-muted text-[10px] uppercase font-black tracking-widest">
            <div className="flex items-center gap-4">
              <span className="text-vuln-accent">VULNBOT AI ENGINE</span>
              <span className="opacity-30">|</span>
              <span>ID: {results.id.toUpperCase()}</span>
            </div>
            <div className="italic">AUTHENTICATED AUDIT REPORT // PAGE 1</div>
          </div>
        </div>

        {/* PAGE 2: METHODOLOGY */}
        <div className="pdf-page">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-12">
              <span className="text-xs font-bold text-vuln-muted tracking-widest">VULNBOT AI // SECURITY AUDIT</span>
              <span className="text-xs font-mono text-vuln-accent">{results.target}</span>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-vuln-accent" />
                02. METHODOLOGY
              </h2>
              <p className="text-base text-vuln-muted leading-relaxed mb-8">
                Our scanning engine executes non-intrusive security auditing based on industry standard frameworks, including the OWASP Top 10, CWE database, and CVSS v3.1 threat intelligence. The audit process is structured into four main operational phases:
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: 'Reconnaissance', desc: 'Passive and active intel collection for surface mapping.' },
                  { title: 'Vulnerability Analysis', desc: 'Cross-referencing services against known exploit databases.' },
                  { title: 'AI Heuristics', desc: 'Gemini-powered analysis of configurations for logical flaws.' },
                  { title: 'Risk Scoring', desc: 'Standardized CVSS v3.1 calculations for objective severity assessment.' }
                ].map(m => (
                  <div key={m.title} className="p-8 border border-white/5 rounded-3xl bg-white/5">
                    <h4 className="text-xl font-bold text-white mb-2">{m.title}</h4>
                    <p className="text-sm text-vuln-muted leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-vuln-accent/5 border border-vuln-accent/20 rounded-3xl">
              <p className="text-xs font-bold text-vuln-accent uppercase tracking-widest mb-2">Cognitive Posture Assessment</p>
              <p className="text-sm text-blue-100 leading-relaxed mb-0">
                This automated report has been verified using real-time security model inferences. In accordance with zero-trust constraints, all verified vulnerabilities require urgent patching. For any critical CVE issues, refer to section 03 below for immediate step-by-step remediation commands.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-white/10 flex justify-between items-center text-vuln-muted text-[10px] uppercase font-black tracking-widest">
            <div className="flex items-center gap-4">
              <span className="text-vuln-accent">VULNBOT AI ENGINE</span>
              <span className="opacity-30">|</span>
              <span>ID: {results.id.toUpperCase()}</span>
            </div>
            <div className="italic">AUTHENTICATED AUDIT REPORT // PAGE 2</div>
          </div>
        </div>

        {/* PAGES 3+: VULNERABILITY DETAILS (ONE PER PAGE) */}
        {results.findings.map((f: any, idx: number) => {
          const currentPageNum = 3 + idx;
          return (
            <div key={idx} className="pdf-page">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
                  <span className="text-xs font-bold text-red-400 tracking-widest uppercase">SECTION 03 // VULNERABILITY DETAILS</span>
                  <span className="text-xs font-mono text-vuln-accent">FINDING {idx + 1} OF {results.findings.length}</span>
                </div>

                <div className="flex justify-between items-start mb-8 gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 animate-none">
                      <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase text-vuln-bg" style={{ backgroundColor: f.severity === 'Critical' ? '#ef4444' : f.severity === 'High' ? '#f97316' : '#eab308' }}>
                        {f.severity}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-vuln-accent bg-vuln-accent/10 px-3 py-1 rounded-full border border-vuln-accent/30">{f.owasp}</span>
                      {f.cwe && <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/30">{f.cwe}</span>}
                    </div>
                    <h3 className="text-3xl font-black text-white leading-tight">{f.name}</h3>
                  </div>
                  <div className="text-right bg-black/40 p-4 rounded-2xl border border-white/5 shrink-0">
                    <p className="text-xs text-vuln-muted uppercase font-black tracking-widest mb-1">CVSS v3.1</p>
                    <p className="text-5xl font-black text-white leading-none mb-2">{f.cvss}</p>
                    <p className="text-[9px] font-mono text-vuln-accent opacity-60 max-w-[150px] break-all">{f.cvss_vector}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-black uppercase text-vuln-accent mb-2 tracking-[0.2em] opacity-80">Affected Component</p>
                      <p className="text-sm font-mono text-white bg-white/5 p-3 rounded-xl border border-white/5 break-all">{f.affected_url || results.target}</p>
                    </div>
                    {f.parameter && (
                      <div>
                        <p className="text-xs font-black uppercase text-vuln-accent mb-2 tracking-[0.2em] opacity-80">Parameters</p>
                        <p className="text-sm font-mono text-white bg-white/5 p-3 rounded-xl border border-white/5">{f.parameter}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black uppercase text-vuln-accent mb-2 tracking-[0.2em] opacity-80">Description</p>
                      <p className="text-sm text-vuln-muted leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-black uppercase text-red-400 mb-2 tracking-[0.2em] opacity-80">Impact Analysis</p>
                      <p className="text-sm text-red-300 leading-relaxed font-medium bg-red-400/5 p-4 rounded-xl border border-red-400/10 italic">"{f.impact}"</p>
                    </div>
                    {f.evidence && (
                      <div>
                        <p className="text-xs font-black uppercase text-vuln-accent mb-2 tracking-[0.2em] opacity-80">Evidence / Proof of Concept</p>
                        <pre className="p-4 bg-[#0a0f1d] border border-white/10 rounded-xl max-w-full overflow-hidden !text-[11px] leading-relaxed max-h-[160px] overflow-y-auto w-full">
                          <code className="text-vuln-accent font-mono whitespace-pre-wrap break-all">{f.evidence}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-vuln-accent/5 border border-vuln-accent/20 rounded-2xl mb-6">
                  <p className="text-xs font-black uppercase text-vuln-accent mb-2 tracking-[0.2em]">Mitigation & Remediation</p>
                  <p className="text-sm text-blue-100 leading-relaxed">{f.remediation}</p>
                </div>

                {f.references && f.references.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase text-vuln-muted mb-2 tracking-[0.2em]">References & External Intelligence</p>
                    <div className="flex flex-wrap gap-2">
                      {f.references.map((ref: string, rIdx: number) => (
                        <span key={rIdx} className="text-[9px] font-mono text-vuln-accent bg-vuln-accent/5 px-2 py-0.5 rounded border border-vuln-accent/10">{ref}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-between items-center text-vuln-muted text-[10px] uppercase font-black tracking-widest">
                <div className="flex items-center gap-4">
                  <span className="text-vuln-accent">VULNBOT AI ENGINE</span>
                  <span className="opacity-30">|</span>
                  <span>ID: {results.id.toUpperCase()}</span>
                </div>
                <div className="italic">AUTHENTICATED AUDIT REPORT // PAGE {currentPageNum}</div>
              </div>
            </div>
          );
        })}

        {/* APPENDICES: RAW AUDIT LOG TOOL OUTPUTS */}
        {Object.entries(results.results || {}).map(([tool, output]: [any, any], idx: number) => {
          const rawText = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
          const chunks = chunkText(rawText, 50); // paginated to 50 lines per page for zero scrollbars/overflow
          
          return chunks.map((chunk, chunkIdx) => {
            const pageNumLabel = `${idx + 1}.${chunkIdx + 1}`;
            return (
              <div key={`${tool}-${chunkIdx}`} className="pdf-page">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
                    <span className="text-xs font-bold text-vuln-muted tracking-widest uppercase">SECTION 04 // TECHNICAL APPENDIX ({pageNumLabel})</span>
                    <span className="text-xs font-mono text-vuln-accent">{tool.toUpperCase()} CONSOLE OUTPUT {chunks.length > 1 ? `[PART ${chunkIdx + 1}/${chunks.length}]` : ""}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-6">
                      <h4 className="text-vuln-accent font-black uppercase text-sm tracking-[0.3em]">{tool} OUTPUT STREAM</h4>
                      <div className="h-[1px] flex-1 bg-vuln-accent/10" />
                    </div>
                    
                    <pre className="bg-[#05070f] p-8 rounded-3xl border border-white/5 font-mono text-[9px] leading-relaxed max-h-[1100px] w-full block">
                      <code className="text-vuln-accent font-mono break-all whitespace-pre-wrap">{chunk}</code>
                    </pre>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-center text-vuln-muted text-[10px] uppercase font-black tracking-widest font-mono">
                  <div className="flex items-center gap-4">
                    <span className="text-vuln-accent">VULNBOT AI ENGINE</span>
                    <span className="opacity-30">|</span>
                    <span>ID: {results.id.toUpperCase()}</span>
                  </div>
                  <div className="italic">AUTHENTICATED AUDIT REPORT // APPENDIX {tool.toUpperCase()} {chunks.length > 1 ? `[${chunkIdx + 1}/${chunks.length}]` : ""}</div>
                </div>
              </div>
            );
          });
        })}

      </div>


      <div id="results-content" className="p-4 rounded-3xl">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {stats.map(stat => (
            <div key={stat.label} className="glass p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all no-print" style={{ color: stat.color }}>
                <ShieldAlert size={64} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-vuln-muted mb-2">{stat.label} RISK</p>
              <p className="text-5xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] overflow-hidden">
              <div className="flex border-b border-white/10">
                {['summary', 'findings', 'raw_data'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 font-bold uppercase text-xs tracking-widest transition-all ${activeTab === tab ? 'bg-vuln-accent/10 text-vuln-accent border-b-2 border-vuln-accent' : 'text-vuln-muted hover:text-white'}`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="p-8 font-sans">
                {activeTab === 'summary' && (
                  <div className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-12">
                      <div>
                        <h3 className="text-2xl font-bold mb-6">Risk Distribution</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-6">Target Metadata</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Type', value: results.targetType },
                            { label: 'Scan Mode', value: results.mode },
                            { label: 'Timestamp', value: new Date(results.timestamp).toLocaleString() },
                            { label: 'Engine', value: 'VULNBOT v1.02' },
                          ].map(m => (
                            <div key={m.label} className="flex justify-between py-3 border-b border-white/5">
                              <span className="text-vuln-muted font-medium">{m.label}</span>
                              <span className="font-mono text-vuln-accent">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'findings' && (
                  <div className="space-y-6">
                    {results.findings.map((f:any, i:number) => (
                      <div key={i} className="glass p-6 rounded-2xl border-l-4" style={{ borderColor: f.severity === 'Critical' ? '#ef4444' : f.severity === 'High' ? '#f97316' : '#eab308' }}>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-vuln-bg" style={{ backgroundColor: f.severity === 'Critical' ? '#ef4444' : f.severity === 'High' ? '#f97316' : '#eab308' }}>
                                {f.severity}
                              </span>
                              <span className="text-xs font-mono text-vuln-muted">{f.owasp || 'General'}</span>
                              {f.cwe && <span className="text-xs font-mono text-blue-400/80"> // {f.cwe}</span>}
                            </div>
                            <h3 className="text-xl font-bold">{f.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-vuln-muted uppercase font-bold">CVSS v3.1</p>
                            <p className="text-2xl font-mono font-bold text-white">{f.cvss}</p>
                            {f.cvss_vector && <p className="text-[10px] font-mono text-vuln-muted mt-1 max-w-[150px] truncate" title={f.cvss_vector}>{f.cvss_vector}</p>}
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-vuln-muted mb-1">Affected Link</p>
                              <p className="text-sm font-mono text-white break-all bg-black/20 p-2 rounded border border-white/5">{f.affected_url || results.target}</p>
                            </div>
                            {f.parameter && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-vuln-muted mb-1">Parameters</p>
                                <p className="text-sm font-mono text-white bg-black/20 p-2 rounded border border-white/5">{f.parameter}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-vuln-muted mb-1">Description</p>
                              <p className="text-vuln-muted text-sm leading-relaxed">{f.description}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-vuln-muted mb-1">Impact Analysis</p>
                              <p className="text-sm text-red-300/90 leading-relaxed bg-red-400/5 p-3 rounded-xl border border-red-400/10 italic">"{f.impact}"</p>
                            </div>
                            {f.evidence && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-vuln-muted mb-1">Evidence Snippet</p>
                                <pre className="text-[10px] font-mono bg-black/40 p-3 rounded-xl border border-white/5 text-vuln-accent/80 whitespace-pre-wrap overflow-hidden">{f.evidence}</pre>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-vuln-accent/5 border border-vuln-accent/10 rounded-xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-vuln-accent mb-2">Remediation Strategy</p>
                          <p className="text-xs text-blue-200/90 leading-relaxed">{f.remediation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'raw_data' && (
                  <div className="font-mono text-xs text-vuln-muted space-y-6">
                    {Object.entries(results.results).map(([tool, output]: [any, any]) => (
                      <div key={tool} className="space-y-2">
                        <h4 className="text-vuln-accent text-sm font-bold uppercase tracking-widest border-b border-vuln-accent/20 pb-1">{tool} OUTPUT</h4>
                        <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">{output}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Expert Verdict</h3>
              <div className="p-6 bg-vuln-accent/5 rounded-2xl border border-vuln-accent/20 relative">
                <p className="text-vuln-muted text-sm leading-relaxed">
                  The automated analysis suggests a <span className="text-vuln-accent font-bold">MODERATE</span> risk exposure. Priority remediation is recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const DashboardPage = ({ setPage, onViewResults }: { setPage: (p: Page) => void, onViewResults: (scan: any) => void }) => {
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    const loadScans = async () => {
      try {
        const res = await fetch('/api/scans');
        if (!res.ok) {
          setScans([]);
          return;
        }
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setScans(Array.isArray(json) ? json : []);
        } catch (e) {
          console.error("Failed to parse scans JSON:", e);
          setScans([]);
        }
      } catch (e) {
        console.error("Fetch scans error:", e);
        setScans([]);
      }
    };
    loadScans();
  }, []);

  return (
    <div className="pt-24 min-h-screen px-6 max-w-7xl mx-auto pb-20">
       <div className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-5xl font-bold tracking-tighter">Command Center</h1>
             <p className="text-vuln-muted mt-2">Overview of all security operations.</p>
          </div>
          <button 
            onClick={() => setPage('scanner')}
            className="px-6 py-3 bg-vuln-accent text-vuln-bg rounded-xl font-bold flex items-center gap-2 shadow-neon hover:shadow-neon-strong transition-all"
          >
            <Zap size={18} />
            NEW SCAN
          </button>
       </div>

       <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Active Targets', value: scans.length, icon: GlobeIcon },
            { label: 'Total Findings', value: scans.reduce((acc, s) => acc + (s.findingsCount || 0), 0), icon: ShieldAlert },
            { label: 'Audit Reports', value: scans.filter(s => s.status === 'completed').length, icon: FileText },
          ].map(stat => (
            <div key={stat.label} className="glass p-8 rounded-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
                  <stat.icon size={64} className="text-vuln-accent" />
               </div>
               <p className="text-xs font-bold uppercase tracking-widest text-vuln-muted mb-2">{stat.label}</p>
               <p className="text-5xl font-black text-white">{stat.value}</p>
            </div>
          ))}
       </div>

       <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
          <div className="p-6 bg-white/5 border-b border-white/5 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
             <Terminal size={14} className="text-vuln-accent" />
             OPERATIONAL_LOGS.DB
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-vuln-muted text-[10px] uppercase font-bold border-b border-white/5">
                      <th className="px-8 py-4">Target</th>
                      <th className="px-8 py-4">Timestamp</th>
                      <th className="px-8 py-4">Severity</th>
                      <th className="px-8 py-4">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {scans.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-10 text-center text-vuln-muted font-mono italic">NO SCAN DATA DETECTED IN LOCAL CLUSTER</td>
                      </tr>
                   ) : (
                      scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-vuln-accent/10 flex items-center justify-center text-vuln-accent">
                                    <GlobeIcon size={14} />
                                 </div>
                                 <span className="font-mono text-white">{scan.target}</span>
                              </div>
                           </td>
                           <td className="px-8 py-4 text-vuln-muted text-sm">{new Date(scan.timestamp).toLocaleString()}</td>
                           <td className="px-8 py-4">
                              <div className="flex items-center gap-1">
                                 <div className={`w-2 h-2 rounded-full ${scan.status === 'completed' ? 'bg-vuln-accent shadow-neon' : scan.status === 'error' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'}`} />
                                 <span className="text-xs uppercase font-bold text-white">{scan.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-4">
                              <button 
                                onClick={() => onViewResults(scan)}
                                className="text-vuln-accent hover:text-white flex items-center gap-1 text-xs font-bold uppercase tracking-tighter disabled:opacity-30"
                                disabled={scan.status === 'running'}
                              >
                                 Details <ChevronRight size={14} />
                              </button>
                           </td>
                        </tr>
                      ))
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="pt-24 min-h-screen px-6 max-w-3xl mx-auto pb-20 text-center">
       <SettingsIcon size={64} className="text-vuln-muted mx-auto mb-6 opacity-20" />
       <h1 className="text-4xl font-bold mb-4">Under Deep Maintenance</h1>
       <p className="text-vuln-muted text-lg">System settings are currently locked by administrative override.</p>
    </div>
  );
};

// --- Voice Assistant Component ---

// --- AI Security Chatbot Component ---

const AIChatbot = ({ 
  currentPage, 
  onNavigate, 
  onStartScan 
}: { 
  currentPage: Page, 
  onNavigate: (page: Page) => void, 
  onStartScan: (target: string, mode: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [textCommand, setTextCommand] = useState("");
  const [chatbotError, setChatbotError] = useState("");

  const processChatCommand = async (text: string) => {
    if (!text.trim()) return;
    setChatbotError("");
    setLastMessage(text);
    
    const query = text.toLowerCase().trim();
    
    // Quick offline navigation matching for lightning-fast feedback
    if (query === "go to dashboard" || query === "navigate to dashboard" || query === "open dashboard" || query === "dashboard") {
      setAiResponse("Navigating to Command Center Dashboard.");
      onNavigate('dashboard');
      return;
    }
    if (query === "go to scanner" || query === "navigate to scanner" || query === "open scanner" || query === "scanner") {
      setAiResponse("Navigating to New Security Scan page.");
      onNavigate('scanner');
      return;
    }
    if (query === "go to reports" || query === "navigate to reports" || query === "open reports" || query === "reports") {
      setAiResponse("Opening security reports.");
      onNavigate('reports');
      return;
    }
    if (query === "go to settings" || query === "navigate to settings" || query === "open settings" || query === "settings") {
      setAiResponse("Opening settings console.");
      onNavigate('settings');
      return;
    }
    if (query === "go to documentation" || query === "open documentation" || query === "documentation" || query === "docs") {
      setAiResponse("Opening technical system documentation.");
      onNavigate('documentation');
      return;
    }
    if (query === "go to safety" || query === "open safety" || query === "safety guidelines" || query === "safety") {
      setAiResponse("Opening system safety and compliance guidelines.");
      onNavigate('safety');
      return;
    }
    if (query === "admin" || query === "go to admin" || query === "open admin" || query === "visit admin" || query === "admin panel" || query === "go to admin panel" || query.includes("command admin")) {
      setAiResponse("Elevated operator credentials recognized. Routing connection to Master Administration Command Deck.");
      onNavigate('admin');
      return;
    }
    if (query === "go to landing" || query === "go to home" || query === "navigate to home" || query === "home") {
      setAiResponse("Going back to home screen.");
      onNavigate('landing');
      return;
    }
    if (query === "export to pdf" || query === "generate pdf" || query === "download pdf" || query === "download report to pdf") {
      if (currentPage === 'results') {
        setAiResponse("Generating and downloading your high fidelity security PDF report.");
        window.dispatchEvent(new CustomEvent('trigger-voice-export-pdf'));
      } else {
        setAiResponse("You must be viewing a scan results page to export the PDF.");
      }
      return;
    }
    if (query === "export to json" || query === "download json") {
      if (currentPage === 'results') {
        setAiResponse("Exporting target data structures to JSON.");
        window.dispatchEvent(new CustomEvent('trigger-voice-export-json'));
      } else {
        setAiResponse("Please go to a scan results page first to export the JSON.");
      }
      return;
    }

    // Call server AI Assistant for intent parsing and security advice
    try {
      const response = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: { currentPage } })
      });
      if (!response.ok) throw new Error("Server error status");
      const data = await response.json();
      
      if (data.response) {
        setAiResponse(data.response);
      } else {
        setAiResponse("I processed your request but did not receive a server response.");
      }

      // Execute structured action if returned
      if (data.action) {
        const { type, page, target, mode } = data.action;
        
        if (type === 'NAVIGATE' && page) {
          onNavigate(page);
        } else if (type === 'START_SCAN' && target) {
          setAiResponse(`Initializing active security scan on ${target} in ${mode || 'Basic Scan'} mode.`);
          onStartScan(target, mode || 'Basic Scan');
        } else if (type === 'EXPORT_PDF') {
          if (currentPage === 'results') {
            window.dispatchEvent(new CustomEvent('trigger-voice-export-pdf'));
          } else {
            setAiResponse("PDF generation is only available when viewing a report.");
          }
        } else if (type === 'EXPORT_JSON') {
          if (currentPage === 'results') {
            window.dispatchEvent(new CustomEvent('trigger-voice-export-json'));
          } else {
            setAiResponse("JSON export is only available when viewing a report.");
          }
        }
      }
    } catch (error) {
      console.error(error);
      setAiResponse("Encountered connection problem with VulnBot Security hub.");
      setChatbotError("Connection failed. Check your local server cluster.");
    }
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textCommand.trim()) return;
    processChatCommand(textCommand);
    setTextCommand("");
  };

  return (
    <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass p-6 rounded-[2rem] border border-vuln-accent/30 shadow-neon max-w-sm w-[340px] pointer-events-auto flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-vuln-accent/10 flex items-center justify-center text-vuln-accent">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">VULNBOT AI CHATBOT</p>
                  <p className="text-[9px] text-vuln-muted font-mono uppercase tracking-widest">COGNITIVE SYSTEM ACTIVE</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-vuln-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation Log */}
            <div className="min-h-[140px] max-h-[220px] overflow-y-auto space-y-3 pr-1 font-sans">
              {!lastMessage && !aiResponse && (
                <div className="text-center py-4 text-vuln-muted text-xs">
                  <p className="font-bold text-white mb-1">Welcome Operator.</p>
                  <p>Ask or type system commands to control the scanning pipelines.</p>
                  <p className="font-mono text-[10px] text-vuln-accent mt-3">Try asking: "scan google.com" or "go to reports"</p>
                </div>
              )}

              {lastMessage && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-vuln-muted uppercase tracking-wider mb-1">Operator Command:</p>
                  <p className="text-xs text-white leading-relaxed italic">"{lastMessage}"</p>
                </div>
              )}
              
              {aiResponse && (
                <div className="bg-vuln-accent/5 p-3 rounded-2xl border border-vuln-accent/10">
                  <p className="text-[10px] font-bold text-vuln-accent uppercase tracking-wider mb-1">VulnBot AI Response:</p>
                  <p className="text-xs text-blue-100 leading-relaxed">{aiResponse}</p>
                </div>
              )}

              {chatbotError && (
                <p className="text-[10px] font-bold text-red-400 mt-2 text-center bg-red-400/5 py-1.5 px-3 rounded-lg border border-red-400/10">
                  {chatbotError}
                </p>
              )}
            </div>

            {/* Controls Row */}
            <form onSubmit={handleTextInputSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder='Type a command or question...'
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                className="flex-1 bg-vuln-bg/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-vuln-accent font-sans placeholder:text-white/20"
              />
              <button 
                type="submit" 
                className="p-2 bg-vuln-accent text-vuln-bg rounded-xl font-bold hover:bg-vuln-accent/90 transition-all shadow-neon"
                title="Send Command"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-neon transition-all pointer-events-auto ${isOpen ? 'bg-vuln-bg border border-vuln-accent/30 text-vuln-accent' : 'bg-vuln-accent text-vuln-bg hover:shadow-neon-strong'}`}
        title="Toggle AI Chatbot"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageSquare className="animate-pulse" size={24} />
        )}
      </motion.button>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('vulnbot_operator_email');
    } catch (e) {
      console.warn("localStorage is blocked in sandboxed iframe environment:", e);
      return null;
    }
  });
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  useEffect(() => {
    // Settings check hook
    const checkSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data && typeof data === 'object') {
              setMaintenanceMode(!!data.maintenanceMode);
            }
          } catch (parseErr) {
            // Silently capture parse errors during build transitions or dev-server handshake
            console.debug("Settings endpoint did not return valid JSON. Waiting for server readiness...", parseErr);
          }
        }
      } catch (err) {
        console.debug("Failed to check app settings:", err);
      }
    };
    checkSettings();
    const interval = setInterval(checkSettings, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSetPage = (page: Page) => {
    setCurrentPage(page);
  };

  const startScan = async (target: string, targetType: string, mode: string, confirmed: boolean) => {
    try {
      const res = await fetch('/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, targetType, mode, confirmed })
      });
      if (!res.ok) throw new Error('Failed to start scan');
      const data = await res.json();
      if (data.scanId) {
        setCurrentScanId(data.scanId);
        setCurrentPage('scanner');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScanFinish = async (id: string) => {
    try {
      const res = await fetch(`/api/scan/${id}/results`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setScanResult(data);
      setCurrentPage('results');
      setCurrentScanId(null);
    } catch (e) {
      console.error(e);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vulnbot_operator_email');
    } catch (e) {
      console.warn("Storage removal failed", e);
    }
    setCurrentPage('landing');
  };

  const isOperatorAdmin = currentUser?.toLowerCase() === 'admin@vulnbot.pro' || currentUser?.toLowerCase().includes('admin');

  if (!currentUser) {
    return (
      <AuthPage 
        onSuccess={(email) => {
          setCurrentUser(email);
          try {
            localStorage.setItem('vulnbot_operator_email', email);
          } catch (e) {
            console.warn("Storage write failed", e);
          }
          setCurrentPage('landing');
        }} 
      />
    );
  }

  if (maintenanceMode && !isOperatorAdmin) {
    return <MaintenancePage />;
  }

  if (currentPage === 'admin') {
    return (
      <AdminPanel 
        currentUser={currentUser || ''} 
        onClose={() => handleSetPage('landing')} 
        onToggleMaintenanceState={(state) => setMaintenanceMode(state)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-vuln-bg text-white font-sans selection:bg-vuln-accent selection:text-vuln-bg">
      <Navbar 
        currentPage={currentPage} 
        setPage={handleSetPage} 
        currentUser={currentUser}
        onLogout={handleLogout}
        isOperatorAdmin={isOperatorAdmin}
      />
      
      <main>
        {currentPage === 'landing' && <LandingPage onStart={() => handleSetPage('scanner')} />}
        {currentPage === 'scanner' && (
          currentScanId 
            ? <LiveScanPage scanId={currentScanId} onFinish={handleScanFinish} />
            : <ScannerPage onScanStart={startScan} />
        )}
        {currentPage === 'results' && scanResult && <ResultsPage results={scanResult} />}
        {currentPage === 'dashboard' && (
          <DashboardPage 
            setPage={handleSetPage} 
            onViewResults={(scan) => {
              setScanResult(scan);
              handleSetPage('results');
            }} 
          />
        )}
        {currentPage === 'reports' && (
          <div className="space-y-12">
            <DashboardPage 
              setPage={handleSetPage} 
              onViewResults={(scan) => {
                setScanResult(scan);
                handleSetPage('results');
              }} 
            />
            <div className="max-w-7xl mx-auto px-6">
              <div className="border-t border-white/10" />
            </div>
            <AcademicReportPage />
          </div>
        )}
        {currentPage === 'settings' && <SettingsPage currentUser={currentUser} />}
        {currentPage === 'documentation' && <DocumentationPage />}
        {currentPage === 'safety' && <SafetyGuidelinesPage />}
      </main>

      <AIChatbot 
        currentPage={currentPage} 
        onNavigate={handleSetPage} 
        onStartScan={(target, mode) => {
          startScan(target, 'domain', mode || 'Basic Scan', true);
        }}
      />

      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldAlert size={20} />
            <span className="font-bold tracking-tighter">VULNBOT AI v1.02</span>
          </div>
          <div className="flex gap-8 text-sm text-vuln-muted flex-wrap justify-center items-center">
            <button 
              onClick={() => handleSetPage('documentation')}
              className="hover:text-vuln-accent cursor-pointer transition-colors"
            >
              Documentation
            </button>
            <button 
              onClick={() => handleSetPage('safety')}
              className="hover:text-vuln-accent cursor-pointer transition-colors"
            >
              Safety Guidelines
            </button>
            <button 
              onClick={() => handleSetPage('admin')}
              className="hover:text-red-400 cursor-pointer transition-colors text-red-500 font-extrabold uppercase tracking-widest text-xs bg-red-950/20 px-2.5 py-1 rounded-lg border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            >
              ADMIN PANEL
            </button>
            <a href="#" className="hover:text-vuln-accent transition-colors">Privacy Policy</a>
          </div>
          <div className="text-xs text-vuln-muted font-mono">
            NODE_CLUSTER_772 // ACTIVE
          </div>
        </div>
      </footer>
    </div>
  );
}
