import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, 
  X, 
  Search, 
  Check, 
  Phone, 
  KeyRound, 
  LogOut, 
  Package, 
  Eye, 
  EyeOff, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Globe,
  Settings
} from 'lucide-react';
import { getSupabase } from '../utils/supabaseClient';

// Authentic scaffolding & shuttering materials catalog with photos & live yard rental rates
const MENU_CARD_MATERIALS = [
  {
    id: "MAT-SH-1200",
    name: "MS Shuttering Plate 1200x600 mm (4' x 2')",
    category: "Shuttering Plates",
    photo: "/materials/shuttering_plates.jpg",
    specs: "Weight: 16.0 kg • 2.5mm MS Sheet with stiffener angles",
    hsn: "73084000",
    dailyRate: 2.0,
    monthlyRate: 55,
    replacementCost: 880,
    availableStock: 2800,
    yardLocation: "Bay A-2 (Heavy Staging)",
    tag: "Most Popular",
    description: "Heavy duty pressed steel shuttering plate for slabs, beams, and columns with pre-drilled holes for rapid clamp pinning."
  },
  {
    id: "MAT-SH-900",
    name: "MS Shuttering Plate 900x600 mm (3' x 2')",
    category: "Shuttering Plates",
    photo: "/materials/shuttering_plates.jpg",
    specs: "Weight: 12.5 kg • High tensile structural steel",
    hsn: "73084000",
    dailyRate: 1.5,
    monthlyRate: 40,
    replacementCost: 680,
    availableStock: 3500,
    yardLocation: "Bay A-1",
    tag: "High Stock",
    description: "Standard construction shuttering plate engineered for flexible slab dimensioning and column casting."
  },
  {
    id: "MAT-PROP-2035",
    name: "Telescopic Steel Prop 2.0m to 3.5m (Acrow Jack)",
    category: "Telescopic Props",
    photo: "/materials/telescopic_props.jpg",
    specs: "Weight: 18.5 kg • Outer 60.3mm / Inner 48.3mm with quick-turn nut",
    hsn: "73084000",
    dailyRate: 3.5,
    monthlyRate: 95,
    replacementCost: 980,
    availableStock: 4000,
    yardLocation: "Yard Bay B-1",
    tag: "Essential",
    description: "Heavy duty adjustable vertical prop with threaded sleeve for fast slab leveling and high load-bearing capacity."
  },
  {
    id: "MAT-PROP-3045",
    name: "Telescopic Steel Prop 3.0m to 4.5m (High Staging)",
    category: "Telescopic Props",
    photo: "/materials/telescopic_props.jpg",
    specs: "Weight: 23.0 kg • Extended height staging with forged lock pin",
    hsn: "73084000",
    dailyRate: 4.5,
    monthlyRate: 120,
    replacementCost: 1280,
    availableStock: 1500,
    yardLocation: "Yard Bay B-2",
    tag: "High Staging",
    description: "Commercial high-rise staging prop for double-height lobbies, commercial basements, and elevated slab casting."
  },
  {
    id: "MAT-CUP-VERT",
    name: "Cuplock Standard Vertical Pipe 3.0m (10 Ft)",
    category: "Cuplock System",
    photo: "/materials/cuplock_scaffolding.jpg",
    specs: "Weight: 15.2 kg • 48.3mm OD pipe with forged top cups @ 500mm spacing",
    hsn: "73084000",
    dailyRate: 2.5,
    monthlyRate: 65,
    replacementCost: 850,
    availableStock: 3200,
    yardLocation: "Rack C-1",
    tag: "Certified",
    description: "Galvanized vertical standard with captive movable top cups that lock up to 4 horizontal ledgers with a single hammer blow."
  },
  {
    id: "MAT-CUP-LEDG",
    name: "Cuplock Ledger Horizontal Pipe 1.8m (6 Ft)",
    category: "Cuplock System",
    photo: "/materials/cuplock_scaffolding.jpg",
    specs: "Weight: 7.2 kg • Forged blade ends for rigid cuplock node connection",
    hsn: "73084000",
    dailyRate: 1.8,
    monthlyRate: 45,
    replacementCost: 520,
    availableStock: 4500,
    yardLocation: "Rack C-3",
    tag: "High Demand",
    description: "Horizontal connecting member with forged captive wedge blades for robust structural stability."
  },
  {
    id: "MAT-CLAMP-SWIVEL",
    name: "Drop Forged Swivel Coupler Clamp 360°",
    category: "Clamps & Couplers",
    photo: "/materials/scaffold_clamps.jpg",
    specs: "Weight: 1.2 kg • BS 1139 / EN 74 certified heavy duty steel",
    hsn: "73084000",
    dailyRate: 0.6,
    monthlyRate: 15,
    replacementCost: 140,
    availableStock: 8000,
    yardLocation: "Bin D-1",
    tag: "Certified",
    description: "High-grade forged swivel clamp for diagonal bracing and connecting two 48.3mm scaffolding tubes at any angle."
  },
  {
    id: "MAT-CLAMP-FIXED",
    name: "Right Angle Fixed Coupler Clamp 90°",
    category: "Clamps & Couplers",
    photo: "/materials/scaffold_clamps.jpg",
    specs: "Weight: 1.15 kg • Heavy duty drop forged 90-degree load clamp",
    hsn: "73084000",
    dailyRate: 0.6,
    monthlyRate: 15,
    replacementCost: 130,
    availableStock: 9500,
    yardLocation: "Bin D-2",
    tag: "Bulk Stock",
    description: "Heavy duty 90-degree right angle coupler for connecting horizontal tubes to vertical standards."
  },
  {
    id: "MAT-WALK-PLANK",
    name: "Steel Walkway Plank (Jali Chali) 2.5m x 300mm",
    category: "Walkway Planks",
    photo: "/materials/walkway_planks.jpg",
    specs: "Weight: 14.5 kg • Galvanized perforated anti-slip with safety end-hooks",
    hsn: "73084000",
    dailyRate: 3.0,
    monthlyRate: 80,
    replacementCost: 950,
    availableStock: 1800,
    yardLocation: "Bay E-1",
    tag: "Safety Approved",
    description: "Anti-skid perforated walkway platform plank with integral safety hooks for safe worker movement at elevated heights."
  },
  {
    id: "MAT-JACK-BASE",
    name: "Adjustable Hollow Screw Base Jack (38mm x 600mm)",
    category: "Jacks & Bases",
    photo: "/materials/base_jacks.jpg",
    specs: "Weight: 4.8 kg • Solid 150x150mm base plate with cast iron nut",
    hsn: "73084000",
    dailyRate: 1.2,
    monthlyRate: 32,
    replacementCost: 380,
    availableStock: 3000,
    yardLocation: "Bin F-1",
    tag: "Foundation",
    description: "Adjustable foundation screw jack with heavy square base plate for leveling vertical scaffolding on uneven ground."
  },
  {
    id: "MAT-JACK-UHEAD",
    name: "Adjustable Stirrup U-Head Jack (600mm Height)",
    category: "Jacks & Bases",
    photo: "/materials/base_jacks.jpg",
    specs: "Weight: 5.2 kg • Heavy welded steel U-channel for wooden / steel H-beams",
    hsn: "73084000",
    dailyRate: 1.4,
    monthlyRate: 36,
    replacementCost: 420,
    availableStock: 2500,
    yardLocation: "Bin F-2",
    tag: "Beam Staging",
    description: "U-head jack for supporting timber runners, steel girders, and H20 beams under concrete slab formwork."
  }
];

