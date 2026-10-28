import React, { useState, useEffect } from 'react';
import RoleHeader from './components/RoleHeader';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import InventoryYard from './components/InventoryYard';
import RentalChallans from './components/RentalChallans';
import InvoiceGenerator from './components/InvoiceGenerator';
import AreaCalculator from './components/AreaCalculator';
import EWayBillView from './components/EWayBillView';
import EInvoiceView from './components/EInvoiceView';
import Contractors from './components/Contractors';
import CompanySettings from './components/CompanySettings';
import MoreSettingsPage from './components/MoreSettingsPage';
import OwnerQuotationManager from './components/OwnerQuotationManager';
import ClientPortal from './components/ClientPortal';
import WorkerPortal from './components/WorkerPortal';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';

import { 
  DEFAULT_COMPANY, 
  INITIAL_INVENTORY, 
  INITIAL_CLIENTS, 
  INITIAL_CHALLANS, 
  INITIAL_INVOICES 
} from './data/defaultData';

import { 
  INITIAL_USERS, 
  INITIAL_QUOTATIONS, 
  INITIAL_WORKER_LOGS,
  getDbCollection,
  saveDbCollection
} from './data/database';

import { 
  getSupabase, 
  mapSupabaseUserToAppUser, 
  fetchUserProfile,
  getSupabaseConfig,
  signOutUser
} from './utils/supabaseClient';

import { HardHat, LogIn } from 'lucide-react';

