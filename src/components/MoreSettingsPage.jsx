import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ArrowLeft,
  Share2, 
  Cloud, 
  HelpCircle, 
  Package, 
  User, 
  Building2, 
  RefreshCw, 
  Users, 
  Laptop, 
  Smartphone,
  ClipboardList, 
  FileText, 
  Globe, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Check, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Save, 
  X,
  AlertCircle,
  Truck,
  Layers
} from 'lucide-react';
import { getTranslation } from '../utils/translations';
import CompanySettings from './CompanySettings';

export default function MoreSettingsPage({
  currentUser,
  setCurrentUser,
  company,
  setCompany,
  users = [],
  setUsers,
  inventory = [],
  setInventory,
  clients = [],
  challans = [],
  invoices = [],
  quotations = [],
  onLogout,
  onBack,
  onResetAllData,
  onExportAllData,
  onImportAllData,
  currentLanguage = 'en',
  onLanguageChange
}) {
  // Current active sub-view / modal:
  // null (main menu matching screenshot)
  // 'share_app', 'web_desktop', 'contact_us', 'available_products'
  // 'user_profile', 'business_profile', 'switch_account', 'manage_users'
  // 'linked_devices', 'track_activities', 'invoice_settings'
  // 'change_language', 'change_password', 'logout_confirm'
  const [activeModal, setActiveModal] = useState(null);

  // Language state (persisted in localStorage)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('scaffbuild_language') || currentLanguage || 'en';
  });

  const t = (key) => getTranslation(lang, key);

  const handleSelectLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('scaffbuild_language', newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // QR Code for App Share
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL('https://scaffbuild.app', { width: 180, margin: 1 })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error(err));
  }, []);

  // -------------------------------------------------------------
  // Form State: User Profile
  // -------------------------------------------------------------
  const [userProfileForm, setUserProfileForm] = useState(() => ({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    title: currentUser?.title || '',
    avatar: currentUser?.avatar || '👑'
  }));

  const handleOpenUserProfile = () => {
    setUserProfileForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      title: currentUser?.title || '',
      avatar: currentUser?.avatar || '👑'
    });
    setActiveModal('user_profile');
  };

  const handleSaveUserProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...userProfileForm };
    setCurrentUser(updatedUser);
    localStorage.setItem('scaffbuild_current_user', JSON.stringify(updatedUser));
    if (setUsers) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
    showToast(lang === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಿದೆ!' : lang === 'hi' ? 'प्रोफ़ाइल सहेज ली गई!' : 'User Profile saved successfully!');
    setActiveModal(null);
  };

  // -------------------------------------------------------------
  // Form State: Business Profile & Project Name
  // -------------------------------------------------------------
  const [projectForm, setProjectForm] = useState({
    projectName: currentUser?.companyName || company?.name || 'SP Imperial Tower & Commercial Hub',
    companyLegalName: company?.name || 'SCAFFBUILD SHUTTERING & SCAFFOLDING CO. PVT. LTD.',
    tagline: company?.tagline || 'Heavy Construction Scaffolding, Formwork & Rental Equipment',
    gstin: company?.gstin || '27AABCS9876P1ZV',
    pan: company?.pan || 'AABCS9876P',
    yardAddress: company?.address || 'Plot No. 42, MIDC Heavy Industrial Zone, Taloja Yard 3, Navi Mumbai',
    phone: company?.phone || '+91 98201 54321',
    email: company?.email || 'billing@scaffbuild.in',
    state: company?.state || 'Maharashtra',
    stateCode: company?.stateCode || '27'
  });

  const handleSaveProjectAndBusiness = (e) => {
    e.preventDefault();
    if (setCompany) {
      setCompany(prev => ({
        ...prev,
        name: projectForm.companyLegalName,
        tagline: projectForm.tagline,
        gstin: projectForm.gstin,
        pan: projectForm.pan,
        address: projectForm.yardAddress,
        phone: projectForm.phone,
        email: projectForm.email,
        state: projectForm.state,
        stateCode: projectForm.stateCode
      }));
    }
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        companyName: projectForm.projectName
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(updatedUser));
    }
    showToast(lang === 'kn' ? 'ಪ್ರಾಜೆಕ್ಟ್ ಮತ್ತು ವ್ಯಾಪಾರ ಮಾಹಿತಿ ಅಪ್ಡೇಟ್ ಆಗಿದೆ!' : lang === 'hi' ? 'प्रोजेक्ट व व्यापार विवरण अपडेट हो गया!' : 'Project name and business profile updated!');
    setActiveModal(null);
  };

  // -------------------------------------------------------------
  // Form State: Change Password
  // -------------------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword.length < 4) {
      setPasswordError(lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳಿರಬೇಕು' : lang === 'hi' ? 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : 'New password must be at least 4 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ' : lang === 'hi' ? 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते' : 'New passwords do not match');
      return;
    }

    // Save to user object and localStorage
    if (currentUser) {
      const updatedUser = { ...currentUser, password: passwordForm.newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(updatedUser));
      if (setUsers) {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      }
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast(lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಗಿದೆ!' : lang === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल दिया गया!' : 'Password updated successfully!');
    setActiveModal(null);
  };

  // -------------------------------------------------------------
  // Form State: Add New User (Manage Users)
  // -------------------------------------------------------------
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    role: 'client',
    phone: '',
    email: '',
    title: 'Site Project Engineer'
  });

  const handleAddNewUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim()) return;

    const createdUser = {
      id: `usr_${Date.now()}`,
      name: newUserForm.name,
      role: newUserForm.role,
      phone: newUserForm.phone || '+91 98000 00000',
      email: newUserForm.email || `${newUserForm.name.toLowerCase().replace(/\s+/g, '')}@scaffbuild.com`,
      title: newUserForm.title,
      companyName: company?.name || 'ScaffBuild ERP',
      avatar: newUserForm.role === 'owner' ? '👑' : newUserForm.role === 'client' ? '🏢' : '👷'
    };

    if (setUsers) {
      setUsers(prev => [createdUser, ...prev]);
    }
    setNewUserForm({ name: '', role: 'client', phone: '', email: '', title: 'Site Project Engineer' });
    setIsAddUserOpen(false);
    showToast(lang === 'kn' ? 'ಹೊಸ ಬಳಕೆದಾರರನ್ನು ಸೇರಿಸಲಾಗಿದೆ!' : lang === 'hi' ? 'नया उपयोगकर्ता जोड़ा गया!' : 'New user added successfully!');
  };

  const handleSwitchAccount = (userToSwitch) => {
    setCurrentUser(userToSwitch);
    localStorage.setItem('scaffbuild_current_user', JSON.stringify(userToSwitch));
    showToast(lang === 'kn' ? `ಖಾತೆ ಬದಲಾಗಿದೆ: ${userToSwitch.name}` : lang === 'hi' ? `खाता बदल दिया: ${userToSwitch.name}` : `Switched to ${userToSwitch.name}`);
    setActiveModal(null);
  };

  // -------------------------------------------------------------
  // State: Available Products Filter & Search
  // -------------------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Shuttering Plates',
    'Telescopic Props',
    'Cuplock System',
    'Base Jacks',
    'Couplers & Clamps'
  ];

  const filteredProducts = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(productSearch.toLowerCase()) ||
      (item.hsn || '').includes(productSearch);
    
    if (productCategory === 'ALL') return matchesSearch;
    return matchesSearch && (item.category || '').toLowerCase().includes(productCategory.toLowerCase());
  });

  // -------------------------------------------------------------
  // Contact Us Message Form
  // -------------------------------------------------------------
  const [contactMsg, setContactMsg] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', message: '' });
  const handleSendContactMsg = (e) => {
    e.preventDefault();
    setContactMsg({ name: '', phone: '', message: '' });
    showToast(lang === 'kn' ? 'ನಿಮ್ಮ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ! ನಮ್ಮ ಯಾರ್ಡ್ ಸಿಬ್ಬಂದಿ ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.' : lang === 'hi' ? 'संदेश भेज दिया गया है! हमारी यार्ड टीम शीघ्र ही आपसे संपर्क करेगी।' : 'Message sent! Our yard manager will call you shortly.');
    setActiveModal(null);
  };

  // Share Actions
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ScaffBuild ERP - Shuttering & Scaffolding',
          text: 'Manage construction shuttering challans, yard stock & GST invoices with ScaffBuild ERP.',
          url: 'https://scaffbuild.app'
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      navigator.clipboard.writeText('https://scaffbuild.app');
      showToast(t('copied'));
    }
  };

  const handleCopyLink = (text = 'https://scaffbuild.app') => {
    navigator.clipboard.writeText(text);
    showToast(t('copied'));
  };

  // =============================================================
  // SUB-VIEW 1: INVOICE AND CHALLAN SETTINGS (CompanySettings)
  // =============================================================
  if (activeModal === 'invoice_settings') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0.75rem', background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setActiveModal(null)}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {t('invoiceAndChallanSettings')}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              {t('invoiceAndChallanSettingsDesc')}
            </p>
          </div>
        </div>

        <CompanySettings 
          company={company}
          setCompany={setCompany}
          onResetAllData={onResetAllData}
          onExportAllData={onExportAllData}
          onImportAllData={onImportAllData}
        />
      </div>
    );
  }

  // =============================================================
  // SUB-VIEW 2: AVAILABLE PRODUCTS CATALOG PAGE
  // =============================================================
  if (activeModal === 'available_products') {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1rem', background: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#0f172a' }}
            >
              <ArrowLeft size={22} strokeWidth={2.4} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {t('availableProducts')}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                {inventory.length} {lang === 'kn' ? 'ವಸ್ತುಗಳು ಲಭ್ಯವಿವೆ' : lang === 'hi' ? 'सामग्रियां यार्ड में उपलब्ध' : 'materials in Yard Inventory'}
              </p>
            </div>
          </div>

          <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
            ● Ready for Dispatch
          </span>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder={lang === 'kn' ? 'ವಸ್ತುಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: Cuplock, 3x2 Plate, Prop)...' : lang === 'hi' ? 'सामग्री खोजें (जैसे Cuplock, 3x2 प्लेट, प्रॉप)...' : 'Search shuttering & scaffolding products...'}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#f8fafc'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.65rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setProductCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: productCategory === cat ? 700 : 500,
                border: 'none',
                background: productCategory === cat ? '#ff6b00' : '#f1f5f9',
                color: productCategory === cat ? '#ffffff' : '#475569',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'ALL' ? (lang === 'kn' ? 'ಎಲ್ಲಾ ವಸ್ತುಗಳು' : lang === 'hi' ? 'सभी सामग्री' : 'All Materials') : cat}
            </button>
          ))}
        </div>

        {/* Products List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredProducts.map((prod) => {
            const availableCount = Math.max(0, (prod.totalStock || 0) - (prod.onRent || 0) - (prod.underRepair || 0));
            return (
              <div 
                key={prod.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #fff7ed, #fed7aa)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ea580c',
                      flexShrink: 0
                    }}>
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                        {prod.name}
                      </h4>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                          HSN: {prod.hsn || '73084000'}
                        </span>
                        {prod.location && (
                          <span style={{ color: '#ff6b00', fontWeight: 600 }}>
                            📍 {prod.location}
                          </span>
                        )}
                        <span>• {prod.weightKg ? `${prod.weightKg} kg / pc` : ''}</span>
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: availableCount > 0 ? '#ecfdf5' : '#fff1f2',
                    color: availableCount > 0 ? '#059669' : '#e11d48',
                    border: `1px solid ${availableCount > 0 ? '#a7f3d0' : '#fecdd3'}`
                  }}>
                    {availableCount > 0 ? `${availableCount} Pcs ${t('inStock')}` : 'Full On Rent'}
                  </span>
                </div>

                {/* Rates & Stock breakdown */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  background: '#f8fafc',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  border: '1px solid #f1f5f9'
                }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Daily Hire</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>₹{prod.dailyRent || 1.5}</strong> {t('perDay')}
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Monthly Hire</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>₹{prod.monthlyRent || (prod.dailyRent * 25)}</strong> {t('perMonth')}
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Current On Rent</span>
                    <strong style={{ color: '#ea580c', fontSize: '0.85rem' }}>{prod.onRent || 0}</strong> {prod.unit || 'Pcs'}
                  </div>
                </div>

                {/* Quick Action Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`${prod.name} ${lang === 'kn' ? 'ಬುಕ್ಕಿಂಗ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ' : lang === 'hi' ? 'ऑर्डर में जोड़ा गया' : 'ready for dispatch challan'}`);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Truck size={14} />
                    <span>{lang === 'kn' ? 'ಚಲನ್‌ಗೆ ಸೇರಿಸಿ' : lang === 'hi' ? 'चालान में जोड़ें' : 'Add to Challan / Order'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =============================================================
  // MAIN VIEW: SETTINGS "MORE" SCREEN (MATCHING SCREENSHOT)
  // =============================================================
  return (
    <div style={{ 
      maxWidth: '640px', 
      margin: '0 auto', 
      background: '#ffffff', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '5rem',
      boxShadow: '0 0 20px rgba(0,0,0,0.03)'
    }}>
      
      {/* Toast alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.65rem 1.25rem',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 600,
          zIndex: 9999,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header: Matching Screenshot Arrow + "More" */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '1.25rem 1rem 0.85rem',
        borderBottom: '1px solid #f8fafc',
        gap: '1.25rem'
      }}>
        <button
          type="button"
          onClick={() => {
            if (onBack) onBack();
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000'
          }}
          title="Back"
        >
          <ArrowLeft size={26} strokeWidth={2.4} />
        </button>
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 800, 
          margin: 0, 
          color: '#000000',
          letterSpacing: '-0.02em'
        }}>
          {t('more')}
        </h1>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: OUR PRODUCTS                                   */}
      {/* ========================================================= */}
      <div style={{ paddingTop: '0.5rem' }}>
        <div style={{ 
          padding: '1rem 1rem 0.5rem', 
          fontSize: '1.2rem', 
          fontWeight: 800, 
          color: '#000000',
          letterSpacing: '-0.01em'
        }}>
          {t('ourProducts')}
        </div>

        {/* Share App Item */}
        <div 
          onClick={() => setActiveModal('share_app')}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <Share2 size={22} strokeWidth={2} color="#1e293b" />
            <span style={itemLabelStyle}>{t('shareApp')}</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>

        {/* Web (Laptop & Desktop) Item */}
        <div 
          onClick={() => setActiveModal('web_desktop')}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <Cloud size={22} strokeWidth={2} color="#1e293b" />
            <span style={itemLabelStyle}>{t('webLaptopDesktop')}</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>

        {/* Contact Us Item */}
        <div 
          onClick={() => setActiveModal('contact_us')}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <HelpCircle size={22} strokeWidth={2} color="#1e293b" />
            <span style={itemLabelStyle}>{t('contactUs')}</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>

        {/* Available Products Page Item (User Explicitly Requested!) */}
        <div 
          onClick={() => setActiveModal('available_products')}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <Package size={22} strokeWidth={2} color="#ff6b00" />
            <div>
              <span style={itemLabelStyle}>{t('availableProducts')}</span>
              <span style={{ 
                marginLeft: '8px', 
                background: '#fff7ed', 
                color: '#ea580c', 
                fontSize: '0.68rem', 
                fontWeight: 800, 
                padding: '2px 7px', 
                borderRadius: '999px',
                border: '1px solid #fed7aa'
              }}>
                Catalog ({inventory.length})
              </span>
            </div>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: USERS & PROFILES                              */}
      {/* ========================================================= */}
      <div style={{ paddingTop: '0.75rem' }}>
        <div style={{ 
          padding: '1rem 1rem 0.5rem', 
          fontSize: '1.2rem', 
          fontWeight: 800, 
          color: '#000000',
          letterSpacing: '-0.01em'
        }}>
          {t('usersAndProfiles')}
        </div>

        {/* My User Profile Item - ONLY ITEM KEPT UNDER USERS & PROFILES */}
        <div 
          onClick={handleOpenUserProfile}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <User size={22} strokeWidth={2} color="#1e293b" />
            <div>
              <div style={itemLabelStyle}>{t('myUserProfile')}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                {currentUser?.name || 'User'} ({currentUser?.role === 'owner' ? 'Yard Admin' : currentUser?.role === 'client' ? 'Client' : 'Worker'})
              </div>
            </div>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: APP & BUSINESS SETTINGS                       */}
      {/* ========================================================= */}
      <div style={{ paddingTop: '0.75rem' }}>
        <div style={{ 
          padding: '1rem 1rem 0.5rem', 
          fontSize: '1.2rem', 
          fontWeight: 800, 
          color: '#000000',
          letterSpacing: '-0.01em'
        }}>
          {t('appAndBusinessSettings')}
        </div>

        {/* Change Language Item (User Requested: Kannada / Hindi / English!) */}
        <div 
          onClick={() => setActiveModal('change_language')}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <Globe size={22} strokeWidth={2} color="#2563eb" />
            <div>
              <div style={itemLabelStyle}>{t('changeLanguage')}</div>
              <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>
                {lang === 'kn' ? 'ಕನ್ನಡ (Kannada)' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'English (Selected)'}
              </div>
            </div>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>

        {/* Change Password Item (User Requested!) */}
        <div 
          onClick={() => setActiveModal('change_password')}
          style={rowItemStyle}
        >
          <div style={leftIconLabelStyle}>
            <Lock size={22} strokeWidth={2} color="#1e293b" />
            <span style={itemLabelStyle}>{t('changePassword')}</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#0f172a" />
        </div>

        {/* Log Out Item (User Requested!) */}
        <div 
          onClick={() => setActiveModal('logout_confirm')}
          style={{ ...rowItemStyle, borderBottom: 'none' }}
        >
          <div style={leftIconLabelStyle}>
            <LogOut size={22} strokeWidth={2} color="#e11d48" />
            <span style={{ ...itemLabelStyle, color: '#e11d48', fontWeight: 700 }}>{t('logOut')}</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.2} color="#e11d48" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: SHARE APP                                        */}
      {/* ========================================================= */}
      {activeModal === 'share_app' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('shareApp')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 1rem' }}>
                  {t('shareAppDesc')}
                </p>

                {/* Real QR Code */}
                {qrCodeDataUrl ? (
                  <div style={{
                    display: 'inline-block',
                    padding: '8px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0'
                  }}>
                    <img src={qrCodeDataUrl} alt="App QR Code" style={{ width: '150px', height: '150px', display: 'block' }} />
                  </div>
                ) : null}
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                  Scan with Camera to open app instantly
                </div>
              </div>

              {/* Share actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("Join me on ScaffBuild ERP - India's easiest Shuttering & Scaffolding billing and yard management app: https://scaffbuild.app")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Share via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={18} />
                  <span>Share with Other Apps</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink('https://scaffbuild.app')}
                  style={{
                    background: '#f1f5f9',
                    color: '#1e293b',
                    border: '1px solid #cbd5e1',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={16} />
                  <span>Copy Web App Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: WEB (LAPTOP & DESKTOP)                           */}
      {/* ========================================================= */}
      {activeModal === 'web_desktop' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('webLaptopDesktop')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Laptop size={28} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>
                  Use ScaffBuild on any PC or Mac
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Generate heavy GST invoices, print e-Way bills & audit rental inventory with dual-screen convenience.
                </p>
              </div>

              {/* URL Box */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.88rem', color: '#2563eb' }}>
                  https://app.scaffbuild.com
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyLink('https://app.scaffbuild.com')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title="Copy URL"
                >
                  <Copy size={16} />
                </button>
              </div>

              {/* Steps */}
              <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div>1. Open Google Chrome or Edge on your computer</div>
                <div>2. Visit <strong>app.scaffbuild.com</strong></div>
                <div>3. Sign in with your registered phone or Google account</div>
                <div>4. All yard challans & bills sync instantly in real-time</div>
              </div>

              <button
                type="button"
                onClick={() => window.open(window.location.origin, '_blank')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <ExternalLink size={16} />
                <span>Open in Desktop Browser</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CONTACT US                                       */}
      {/* ========================================================= */}
      {activeModal === 'contact_us' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('contactUs')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {/* Quick Contact Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <a
                  href="tel:+919820154321"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#0f172a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Phone size={20} color="#ff6b00" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Direct Call</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>+91 98201 54321</span>
                </a>

                <a
                  href="https://wa.me/919820154321?text=Hello%20ScaffBuild%20Support,%20I%20need%20help%20with%20my%20shuttering%20yard%20account"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#166534',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageCircle size={20} color="#22c55e" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>WhatsApp Chat</span>
                  <span style={{ fontSize: '0.68rem', color: '#16a34a' }}>24x7 Yard Desk</span>
                </a>
              </div>

              {/* Yard Addresses */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#ff6b00" />
                  <span>Main Yard Locations:</span>
                </div>
                <div style={{ color: '#475569', marginBottom: '4px' }}>
                  • <strong>Bangalore Yard:</strong> Jigani Bommasandra Link Rd, Industrial Area, Bangalore - 560105
                </div>
                <div style={{ color: '#475569' }}>
                  • <strong>Mumbai Yard:</strong> Plot 42, MIDC Heavy Industrial Zone, Taloja, Navi Mumbai - 410208
                </div>
              </div>

              {/* Quick Message Form */}
              <form onSubmit={handleSendContactMsg} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Your Query / Feedback</label>
                  <textarea 
                    rows={3}
                    placeholder="Type your question or request..."
                    value={contactMsg.message}
                    onChange={(e) => setContactMsg({ ...contactMsg, message: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Send Support Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: MY USER PROFILE                                  */}
      {/* ========================================================= */}
      {activeModal === 'user_profile' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('myUserProfile')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveUserProfile} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Avatar Selector */}
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.35rem' }}>
                  {userProfileForm.avatar}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {['👑', '👷', '👨‍💼', '🏗️', '🏢'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setUserProfileForm({ ...userProfileForm, avatar: emoji })}
                      style={{
                        background: userProfileForm.avatar === emoji ? '#fff7ed' : '#f1f5f9',
                        border: userProfileForm.avatar === emoji ? '2px solid #ff6b00' : '1px solid transparent',
                        borderRadius: '8px',
                        fontSize: '1.2rem',
                        padding: '4px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={fieldLabelStyle}>Full Name</label>
                <input 
                  type="text" 
                  value={userProfileForm.name}
                  onChange={(e) => setUserProfileForm({ ...userProfileForm, name: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Designation / Role Title</label>
                <input 
                  type="text" 
                  value={userProfileForm.title}
                  onChange={(e) => setUserProfileForm({ ...userProfileForm, title: e.target.value })}
                  placeholder="e.g. Managing Director / Site Engineer"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Mobile Phone</label>
                <input 
                  type="text" 
                  value={userProfileForm.phone}
                  onChange={(e) => setUserProfileForm({ ...userProfileForm, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Email Address</label>
                <input 
                  type="email" 
                  value={userProfileForm.email}
                  onChange={(e) => setUserProfileForm({ ...userProfileForm, email: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <Save size={16} />
                <span>{t('save')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MY BUSINESS PROFILE & CHANGE PROJECT NAME        */}
      {/* ========================================================= */}
      {activeModal === 'business_profile' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                {t('myBusinessProfile')}
              </h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProjectAndBusiness} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Highlighted Project Name Input */}
              <div style={{ background: '#fff7ed', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fed7aa' }}>
                <label style={{ ...fieldLabelStyle, color: '#c2410c', fontWeight: 800 }}>
                  🏗️ {t('changeProjectName')}
                </label>
                <input 
                  type="text" 
                  value={projectForm.projectName}
                  onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })}
                  required
                  placeholder="e.g. ICON MICASA JIGANI or SP Imperial Tower"
                  style={{ ...inputStyle, background: '#ffffff', fontWeight: 700, fontSize: '0.95rem', borderColor: '#fdba74' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#9a3412', marginTop: '3px', display: 'block' }}>
                  This title appears on work orders, site delivery challans & client reports
                </span>
              </div>

              <div>
                <label style={fieldLabelStyle}>Company Legal Name</label>
                <input 
                  type="text" 
                  value={projectForm.companyLegalName}
                  onChange={(e) => setProjectForm({ ...projectForm, companyLegalName: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={fieldLabelStyle}>GSTIN Number</label>
                  <input 
                    type="text" 
                    value={projectForm.gstin}
                    onChange={(e) => setProjectForm({ ...projectForm, gstin: e.target.value.toUpperCase() })}
                    style={{ ...inputStyle, fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Company PAN</label>
                  <input 
                    type="text" 
                    value={projectForm.pan}
                    onChange={(e) => setProjectForm({ ...projectForm, pan: e.target.value.toUpperCase() })}
                    style={{ ...inputStyle, fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={fieldLabelStyle}>Yard / Site Address</label>
                <input 
                  type="text" 
                  value={projectForm.yardAddress}
                  onChange={(e) => setProjectForm({ ...projectForm, yardAddress: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <Save size={16} />
                <span>{lang === 'kn' ? 'ಪ್ರಾಜೆಕ್ಟ್ ವಿವರ ಉಳಿಸಿ' : lang === 'hi' ? 'प्रोजेक्ट विवरण सहेजें' : 'Save Project & Business'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: SWITCH BUSINESS ACCOUNT                          */}
      {/* ========================================================= */}
      {activeModal === 'switch_account' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('switchBusinessAccount')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                Tap to switch your active persona and role:
              </p>

              {users.map(u => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSwitchAccount(u)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: isCurrent ? '2px solid #ff6b00' : '1px solid #e2e8f0',
                      background: isCurrent ? '#fff7ed' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{u.avatar || '👤'}</span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {u.role === 'owner' ? '👑 Yard Owner & Admin' : u.role === 'client' ? `🏢 Client (${u.companyName || 'Builder'})` : `👷 Worker (${u.trade || 'Field Ops'})`}
                        </div>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span style={{ background: '#ff6b00', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                        Active
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Switch</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: MANAGE USERS                                     */}
      {/* ========================================================= */}
      {activeModal === 'manage_users' && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '520px' }}>
            <div style={modalHeaderStyle}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('manageUsers')}</h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{users.length} Registered Team Members</span>
              </div>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {/* Add New User Toggle Button */}
              {!isAddUserOpen ? (
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#ff6b00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                  }}
                >
                  <Plus size={16} />
                  <span>+ Add New User (Engineer / Supervisor)</span>
                </button>
              ) : (
                <form onSubmit={handleAddNewUser} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Add Team Member</div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={newUserForm.name} 
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} 
                      required 
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <select 
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="client">Client / Contractor</option>
                      <option value="worker">Worker / Foreman</option>
                      <option value="owner">Admin Owner</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Mobile Phone" 
                      value={newUserForm.phone} 
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })} 
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button type="button" onClick={() => setIsAddUserOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Cancel
                    </button>
                    <button type="submit" style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                      Add User
                    </button>
                  </div>
                </form>
              )}

              {/* Users List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                {users.map(u => (
                  <div 
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{u.avatar || '👤'}</span>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{u.email || u.phone}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: u.role === 'owner' ? '#fff7ed' : u.role === 'client' ? '#eff6ff' : '#ecfdf5',
                        color: u.role === 'owner' ? '#ea580c' : u.role === 'client' ? '#2563eb' : '#059669'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                      {users.length > 1 && u.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Remove user ${u.name}?`)) {
                              setUsers(prev => prev.filter(item => item.id !== u.id));
                              showToast('User removed');
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 8: LINKED DEVICES                                   */}
      {/* ========================================================= */}
      {activeModal === 'linked_devices' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('linkedDevices')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Smartphone size={22} color="#059669" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>This Mobile Device (Android / iOS)</div>
                      <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>● Active Session Now</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Laptop size={22} color="#64748b" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Office MacBook Pro (Chrome)</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Last active: Today, 11:20 AM</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Smartphone size={22} color="#64748b" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Yard Supervisor Samsung Tab</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Last active: Yesterday, 4:45 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Logged out from other 2 devices successfully');
                }}
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Sign Out From All Other Devices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 9: TRACK USER ACTIVITIES                            */}
      {/* ========================================================= */}
      {activeModal === 'track_activities' && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '520px' }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('trackUserActivities')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem', maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={timelineItemStyle}>
                  <div style={timelineDotStyle} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      Challan DC/26/104 Outward Dispatched
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      To: Site ICON MICASA (Bangalore) • 240 Pcs Cuplock & Plates
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Today, 10:45 AM by Santosh</div>
                  </div>
                </div>

                <div style={timelineItemStyle}>
                  <div style={timelineDotStyle} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      GST Tax Invoice SB/26-27/302 Generated
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Amount: ₹1,42,800 • Shapoorji Pallonji Construction
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Yesterday, 5:30 PM</div>
                  </div>
                </div>

                <div style={timelineItemStyle}>
                  <div style={timelineDotStyle} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      Work Progress Log Approved
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      5th Floor Slab Formwork • 4,500 Sq.Ft Verified
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>26 Oct 2026 by Amit Patil</div>
                  </div>
                </div>

                <div style={timelineItemStyle}>
                  <div style={timelineDotStyle} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      Inward Material Return Inspected
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Taloja Yard Bay A-1 • 180 Plates checked (0 damage)
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>25 Oct 2026 by Ramesh Foreman</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 10: CHANGE LANGUAGE (KANNADA / HINDI / ENGLISH)     */}
      {/* ========================================================= */}
      {activeModal === 'change_language' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('changeLanguage')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                Select your preferred language for the application:
              </p>

              {/* Language 1: English */}
              <div
                onClick={() => {
                  handleSelectLanguage('en');
                  showToast('Language changed to English');
                  setActiveModal(null);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: lang === 'en' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: lang === 'en' ? '#eff6ff' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🇬🇧</span>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>English</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Default standard business language</div>
                  </div>
                </div>
                {lang === 'en' && <Check size={20} color="#2563eb" strokeWidth={3} />}
              </div>

              {/* Language 2: Kannada */}
              <div
                onClick={() => {
                  handleSelectLanguage('kn');
                  showToast('ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ');
                  setActiveModal(null);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: lang === 'kn' ? '2px solid #ff6b00' : '1px solid #e2e8f0',
                  background: lang === 'kn' ? '#fff7ed' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🇮🇳</span>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>ಕನ್ನಡ (Kannada)</div>
                    <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 600 }}>ಕರ್ನಾಟಕ ಮತ್ತು ಬೆಂಗಳೂರು ಸೈಟ್‌ಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ</div>
                  </div>
                </div>
                {lang === 'kn' && <Check size={20} color="#ff6b00" strokeWidth={3} />}
              </div>

              {/* Language 3: Hindi */}
              <div
                onClick={() => {
                  handleSelectLanguage('hi');
                  showToast('भाषा को हिन्दी में बदल दिया गया है');
                  setActiveModal(null);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: lang === 'hi' ? '2px solid #059669' : '1px solid #e2e8f0',
                  background: lang === 'hi' ? '#ecfdf5' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🇮🇳</span>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>हिन्दी (Hindi)</div>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>निर्माण स्थलों और ठेकेदारों के लिए सुगम</div>
                  </div>
                </div>
                {lang === 'hi' && <Check size={20} color="#059669" strokeWidth={3} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 11: CHANGE PASSWORD                                 */}
      {/* ========================================================= */}
      {activeModal === 'change_password' && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{t('changePassword')}</h3>
              <button onClick={() => setActiveModal(null)} style={closeBtnStyle}><X size={20} /></button>
            </div>

            <form onSubmit={handleChangePassword} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {passwordError && (
                <div style={{ background: '#fff1f2', color: '#e11d48', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label style={fieldLabelStyle}>Current Password / PIN</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="Enter current password (e.g. xrgt)"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={fieldLabelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Enter new password (min. 4 characters)"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={fieldLabelStyle}>Confirm New Password</label>
                <input 
                  type="password"
                  placeholder="Re-type new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #ff6b00, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <ShieldCheck size={16} />
                <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಅಪ್ಡೇಟ್ ಮಾಡಿ' : lang === 'hi' ? 'पासवर्ड अपडेट करें' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 12: LOG OUT CONFIRMATION                            */}
      {/* ========================================================= */}
      {activeModal === 'logout_confirm' && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '380px', textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <LogOut size={28} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
              {lang === 'kn' ? 'ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಖಚಿತವೇ?' : lang === 'hi' ? 'क्या आप लॉग आउट करना चाहते हैं?' : 'Log Out of ScaffBuild?'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem' }}>
              {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸೆಷನ್ ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ.' : lang === 'hi' ? 'आपका चालू सत्र बंद हो जाएगा।' : 'You can log back in anytime using your phone or credentials.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#475569',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  if (onLogout) onLogout();
                }}
                style={{
                  background: '#e11d48',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {t('logOut')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline Styles strictly matching WhatsApp screenshot
const rowItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.05rem 1rem',
  borderBottom: '1px solid #f1f5f9',
  cursor: 'pointer',
  transition: 'background-color 0.12s ease',
  userSelect: 'none'
};

const leftIconLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.15rem'
};

const itemLabelStyle = {
  fontSize: '1.05rem',
  fontWeight: 600,
  color: '#0f172a',
  letterSpacing: '-0.01em'
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(15, 23, 42, 0.65)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '1rem'
};

const modalBoxStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '460px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const modalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid #f1f5f9'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: '#64748b'
};

const fieldLabelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#475569',
  display: 'block',
  marginBottom: '3px'
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.88rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const timelineItemStyle = {
  display: 'flex',
  gap: '0.75rem',
  position: 'relative',
  paddingLeft: '0.5rem'
};

const timelineDotStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: '#ff6b00',
  marginTop: '4px',
  flexShrink: 0
};