export default function ClientThreeDotMenu({
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  onLogout,
  onOpenSettings,
  currentLanguage,
  onLanguageChange,
  onRequestMaterial,
  buttonStyle = {},
  variant = 'default'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMaterialsOpen(false);
        setIsPasswordOpen(false);
        setIsPhoneOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      
      {/* 3-DOTS TRIGGER BUTTON */}
      <button
        type="button"
        id="client-three-dot-menu-button"
        aria-label="Open client menu"
        aria-expanded={isOpen}
        title="Client Options (Available Materials, Password, Phone, Log Out)"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? '#f1f5f9' : '#ffffff',
          border: '1.5px solid #d1d5db',
          borderRadius: '8px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#1e293b',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease',
          ...buttonStyle
        }}
      >
        <MoreVertical size={18} strokeWidth={2.3} />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            width: 'min(270px, calc(100vw - 20px))',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 12px 28px -4px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            zIndex: 1050,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* User Brief Card */}
          <div style={{
            background: '#f8fafc',
            padding: '0.75rem 0.95rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{currentUser?.avatar || '🏢'}</span>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {currentUser?.name || 'Client User'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Options List */}
          <div style={{ padding: '0.35rem 0' }}>
            
            {/* 1. AVAILABLE MATERIALS MENU CARD WITH PHOTOS */}
            <button
              type="button"
              id="menu-opt-materials-card"
              onClick={() => {
                setIsOpen(false);
                setIsMaterialsOpen(true);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.95rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--orange-primary)',
                flexShrink: 0
              }}>
                <Package size={17} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Available Materials</span>
                  <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>PHOTOS</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Menu card with yard photos & rates
                </div>
              </div>
            </button>

            {/* 2. MORE SETTINGS (PROJECT, PROFILE, USERS, APP) */}
            {onOpenSettings && (
              <button
                type="button"
                id="menu-opt-more-settings"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.95rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f3e8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9333ea',
                  flexShrink: 0
                }}>
                  <Settings size={17} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827' }}>
                    More Settings
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Profile, Project Name, Users & Products
                  </div>
                </div>
              </button>
            )}

            {/* 3. CHANGE LANGUAGE (KANNADA, HINDI, ENGLISH) */}
            <button
              type="button"
              id="menu-opt-change-language"
              onClick={() => {
                setIsOpen(false);
                setIsLanguageOpen(true);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.95rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
                flexShrink: 0
              }}>
                <Globe size={17} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Change Language</span>
                  <span style={{ fontSize: '0.62rem', background: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>ಕನ್ನಡ / हिन्दी</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  English, ಕನ್ನಡ, हिन्दी
                </div>
              </div>
            </button>

            {/* 2. FORGOT PASSWORD */}
            <button
              type="button"
              id="menu-opt-forgot-password"
              onClick={() => {
                setIsOpen(false);
                setIsPasswordOpen(true);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.95rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                flexShrink: 0
              }}>
                <KeyRound size={17} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827' }}>
                  Forgot Password
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Reset or change account password
                </div>
              </div>
            </button>

            {/* 3. CHANGE PHONE NUMBER */}
            <button
              type="button"
              id="menu-opt-change-phone"
              onClick={() => {
                setIsOpen(false);
                setIsPhoneOpen(true);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.95rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                flexShrink: 0
              }}>
                <Phone size={17} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827' }}>
                  Change Phone Number
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Update for WhatsApp bills & challans
                </div>
              </div>
            </button>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

            {/* 4. LOG OUT */}
            <button
              type="button"
              id="menu-opt-logout"
              onClick={() => {
                setIsOpen(false);
                if (onLogout) onLogout();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.95rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#e11d48',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ffe4e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e11d48',
                flexShrink: 0
              }}>
                <LogOut size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#e11d48' }}>
                  Log Out
                </div>
                <div style={{ fontSize: '0.7rem', color: '#f43f5e' }}>
                  End current client portal session
                </div>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: AVAILABLE MATERIALS LIKE A MENU CARD WITH PHOTOS                 */}
      {/* ========================================================================= */}
      {isMaterialsOpen && (
        <AvailableMaterialsModal 
          onClose={() => setIsMaterialsOpen(false)}
          onRequestMaterial={onRequestMaterial}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORGOT PASSWORD (RESET PASSWORD)                                 */}
      {/* ========================================================================= */}
      {isPasswordOpen && (
        <ForgotPasswordModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
          onClose={() => setIsPasswordOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CHANGE PHONE NUMBER                                              */}
      {/* ========================================================================= */}
      {isPhoneOpen && (
        <ChangePhoneNumberModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
          onClose={() => setIsPhoneOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CHANGE LANGUAGE (ENGLISH, KANNADA, HINDI)                        */}
      {/* ========================================================================= */}
      {isLanguageOpen && (
        <ChangeLanguageModal
          isOpen={isLanguageOpen}
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          onClose={() => setIsLanguageOpen(false)}
        />
      )}

    </div>
  );
}

// =============================================================================
// SUB-MODAL 1: AVAILABLE MATERIALS MENU CARD WITH PHOTOS
// =============================================================================
function AvailableMaterialsModal({ onClose, onRequestMaterial }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterialPreview, setSelectedMaterialPreview] = useState(null);

  const categories = [
    'ALL',
    'Shuttering Plates',
    'Telescopic Props',
    'Cuplock System',
    'Clamps & Couplers',
    'Walkway Planks',
    'Jacks & Bases'
  ];

  const filteredMaterials = MENU_CARD_MATERIALS.filter(m => {
    const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      m.name.toLowerCase().includes(q) || 
      m.category.toLowerCase().includes(q) || 
      m.specs.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="modal-backdrop" style={{ zIndex: 1200, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal-content"
        style={{
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          background: '#ffffff'
        }}
      >
        {/* Header - Menu Card Styling */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--orange-primary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: 'var(--orange-primary)',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.05em'
              }}>
                MENU CARD
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                Available Materials & Equipment
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Live Yard Inventory • Verified Heavy Duty Construction Gear with Photos & Daily Hire Rates
            </p>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '999px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ padding: '0.85rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text"
              placeholder="Search shuttering plates, props, cuplock standards, couplers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 36px 8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '11px', pointerEvents: 'none' }} />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    border: active ? '1.5px solid var(--orange-primary)' : '1px solid #cbd5e1',
                    background: active ? 'var(--orange-soft)' : '#ffffff',
                    color: active ? 'var(--orange-primary)' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat === 'ALL' ? '🍽️ All Materials' : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Menu Cards Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: '0.85rem', background: '#f1f5f9' }}>
          {filteredMaterials.map(item => (
            <div 
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              {/* Photo Banner with Tag & Stock Overlay */}
              <div style={{ position: 'relative', height: '155px', background: '#e2e8f0', overflow: 'hidden' }}>
                <img 
                  src={item.photo} 
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {item.category}
                </div>

                {/* Popular Tag */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'var(--orange-primary)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '3px 7px',
                  borderRadius: '6px'
                }}>
                  {item.tag}
                </div>

                {/* Stock Tag Bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <span>● In Yard: {item.availableStock.toLocaleString()} Pcs</span>
                </div>
              </div>

              {/* Item Info (Like a restaurant menu description) */}
              <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}>
                    {item.specs}
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.35, margin: '0 0 10px 0' }}>
                    {item.description}
                  </p>
                </div>

                {/* Pricing Box (Menu Card Rate Card) */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 700 }}>DAILY RENT</div>
                      <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--orange-primary)' }}>
                        ₹{item.dailyRate.toFixed(2)}<span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>/day</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 700 }}>MONTHLY HIRE</div>
                      <div className="mono" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857' }}>
                        ₹{item.monthlyRate}<span style={{ fontSize: '0.65rem', color: '#64748b' }}>/mo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Request Button */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                  onClick={() => {
                    if (onRequestMaterial) {
                      onRequestMaterial(item);
                      onClose();
                    } else {
                      const msg = encodeURIComponent(`Hi Santosh, I would like to request ${item.name} for our site.`);
                      window.open(`https://wa.me/919820154321?text=${msg}`, '_blank');
                    }
                  }}
                >
                  <span>+ Request This Item</span>
                  <ArrowRight size={13} />
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div style={{
          padding: '0.75rem 1.25rem',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            Showing <strong>{filteredMaterials.length}</strong> equipment items ready for dispatch from Taloja Yard.
          </div>
          <button 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            style={{ fontSize: '0.78rem' }}
          >
            Close Menu Card
          </button>
        </div>

      </div>
    </div>
  );
}

