import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Terminal, 
  BookOpen, 
  Code, 
  ShieldAlert, 
  ChevronRight, 
  Search, 
  Layers, 
  ExternalLink,
  Cpu,
  Database
} from 'lucide-react';

export default function DocumentationPage() {
  const [activeTab, setActiveTab ] = useState<'getting-started' | 'architecture' | 'commands' | 'api'>('getting-started');

  const docToggles = [
    { id: 'getting-started' as const, label: 'Standard Quickstart', icon: BookOpen },
    { id: 'architecture' as const, label: 'Orchestration Mechanics', icon: Layers },
    { id: 'commands' as const, label: 'Chatbot CLI Commands', icon: Terminal },
    { id: 'api' as const, label: 'System REST Web APIs', icon: Code },
  ];

  return (
    <div className="pt-24 min-h-screen px-4 md:px-6 max-w-5xl mx-auto pb-24 font-sans text-left selection:bg-vuln-accent selection:text-vuln-bg">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vuln-accent/10 border border-vuln-accent/30 rounded-xl flex items-center justify-center text-vuln-accent shadow-neon">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-white">System Documentation</h1>
              <p className="text-xs text-vuln-muted mt-1 uppercase font-mono tracking-widest">
                Technical manuals, command registries, and emulation API manifests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {docToggles.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-vuln-accent text-vuln-bg shadow-neon' 
                  : 'bg-slate-950/60 border border-white/5 text-vuln-muted hover:text-white hover:border-white/10'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
          
          <div className="p-4.5 bg-slate-950/25 border border-white/5 rounded-2xl space-y-2.5 mt-6">
            <span className="text-[10px] font-mono text-vuln-muted tracking-widest uppercase block">
              SUPPORT CHANNELS
            </span>
            <p className="text-[11px] text-vuln-muted leading-relaxed">
              For security compliance overrides and advanced target orchestration questions, please coordinate with Section 7 Security Leads.
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3">
          <div className="glass-card border border-white/10 rounded-3xl p-8 min-h-[500px] flex flex-col justify-between">
            
            {/* TAB: Getting Started */}
            {activeTab === 'getting-started' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white">
                  <BookOpen size={18} className="text-vuln-accent" />
                  <h2 className="text-xl font-bold tracking-tight">Standard Quickstart Manual</h2>
                </div>
                <p className="text-xs text-vuln-muted leading-relaxed">
                  VulnBot AI provides authorized security personnel with a secure, simulated sandboxed ecosystem. This platform assists red teams and security engineers in mapping active host parameters, identifying severe coding oversights, and generating executive reports.
                </p>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Operational Lifecycle</h3>
                  <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-5">
                    {[
                      { step: '01', title: 'Operator Registration', desc: 'Secure an encrypted identity profile key. Telemetry and credentials logs are maintained in isolated local files.' },
                      { step: '02', title: 'Target Probing', desc: 'Input an active target, choose the scanning depth profile, and confirm matching ownership authority headers.' },
                      { step: '03', title: 'Analysis Orchestration', desc: 'Observe real-time threat maps and logs. Simulated payloads test path availability without causing actual host impacts.' },
                      { step: '04', title: 'Executive Report Extraction', desc: 'Compile professional PDF/JSON document portfolios detailing vulnerabilities with severity indicators.' },
                    ].map((step, idx) => (
                      <div key={idx} className="relative text-left">
                        <div className="absolute -left-[27px] top-1 w-3 h-3 bg-vuln-accent rounded-full border-2 border-vuln-bg shadow-neon" />
                        <span className="text-[10px] font-mono font-bold text-vuln-accent uppercase tracking-wider">{step.step} // {step.title}</span>
                        <p className="text-xs text-vuln-muted mt-0.5">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Architecture Mechanics */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white">
                  <Layers size={18} className="text-vuln-accent" />
                  <h2 className="text-xl font-bold tracking-tight">Threat Orchestration Mechanics</h2>
                </div>
                <p className="text-xs text-vuln-muted leading-relaxed">
                  Understanding how VulnBot handles targets ensures accurate threat emulations. All scans follow strict guidelines to separate defensive telemetry from harmful impact signals.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4.5 space-y-2">
                    <Cpu size={18} className="text-amber-400" />
                    <h3 className="text-xs font-bold text-white">Passive Tracer Engine</h3>
                    <p className="text-[11px] text-vuln-muted leading-relaxed">
                      Probes standard open access ports and validates network topology parameters passively without injecting executable blocks. Avoids standard anti-virus and routing alarms.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4.5 space-y-2">
                    <Database size={18} className="text-vuln-accent" />
                    <h3 className="text-xs font-bold text-white">CWE Knowledge Mapping</h3>
                    <p className="text-[11px] text-vuln-muted leading-relaxed">
                      Cross-references scan observations against an isolated database containing OWASP 2026 guidelines. Classifies patterns into structured severity matrices.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-left">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={14} /> Critical Network Safety Guideline
                  </h4>
                  <p className="text-[11px] text-amber-300/80 mt-1.5 leading-relaxed">
                    By default, the simulation environment operates under deep sandboxing bounds. This shields third-party databases while enforcing correct validation protocols on client systems.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Chatbot CLI Commands */}
            {activeTab === 'commands' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white">
                  <Terminal size={18} className="text-vuln-accent" />
                  <h2 className="text-xl font-bold tracking-tight">Cognitive Chatbot CLI Console</h2>
                </div>
                <p className="text-xs text-vuln-muted leading-relaxed">
                  The integrated VulnBot AI features an executive command parser allowing speedy, keyboard-driven navigation and scanning handshakes.
                </p>

                <div className="space-y-3 font-mono text-[11px] text-left">
                  <div className="bg-slate-950 p-4.5 rounded-2xl border border-white/5 space-y-3.5">
                    {[
                      { cmd: 'scan [domain/IP]', desc: 'Directly initializes a standard security scan (e.g. "scan google.com" or "scan 10.0.0.1")' },
                      { cmd: 'go to [page]', desc: 'Bypasses click maps instantly and opens deep layouts (e.g., "go to dashboard", "go to reports")' },
                      { cmd: 'export to pdf', desc: 'Triggers client-side PDF document generation and local download during active report views' },
                      { cmd: 'export to json', desc: 'Extracts full CWE metrics structure matching the current results page directly to a JSON document' },
                    ].map((command, k) => (
                      <div key={k} className="border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                        <span className="text-vuln-accent font-bold block">{command.cmd}</span>
                        <span className="text-vuln-muted block mt-0.5 font-sans text-xs">{command.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REST Web APIs */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white">
                  <Code size={18} className="text-vuln-accent" />
                  <h2 className="text-xl font-bold tracking-tight">System REST API Specifications</h2>
                </div>
                <span className="text-xs text-vuln-muted leading-relaxed block">
                  The full-stack application relies on standardized back-end triggers running inside Container Port 3000. Under developers authorization, these endpoints can be bound to external tools.
                </span>

                <div className="space-y-4 font-mono text-[11px] text-left">
                  {/* Endpoint 1 */}
                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-vuln-accent/15 text-vuln-accent font-bold uppercase rounded text-[9px]">POST</span>
                      <span className="text-white font-bold">/api/auth/register</span>
                    </div>
                    <p className="text-xs text-vuln-muted font-sans leading-relaxed">
                      Saves lit security credential registries. Verifies email correctness and logs details to isolated txt trails.
                    </p>
                  </div>

                  {/* Endpoint 2 */}
                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-vuln-accent/15 text-vuln-accent font-bold uppercase rounded text-[9px]">POST</span>
                      <span className="text-white font-bold">/api/scan/start</span>
                    </div>
                    <p className="text-xs text-vuln-muted font-sans leading-relaxed">
                      Launches an automated background worker tracking target status. Generates real-time emulated vulnerability vectors.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Common Footer element inside Doc Panel */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500 font-mono mt-8 gap-4.5">
              <span>DOCUMENT_REVISION: v24.5.1</span>
              <span>CLASSIFICATION: OPEN_TO_AUTHORIZED_STAFF</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