export default function App() {
  // Database Collections with LocalStorage Persistence
  const [users, setUsers] = useState(() => getDbCollection('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('scaffbuild_current_user');
    return savedUser ? JSON.parse(savedUser) : users[0];
  });

  const [company, setCompany] = useState(() => getDbCollection('company', DEFAULT_COMPANY));
  const [inventory, setInventory] = useState(() => getDbCollection('inventory', INITIAL_INVENTORY));
  const [clients, setClients] = useState(() => getDbCollection('clients', INITIAL_CLIENTS));
  const [challans, setChallans] = useState(() => getDbCollection('challans', INITIAL_CHALLANS));
  const [invoices, setInvoices] = useState(() => getDbCollection('invoices', INITIAL_INVOICES));
  const [quotations, setQuotations] = useState(() => getDbCollection('quotations', INITIAL_QUOTATIONS));
  const [workerLogs, setWorkerLogs] = useState(() => getDbCollection('worker_logs', INITIAL_WORKER_LOGS));

  // Active view tab for Owner ERP
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => localStorage.getItem('scaffbuild_language') || 'en');

  // Transient prefill for cross-navigation
  const [prefillInvoice, setPrefillInvoice] = useState(null);

  // Real-time Supabase Auth Session Listener
  useEffect(() => {
    const client = getSupabase();
    if (!client) return;

    const syncUserWithProfile = async (authUser) => {
      try {
        const profile = await fetchUserProfile(authUser.id);
        const appUser = mapSupabaseUserToAppUser(authUser, profile);
        setCurrentUser(appUser);
        setUsers(prev => {
          const exists = prev.some(u => u.id === appUser.id || u.email === appUser.email);
          return exists ? prev.map(u => (u.id === appUser.id || u.email === appUser.email ? appUser : u)) : [appUser, ...prev];
        });
      } catch (err) {
        const fallbackUser = mapSupabaseUserToAppUser(authUser);
        setCurrentUser(fallbackUser);
      }
    };

    // Check existing live session
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserWithProfile(session.user);
      }
    }).catch(err => console.warn('Supabase session check error:', err));

    // Listen for live login, logout, and token refresh events
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        syncUserWithProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        const fallback = users.find(u => u.role === 'owner') || null;
        setCurrentUser(fallback);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Sync to LocalStorage
  useEffect(() => saveDbCollection('users', users), [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('scaffbuild_current_user', JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => saveDbCollection('company', company), [company]);
  useEffect(() => saveDbCollection('inventory', inventory), [inventory]);
  useEffect(() => saveDbCollection('clients', clients), [clients]);
  useEffect(() => saveDbCollection('challans', challans), [challans]);
  useEffect(() => saveDbCollection('invoices', invoices), [invoices]);
  useEffect(() => saveDbCollection('quotations', quotations), [quotations]);
  useEffect(() => saveDbCollection('worker_logs', workerLogs), [workerLogs]);

  // Handler: Open New Invoice (GST or Non-GST)
  const handleOpenNewInvoice = (type = 'with_gst') => {
    const isGst = type === 'with_gst';
    const firstClient = clients.find(c => isGst ? Boolean(c.gstin) : true) || clients[0];
    
    setPrefillInvoice({
      id: `INV-${Date.now()}`,
      invoiceNo: isGst ? `SB/26-27/${Math.floor(100 + Math.random() * 900)}` : `EST/26-27/${Math.floor(100 + Math.random() * 900)}`,
      billingType: type,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      clientId: firstClient?.id || '',
      clientName: firstClient?.name || '',
      tradeName: firstClient?.tradeName || '',
      clientGstin: firstClient?.gstin || '',
      clientPan: firstClient?.pan || '',
      clientAddress: firstClient?.address || '',
      state: firstClient?.state || company.state,
      stateCode: firstClient?.stateCode || company.stateCode,
      placeOfSupply: `${firstClient?.stateCode || company.stateCode}-${firstClient?.state || company.state}`,
      isReverseCharge: false,
      periodFrom: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
      periodTo: new Date().toISOString().slice(0, 10),
      billDays: 30,
      items: [
        {
          id: inventory[0]?.id,
          description: `Hire Charges: ${inventory[0]?.name}`,
          hsn: isGst ? '997312' : '',
          qty: 200,
          unit: 'Pcs',
          days: 30,
          rate: inventory[0]?.dailyRent || 1.5,
          amount: 200 * (inventory[0]?.dailyRent || 1.5) * 30
        }
      ],
      transportCharges: 2500,
      loadingUnloading: 1500,
      damagesLossCharges: 0,
      discount: 0,
      securityDepositDeduction: 0,
      ewayBillNo: '',
      irn: ''
    });

    setActiveTab('billing');
  };

  // Convert Quotation to Invoice
  const handleConvertQuotationToInvoice = (quot) => {
    const isGst = true;
    const client = clients.find(c => c.name.toLowerCase().includes(quot.clientName.toLowerCase().slice(0, 6))) || clients[0];

    const invoiceItems = quot.items.map(it => {
      const invItem = inventory.find(i => i.name.toLowerCase().includes(it.name.toLowerCase().slice(0, 8)));
      return {
        id: invItem?.id || `ITEM-${Date.now()}`,
        description: `Hire Charges: ${it.name}`,
        hsn: '997312',
        qty: it.qty,
        unit: it.unit,
        days: it.days || 30,
        rate: it.ratePerDay || 2,
        amount: Number((it.qty * (it.ratePerDay || 2) * (it.days || 30)).toFixed(2))
      };
    });

    setPrefillInvoice({
      id: `INV-${Date.now()}`,
      invoiceNo: `SB/26-27/${Math.floor(100 + Math.random() * 900)}`,
      billingType: 'with_gst',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      clientId: client?.id || '',
      clientName: quot.clientName,
      tradeName: quot.siteName,
      clientGstin: client?.gstin || '27AAACS1234M1Z8',
      clientPan: client?.pan || 'AAACS1234M',
      clientAddress: client?.address || 'Site Location',
      state: client?.state || company.state,
      stateCode: client?.stateCode || company.stateCode,
      placeOfSupply: `${client?.stateCode || company.stateCode}-${client?.state || company.state}`,
      isReverseCharge: false,
      periodFrom: quot.date,
      periodTo: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      billDays: 30,
      items: invoiceItems,
      transportCharges: quot.transportFreight || 4500,
      loadingUnloading: quot.loadingHamali || 2500,
      damagesLossCharges: 0,
      discount: 0,
      securityDepositDeduction: 0,
      ewayBillNo: '',
      irn: ''
    });

    setActiveTab('billing');
  };

  // Convert Quotation to Challan
  const handleConvertQuotationToChallan = (quot) => {
    const challanItems = quot.items.map(m => ({
      itemId: inventory[0]?.id,
      name: m.name,
      quantity: m.qty,
      unit: m.unit,
      ratePerDay: m.ratePerDay || 2,
      weightKg: 16
    }));

    const totalWeightKg = challanItems.reduce((acc, it) => acc + (it.quantity * it.weightKg), 0);

    const newChl = {
      id: `DC-${Date.now()}`,
      type: 'outward',
      challanNo: `DC/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().slice(0, 10),
      clientId: quot.clientId,
      clientName: quot.clientName,
      siteName: quot.siteName,
      vehicleNo: 'MH 46 BB 3421',
      driverName: 'Santosh Yadav',
      driverPhone: '+91 98670 11234',
      status: 'active',
      items: challanItems,
      totalWeightKg,
      remarks: `Dispatched against Work Order ${quot.workOrderNo || quot.quotationNo}`
    };

    setChallans(prev => [newChl, ...prev]);
    setActiveTab('challans');
  };

  // Calculator to Invoice
  const handleCalculatorToInvoice = (materials, title) => {
    const days = 30;
    const lineItems = materials.map(m => ({
      id: m.itemId,
      description: `Hire Charges: ${m.name}`,
      hsn: '997312',
      qty: m.quantity,
      unit: m.unit,
      days,
      rate: m.ratePerDay,
      amount: Number((m.quantity * m.ratePerDay * days).toFixed(2))
    }));

    setPrefillInvoice({
      id: `INV-${Date.now()}`,
      invoiceNo: `SB/26-27/${Math.floor(100 + Math.random() * 900)}`,
      billingType: 'with_gst',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      clientId: clients[0]?.id || '',
      clientName: clients[0]?.name || '',
      tradeName: title,
      clientGstin: clients[0]?.gstin || '',
      clientPan: clients[0]?.pan || '',
      clientAddress: clients[0]?.address || '',
      state: clients[0]?.state || company.state,
      stateCode: clients[0]?.stateCode || company.stateCode,
      placeOfSupply: `${clients[0]?.stateCode || company.stateCode}-${clients[0]?.state || company.state}`,
      isReverseCharge: false,
      periodFrom: new Date().toISOString().slice(0, 10),
      periodTo: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      billDays: days,
      items: lineItems,
      transportCharges: 4000,
      loadingUnloading: 2500,
      damagesLossCharges: 0,
      discount: 0,
      securityDepositDeduction: 0,
      ewayBillNo: '',
      irn: ''
    });

    setActiveTab('billing');
  };

  // Calculator to Challan
  const handleCalculatorToChallan = (materials, title) => {
    const challanItems = materials.map(m => ({
      itemId: m.itemId,
      name: m.name,
      quantity: m.quantity,
      unit: m.unit,
      ratePerDay: m.ratePerDay,
      weightKg: 15
    }));

    const totalWeightKg = challanItems.reduce((acc, it) => acc + (it.quantity * it.weightKg), 0);

    const newChl = {
      id: `DC-${Date.now()}`,
      type: 'outward',
      challanNo: `DC/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().slice(0, 10),
      clientId: clients[0]?.id,
      clientName: clients[0]?.name,
      siteName: title,
      vehicleNo: 'MH 46 BB 3421',
      driverName: 'Santosh Yadav',
      driverPhone: '+91 98670 11234',
      status: 'active',
      items: challanItems,
      totalWeightKg,
      remarks: `Material computed via ScaffBuild Estimator for: ${title}`
    };

    setChallans(prev => [newChl, ...prev]);
    setActiveTab('challans');
  };

  // Challan to Invoice
  const handleChallanToInvoice = (challan) => {
    const client = clients.find(c => c.id === challan.clientId);
    const isClientGst = client?.billingTypePreference === 'with_gst' || Boolean(client?.gstin);
    const billType = isClientGst ? 'with_gst' : 'without_gst';

    const startDate = new Date(challan.date);
    const endDate = challan.returnDate ? new Date(challan.returnDate) : new Date();
    const diffTime = Math.abs(endDate - startDate);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const invoiceItems = challan.items.map(it => {
      const invItem = inventory.find(i => i.id === it.itemId);
      const rate = it.ratePerDay || invItem?.dailyRent || 2;
      return {
        id: it.itemId,
        description: `Hire Charges: ${it.name}`,
        hsn: billType === 'with_gst' ? '997312' : '',
        qty: it.quantity,
        unit: it.unit || 'Pcs',
        days,
        rate,
        amount: Number((it.quantity * rate * days).toFixed(2))
      };
    });

    setPrefillInvoice({
      id: `INV-${Date.now()}`,
      invoiceNo: billType === 'with_gst' ? `SB/26-27/${Math.floor(100 + Math.random() * 900)}` : `EST/26-27/${Math.floor(100 + Math.random() * 900)}`,
      billingType: billType,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      clientId: challan.clientId,
      clientName: challan.clientName,
      tradeName: challan.siteName,
      clientGstin: client?.gstin || '',
      clientPan: client?.pan || '',
      clientAddress: client?.address || '',
      state: client?.state || company.state,
      stateCode: client?.stateCode || company.stateCode,
      placeOfSupply: `${client?.stateCode || company.stateCode}-${client?.state || company.state}`,
      isReverseCharge: false,
      periodFrom: challan.date,
      periodTo: challan.returnDate || new Date().toISOString().slice(0, 10),
      billDays: days,
      items: invoiceItems,
      transportCharges: 3500,
      loadingUnloading: 2000,
      damagesLossCharges: 0,
      discount: 0,
      securityDepositDeduction: billType === 'without_gst' ? 10000 : 0,
      ewayBillNo: '',
      irn: ''
    });

    setActiveTab('billing');
  };

  // Reset Demo Data
  const handleResetAllData = () => {
    if (window.confirm("Reset all databases (Users, Sites, Quotations, Worker Logs, Inventory, Bills) to initial demo defaults?")) {
      localStorage.clear();
      setCompany(DEFAULT_COMPANY);
      setInventory(INITIAL_INVENTORY);
      setClients(INITIAL_CLIENTS);
      setChallans(INITIAL_CHALLANS);
      setInvoices(INITIAL_INVOICES);
      setUsers(INITIAL_USERS);
      setCurrentUser(INITIAL_USERS[0]);
      setQuotations(INITIAL_QUOTATIONS);
      setWorkerLogs(INITIAL_WORKER_LOGS);
      alert("All systems restored to initial demo database.");
    }
  };

  // Full Backup Export
  const handleExportAllData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      company,
      inventory,
      clients,
      challans,
      invoices,
      users,
      quotations,
      workerLogs
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backup, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `ScaffBuild_Complete_ERP_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Backup Import
  const handleImportAllData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.company) setCompany(parsed.company);
          if (parsed.inventory) setInventory(parsed.inventory);
          if (parsed.clients) setClients(parsed.clients);
          if (parsed.challans) setChallans(parsed.challans);
          if (parsed.invoices) setInvoices(parsed.invoices);
          if (parsed.users) setUsers(parsed.users);
          if (parsed.quotations) setQuotations(parsed.quotations);
          if (parsed.workerLogs) setWorkerLogs(parsed.workerLogs);
          alert("Full database restored successfully!");
        } catch (err) {
          alert("Invalid backup JSON file.");
        }
      };
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('scaffbuild_current_user');
    setIsAuthOpen(false);
  };

  // Quick Demo Login for Santosh Admin
  const handleQuickAdminLogin = () => {
    const adminUser = {
      id: 'usr-santosh-admin',
      name: 'Santosh Yadav',
      email: 'admin@scaffbuild.com',
      role: 'owner',
      phone: '+91 98201 98201',
      company: 'ScaffBuild Shuttering & Scaffolding Co.'
    };
    setCurrentUser(adminUser);
    localStorage.setItem('scaffbuild_current_user', JSON.stringify(adminUser));
  };

  // Quick Demo Login for Client
  const handleQuickClientLogin = () => {
    const clientUser = {
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
    setCurrentUser(clientUser);
    localStorage.setItem('scaffbuild_current_user', JSON.stringify(clientUser));
  };

  return (
    <div className="app-container">
      
      {/* Sleek Enterprise Portal Header (Hidden for Client to keep page clean & dedicated) */}
      {currentUser?.role !== 'client' && (
        <RoleHeader 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSettings={() => {
            if (currentUser?.role === 'owner') {
              setActiveTab('settings');
            } else {
              setIsSettingsModalOpen(true);
            }
          }}
        />
      )}

      {/* Guest / Logged-Out View: Full High-Converting Landing Page */}
      {!currentUser && (
        <LandingPage 
          onOpenAuth={() => setIsAuthOpen(true)}
          onQuickAdminLogin={handleQuickAdminLogin}
          onQuickClientLogin={handleQuickClientLogin}
        />
      )}

      {/* PORTAL 1: CLIENT / BUILDER PORTAL */}
      {currentUser?.role === 'client' && (
        <main className="main-content">
          <ClientPortal 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            users={users}
            setUsers={setUsers}
            quotations={quotations}
            setQuotations={setQuotations}
            workerLogs={workerLogs}
            setWorkerLogs={setWorkerLogs}
            company={company}
            setCompany={setCompany}
            inventory={inventory}
            setInventory={setInventory}
            challans={challans}
            invoices={invoices}
            onLogout={handleLogout}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />
        </main>
      )}

      {/* PORTAL 2: WORKER PORTAL */}
      {currentUser?.role === 'worker' && (
        <main className="main-content">
          <WorkerPortal 
            currentUser={currentUser}
            workerLogs={workerLogs}
            setWorkerLogs={setWorkerLogs}
            users={users}
          />
        </main>
      )}

      {/* PORTAL 3: OWNER COMPANY ERP (Santosh Admin) */}
      {currentUser?.role === 'owner' && (
        <>
          {/* Simple 3-Tab Mobile App Navigation */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            quotations={quotations}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <main className="main-content">
            {activeTab === 'dashboard' && (
              <Dashboard 
                inventory={inventory}
                challans={challans}
                invoices={invoices}
                clients={clients}
                setActiveTab={setActiveTab}
                onOpenNewInvoice={handleOpenNewInvoice}
                onOpenNewChallan={() => setActiveTab('challans')}
              />
            )}

            {activeTab === 'quotations' && (
              <OwnerQuotationManager 
                quotations={quotations}
                setQuotations={setQuotations}
                clients={clients}
                inventory={inventory}
                company={company}
                onConvertQuotationToInvoice={handleConvertQuotationToInvoice}
                onConvertQuotationToChallan={handleConvertQuotationToChallan}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryYard 
                inventory={inventory}
                setInventory={setInventory}
                onSendToCalculator={() => setActiveTab('calculator')}
              />
            )}

            {activeTab === 'challans' && (
              <RentalChallans 
                challans={challans}
                setChallans={setChallans}
                inventory={inventory}
                setInventory={setInventory}
                clients={clients}
                company={company}
                onGenerateInvoiceFromChallan={handleChallanToInvoice}
                onGenerateEwayBillFromChallan={(challan) => {
                  setActiveTab('ewaybill');
                }}
              />
            )}

            {activeTab === 'billing' && (
              <InvoiceGenerator 
                invoices={invoices}
                setInvoices={setInvoices}
                inventory={inventory}
                clients={clients}
                company={company}
                prefillInvoice={prefillInvoice}
                onOpenEwayBillModal={(inv) => {
                  setPrefillInvoice(inv);
                  setActiveTab('ewaybill');
                }}
                onOpenEInvoiceModal={(inv) => {
                  setPrefillInvoice(inv);
                  setActiveTab('einvoice');
                }}
              />
            )}

            {activeTab === 'calculator' && (
              <AreaCalculator 
                onSendToInvoice={handleCalculatorToInvoice}
                onSendToChallan={handleCalculatorToChallan}
              />
            )}

            {activeTab === 'ewaybill' && (
              <EWayBillView 
                invoices={invoices}
                setInvoices={setInvoices}
                company={company}
                clients={clients}
                prefillInvoice={prefillInvoice}
              />
            )}

            {activeTab === 'einvoice' && (
              <EInvoiceView 
                invoices={invoices}
                setInvoices={setInvoices}
                company={company}
                prefillInvoice={prefillInvoice}
              />
            )}

            {activeTab === 'contractors' && (
              <Contractors 
                clients={clients}
                setClients={setClients}
                onNewInvoiceForClient={(c) => {
                  handleOpenNewInvoice(c.billingTypePreference || 'with_gst');
                }}
                onNewChallanForClient={(c) => {
                  setActiveTab('challans');
                }}
              />
            )}

            {activeTab === 'settings' && (
              <MoreSettingsPage 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                company={company}
                setCompany={setCompany}
                users={users}
                setUsers={setUsers}
                inventory={inventory}
                setInventory={setInventory}
                clients={clients}
                challans={challans}
                invoices={invoices}
                quotations={quotations}
                onLogout={handleLogout}
                onBack={() => setActiveTab('dashboard')}
                onResetAllData={handleResetAllData}
                onExportAllData={handleExportAllData}
                onImportAllData={handleImportAllData}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            )}
          </main>
        </>
      )}

      {/* Settings "More" Modal (For Clients & Workers) */}
      {isSettingsModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#ffffff',
          zIndex: 9998,
          overflowY: 'auto'
        }}>
          <MoreSettingsPage 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            company={company}
            setCompany={setCompany}
            users={users}
            setUsers={setUsers}
            inventory={inventory}
            setInventory={setInventory}
            clients={clients}
            challans={challans}
            invoices={invoices}
            quotations={quotations}
            onLogout={handleLogout}
            onBack={() => setIsSettingsModalOpen(false)}
            onResetAllData={handleResetAllData}
            onExportAllData={handleExportAllData}
            onImportAllData={handleImportAllData}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        </div>
      )}

      {/* Multi-User Switch & Registration Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        users={users}
        setUsers={setUsers}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

    </div>
  );
}
