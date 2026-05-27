import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Key, 
  Trash2, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  Sliders, 
  Terminal, 
  FileCheck, 
  ShieldAlert, 
  Lock,
  Eye,
  EyeOff,
  Radio,
  Server,
  Plus,
  X,
  Edit2,
  Power,
  KeyRound
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: string;
  onClose?: () => void;
  onToggleMaintenanceState?: (state: boolean) => void;
}

interface UserRecord {
  email: string;
  hasPassword: boolean;
  disabled?: boolean;
}

export default function AdminPanel({ currentUser, onClose, onToggleMaintenanceState }: AdminPanelProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [credentialsContent, setCredentialsContent] = useState<string>('');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  
  const [scansCount, setScansCount] = useState<number>(0);
  const [errorText, setErrorText] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogRefreshing, setIsLogRefreshing] = useState<boolean>(false);
  const [showRawPasswords, setShowRawPasswords] = useState<boolean>(false);

  // Administrative Panel Authentication and Tab Selection States
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(() => {
    if (currentUser?.toLowerCase() === 'admin@vulnbot.pro') {
      return true;
    }
    return sessionStorage.getItem('admin_session_auth') === 'true';
  });
  const [adminEmailInput, setAdminEmailInput] = useState<string>('');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  type AdminTab = 'overview' | 'operators' | 'maintenance' | 'phishing';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Administrative CRUD and User state management fields
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPassword, setNewUserPassword] = useState<string>('');
  const [newUserDisabled, setNewUserDisabled] = useState<boolean>(false);

  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editPassword, setEditPassword] = useState<string>('');
  const [editDisabled, setEditDisabled] = useState<boolean>(false);

  // Active sandbox stats
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 14,
    ramUsage: 42,
    activeTracerThreads: 4,
    sandboxedFilesCount: 8
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch registered users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok && usersRes.headers.get('content-type')?.toLowerCase().includes('application/json')) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // 2. Fetch logged credentials
      const credRes = await fetch('/api/admin/credentials');
      if (credRes.ok && credRes.headers.get('content-type')?.toLowerCase().includes('application/json')) {
        const credData = await credRes.json();
        setCredentialsContent(credData.content || '');
      }

      // 3. Fetch app settings (maintenance status)
      const settingsRes = await fetch('/api/admin/settings');
      if (settingsRes.ok && settingsRes.headers.get('content-type')?.toLowerCase().includes('application/json')) {
        const settingsData = await settingsRes.json();
        setMaintenanceMode(!!settingsData.maintenanceMode);
      }

      // 4. Fetch scans count
      const scansRes = await fetch('/api/scans');
      if (scansRes.ok && scansRes.headers.get('content-type')?.toLowerCase().includes('application/json')) {
        const scansData = await scansRes.json();
        setScansCount(scansData.length);
      }

      setErrorText('');
    } catch (err: any) {
      setErrorText('Failed to pull administrative telemetry buffer: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Simulate minor visual fluctuations in server stats
    const statTimer = setInterval(() => {
      setSystemMetrics(prev => ({
        cpuUsage: Math.max(8, Math.min(65, prev.cpuUsage + (Math.random() > 0.5 ? 2 : -2))),
        ramUsage: Math.max(30, Math.min(50, prev.ramUsage + (Math.random() > 0.5 ? 1 : -1))),
        activeTracerThreads: Math.max(2, Math.min(12, prev.activeTracerThreads + (Math.random() > 0.8 ? 1 : Math.random() > 0.8 ? -1 : 0))),
        sandboxedFilesCount: prev.sandboxedFilesCount
      }));
    }, 4000);

    return () => clearInterval(statTimer);
  }, []);

  const handleToggleMaintenance = async () => {
    const newState = !maintenanceMode;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: newState })
      });
      if (res.ok) {
        setMaintenanceMode(newState);
        if (onToggleMaintenanceState) {
          onToggleMaintenanceState(newState);
        }
        showFeedback(`System maintenance status successfully updated to ${newState ? 'ON' : 'OFF'}.`);
      } else {
        setErrorText('Failed to transmit operational maintenance directive.');
      }
    } catch (err: any) {
      setErrorText('Directive transmission error: ' + err.message);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (email.toLowerCase() === currentUser.toLowerCase()) {
      alert("You cannot delete your own logged administrative session.");
      return;
    }
    if (!confirm(`Are you sure you want to isolate and delete user ${email}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/user/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.email !== email));
        showFeedback(`User ${email} purged successfully.`);
      } else {
        setErrorText('Failed to delete operator record.');
      }
    } catch (err: any) {
      setErrorText('Purge action failed: ' + err.message);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    if (!newUserEmail || !newUserEmail.includes('@')) {
      setErrorText('Please provide a valid operator email address.');
      return;
    }
    if (!newUserPassword || newUserPassword.length < 6) {
      setErrorText('Security standard requires password to be at least 6 characters.');
      return;
    }
    try {
      const res = await fetch('/api/admin/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          disabled: newUserDisabled
        })
      });
      if (res.ok) {
        showFeedback(`Operator ${newUserEmail} registered.`);
        setIsAddingUser(false);
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserDisabled(false);
        fetchData();
      } else {
        const data = await res.json();
        setErrorText(data.error || 'Failed to initialize operator Account node.');
      }
    } catch (err: any) {
      setErrorText('Error initializing operator: ' + err.message);
    }
  };

  const handleToggleUserStatus = async (user: UserRecord) => {
    if (user.email.toLowerCase() === currentUser.toLowerCase()) {
      alert("You cannot modify your own executive command account state.");
      return;
    }
    const targetState = !user.disabled;
    try {
      const res = await fetch(`/api/admin/user/${encodeURIComponent(user.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: targetState })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.email === user.email ? { ...u, disabled: targetState } : u));
        showFeedback(`Operator ${user.email} is now ${targetState ? 'DISABLED' : 'ENABLED'}.`);
      } else {
        const data = await res.json();
        setErrorText(data.error || 'Failed to update operator state.');
      }
    } catch (err: any) {
      setErrorText('Error saving operator status: ' + err.message);
    }
  };

  const handleUpdatePasswordAndStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorText('');
    
    // Guard: current logged in admin cannot disable themselves
    if (editingUser.email.toLowerCase() === currentUser.toLowerCase() && editDisabled) {
      setErrorText('Error: You cannot disable your own active master session.');
      return;
    }

    const body: any = { disabled: editDisabled };
    if (editPassword !== "") {
      if (editPassword.length < 6) {
        setErrorText('Password must be at least 6 characters.');
        return;
      }
      body.password = editPassword;
    }

    try {
      const res = await fetch(`/api/admin/user/${encodeURIComponent(editingUser.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        showFeedback(`Configured settings updated for ${editingUser.email}.`);
        setEditingUser(null);
        setEditPassword('');
        fetchData();
      } else {
        const data = await res.json();
        setErrorText(data.error || 'Failed to update operator configuration.');
      }
    } catch (err: any) {
      setErrorText('Error updating operator configuration: ' + err.message);
    }
  };

  const handleClearCredentials = async () => {
    if (!confirm("Are you sure you want to permanently empty the credentials.txt leakage buffer? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'DELETE'
      });
      if (res.ok) {
        setCredentialsContent('');
        showFeedback('Credentials leakage log buffer cleared.');
      } else {
        setErrorText('Could not clear log buffer.');
      }
    } catch (err: any) {
      setErrorText('Purge logs action failed: ' + err.message);
    }
  };

  const handleRefreshCredentials = async () => {
    setIsLogRefreshing(true);
    try {
      const credRes = await fetch('/api/admin/credentials');
      if (credRes.ok) {
        const credData = await credRes.json();
        setCredentialsContent(credData.content || '');
        showFeedback('Credentials list refreshed.');
      }
    } catch (err: any) {
      setErrorText('Refresh failed: ' + err.message);
    } finally {
      setIsLogRefreshing(false);
    }
  };

  // Dedicated Administrative Session Login Handler
  const handleAdminGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    setIsAuthenticating(true);

    try {
      if (!adminEmailInput || !adminPasswordInput) {
        setAdminAuthError('Provide both administrative credentials.');
        setIsAuthenticating(false);
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmailInput, password: adminPasswordInput })
      });

      const data = await res.json();
      if (!res.ok) {
        setAdminAuthError(data.error || 'Invalid cryptographic credentials signature.');
        setIsAuthenticating(false);
        return;
      }

      const emailLower = data.email.toLowerCase();
      if (emailLower.includes('admin') || emailLower === 'admin@vulnbot.pro') {
        sessionStorage.setItem('admin_session_auth', 'true');
        setIsAdminVerified(true);
        fetchData();
        showFeedback('Master administrative session authorized.');
      } else {
        setAdminAuthError('ACCESS DENIED: Operator profile is unauthorized to sign into the Master Command Deck.');
      }
    } catch (err: any) {
      setAdminAuthError('Session authentication transaction failure: ' + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_session_auth');
    setIsAdminVerified(false);
    setAdminEmailInput('');
    setAdminPasswordInput('');
    showFeedback('Administrative session revoked.');
  };

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 1st Layer: Access Gate Verification
  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-vuln-accent selection:text-vuln-bg px-4 py-8">
        {/* Dynamic scanline decorative grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none animate-pulse" />
        
        {/* Deep matrix glow aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md z-10">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-14 h-14 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-4"
            >
              <ShieldAlert className="text-red-500 w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-white">
              ADMINISTRATIONAL <span className="text-red-500 text-glow">VERIFICATION</span>
            </h1>
            <p className="text-xs text-vuln-muted tracking-widest font-mono mt-1 uppercase">
              Secure Master Console Entry Terminal
            </p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-card border border-red-500/20 rounded-3xl p-8 relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-slate-950/90"
          >
            <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-85" />

            <form onSubmit={handleAdminGateSubmit} className="space-y-5">
              {adminAuthError && (
                <div className="p-3.5 rounded-2xl border border-red-500/30 bg-red-950/30 text-red-400 text-xs text-left flex items-center gap-2.5">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{adminAuthError}</span>
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">
                  Admin Email ID
                </label>
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="admin@vulnbot.pro"
                  disabled={isAuthenticating}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-red-500 transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">
                  Console cipher key (password)
                </label>
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  disabled={isAuthenticating}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-red-500 transition-colors font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black tracking-wider uppercase text-xs rounded-xl shadow-[0_4px_25px_rgba(220,38,38,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>VERIFYING SIGNAL...</span>
                  </>
                ) : (
                  <>
                    <Lock size={13} />
                    <span>SIGN INTO COMMAND DECK</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10 font-bold uppercase text-[10px] rounded-xl transition-all cursor-pointer"
              >
                CANCEL & RETURN
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // 2nd Layer: Redesigned Tabbed Sidebar View
  const sidebarTabs = [
    { id: 'overview', label: 'Monitor Telemetry', icon: Activity, desc: 'Real-time CPU/memory stats' },
    { id: 'operators', label: 'Operator Registry', icon: Users, desc: 'Add, update & lock profiles' },
    { id: 'maintenance', label: 'Global Directives', icon: Sliders, desc: 'Maintenance mode overrides' },
    { id: 'phishing', label: 'Leakage Buffers', icon: Terminal, desc: 'Captured credentials dump' }
  ] as const;

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans text-left selection:bg-vuln-accent selection:text-vuln-bg relative">
      {/* Background Matrix Scanning Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-72 bg-slate-950/80 border-r border-white/10 flex flex-col shrink-0 z-40 relative backdrop-blur-md">
        {/* Brand Logo & Version Area */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600/15 border border-red-500/30 rounded-lg flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <ShieldAlert size={18} className="animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-widest uppercase">
                VULNBOT <span className="text-red-500 text-glow">ADMIN</span>
              </span>
              <span className="text-[8px] font-mono text-zinc-500 block tracking-wider uppercase">
                SECURE CONSOLE v1.02
              </span>
            </div>
          </div>
        </div>

        {/* User Session Profile details */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-[#020617]/90 border border-white/5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-red-500/30 flex items-center justify-center font-mono text-[10px] text-red-400 font-bold">
              ADM
            </div>
            <div className="truncate text-left select-none">
              <span className="text-[10px] font-semibold text-zinc-400 block truncate" title={currentUser}>
                {currentUser}
              </span>
              <span className="text-[8px] font-mono text-red-400 uppercase tracking-wider block font-bold">
                MASTER AUTHORITY_LEVEL 5
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection Lists */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorText('');
                }}
                className={`w-full text-xs font-medium px-4 py-3.5 rounded-2xl flex items-center gap-3.5 relative transition-all cursor-pointer group text-left ${
                  isTabActive
                    ? 'bg-red-500/10 border border-red-500/20 text-white font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {isTabActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-red-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={16} className={isTabActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'} />
                <div>
                  <span className="block font-bold">{tab.label}</span>
                  <span className="text-[9px] font-mono text-zinc-500 font-normal block tracking-tight group-hover:text-zinc-400 mt-0.5">
                    {tab.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Actions Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white rounded-xl transition-all font-bold text-[10px] tracking-wider uppercase cursor-pointer"
            >
              EXIT ADMIN PANEL
            </button>
          )}
          <button
            onClick={handleAdminLogout}
            className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 text-red-400 font-bold rounded-xl transition-all text-[10px] tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Power size={11} />
            <span>REVOKE SESSION</span>
          </button>
        </div>
      </aside>

      {/* RIGHT VIEWPORT WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        {/* TOP NAVBAR CONTAINER */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-950/40 relative z-30 backdrop-blur-md">
          {/* Breadcrumbs */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              COMMAND DECK / ADMINISTRATIVE UTILITIES
            </span>
            <h2 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">
              {activeTab === 'overview' && 'SYSTEM REAL-TIME HEALTH TELEMETRY'}
              {activeTab === 'operators' && 'OPERATOR ACCOUNT INDEX & AUTHORIZATIONS'}
              {activeTab === 'maintenance' && 'GLOBAL DIRECTIVES & MODE OVERRIDES'}
              {activeTab === 'phishing' && 'CREDENTIALS INTERCEPT & LEAKAGE LOGS'}
            </h2>
          </div>

          {/* Sync actions & status pillars */}
          <div className="flex items-center gap-4">
            {/* System Mode Pill */}
            <div className={`p-1.5 px-3 rounded-xl border flex items-center gap-2 select-none ${
              maintenanceMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${maintenanceMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-black">
                {maintenanceMode ? 'SYSTEMS: MAINTENANCE' : 'SYSTEMS: SECURE ONLINE'}
              </span>
            </div>

            <div className="w-[1px] h-6 bg-white/10" />

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2 bg-slate-900 border border-white/10 hover:border-white/20 text-white rounded-xl flex items-center gap-1.5 hover:bg-slate-850 transition-colors cursor-pointer text-[10px] font-extrabold uppercase tracking-widest"
              title="Force Telemetry Sync"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin text-red-400' : 'text-zinc-400'} />
              <span>SYNC CORE</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE MAIN VIEW AREA */}
        <div className="p-8 flex-1 overflow-y-auto pb-24">
          {/* Action notification overlays */}
          <AnimatePresence>
            {errorText && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-950/25 p-4 flex items-center justify-between text-red-400 text-xs overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={15} className="text-red-400 shrink-0" />
                  <span>{errorText}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setErrorText('')}
                  className="text-red-400 hover:text-white transition-colors p-1 bg-white/5 rounded-lg cursor-pointer"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC TAB SWITCH RENDER */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* System Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { name: 'Core CPU Load', val: `${systemMetrics.cpuUsage}%`, color: 'text-red-400', desc: 'Real-time emulation load' },
                      { name: 'Emulation RAM Allocation', val: `${systemMetrics.ramUsage}%`, color: 'text-amber-400', desc: 'Active container buffer heap' },
                      { name: 'Network Port Probes', val: `${systemMetrics.activeTracerThreads} threads`, color: 'text-cyan-400', desc: 'Active scanning threadpools' },
                      { name: 'Logged Port Audits', val: `${scansCount} scans`, color: 'text-purple-400', desc: 'Total scan histories logged' },
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-white/5 hover:border-white/10 rounded-3xl p-6 text-left transition-colors">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-extrabold">{metric.name}</span>
                        <span className={`text-2xl font-black font-mono mt-1 block ${metric.color}`}>{metric.val}</span>
                        <span className="text-[10px] text-zinc-400 block mt-2">{metric.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Diagnostic Verification Status Checkbox cards */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 bg-slate-950/60 border border-white/5 rounded-3xl p-6.5 text-left h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-red-500" />
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Telemetry Statistics Monitor</h4>
                      </div>
                      <p className="text-xs text-vuln-muted leading-relaxed mb-6">
                        Below represents simulated status readings from inside the Cloud Run container environment. CPU fluctuations demonstrate dynamic container task assignments, whilst scanning memory reflects active payload buffering.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-zinc-300 font-medium">Virtual CPU Allocator Thread Status</span>
                            <span className="font-mono text-zinc-400">{systemMetrics.cpuUsage}% Core Task Load</span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${systemMetrics.cpuUsage}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-zinc-300 font-medium">Emulation Sandbox File Allocation Heap</span>
                            <span className="font-mono text-zinc-400">{systemMetrics.ramUsage}% Heap Buffers</span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${systemMetrics.ramUsage}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 bg-slate-950/60 border border-white/5 rounded-3xl p-6 text-left h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <FileCheck size={16} className="text-emerald-500" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">Diagnostics Check</h4>
                        </div>
                        <div className="space-y-3.5 text-xs">
                          {[
                            { label: 'Sandbox System Host', status: 'Healthy', val: 'Port 3000' },
                            { label: 'Logged Users Schema', status: 'Stable', val: 'users.json' },
                            { label: 'AI Vulnerability Core', status: 'Ready', val: 'Gemini Client' },
                            { label: 'Leakage Log Mount', status: 'Active', val: 'credentials.txt' },
                          ].map((item, key) => (
                            <div key={key} className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0 last:pb-0">
                              <div>
                                <span className="text-white font-bold block">{item.label}</span>
                                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black mt-0.5 block">{item.status}</span>
                              </div>
                              <span className="text-[9px] font-mono text-stone-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                                {item.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Operators CRUD */}
              {activeTab === 'operators' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Accounts list directory */}
                  <div className="lg:col-span-7 bg-slate-950/40 border border-white/5 rounded-3xl p-6.5">
                    <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-4">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 block tracking-wider uppercase font-extrabold mb-0.5">
                          SECURE PORTAL RECORDS
                        </span>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                          Active Security Operators ({users.length})
                        </h3>
                      </div>
                      
                      {!isAddingUser && !editingUser && (
                        <button
                          onClick={() => {
                            setIsAddingUser(true);
                            setErrorText('');
                          }}
                          className="px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <Plus size={12} />
                          <span>NEW OPERATOR</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-vuln-muted leading-relaxed mb-6">
                      Registered users have privileges to execute penetration scan actions. Revoke permissions or lock state instantly below to block active credentials sessions.
                    </p>

                    {/* Users list mapping */}
                    <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                      {users.length === 0 ? (
                        <div className="text-center text-zinc-600 font-mono text-xs py-8">
                          -- NO OPERATOR ACCOUNTS RECORDED --
                        </div>
                      ) : (
                        users.map((u, i) => {
                          const isAdminSelf = u.email.toLowerCase() === currentUser.toLowerCase();
                          return (
                            <div 
                              key={i} 
                              className={`p-4 rounded-2xl bg-[#020617] border transition-all ${
                                u.disabled 
                                  ? 'border-red-500/15 opacity-75 grayscale-[20%]' 
                                  : 'border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="text-left truncate flex-1">
                                  <div className="flex items-center gap-2 truncate">
                                    <span 
                                      className={`text-xs font-bold block truncate ${u.disabled ? 'text-zinc-500 line-through decoration-red-500/40' : 'text-white'}`} 
                                      title={u.email}
                                    >
                                      {u.email}
                                    </span>
                                    
                                    <span 
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        u.disabled 
                                          ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' 
                                          : 'bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                                      }`}
                                    />
                                  </div>
                                  <span className="text-[9px] font-mono text-zinc-500 block mt-1 uppercase tracking-wide">
                                    {isAdminSelf 
                                      ? 'EXECUTIVE ADMIN DECK SESSION (SELF)' 
                                      : u.disabled 
                                      ? 'OPERATOR SECURITY STATE: INACTIVE / LOCKED' 
                                      : 'OPERATOR SECURITY STATE: DEPLOYED'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* Toggle Disable/Enable Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUserStatus(u)}
                                    disabled={isAdminSelf}
                                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                      isAdminSelf
                                        ? 'border-white/5 text-zinc-700 opacity-20 cursor-not-allowed'
                                        : u.disabled
                                        ? 'border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10'
                                        : 'border-amber-500/25 text-amber-400 hover:bg-amber-500/10'
                                    }`}
                                    title={u.disabled ? 'Permit operator access' : 'Lock/Lock operator access'}
                                  >
                                    <Power size={12} />
                                  </button>

                                  {/* Edit properties popup trigger */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingUser(u);
                                      setEditPassword('');
                                      setEditDisabled(!!u.disabled);
                                      setIsAddingUser(false);
                                      setErrorText('');
                                    }}
                                    className="p-2 rounded-xl border border-white/5 hover:border-white/10 text-stone-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                    title="Edit password"
                                  >
                                    <Edit2 size={12} />
                                  </button>

                                  {/* Remove completely button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.email)}
                                    disabled={isAdminSelf}
                                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                      isAdminSelf
                                        ? 'border-white/5 text-zinc-700 opacity-20 cursor-not-allowed'
                                        : 'border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/35'
                                    }`}
                                    title="Purge operator profiles"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Dynamic Form panels for adding or editing users */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Panel 1: Create New Operator */}
                    {isAddingUser && (
                      <motion.form 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onSubmit={handleAddUser}
                        className="bg-slate-950/80 border border-white/10 rounded-3xl p-6.5 text-left space-y-4"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-black">
                            INITIALIZE SYSTEM OPERATOR
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setIsAddingUser(false)}
                            className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Email Address</label>
                          <input
                            type="email"
                            required
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="operator@security-ledger.pro"
                            className="w-full bg-[#020617] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Cipher Access Key</label>
                          <input
                            type="password"
                            required
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#020617] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex items-center gap-2.5 py-1">
                          <input
                            type="checkbox"
                            id="newUserDisabled"
                            checked={newUserDisabled}
                            onChange={(e) => setNewUserDisabled(e.target.checked)}
                            className="rounded border-white/10 bg-[#020617] text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="newUserDisabled" className="text-[11px] font-bold text-stone-300 cursor-pointer select-none">
                            Deploy as initially locked / disabled
                          </label>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-black tracking-wider uppercase text-[10px] rounded-xl hover:bg-emerald-400 transition-all cursor-pointer"
                          >
                            DEPLOY OPERATOR
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingUser(false)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10 font-bold uppercase text-[10px] rounded-xl transition-all cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Panel 2: Calibrate Operator State */}
                    {editingUser && (
                      <motion.form 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onSubmit={handleUpdatePasswordAndStatus}
                        className="bg-slate-950/80 border border-white/10 rounded-3xl p-6.5 text-left space-y-4"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest font-black">
                            CALIBRATE OPERATOR NODE
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setEditingUser(null)}
                            className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="bg-[#020617] p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Operator Target Profile:</span>
                          <span className="text-xs text-white font-extrabold font-mono block truncate break-all">{editingUser.email}</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">
                            Reset Access Cipher <span className="opacity-50 font-medium">(leave blank to keep current)</span>
                          </label>
                          <input
                            type="password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#020617] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="flex items-center gap-2.5 py-1">
                          <input
                            type="checkbox"
                            id="editDisabled"
                            checked={editDisabled}
                            onChange={(e) => setEditDisabled(e.target.checked)}
                            disabled={editingUser.email.toLowerCase() === currentUser.toLowerCase()}
                            className="rounded border-white/10 bg-[#020617] text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                          <label 
                            htmlFor="editDisabled" 
                            className={`text-[11px] font-bold text-stone-300 cursor-pointer select-none ${
                              editingUser.email.toLowerCase() === currentUser.toLowerCase() ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                          >
                            Disable/Lock active profile permissions
                          </label>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-black tracking-wider uppercase text-[10px] rounded-xl hover:bg-amber-400 transition-all cursor-pointer"
                          >
                            COMMIT UPDATES
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10 font-bold uppercase text-[10px] rounded-xl transition-all cursor-pointer"
                          >
                            ABORT
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Standard helper block */}
                    {!isAddingUser && !editingUser && (
                      <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-6.5 text-xs text-zinc-400 leading-relaxed space-y-3.5">
                        <div className="flex items-center gap-2 text-white font-bold">
                          <KeyRound size={14} className="text-red-500 animate-pulse" />
                          <h4 className="uppercase tracking-wide font-black">Authentication Commands</h4>
                        </div>
                        <p>
                          Verify credentials directly. Operators disabled can no longer submit any scanning actions or request report outputs from the platform.
                        </p>
                        <p className="font-mono text-[9px] text-zinc-500 border-t border-white/5 pt-3">
                          NODE SECURED // ALL MUTATIONS PHYSICALLY LOGGED
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Maintenance directives */}
              {activeTab === 'maintenance' && (
                <div className="max-w-3xl bg-slate-950/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Server size={100} className="text-amber-500 animate-pulse" />
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-6 border-b border-white/15">
                    <div className="text-left space-y-1.5 max-w-xl">
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                        GLOBAL DIRECTIVE CONTROLLER
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight uppercase">Interactive Maintenance Overrides</h3>
                      <p className="text-xs text-vuln-muted leading-relaxed">
                        Setting site-wide maintenance Mode to <strong className="text-amber-400 font-extrabold uppercase">ON</strong> immediately redirects all regular emulative security operators to the Deep Maintenance page, safely isolating testing targets. Administrative profiles bypass this check automatically.
                      </p>
                    </div>

                    <button
                      onClick={handleToggleMaintenance}
                      className={`py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 border transition-all cursor-pointer shrink-0 ${
                        maintenanceMode
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-400'
                      }`}
                    >
                      <Radio size={14} className={maintenanceMode ? 'animate-pulse' : ''} />
                      <span>{maintenanceMode ? 'MAINTENANCE: ACTIVE' : 'MAINTENANCE: OFFLINE'}</span>
                    </button>
                  </div>

                  {/* Warning Box */}
                  <div className="mt-6 p-4 rounded-2xl border border-amber-500/10 bg-amber-950/10 text-xs text-amber-300 leading-relaxed flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <span className="font-bold text-white uppercase font-mono tracking-wider text-[10px] block">CRITICAL IMPACT WARNING</span>
                      <p>
                        Transitioning states will actively terminate connections in mid-probe. Be absolutely certain other operators finished generating files and PDFs before enforcing this global directive.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Phishing Leakage Buffer */}
              {activeTab === 'phishing' && (
                <div className="max-w-4xl bg-slate-950/60 border border-white/5 rounded-3xl p-6.5 relative">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Terminal size={16} className="text-red-500" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Captured credentials.txt buffer dump
                      </h3>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={handleRefreshCredentials}
                        disabled={isLogRefreshing}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-extrabold uppercase text-white cursor-pointer transition-colors"
                      >
                        {isLogRefreshing ? 'Refreshing...' : 'Pull Plaintext Logs'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCredentials}
                        className="px-3.5 py-1.5 rounded-xl bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 text-[10px] font-extrabold uppercase text-red-400 cursor-pointer transition-colors"
                      >
                        Wipe Buffer
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-vuln-muted leading-relaxed mb-5">
                    Logged credentials submitted during scanning and target loops are saved automatically on the filesystem path: <code className="text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded font-mono text-[10px]">/storage/credentials.txt</code> inside the Cloud Run host.
                  </p>

                  {/* Log View Buffer Area */}
                  <div className="relative rounded-2xl bg-[#020617] p-4.5 border border-white/5 font-mono text-xs leading-relaxed text-left">
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      <button
                        onClick={() => setShowRawPasswords(!showRawPasswords)}
                        className="text-zinc-400 hover:text-white transition-colors p-1.5 bg-slate-950 border border-white/10 rounded-lg cursor-pointer"
                        title={showRawPasswords ? 'Mask passwords' : 'Show plaintext keys'}
                      >
                        {showRawPasswords ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>

                    <span className="text-[9px] text-zinc-500 block mb-2.5 border-b border-white/5 pb-1 uppercase tracking-widest font-black">
                      Raw Stream File Output
                    </span>

                    <div className="max-h-[300px] overflow-y-auto font-mono scrollbar-thin text-stone-300 space-y-1">
                      {credentialsContent.trim() ? (
                        credentialsContent.trim().split('\n').map((line, idx) => {
                          let displayLine = line;
                          if (!showRawPasswords && line.includes('password=')) {
                            displayLine = line.replace(/password=[^|]+/g, 'password=********');
                            displayLine = displayLine.replace(/confirmPassword=[^\s]+/g, 'confirmPassword=********');
                          }
                          return (
                            <div key={idx} className="hover:bg-white/5 py-1 px-2 rounded-lg flex items-start gap-2.5 select-all">
                              <span className="text-red-500 shrink-0">❯</span>
                              <span className="break-all">{displayLine}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-zinc-600 text-xs py-10 text-center select-none font-sans">
                          -- LOGGER IS CURRENTLY IMMACULATE -- No active credentials signatures detected.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating feedback alert */}
      <div className="fixed bottom-6 left-6 z-[120]">
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="flex items-center gap-2.5 bg-[#020617] border border-red-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.25)] text-xs text-white"
            >
              <CheckCircle2 className="text-red-500 shrink-0" size={16} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
