import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Mail, Lock, Key, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  onSuccess: (email: string) => void;
}

type AuthMode = 'login' | 'register';

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login'); // DEFAULT: go to login first for convenience
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val: string) => {
    return val.includes('@') && val.includes('.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();

    // Pre-validations
    if (!trimmedEmail) {
      setError('Email address is required.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError('Please provide a valid email address (e.g., mail@example.com).');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password, confirmPassword })
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed.');
        }

        setSuccessMsg('Registration successful! Redirecting to login...');
        
        // Reset passwords
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to Login page after a short delay
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
          setError('');
        }, 2200);

      } catch (err: any) {
        setError(err.message || 'Error occurred during registration.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login Mode
      setLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password })
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Login failed.');
        }

        setSuccessMsg('Access authorized. Initializing environment...');
        
        setTimeout(() => {
          onSuccess(data.email || trimmedEmail);
        }, 1200);

      } catch (err: any) {
        setError(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-vuln-accent selection:text-vuln-bg px-4 py-8">
      
      {/* Dynamic scanline decorative grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Deep matrix glow aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vuln-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-14 h-14 bg-vuln-accent/10 border border-vuln-accent/30 rounded-2xl flex items-center justify-center shadow-neon mb-4.5"
          >
            <ShieldAlert className="text-vuln-accent w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-white">
            VULNBOT <span className="text-vuln-accent text-glow">AI</span>
          </h1>
          <p className="text-xs text-vuln-muted tracking-widest font-mono mt-1.5 uppercase">
            Hacker-Minded Threat Emulation Platform
          </p>
        </div>

        {/* Sliding Card Container */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-card border border-white/10 rounded-3xl p-8 relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
        >
          {/* Neon accents */}
          <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-vuln-accent to-transparent opacity-80" />

          {/* Form Tabs */}
          <div className="grid grid-cols-2 bg-slate-950/80 rounded-2xl p-1.5 border border-white/5 mb-6.5">
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                mode === 'login' 
                  ? 'bg-vuln-accent text-vuln-bg shadow-neon' 
                  : 'text-vuln-muted hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                mode === 'register' 
                  ? 'bg-vuln-accent text-vuln-bg shadow-neon' 
                  : 'text-vuln-muted hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white uppercase tracking-wider block">
                Security Operator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-vuln-muted">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@enterprise.com"
                  disabled={loading}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-vuln-accent transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white uppercase tracking-wider block">
                Security Code (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-vuln-muted">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-vuln-accent transition-colors font-sans"
                />
              </div>
            </div>

            {/* Confirm Password Field (Register Only) */}
            <AnimatePresence initial={false}>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-white uppercase tracking-wider block">
                    Confirm Security Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-vuln-muted">
                      <Key size={15} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-vuln-accent transition-colors font-sans"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* System Warnings/Feedback Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-start gap-2.5 p-3.5 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-left"
                >
                  <AlertTriangle className="shrink-0 mt-0.5" size={15} />
                  <span>{error}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-start gap-2.5 p-3.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-left"
                >
                  <CheckCircle2 className="shrink-0 mt-0.5" size={15} />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-vuln-accent hover:bg-vuln-accent/90 text-vuln-bg font-extrabold rounded-xl shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={15} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'register' ? 'Register Account' : 'Authenticate Operator'}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

        </motion.div>

        {/* Footer Policy Notes */}
        <p className="text-[10px] text-vuln-muted font-mono uppercase text-center mt-6 tracking-wider select-none leading-relaxed">
          Authorized personnel ONLY. Security telemetry recorded.<br />
          Node // {location.hostname || "VULN_CLUSTER"}
        </p>
      </div>
    </div>
  );
}
