import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileLock2, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  HeartHandshake, 
  Scale, 
  Info 
} from 'lucide-react';

export default function SafetyGuidelinesPage() {
  const [agreed, setAgreed] = useState(false);

  const complianceGuidelines = [
    {
      title: 'Rules of Engagement (RoE)',
      desc: 'All security testing simulations must be operated strictly targeting assets where explicit, verified, written authorization has been granted by the correct resource trustee.',
      icon: Scale,
      color: 'text-amber-500'
    },
    {
      title: 'Environment Isolation Protocol',
      desc: 'Credential logging features (used to simulate phishing traces) store operator input within isolated file databases (credentials.txt) safely inside administrative boundaries.',
      icon: FileLock2,
      color: 'text-vuln-accent'
    },
    {
      title: 'Ethics and Disclosures',
      desc: 'Strict adherence to cooperative disclosure procedures is MANDATORY. Any novel security exposure identified during simulation MUST be reported internally through safe pipelines.',
      icon: HeartHandshake,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="pt-24 min-h-screen px-4 md:px-6 max-w-4xl mx-auto pb-24 font-sans text-left selection:bg-vuln-accent selection:text-vuln-bg">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vuln-accent/15 border border-vuln-accent/30 rounded-xl flex items-center justify-center text-vuln-accent shadow-neon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-white">Safety Guidelines</h1>
              <p className="text-xs text-vuln-muted mt-1 uppercase font-mono tracking-widest">
                Responsible usage rules, compliance standard disclosures & ethics manuals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Core Warning Alert Block */}
        <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-6.5 md:p-8 relative overflow-hidden flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <AlertTriangle size={24} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-red-400 tracking-tight uppercase">
              Important: Authorized Operations Only
            </h2>
            <p className="text-xs text-red-200/70 leading-relaxed">
              VulnBot AI simulates real-world vulnerability patterns, mapping structures, and mock exploit payloads. Triggering active scanning sweeps against unauthorized endpoints is classified as web misuse and may breach local administrative laws. Always secure explicit, legal authorizations beforehand.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {complianceGuidelines.map((guideline, index) => {
            const IconComponent = guideline.icon;
            return (
              <div 
                key={index} 
                className="glass-card border border-white/10 rounded-2xl p-6.5 bg-slate-950/40 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center ${guideline.color}`}>
                    <IconComponent size={20} />
                  </div>
                  
                  <h3 className="text-sm font-bold text-white tracking-tight">{guideline.title}</h3>
                  <p className="text-xs text-vuln-muted leading-relaxed">{guideline.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Agreement Interactive Checkbox Card */}
        <div className="glass-card border border-white/15 rounded-3xl p-6 md:p-8 bg-slate-950/80 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-white">
            <Info size={16} className="text-vuln-accent" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">Operator Safety Commitment</h3>
          </div>

          <p className="text-xs text-vuln-muted leading-relaxed">
            By activating threat emulation nodes and registering targets inside this cluster, you officially attest to the following:
          </p>

          <ul className="text-xs text-vuln-muted space-y-3 pl-1 font-sans text-left">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-vuln-accent shrink-0 mt-0.5" />
              <span>I hold appropriate written clearance, scoping guidelines, and authorization from target system owners.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-vuln-accent shrink-0 mt-0.5" />
              <span>I will not attempt active buffer overflows or deploy production-disrupting vectors with high intensity.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-vuln-accent shrink-0 mt-0.5" />
              <span>I understand that security credentials logged (including registrations or authorization handles) are logged to physical storage channels inside 127.0.0.1 environment boundaries.</span>
            </li>
          </ul>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
            <label className="flex items-center gap-3.5 cursor-pointer text-xs font-bold text-white tracking-tight">
              <input 
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4.5 h-4.5 border border-white/20 rounded bg-slate-950 text-vuln-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>I HAVE REVIEWED AND ACCEPT ALL STATED SAFETY TERMS</span>
            </label>

            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase font-bold ${
              agreed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
            }`}>
              {agreed ? 'ROUTER_INTEGRITY_SAFE' : 'ROUTER_STANDBY'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
