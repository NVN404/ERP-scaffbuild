import React, { useState } from 'react';
import { 
  Building2, 
  HardHat, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Phone
} from 'lucide-react';
import { 
  signInUser, 
  signUpUser, 
  signInWithGoogle, 
  mapSupabaseUserToAppUser,
  fetchUserProfile 
} from '../utils/supabaseClient';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  setCurrentUser,
  setUsers 
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register'
  const [registerRole, setRegisterRole] = useState('client'); // 'client' or 'worker' only!

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Register Form (For Clients & Workers)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    gstin: '',
    trade: 'Shuttering Foreman',
    siteName: '',
    siteLocation: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  if (!isOpen) return null;

  // Unified Sign In Handler (Admin + Supabase Clients & Workers)
  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);

    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    // 1. Check for Admin Santosh (Fixed Admin Credentials: user "santosh", password "xrgt")
    if (
      (cleanIdentifier === 'santosh' || cleanIdentifier === 'santosh@scaffbuild.com') && 
      loginPassword === 'xrgt'
    ) {
      const adminUser = {
        id: 'usr_owner_santosh',
        role: 'owner',
        name: 'Santosh',
        username: 'santosh',
        title: 'Owner & Managing Director',
        companyName: 'ScaffBuild Shuttering & Scaffolding Co.',
        email: 'santosh@scaffbuild.com',
        phone: '+91 98201 54321',
        avatar: '👑'
      };

      setCurrentUser(adminUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(adminUser));
      setUsers(prev => {
        const exists = prev.some(u => u.id === adminUser.id);
        return exists ? prev : [adminUser, ...prev];
      });

      setLoginLoading(false);
      onClose();
      return;
    }

    // 2. Direct Worker Login Support (Username "worker", Password "polo")
    if (
      (cleanIdentifier === 'worker' || cleanIdentifier === 'worker@scaffbuild.com' || cleanIdentifier === 'usr_worker_1') && 
      (loginPassword === 'polo' || loginPassword === 'polopolo')
    ) {
      const workerUser = {
        id: 'usr_worker_1',
        role: 'worker',
        name: 'Sunil Kumar',
        username: 'worker',
        trade: 'Senior Shuttering & Scaffolding Foreman',
        workerCode: 'WRK-108',
        email: 'worker@scaffbuild.com',
        phone: '+91 97654 88210',
        assignedSites: ['Main Project Site', 'SP Imperial Tower B & C', 'Navi Mumbai Metro Line 1'],
        avatar: '👷',
        skills: ['Slab Staging', 'Cuplock Erection', 'Safety Harness Level 2']
      };

      setCurrentUser(workerUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(workerUser));
      setUsers(prev => {
        const exists = prev.some(u => u.id === workerUser.id || u.email === workerUser.email);
        return exists ? prev : [workerUser, ...prev];
      });

      setLoginLoading(false);
      onClose();
      return;
    }

    // 3. Direct login support for tempory2911@gmail.com / polopolo
    if (cleanIdentifier === 'tempory2911@gmail.com' && (loginPassword === 'polopolo' || loginPassword === 'polo')) {
      try {
        const { user } = await signInUser({
          email: loginIdentifier.trim(),
          password: loginPassword
        });
        if (user) {
          const profile = await fetchUserProfile(user.id);
          const appUser = mapSupabaseUserToAppUser(user, profile);
          setCurrentUser(appUser);
          localStorage.setItem('scaffbuild_current_user', JSON.stringify(appUser));
          onClose();
          return;
        }
      } catch (e) {
        console.log('Supabase signin attempt:', e?.message);
      }

      const tempClientUser = {
        id: '356bb2cd-ee50-42d6-ae58-97952b9f5dfe',
        role: 'client',
        name: 'ASG WIN INDIA Project Head',
        title: 'Project Procurement Head',
        companyName: 'ASG WIN INDIA PRIVATE LIMITED',
        email: 'tempory2911@gmail.com',
        phone: '+91 98200 99999',
        avatar: '🏢',
        sites: [
          {
            id: 'site_icon_micasa',
            name: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
            location: 'Jigani Bommasandra Link Road, Industrial Area',
            city: 'Bangalore',
            state: 'Karnataka',
            siteEngineer: 'Er. Rajesh Patil',
            phone: '+91 98200 99999',
            dueAmount: 62500,
            totalPcs: 65,
            ratePerSqft: 3,
            balanceAreaSqft: 25000,
            lastDate: '26 Oct 26',
            badgeType: 'Sqft Area Mix',
            active: true,
            slabAreaSqft: 18500
          },
          {
            id: 'site_greenwood',
            name: 'GREEN Wood High School',
            location: 'Sarjapur Main Road, Chikkawadayarapura',
            city: 'Bangalore',
            state: 'Karnataka',
            siteEngineer: 'Sanjay More',
            phone: '+91 98334 11223',
            dueAmount: 1484000,
            totalPcs: 260,
            ratePerSqft: 3,
            balanceAreaSqft: 20000,
            lastDate: '1 Oct 26',
            badgeType: 'Sqft Area Mix',
            active: true,
            slabAreaSqft: 24000
          }
        ]
      };
      setCurrentUser(tempClientUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(tempClientUser));
      setUsers(prev => {
        const exists = prev.some(u => u.id === tempClientUser.id || u.email === tempClientUser.email);
        return exists ? prev : [tempClientUser, ...prev];
      });
      setLoginLoading(false);
      onClose();
      return;
    }

    // 3. Client & Worker Authentication via Supabase
    try {
      const { user } = await signInUser({
        email: loginIdentifier.trim(),
        password: loginPassword
      });

      if (user) {
        const profile = await fetchUserProfile(user.id);
        const appUser = mapSupabaseUserToAppUser(user, profile);

        setCurrentUser(appUser);
        localStorage.setItem('scaffbuild_current_user', JSON.stringify(appUser));
        setUsers(prev => {
          const exists = prev.some(u => u.id === appUser.id || u.email === appUser.email);
          return exists ? prev.map(u => (u.id === appUser.id || u.email === appUser.email ? appUser : u)) : [appUser, ...prev];
        });

        onClose();
      }
    } catch (err) {
      console.error('Sign In Error:', err);
      if (cleanIdentifier === 'santosh' && loginPassword !== 'xrgt') {
        setAuthError('Incorrect admin password for Santosh. Please enter the correct password.');
      } else {
        setAuthError(err.message || 'Invalid email or password. Please verify your credentials.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Register New Client or Worker via Supabase
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setRegisterLoading(true);

    try {
      if (regForm.password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const { user, session } = await signUpUser({
        email: regForm.email.trim(),
        password: regForm.password,
        role: registerRole, // 'client' or 'worker'
        name: regForm.name.trim(),
        phone: regForm.phone.trim(),
        companyName: registerRole === 'client' ? '' : (regForm.companyName?.trim() || ''),
        gstin: registerRole === 'client' ? '' : (regForm.gstin?.trim() || ''),
        trade: regForm.trade,
        siteName: registerRole === 'client' ? '' : (regForm.siteName?.trim() || ''),
        siteLocation: ''
      });

      if (user) {
        const profile = await fetchUserProfile(user.id);
        const appUser = mapSupabaseUserToAppUser(user, profile);

        if (session) {
          setCurrentUser(appUser);
          localStorage.setItem('scaffbuild_current_user', JSON.stringify(appUser));
          setUsers(prev => [appUser, ...prev]);
          alert(`🎉 Registration Successful! Logged in as ${appUser.name} (${registerRole.toUpperCase()}).`);
          onClose();
        } else {
          alert(`🎉 Account created for ${regForm.email}! If email verification is enabled, please check your inbox to confirm, then sign in.`);
          setActiveTab('login');
          setLoginIdentifier(regForm.email);
        }
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      await signInWithGoogle();
    } catch (err) {
      setAuthError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', maxHeight: 'calc(100vh - 3rem)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ 
              background: 'var(--orange-primary)', 
              color: '#ffffff', 
              padding: '0.45rem', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                ScaffBuild Portal Sign In
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Access for Yard Admin, Construction Clients, and Field Workers
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: '#f8fafc', flexShrink: 0 }}>
          <button
            type="button"
            className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              flex: 1, 
              borderRadius: 0, 
              border: 'none', 
              borderBottom: activeTab === 'login' ? '3px solid var(--orange-primary)' : '3px solid transparent',
              background: activeTab === 'login' ? 'var(--orange-soft)' : 'transparent',
              color: activeTab === 'login' ? 'var(--orange-dark)' : 'var(--text-muted)',
              fontWeight: activeTab === 'login' ? 700 : 500,
              padding: '0.75rem'
            }}
            onClick={() => { setActiveTab('login'); setAuthError(''); }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              flex: 1, 
              borderRadius: 0, 
              border: 'none', 
              borderBottom: activeTab === 'register' ? '3px solid var(--orange-primary)' : '3px solid transparent',
              background: activeTab === 'register' ? 'var(--orange-soft)' : 'transparent',
              color: activeTab === 'register' ? 'var(--orange-dark)' : 'var(--text-muted)',
              fontWeight: activeTab === 'register' ? 700 : 500,
              padding: '0.75rem'
            }}
            onClick={() => { setActiveTab('register'); setAuthError(''); }}
          >
            <UserPlus size={15} />
            <span>Register (Client / Worker)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0, padding: '1.25rem 1.5rem' }}>
          
          {/* Error Alert */}
          {authError && (
            <div style={{ 
              background: 'var(--rose-soft)', 
              border: '1px solid var(--rose-border)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.75rem 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--rose-primary)', 
              fontSize: '0.82rem', 
              marginBottom: '1rem' 
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <div>{authError}</div>
            </div>
          )}

          {/* TAB 1: SIGN IN (Supports Admin Santosh + Clients & Workers) */}
          {activeTab === 'login' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. santosh or client@builder.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                    autoFocus
                  />
                  <User size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-dim)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Demo Credentials */}
              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  QUICK DEMO CREDENTIALS (CLICK TO AUTO-FILL):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="badge badge-neutral"
                    style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '0.72rem', border: '1px solid var(--border-light)' }}
                    onClick={() => { setLoginIdentifier('worker'); setLoginPassword('polo'); }}
                  >
                    👷 Worker (worker / polo)
                  </button>
                  <button
                    type="button"
                    className="badge badge-neutral"
                    style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '0.72rem', border: '1px solid var(--border-light)' }}
                    onClick={() => { setLoginIdentifier('santosh'); setLoginPassword('xrgt'); }}
                  >
                    👑 Owner (santosh / xrgt)
                  </button>
                  <button
                    type="button"
                    className="badge badge-neutral"
                    style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '0.72rem', border: '1px solid var(--border-light)' }}
                    onClick={() => { setLoginIdentifier('tempory2911@gmail.com'); setLoginPassword('polopolo'); }}
                  >
                    🏢 Client (tempory2911 / polopolo)
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', padding: '0.75rem' }}
                disabled={loginLoading}
              >
                <LogIn size={16} />
                <span>{loginLoading ? 'Signing in...' : 'Sign In to Portal'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                <span style={{ padding: '0 0.75rem' }}>OR SOCIAL LOGIN</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
              </div>

              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                onClick={handleGoogleSignIn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER (Clients and Workers ONLY) */}
          {activeTab === 'register' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label className="form-label">Select Your Account Type:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className={`btn ${registerRole === 'client' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ 
                      fontSize: '0.82rem', 
                      padding: '0.65rem', 
                      justifyContent: 'center',
                      background: registerRole === 'client' ? 'var(--orange-primary)' : '#ffffff',
                      color: registerRole === 'client' ? '#ffffff' : 'var(--text-main)',
                      borderColor: registerRole === 'client' ? 'var(--orange-primary)' : 'var(--border-light)'
                    }}
                    onClick={() => setRegisterRole('client')}
                  >
                    <span>🏢 Builder / Client</span>
                  </button>

                  <button
                    type="button"
                    className={`btn ${registerRole === 'worker' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ 
                      fontSize: '0.82rem', 
                      padding: '0.65rem', 
                      justifyContent: 'center',
                      background: registerRole === 'worker' ? '#059669' : '#ffffff',
                      color: registerRole === 'worker' ? '#ffffff' : 'var(--text-main)',
                      borderColor: registerRole === 'worker' ? '#059669' : 'var(--border-light)'
                    }}
                    onClick={() => setRegisterRole('worker')}
                  >
                    <span>👷 Site Worker</span>
                  </button>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Ramesh Patil"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="e.g. +91 98200 12345"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="user@builder.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password (min 6 chars)</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Worker Details (Only shown for worker role) */}
              {registerRole === 'worker' && (
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#059669' }}>
                    👷 Field Worker Profile
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Trade / Skill Category</label>
                      <select 
                        className="form-select"
                        value={regForm.trade}
                        onChange={(e) => setRegForm({ ...regForm, trade: e.target.value })}
                      >
                        <option value="Shuttering Foreman">Shuttering Foreman</option>
                        <option value="Cuplock Scaffolding Rigger">Cuplock Scaffolding Rigger</option>
                        <option value="Slab Staging Carpenter">Slab Staging Carpenter</option>
                        <option value="Safety Supervisor">Safety Supervisor</option>
                        <option value="General Equipment Handler">General Equipment Handler</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned Site / Project</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Tower B & C"
                        value={regForm.siteName}
                        onChange={(e) => setRegForm({ ...regForm, siteName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
                disabled={registerLoading}
              >
                <UserPlus size={16} />
                <span>{registerLoading ? 'Creating Account in Supabase...' : `Register as ${registerRole === 'client' ? 'Client' : 'Worker'}`}</span>
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ flexShrink: 0, justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            🔒 Powered by Supabase Auth & Cloud Database
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
