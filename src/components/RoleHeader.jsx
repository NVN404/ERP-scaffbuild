import React from 'react';
import { 
  Building2, 
  LogOut, 
  LogIn,
  User,
  ShieldCheck,
  CheckCircle2,
  HardHat
} from 'lucide-react';

export default function RoleHeader({ 
  currentUser, 
  onLogout,
  onOpenAuth 
}) {
  return (
    <div className="role-banner-bar no-print" style={{ 
      background: '#ffffff', 
      borderBottom: '1px solid var(--border-light)',
      padding: '0.65rem 1.25rem' 
    }}>
      <div className="role-banner-inner" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        maxWidth: '1440px', 
        margin: '0 auto',
        width: '100%' 
      }}>
        
        {/* Left: Portal Identity Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--orange-primary)', 
            color: '#fff', 
            fontWeight: 900, 
            fontSize: '0.85rem', 
            padding: '4px 10px', 
            borderRadius: 'var(--radius-md)',
            letterSpacing: '0.04em'
          }}>
            SCAFFBUILD
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            {currentUser?.role === 'owner' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>👑 Yard Admin ERP</span>
                <span className="badge badge-gst" style={{ fontSize: '0.65rem' }}>Full Access</span>
              </span>
            )}

            {currentUser?.role === 'client' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>🏢 Client Portal</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.78rem' }}>
                  ({currentUser.companyName || 'Builder'})
                </span>
              </span>
            )}

            {currentUser?.role === 'worker' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>👷 Site Worker Portal</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.78rem' }}>
                  ({currentUser.trade || 'Field Operations'})
                </span>
              </span>
            )}

            {!currentUser && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Construction ERP & Portal
              </span>
            )}
          </div>
        </div>

        {/* Right: Authenticated User Info & Logout Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.55rem', 
                background: '#f8fafc', 
                padding: '0.35rem 0.75rem', 
                borderRadius: '999px',
                border: '1px solid var(--border-light)' 
              }}>
                <span style={{ fontSize: '1rem' }}>{currentUser.avatar || '👤'}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {currentUser.role === 'owner' ? 'Admin (Santosh)' : currentUser.email || currentUser.phone}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-outline btn-sm"
                style={{ 
                  color: '#e11d48', 
                  borderColor: '#fecdd3', 
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  gap: '0.35rem' 
                }}
                onClick={onLogout}
                title="Log Out of current session"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button 
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAuth}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
