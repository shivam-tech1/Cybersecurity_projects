import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Cpu, 
  Database, 
  Terminal, 
  AlertOctagon, 
  RefreshCw, 
  Settings, 
  Activity, 
  FileLock2, 
  ServerCrash 
} from 'lucide-react';

export default function MaintenancePage() {
  const [percent, setPercent] = useState(87);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [timerText, setTimerText] = useState('01:18:42');

  // Simulated countdown timer
  useEffect(() => {
    const start = Date.now() + 4722000; // ~1hr 18min from now
    const interval = setInterval(() => {
      const diff = start - Date.now();
      if (diff <= 0) {
        setTimerText('00:00:00');
        clearInterval(interval);
        return;
      }
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimerText(
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const maintenanceLogs = [
    { time: '06:12:15', msg: 'Core emulation neural weights calibration triggered.', status: 'SUCCESS' },
    { time: '06:14:40', msg: 'Reordering physical partitioned DB tables for high-performance indexing.', status: 'SUCCESS' },
    { time: '06:18:02', msg: 'Synchronizing CWE-200 / CWE-79 OWASP 2026 intelligence models.', status: 'SUCCESS' },
    { time: '06:22:11', msg: 'Strengthening automated credential telemetry isolation barriers.', status: 'SUCCESS' },
    { time: '06:25:34', msg: 'Enforcing sandbox iframe restriction protocols for PDF rendering.', status: 'ACTIVE' },
    { time: '06:27:01', msg: 'Spinning up backup multi-node redundancy cluster under node_cluster_772.', status: 'PENDING' },
    { time: '06:28:44', msg: 'Re-routing standard ingress points via secure SSL proxy.', status: 'QUEUED' }
  ];

  // Rotate passive log lines to simulate ongoing secure actions
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % maintenanceLogs.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [maintenanceLogs.length]);

  const triggerDiagnosticAction = () => {
    if (runningDiagnostics) return;
    setRunningDiagnostics(true);
    setDiagnosticStep(1);
    
    setTimeout(() => {
      setDiagnosticStep(2);
      setPercent(Math.min(percent + 2, 99));
    }, 1200);

    setTimeout(() => {
      setDiagnosticStep(3);
    }, 2400);

    setTimeout(() => {
      setDiagnosticStep(4);
    }, 3800);

    setTimeout(() => {
      setRunningDiagnostics(false);
      setDiagnosticStep(0);
    }, 5000);
  };

  const systems = [
    { name: 'Emulation Kernel', status: 'COMPILING', progress: 94, icon: Cpu },
    { name: 'Telemetry Storage', status: 'DEEP_CLEAN', progress: 82, icon: Database },
    { name: 'PDF Document Engine', status: 'ISOLATION_PATCH', progress: 100, icon: FileLock2 },
    { name: 'Red Team AI Core', status: 'NEURAL_STABILIZATION', progress: 75, icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-vuln-accent selection:text-vuln-bg px-4 py-12">
      
      {/* Structural background lines and matrix grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Soft hazard-yellow/cyan glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-vuln-accent/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl z-10 flex flex-col gap-8">
        
        {/* Banner Alert Row */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-amber-500/10 border border-amber-500/20 rounded-2xl px-6 py-4.5 gap-4">
          <div className="flex items-center gap-4.5">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-amber-400 shrink-0 animate-bounce">
              <AlertOctagon size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                CRITICAL SYSTEM NOTICE: MAINTENANCE WINDOW IN PROGRESS
              </h4>
              <p className="text-xs text-amber-300/70 mt-0.5">
                The security operations sandbox and emulation stack are offline for core infrastructure reconfiguration.
              </p>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl px-4 py-2 font-mono text-center shrink-0">
            <div className="text-[10px] text-amber-400/60 uppercase tracking-widest">EST. RESUME</div>
            <div className="text-sm font-bold text-amber-400 tracking-wider mt-0.5">{timerText}</div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Visual Progress Panel */}
          <div className="md:col-span-7 glass-card border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden bg-slate-950/40">
            {/* Top decorative edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-vuln-accent tracking-widest bg-vuln-accent/10 border border-vuln-accent/20 px-2.5 py-1 rounded-md">
                    RECALIBRATION_PHASE_04
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tighter text-white mt-3 leading-none">
                    DEEP <span className="text-amber-500">MAINTENANCE</span>
                  </h1>
                </div>
                <ServerCrash className="text-amber-500 w-11 h-11 shrink-0 opacity-70" />
              </div>

              <p className="text-xs text-vuln-muted leading-relaxed mb-8">
                Vulnbot AI is currently executing planned architectural modifications. Core modules are set to offline status to prevent target detection noise and assure secure credential isolation checks. Standard operations will resume automatically.
              </p>
            </div>

            {/* Giant Circular/Linear Progress Meter */}
            <div className="space-y-4">
              <div className="flex justify-between items-end font-mono">
                <span className="text-xs text-vuln-muted font-bold uppercase tracking-wider">
                  TOTAL COMPILATION PROGRESS
                </span>
                <span className="text-2xl font-black text-white">
                  {percent}%
                </span>
              </div>
              <div className="w-full h-4 bg-slate-950 border border-white/10 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-vuln-accent rounded-full relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem] animate-[loading_1s_linear_infinite]" />
                </motion.div>
              </div>
              
              <div className="grid grid-cols-3 gap-4.5 pt-4">
                <div className="bg-slate-900/60 rounded-xl px-4 py-2.5 border border-white/5">
                  <span className="text-[9px] font-mono text-vuln-muted block tracking-wider">INTEGRITY</span>
                  <span className="text-xs font-bold text-white uppercase mt-0.5">VERIFIED</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl px-4 py-2.5 border border-white/5">
                  <span className="text-[9px] font-mono text-vuln-muted block tracking-wider">DESTRUCTIVE SCANS</span>
                  <span className="text-xs font-bold text-red-500 uppercase mt-0.5">PAUSED</span>
                </div>
                <div className="bg-slate-900/60 rounded-xl px-4 py-2.5 border border-white/5">
                  <span className="text-[9px] font-mono text-vuln-muted block tracking-wider">SECURE VAULT</span>
                  <span className="text-xs font-bold text-emerald-400 uppercase mt-0.5">LOCKED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsystem State panel */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* Interactive Diagnostics Trigger Card */}
            <div className="glass-card border border-white/10 rounded-3xl p-6.5 bg-slate-950/40 relative">
              <span className="text-[9px] font-mono text-vuln-muted block tracking-wider uppercase mb-3">
                INTEGRATED DIAGNOSTICS DECK
              </span>
              <h3 className="text-sm font-bold text-white mb-2">Simulate Terminal Diagnostic Scan</h3>
              <p className="text-xs text-vuln-muted mb-4.5">
                Check connection buffers and probe active emulation worker configurations in real-time.
              </p>

              <button
                onClick={triggerDiagnosticAction}
                disabled={runningDiagnostics}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  runningDiagnostics 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <RefreshCw size={14} className={runningDiagnostics ? 'animate-spin' : ''} />
                <span>{runningDiagnostics ? 'Diagnosing Cluster...' : 'Run Subsystem Check'}</span>
              </button>

              {/* Step indicator */}
              <AnimatePresence>
                {runningDiagnostics && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4.5 pt-3.5 border-t border-white/5 text-[11px] font-mono text-left space-y-1 text-vuln-muted"
                  >
                    <p className={diagnosticStep >= 1 ? 'text-amber-400 font-bold' : ''}>
                      {diagnosticStep >= 1 ? '●' : '○'} STEP 1: Probing container port 3000...
                    </p>
                    <p className={diagnosticStep >= 2 ? 'text-amber-400 font-bold' : ''}>
                      {diagnosticStep >= 2 ? '●' : '○'} STEP 2: Isolating credentials.txt structures...
                    </p>
                    <p className={diagnosticStep >= 3 ? 'text-amber-400 font-bold' : ''}>
                      {diagnosticStep >= 3 ? '●' : '○'} STEP 3: Validating user session registries...
                    </p>
                    <p className={diagnosticStep >= 4 ? 'text-emerald-400 font-bold' : ''}>
                      {diagnosticStep >= 4 ? '✔' : '○'} STEP 4: System integrity index healthy.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Status Grid */}
            <div className="glass-card border border-white/10 rounded-3xl p-6 flex-1 bg-slate-950/40 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-vuln-muted block tracking-wider uppercase mb-4">
                CORE SYSTEM WORKERS
              </span>
              <div className="space-y-4">
                {systems.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-vuln-muted">
                        <s.icon size={15} />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">{s.name}</span>
                        <span className="text-[10px] font-mono text-amber-500">{s.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-vuln-muted">{s.progress}%</span>
                      <div className="w-16 h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-vuln-accent" style={{ width: `${s.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Live Rolling System Log Console */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 text-left font-mono relative overflow-hidden bg-slate-950/90">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] uppercase text-emerald-400 font-bold animate-pulse">
            <Activity size={12} />
            <span>Telemetry Stream Active</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-white/5">
            <Terminal size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">Core Recalibration Audit Log</span>
          </div>

          <div className="space-y-2 h-[130px] overflow-y-auto pr-2 scrollbar-thin text-[11px] leading-relaxed">
            {maintenanceLogs.map((log, i) => (
              <div 
                key={i} 
                className={`transition-all duration-300 ${
                  i === activeLogIndex 
                    ? 'text-white translate-x-1 font-bold' 
                    : 'text-vuln-muted opacity-50'
                }`}
              >
                <span className="text-vuln-accent mr-2">[{log.time}]</span>
                <span className="text-slate-400 mr-2">SYS_CRITICAL:</span>
                <span>{log.msg}</span>
                <span className={`inline-block ml-3 px-1.5 py-0.5 rounded text-[8px] tracking-widest font-black uppercase ${
                  log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                  log.status === 'ACTIVE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>

          {/* Underlay terminal shadow edge */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>

        {/* Humorous Authorized Disclaimer footer */}
        <div className="text-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          AUTHORIZED VULNBOT CONSOLE // SECURE TELEMETRY BUFFER // ID: {Math.random().toString(36).slice(2, 10).toUpperCase()}
        </div>

      </div>
    </div>
  );
}
