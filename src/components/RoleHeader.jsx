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
import ClientThreeDotMenu from './ClientThreeDotMenu';

export default function RoleHeader({ 
  currentUser, 
  setCurrentUser,
  users,
  setUsers,
  onLogout,
  onOpenAuth 
}) {
  return (
    <div className="role-banner-bar no-print" style={{ 
      background: '#ffffff', 
      borderBottom: '1px solid var(--border-light)',
      padding: '0.45rem 0.85rem' 
    }}>
      <div className="role-banner-inner" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        maxWidth: '1440px', 
        margin: '0 auto',
        width: '100%',
        gap: '0.5rem',
        flexWrap: 'nowrap'
      }}>
        
        {/* Left: Portal Identity Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ 
            background: 'var(--orange-primary)', 
            color: '#fff', 
            fontWeight: 900, 
            fontSize: '0.78rem', 
            padding: '3px 8px', 
            borderRadius: '6px',
            letterSpacing: '0.04em',
            flexShrink: 0
          }}>
            SCAFFBUILD
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0, overflow: 'hidden' }}>
            <span style={{ color: 'var(--border-subtle)', flexShrink: 0 }}>|</span>
            {currentUser?.role === 'owner' && (
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Yard Admin
              </span>
            )}

            {currentUser?.role === 'client' && (
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Client Portal
              </span>
            )}

            {currentUser?.role === 'worker' && (
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Worker Portal
              </span>
            )}

            {!currentUser && (
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Construction ERP
              </span>
            )}
          </div>
        </div>

        {/* Right: Authenticated User Info & Logout / 3-Dot Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                background: '#f8fafc', 
                padding: '0.25rem 0.65rem', 
                borderRadius: '999px',
                border: '1px solid var(--border-light)',
                maxWidth: '160px'
              }}>
                <span style={{ fontSize: '0.92rem', flexShrink: 0 }}>{currentUser.avatar || '👤'}</span>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser.name}
                  </div>
                </div>
              </div>

              {/* In client page, instead of direct log out button, display 3-dots menu! */}
              {currentUser?.role === 'client' ? (
                <ClientThreeDotMenu 
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  users={users}
                  setUsers={setUsers}
                  onLogout={onLogout}
                />
              ) : (
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
              )}
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
