import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Shield, 
  Cpu, 
  Trash2, 
  Save, 
  Key, 
  Eye, 
  EyeOff, 
  Sliders, 
  Play, 
  Zap, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: string;
}

export default function SettingsPage({ currentUser }: SettingsPageProps) {
  // Threat Profile Settings
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(75);
  const [autoReport, setAutoReport] = useState<boolean>(true);
  const [stealthMode, setStealthMode] = useState<boolean>(false);

  // Active vulnerability plug-ins
  const [plugins, setPlugins] = useState({
    sqlInjection: true,
    crossSiteScripting: true,
    pathTraversal: true,
    brokenAuth: true,
    cwe200Exposure: true,
    outdatedDependencies: false,
    headerAnalysis: true
  });

  // Password Management input
  const [showKey, setShowKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('vb_live_a3b2b8ddee4fa9910c0e7b41');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Toggle specific plugin
  const handlePluginToggle = (key: keyof typeof plugins) => {
    setPlugins(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const threatLevels = [
    { level: 'LOW', desc: 'Passive discovery', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { level: 'MEDIUM', desc: 'Standard non-destructive scans', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
    { level: 'HIGH', desc: 'In-depth simulation stack', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
    { level: 'CRITICAL', desc: 'Full-scale threat orchestration', color: 'text-red-400 border-red-500/20 bg-red-500/5' }
  ] as const;

  return (
    <div className="pt-24 min-h-screen px-4 md:px-6 max-w-5xl mx-auto pb-24 font-sans text-left selection:bg-vuln-accent selection:text-vuln-bg">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vuln-accent/10 border border-vuln-accent/30 rounded-xl flex items-center justify-center text-vuln-accent shadow-neon">
              <Settings size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-white">System Settings</h1>
              <p className="text-xs text-vuln-muted mt-1 uppercase font-mono tracking-widest">
                Configure orchestration engines & simulation parameters
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-5 py-2.5 bg-vuln-accent text-vuln-bg text-xs font-extrabold uppercase rounded-xl flex items-center gap-2 tracking-wider shadow-neon hover:shadow-neon-strong transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Commit Changes'}
          <Save size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Threat Parameters */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Section: Core Emulation Profile */}
          <div className="glass-card border border-white/15 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <Sliders size={16} className="text-vuln-accent" />
              <h2 className="text-lg font-bold text-white tracking-tight">Core Threat Orchestration Profile</h2>
            </div>

            {/* Simulated Threat Intensity Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Simulation Intensity Profile
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {threatLevels.map((t) => (
                  <button
                    key={t.level}
                    type="button"
                    onClick={() => setThreatLevel(t.level)}
                    className={`flex flex-col p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      threatLevel === t.level
                        ? 'border-vuln-accent bg-vuln-accent/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                        : 'border-white/5 bg-slate-950/60 hover:border-white/10'
                    }`}
                  >
                    <span className={`text-xs font-bold ${t.color.split(' ')[0]}`}>{t.level}</span>
                    <span className="text-[10px] text-vuln-muted leading-tight mt-1">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider: Simulation Precision/Speed Limit */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Throttle Bandwidth Rate
                </label>
                <span className="text-xs font-mono text-vuln-accent font-bold bg-vuln-accent/10 px-2 py-0.5 rounded border border-vuln-accent/20">
                  {simulationSpeed} request/sec
                </span>
              </div>
              <p className="text-[11px] text-vuln-muted leading-relaxed">
                Slow down requests to avoid tripwires, safety triggers, or service-level disruption on target servers during threat emulation.
              </p>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 border border-white/5 rounded-lg appearance-none cursor-pointer accent-vuln-accent"
              />
            </div>

            {/* Toggle Switch options */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="text-left pr-4">
                  <span className="text-xs font-bold text-white block uppercase tracking-wide">Stealth Mode Operation</span>
                  <span className="text-[11px] text-vuln-muted leading-relaxed block mt-0.5">
                    Modifies operational signatures to mimic zero-day, browser-origin threats passively.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStealthMode(!stealthMode)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                    stealthMode ? 'bg-vuln-accent' : 'bg-slate-900 border border-white/10'
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md swap-anim transform transition-transform ${
                      stealthMode ? 'translate-x-5.5 bg-vuln-bg' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-left pr-4">
                  <span className="text-xs font-bold text-white block uppercase tracking-wide font-sans">Auto-Generate PDF Clean Records</span>
                  <span className="text-[11px] text-vuln-muted leading-relaxed block mt-0.5">
                    Trigger automatic sandbox documentation on final task completions.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoReport(!autoReport)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                    autoReport ? 'bg-vuln-accent' : 'bg-slate-900 border border-white/10'
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md swap-anim transform transition-transform ${
                      autoReport ? 'translate-x-5.5 bg-vuln-bg' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Modular Rule Checking Algorithms */}
          <div className="glass-card border border-white/15 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <Shield size={16} className="text-vuln-accent" />
              <h2 className="text-lg font-bold text-white tracking-tight">CWE & OWASP Threat Model Plugins</h2>
            </div>
            
            <p className="text-xs text-vuln-muted leading-relaxed">
              Enable or isolate modular simulation plugins targeting specific web security structures. Disable plugins to accelerate testing times or bypass unrelated protocols.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'sqlInjection' as const, label: 'CWE-89: SQL Injection Probes', tags: 'OWASP_A1' },
                { key: 'crossSiteScripting' as const, label: 'CWE-79: Cross-Site Scripting (XSS)', tags: 'OWASP_A3' },
                { key: 'pathTraversal' as const, label: 'CWE-22: Path Traversal Probing', tags: 'OWASP_A5' },
                { key: 'brokenAuth' as const, label: 'CWE-287: Broken Auth Verification', tags: 'OWASP_A2' },
                { key: 'cwe200Exposure' as const, label: 'CWE-200: Info leakage & Telemetry', tags: 'COMPLIANCE' },
                { key: 'outdatedDependencies' as const, label: 'CWE-1104: Stack Dependency Scans', tags: 'STABLE_ONLY' },
                { key: 'headerAnalysis' as const, label: 'CWE-693: Security Header Diagnostics', tags: 'PASSIVE' }
              ].map((pl) => (
                <div 
                  key={pl.key} 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-slate-950/40 hover:border-white/10 transition-colors"
                >
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block leading-tight">{pl.label}</span>
                    <span className="text-[9px] font-mono font-bold text-vuln-accent bg-vuln-accent/10 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                      {pl.tags}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handlePluginToggle(pl.key)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      plugins[pl.key] ? 'bg-vuln-accent' : 'bg-slate-900 border border-white/15'
                    }`}
                  >
                    <div
                      className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        plugins[pl.key] ? 'translate-x-4 bg-vuln-bg' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Operator Vault & Diagnostics */}
        <div className="space-y-6">
          
          {/* API Key Vault */}
          <div className="glass-card border border-white/15 rounded-3xl p-6 bg-slate-950/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Key size={50} className="text-vuln-accent" />
            </div>

            <span className="text-[9px] font-mono text-vuln-muted block tracking-wider uppercase mb-1">
              OPERATOR CREDENTIAL VAULT
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 leading-tight">
              Secret AI Orchestration Token
            </h3>

            <p className="text-[11px] text-vuln-muted leading-relaxed mb-4">
              Authorized token used to register custom telemetry channels. Never share credentials with third parties.
            </p>

            <div className="space-y-3.5">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-xs font-mono text-white focus:outline-none focus:border-vuln-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-vuln-muted hover:text-white"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <span className="text-[9px] font-mono text-vuln-muted uppercase bg-white/5 border border-white/5 px-2.5 py-1 rounded">
                  SHA-256 ENCRYPTED
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded">
                  CLIENT_SECURE_VAULT
                </span>
              </div>
            </div>
          </div>

          {/* Operator Identity & History info */}
          <div className="glass-card border border-white/15 rounded-3xl p-6 bg-slate-950/40 space-y-4">
            <span className="text-[9px] font-mono text-vuln-muted block tracking-wider uppercase">
              ACTIVE NODE COMPLIANCE
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                OP
              </div>
              <div className="text-left truncate flex-1">
                <span className="text-xs font-bold text-white block truncate" title={currentUser}>
                  {currentUser}
                </span>
                <span className="text-[10px] font-mono text-vuln-accent">NODEID: CLUSTER_772_REG_ACTIVE</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-4.5 border-t border-white/5 text-[11px] font-mono text-vuln-muted">
              <div className="flex justify-between">
                <span>Access Authority:</span>
                <span className="text-white font-bold">OPERATOR_LVL_3</span>
              </div>
              <div className="flex justify-between">
                <span>Access Point IP:</span>
                <span className="text-white">127.0.0.1</span>
              </div>
              <div className="flex justify-between">
                <span>Crypto Signatures:</span>
                <span className="text-white">TLS_AES_256_GCM</span>
              </div>
            </div>
          </div>

          {/* Local State purging */}
          <div className="glass-card border border-white/15 rounded-3xl p-6 bg-slate-950/40 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider block">
              Danger Zone Operations
            </h3>
            <p className="text-[11px] text-vuln-muted leading-relaxed">
              Purges local browser cache data registries, clearing active emulations, report indices and session telemetry data fully.
            </p>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your local emulations history? This cannot be undone.")) {
                  localStorage.removeItem('vulnbot_operator_email');
                  location.reload();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/60 bg-red-500/5 text-red-400 hover:bg-red-500/10 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Purge Local Registry</span>
            </button>
          </div>

        </div>
      </div>

      {/* Action alerts overlay feedback messages */}
      <div className="fixed bottom-6 left-6 z-[120]">
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="flex items-center gap-2.5 bg-[#020617] border border-vuln-accent px-5 py-3.5 rounded-2xl shadow-neon text-xs text-white"
          >
            <CheckCircle2 className="text-vuln-accent shrink-0" size={16} />
            <span>Settings committed to VulnBot secure local state successfully!</span>
          </motion.div>
        )}
      </div>

    </div>
  );
}
