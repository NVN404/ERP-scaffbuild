import React from 'react';
import { 
  Building2, 
  FileText, 
  Send,
  Calculator, 
  Settings, 
  LogOut,
  HardHat,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  quotations,
  currentUser,
  onLogout 
}) {
  const pendingQuotations = (quotations || []).filter(q => q.status === 'requested').length;

  // Core Tabs for Mobile App & Top Nav:
  const tabs = [
    { id: 'dashboard', label: 'Yard & Stats', icon: Building2 },
    { id: 'billing', label: 'Bills & GST', icon: FileText, badge: 'Tax / Cash' },
    { id: 'quotations', label: 'Work Orders', icon: Send, count: pendingQuotations },
    { id: 'settings', label: 'More', icon: Settings }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="top-navbar no-print" style={{ padding: '0.6rem 1rem' }}>
        <div className="navbar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Brand */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(255, 107, 0, 0.35)'
            }}>
              <HardHat size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.1 }}>
                ScaffBuild <span style={{ color: 'var(--orange-primary)' }}>ERP</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                👑 Admin ({currentUser?.name || 'Santosh'})
              </div>
            </div>
          </div>

          {/* Desktop/Tablet 3 Tab Pills */}
          <nav className="nav-tabs desktop-only-tabs" style={{ margin: 0, padding: '3px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span style={{
                      background: isActive ? '#ffffff' : 'var(--orange-primary)',
                      color: isActive ? 'var(--orange-primary)' : '#ffffff',
                      fontSize: '0.65rem',
                      padding: '1px 5px',
                      borderRadius: '999px',
                      fontWeight: 800
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Icons: Calculator, Settings, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'calculator' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-md)' }}
              onClick={() => setActiveTab('calculator')}
              title="Area & Volume Calculator (Sq.Ft / m³)"
            >
              <Calculator size={15} />
              <span className="hide-on-small-mobile">Calculator</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-md)' }}
              onClick={() => setActiveTab('settings')}
              title="Yard Settings & IRIS IRP Hub"
            >
              <Settings size={15} />
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ padding: '0.4rem 0.65rem', color: '#e11d48', borderColor: '#fecdd3' }}
              onClick={onLogout}
              title="Log Out"
            >
              <LogOut size={15} />
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly 3 Tabs) */}
      <div className="mobile-bottom-nav no-print">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: 'var(--orange-primary)',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    padding: '1px 4px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    minWidth: '14px',
                    textAlign: 'center'
                  }}>
                    {tab.count}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