// =============================================================================
// SUB-MODAL 2: FORGOT PASSWORD
// =============================================================================
function ForgotPasswordModal({ currentUser, setCurrentUser, users, setUsers, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (!newPassword || newPassword.length < 6) {
      setStatus({ type: 'error', msg: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try Supabase password update if active session exists
      try {
        const sb = getSupabase();
        if (sb?.auth) {
          await sb.auth.updateUser({ password: newPassword });
        }
      } catch (err) {
        console.log('Supabase auth update notice:', err?.message);
      }

      // 2. Update local state and current user
      if (setUsers) {
        setUsers(prev => prev.map(u => {
          if (u.id === currentUser?.id || u.email === currentUser?.email) {
            return { ...u, password: newPassword };
          }
          return u;
        }));
      }

      // 3. Update localStorage
      const updatedUser = { ...currentUser, password: newPassword };
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(updatedUser));
      if (setCurrentUser) setCurrentUser(updatedUser);

      setStatus({ 
        type: 'success', 
        msg: '✅ Password updated successfully! Your new password is now active for future sign-ins.' 
      });

      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Failed to update password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1200, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal-content"
        style={{
          maxWidth: '440px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          background: '#ffffff'
        }}
      >
        <div style={{
          padding: '1.15rem 1.25rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <KeyRound size={17} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Reset Password
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Set a new password for your client account
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          {/* User Email/Account Read-only preview */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: '#64748b' }}>Account: </span>
            <strong style={{ color: '#0f172a' }}>{currentUser?.email || currentUser?.phone || 'client@builder.com'}</strong>
          </div>

          {status.msg && (
            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: status.type === 'success' ? '#065f46' : '#991b1b',
              border: status.type === 'success' ? '1px solid #10b981' : '1px solid #f87171'
            }}>
              {status.msg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter at least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1.5 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// =============================================================================
// SUB-MODAL 3: CHANGE PHONE NUMBER
// =============================================================================
function ChangePhoneNumberModal({ currentUser, setCurrentUser, users, setUsers, onClose }) {
  const [newPhone, setNewPhone] = useState(currentUser?.phone || '');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    const clean = newPhone.replace(/\D/g, '');
    if (clean.length < 10) {
      setStatus({ type: 'error', msg: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsSubmitting(true);
    const formatted = `+91 ${clean.slice(-10, -5)} ${clean.slice(-5)}`;

    try {
      // 1. Update in users array
      if (setUsers) {
        setUsers(prev => prev.map(u => {
          if (u.id === currentUser?.id || u.email === currentUser?.email) {
            return { ...u, phone: formatted };
          }
          return u;
        }));
      }

      // 2. Update currentUser
      const updatedUser = { ...currentUser, phone: formatted };
      if (setCurrentUser) setCurrentUser(updatedUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(updatedUser));

      setStatus({
        type: 'success',
        msg: `✅ Mobile number successfully updated to ${formatted}! SMS notifications and WhatsApp PDF bills will now be delivered here.`
      });

      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Failed to update phone number.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1200, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal-content"
        style={{
          maxWidth: '440px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          background: '#ffffff'
        }}
      >
        <div style={{
          padding: '1.15rem 1.25rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Phone size={17} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Change Phone Number
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                For WhatsApp bills, dispatch challans & OTP
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: '#64748b' }}>Current Registered Number: </span>
            <strong style={{ color: '#047857' }}>{currentUser?.phone || 'Not registered'}</strong>
          </div>

          {status.msg && (
            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: status.type === 'success' ? '#065f46' : '#991b1b',
              border: status.type === 'success' ? '1px solid #10b981' : '1px solid #f87171'
            }}>
              {status.msg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              New Mobile Phone Number
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                background: '#f1f5f9',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#475569'
              }}>
                🇮🇳 +91
              </div>
              <input
                type="tel"
                className="form-input"
                placeholder="Enter 10-digit mobile number"
                value={newPhone.replace('+91', '').trim()}
                onChange={(e) => setNewPhone(e.target.value)}
                maxLength={14}
                required
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              We will send WhatsApp Delivery Challans and Invoices to this number.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              style={{ flex: 1.5 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Phone Number'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Interactive Change Language Modal (Supports English, Kannada, Hindi)
function ChangeLanguageModal({ isOpen, onClose, currentLanguage = 'en', onLanguageChange }) {
  if (!isOpen) return null;
  const [selected, setSelected] = useState(currentLanguage || localStorage.getItem('scaffbuild_language') || 'en');
  const [savedMsg, setSavedMsg] = useState(false);

  const languages = [
    { id: 'en', flag: '🇬🇧', name: 'English', subtitle: 'Standard Construction ERP interface', popular: 'Global / Enterprise' },
    { id: 'kn', flag: '🇮🇳', name: 'ಕನ್ನಡ (Kannada)', subtitle: 'ಕರ್ನಾಟಕ ಮತ್ತು ಬೆಂಗಳೂರು ಸೈಟ್ಗಳಿಗೆ', popular: 'Bangalore Yard / Karnataka' },
    { id: 'hi', flag: '🇮🇳', name: 'हिन्दी (Hindi)', subtitle: 'निर्माण स्थलों और ठेकेदारों के लिए', popular: 'North & Pan-India Sites' },
  ];

  const handleSave = (id) => {
    setSelected(id);
    localStorage.setItem('scaffbuild_language', id);
    if (onLanguageChange) onLanguageChange(id);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 450);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '440px', width: '92%', borderRadius: '16px', padding: 0, overflow: 'hidden' }}>
        <div style={{ background: '#0f172a', color: '#ffffff', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <Globe size={20} color="var(--orange-primary)" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Change Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Select preferred language for billing &amp; portal
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>

        <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {languages.map((l) => {
            const isSel = selected === l.id;
            return (
              <div
                key={l.id}
                onClick={() => handleSave(l.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: isSel ? '2px solid var(--orange-primary)' : '1.5px solid #e2e8f0',
                  background: isSel ? '#fff7ed' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{l.flag}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                      {l.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      {l.subtitle}
                    </div>
                  </div>
                </div>
                {isSel && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}

          {savedMsg && (
            <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.55rem', borderRadius: '8px', fontSize: '0.78rem', textAlign: 'center', fontWeight: 700 }}>
              ✓ Language preference saved!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
