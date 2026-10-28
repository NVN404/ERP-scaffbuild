import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  FileText, 
  HardHat, 
  MapPin, 
  Calendar, 
  Check, 
  X,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Ruler,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Sliders,
  CheckCircle,
  User,
  MessageCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ListFilter,
  Truck,
  RotateCcw,
  ArrowLeft,
  Printer,
  Search,
  FileDown,
  CreditCard,
  Settings,
  Package,
  Receipt,
  Bell,
  Mail,
  MailOpen,
  Inbox
} from 'lucide-react';
import ClientThreeDotMenu from './ClientThreeDotMenu';
import MoreSettingsPage from './MoreSettingsPage';

export default function ClientPortal({ 
  currentUser, 
  setCurrentUser,
  users, 
  setUsers, 
  quotations, 
  setQuotations, 
  workerLogs, 
  setWorkerLogs,
  company,
  setCompany,
  inventory,
  setInventory,
  challans,
  invoices,
  onLogout,
  onOpenSettings,
  currentLanguage,
  setCurrentLanguage
}) {
  // Navigation: Separate pages like slides as nav bar
  // 'request': Request Quotation Slide
  // 'projects': My Projects & Orders Slide (matching exact mobile card UI from screenshot)
  // 'worker_progress': Daily Worker Progress Approval Slide
  const [activeSlide, setActiveSlide] = useState('projects'); // Open on Projects view to match screenshot!

  // Filter / Sort in Projects View: 'date', 'due', 'name'
  const [siteSortBy, setSiteSortBy] = useState('date');

  // Search on Client Main Page
  const [mainPageSearchQuery, setMainPageSearchQuery] = useState('');
  const [isMainSearchOpen, setIsMainSearchOpen] = useState(false);



  // Modals for Site Card Actions (Request Items, Take Back, Details, New Site)
  const [selectedSiteForIssue, setSelectedSiteForIssue] = useState(null); // Request Extra Items
  const [issueFormData, setIssueFormData] = useState({
    items: [
      { name: "Cuplock Standard Vertical Pipes 3.0m", qty: 40, unit: "Pcs" },
      { name: "MS Shuttering Plates 900x600 (3'x2')", qty: 100, unit: "Pcs" }
    ],
    purpose: "5th Floor Slab Casting & Shuttering Staging",
    date: new Date().toISOString().slice(0, 10),
    challanNo: `REQ/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    notes: ''
  });

  const [selectedSiteForReceive, setSelectedSiteForReceive] = useState(null); // Take Back Notification
  const [receiveFormData, setReceiveFormData] = useState({
    notes: '',
    contactPhone: currentUser?.phone || '+91 98200 99999'
  });

  const [selectedSiteForDetails, setSelectedSiteForDetails] = useState(null);
  
  // Site Details Screen State:
  const [siteDetailsActiveTab, setSiteDetailsActiveTab] = useState('requests'); // default to 'requests' to show where, when, and all requested/take-back
  const [siteDetailsSearchQuery, setSiteDetailsSearchQuery] = useState('');
  const [siteDetailsShowTotal, setSiteDetailsShowTotal] = useState(false);
  const [activityFilter, setActivityFilter] = useState('ALL'); // 'ALL', 'REQUESTS', 'TAKE_BACK'

  // Comprehensive Where & When Activity Log for Material Requests and Take Backs
  const [siteMaterialActivities, setSiteMaterialActivities] = useState([
    {
      id: 'act_1',
      siteName: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      location: 'Jigani Bommasandra Link Rd, Bengaluru',
      type: 'request', // 'request' | 'take_back'
      title: 'Extra Materials Requested',
      refNo: 'REQ/2026/439',
      dateTime: '26 Oct 2026, 03:45 PM',
      status: 'Yard Processing',
      statusColor: '#ea580c',
      items: [
        { name: "Cuplock Standard Vertical Pipes 3.0m", qty: 40, unit: "Pcs" },
        { name: "MS Shuttering Plates 900x600 (3'x2')", qty: 100, unit: "Pcs" }
      ],
      totalPcs: 140,
      notes: 'Required for 5th slab staging and beam casting'
    },
    {
      id: 'act_2',
      siteName: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      location: 'Jigani Bommasandra Link Rd, Bengaluru',
      type: 'take_back',
      title: 'Take Back Pickup Notification',
      refNo: 'RC/2026/302',
      dateTime: '26 Oct 2026, 01:15 PM',
      status: 'Transport Scheduled',
      statusColor: '#16a34a',
      items: [
        { name: "Dismantled Equipment (Ready at Gate 2)", qty: 65, unit: "Pcs" }
      ],
      totalPcs: 65,
      notes: 'Slab dismantled, material stacked near Gate 2 ready for yard truck pickup'
    },
    {
      id: 'act_3',
      siteName: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      location: 'Jigani Bommasandra Link Rd, Bengaluru',
      type: 'request',
      title: 'Outward Delivery Issued (DC0003)',
      refNo: 'DC0003',
      dateTime: '26 Sep 2026, 04:56 PM',
      status: 'Delivered on Site',
      statusColor: '#2563eb',
      items: [
        { name: "3m Vertical 3m 10ft", qty: 40, unit: "Pcs" },
        { name: "Farma 9x9", qty: 5, unit: "Pcs" }
      ],
      totalPcs: 45,
      notes: 'Dispatched from ScaffBuild yard via Truck MH 46 BB 3421'
    },
    {
      id: 'act_4',
      siteName: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      location: 'Jigani Bommasandra Link Rd, Bengaluru',
      type: 'take_back',
      title: 'Material Taken Back (RC0001)',
      refNo: 'RC0001',
      dateTime: '26 Sep 2026, 09:25 AM',
      status: 'Received at Yard',
      statusColor: '#16a34a',
      items: [
        { name: "3m Vertical 3m 10ft", qty: 10, unit: "Pcs" }
      ],
      totalPcs: 10,
      notes: 'Returned to yard after beam bottom de-shuttering inspection'
    },
    {
      id: 'act_5',
      siteName: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      location: 'Jigani Bommasandra Link Rd, Bengaluru',
      type: 'request',
      title: 'Outward Delivery Issued (DC0002)',
      refNo: 'DC0002',
      dateTime: '26 Sep 2026, 09:34 AM',
      status: 'Delivered on Site',
      statusColor: '#2563eb',
      items: [
        { name: "3m Vertical 3m 10ft", qty: 5, unit: "Pcs" }
      ],
      totalPcs: 5,
      notes: 'Extra vertical pipe replacements dispatched'
    },
    {
      id: 'act_gw_1',
      siteName: 'GREEN Wood High School',
      location: 'Sarjapur Main Rd, Bengaluru',
      type: 'request',
      title: 'Outward Material Requested & Dispatched',
      refNo: 'DC0012',
      dateTime: '15 Sep 2026, 02:15 PM',
      status: 'Delivered on Site',
      statusColor: '#2563eb',
      items: [
        { name: "3m Vertical 3m 10ft", qty: 150, unit: "Pcs" },
        { name: "Farma 9x9", qty: 60, unit: "Pcs" }
      ],
      totalPcs: 210,
      notes: 'Initial staging equipment for auditorium construction'
    },
    {
      id: 'act_gw_2',
      siteName: 'GREEN Wood High School',
      location: 'Sarjapur Main Rd, Bengaluru',
      type: 'take_back',
      title: 'Surplus Material Taken Back',
      refNo: 'RC0005',
      dateTime: '28 Sep 2026, 11:30 AM',
      status: 'Received at Yard',
      statusColor: '#16a34a',
      items: [
        { name: "3m Vertical 3m 10ft", qty: 20, unit: "Pcs" },
        { name: "Farma 9x9", qty: 5, unit: "Pcs" }
      ],
      totalPcs: 25,
      notes: 'Surplus pipes and farmas returned to yard'
    }
  ]);

  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [newSiteInput, setNewSiteInput] = useState({
    name: '',
    location: '',
    city: 'Bangalore',
    siteEngineer: currentUser?.name || 'Site In-Charge',
    phone: currentUser?.phone || '+91 98200 99999',
    slabAreaSqft: 18500,
    dueAmount: 0,
    totalPcs: 65,
    ratePerSqft: 3,
    balanceAreaSqft: 25000,
    badgeType: 'Sqft Area Mix'
  });

  // Quotation Request Form State (Mandatory Company, Building, GST as per user requirements)
  const defaultSiteName = currentUser?.sites?.[0]?.name || '';

  const [quotationRequest, setQuotationRequest] = useState({
    companyName: currentUser?.companyName || '',
    siteName: defaultSiteName,
    gstin: currentUser?.gstin || '',
    workPurpose: 'Slab Staging & Shuttering',
    lengthFt: 100,
    breadthFt: 120,
    tenureMonths: 1,
    startDate: new Date().toISOString().slice(0, 10),
    itemsNeeded: [
      { name: "MS Shuttering Plates 900x600 (3'x2')", qty: 500, unit: "Pcs" },
      { name: "Telescopic Steel Props (2.0m - 3.5m)", qty: 350, unit: "Pcs" },
      { name: "Acrow Telescopic Spans (2.5m - 4.2m)", qty: 90, unit: "Pcs" },
      { name: "Stirrup U-Jacks & Base Jacks", qty: 350, unit: "Pcs" }
    ],
    notes: 'Require shuttering material for slab casting. Please include transport & erection quote.'
  });

  // Dropdown Form toggle for Projects Tab (collapses back to normal after submit)
  const [isQuotationDropdownOpen, setIsQuotationDropdownOpen] = useState(false);

  // Sub-tabs inside Approvals Slide: 'pending', 'quotations', 'labour', 'notifications'
  const [notificationsActiveTab, setNotificationsActiveTab] = useState('pending');

  // System Notifications Feed State (renamed from mail to notifications as requested)
  const [notificationFilter, setNotificationFilter] = useState('ALL'); // 'ALL' or 'UNREAD'
  const [systemNotifications, setSystemNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Quotation Rate Proposal Available',
      body: 'Yard admin has reviewed your equipment quotation for Tower B & C. Please review commercial rates and issue work order.',
      sender: 'ScaffBuild Yard Dispatch',
      category: 'Quotation',
      time: '15 mins ago',
      date: new Date().toISOString().slice(0, 10),
      isRead: false
    },
    {
      id: 'notif_2',
      title: 'Daily Labour Work Log Submitted for Approval',
      body: 'Worker Gang Leader Sunil Kumar submitted Slab Shuttering & Prop Staging (1,500 Sq.Ft) for certification.',
      sender: 'Site Supervisor Sunil',
      category: 'Labour',
      time: '2 hours ago',
      date: new Date().toISOString().slice(0, 10),
      isRead: false
    },
    {
      id: 'notif_3',
      title: 'Material Delivery Dispatched - Truck MH-46-BB-3421',
      body: 'Delivery Challan DC0003 with 45 Pcs scaffolding equipment is en route to site location.',
      sender: 'Yard Logistics Team',
      category: 'Dispatch',
      time: 'Yesterday',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      isRead: true
    },
    {
      id: 'notif_4',
      title: 'GST Tax Invoice Generated',
      body: 'Monthly rental invoice for equipment staging has been generated under Rule 46 compliance.',
      sender: 'Billing & Accounts',
      category: 'Invoice',
      time: '3 days ago',
      date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
      isRead: true
    }
  ]);

  const unreadNotificationCount = systemNotifications.filter(n => !n.isRead).length;

  const toggleNotificationReadStatus = (notifId) => {
    setSystemNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: !n.isRead } : n));
  };

  const markAllNotificationsAsRead = () => {
    setSystemNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Collapsible toggle for Estimated Items Needed (Optional in dropdown)
  const [showEstimatedItems, setShowEstimatedItems] = useState(false);

  // Success message notification state
  const [successBanner, setSuccessBanner] = useState('');

  // Quotation form collapse state after submission & last submitted quotation details
  const [isQuotationFormCollapsed, setIsQuotationFormCollapsed] = useState(false);
  const [lastSubmittedQuotation, setLastSubmittedQuotation] = useState(null);
  const [quotationHistoryFilter, setQuotationHistoryFilter] = useState('ALL');
  const [quotationHistorySearch, setQuotationHistorySearch] = useState('');

  // Selected project site filter for worker progress slide
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('ALL');

  // Client Approval Remarks Modal State
  const [selectedLogToApprove, setSelectedLogToApprove] = useState(null);
  const [approvalComment, setApprovalComment] = useState('Work inspected and certified as per site structural layout.');

  // Labour Work & Approvals Section State
  const [labourBillingActiveSubTab, setLabourBillingActiveSubTab] = useState('pending'); // 'pending', 'approved', 'all'
  const [billsViewFilter, setBillsViewFilter] = useState('all'); // 'all', 'material', 'labour'
  const [labourRatePerSqft, setLabourRatePerSqft] = useState(18); // default ₹18 per Sq.Ft
  const [labourManDayRate, setLabourManDayRate] = useState(850); // default ₹850 per worker day
  const [labourBillingBasis, setLabourBillingBasis] = useState('sqft'); // 'sqft' or 'manday'
  const [isLabourStatementModalOpen, setIsLabourStatementModalOpen] = useState(false);
  const [isAddLabourModalOpen, setIsAddLabourModalOpen] = useState(false);
  const [newLabourForm, setNewLabourForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    siteName: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
    workerName: 'Sunil Kumar (Labour Gang Leader)',
    workType: 'Slab Shuttering & Staging',
    floorLevel: 'Tower A - 3rd Floor Slab',
    areaCompletedSqft: 1200,
    laborCount: 6,
    hoursWorked: 8.0,
    workCompletedSummary: 'Erected 140 telescopic props and laid 90 shuttering plates. Leveled using water tube.',
    autoApprove: true
  });

  // Default Project Sites grouped under company with NO hardcoded fake due amounts
  const defaultIndustrySites = [
    {
      id: 'site_icon_micasa',
      name: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      companyName: 'ASG WIN INDIA PRIVATE LIMITED',
      gstin: '29ABCDE1234F1Z5',
      location: 'Jigani Bommasandra Link Road, Industrial Area',
      city: 'Bangalore',
      state: 'Karnataka',
      siteEngineer: 'Er. Rajesh Patil',
      phone: '+91 98200 99999',
      slabAreaSqft: 18500,
      dueAmount: 0,
      totalPcs: 65,
      ratePerSqft: 3,
      balanceAreaSqft: 25000,
      lastDate: '26 Oct 26',
      badgeType: 'Sqft Area Mix',
      active: true
    },
    {
      id: 'site_greenwood',
      name: 'GREEN Wood High School',
      companyName: 'ASG WIN INDIA PRIVATE LIMITED',
      gstin: '29ABCDE1234F1Z5',
      location: 'Sarjapur Main Road, Chikkawadayarapura',
      city: 'Bangalore',
      state: 'Karnataka',
      siteEngineer: 'Sanjay More',
      phone: '+91 98334 11223',
      slabAreaSqft: 24000,
      dueAmount: 0,
      totalPcs: 260,
      ratePerSqft: 3,
      balanceAreaSqft: 20000,
      lastDate: '1 Oct 26',
      badgeType: 'Sqft Area Mix',
      active: true
    }
  ];

  const clientSites = currentUser?.sites && currentUser.sites.length > 0 
    ? currentUser.sites 
    : (currentUser?.email === 'tempory2911@gmail.com' ? defaultIndustrySites : []);

  const clientSiteNames = clientSites.map(s => s.name);

  // Filter logs for this client (matches clientId, company, site name, or client role)
  const clientWorkerLogs = workerLogs.filter(log => {
    if (!currentUser) return true;
    if (log.clientId && currentUser.id && log.clientId === currentUser.id) return true;
    const cName = (currentUser.companyName || currentUser.name || '').toLowerCase();
    const logCompany = (log.clientCompanyName || '').toLowerCase();
    if (cName && (logCompany.includes(cName) || cName.includes(logCompany))) return true;
    if (log.siteName && clientSiteNames.some(s => s.toLowerCase() === (log.siteName || '').toLowerCase())) return true;
    if (currentUser.role === 'client') return true;
    return false;
  });

  // Filter quotations for this client (matches clientId, client company/name, contactPerson, or siteName)
  const clientQuotations = quotations.filter(q => {
    if (!currentUser) return true;
    if (q.clientId && currentUser.id && q.clientId === currentUser.id) return true;
    const cName = (currentUser.companyName || currentUser.name || '').toLowerCase();
    const qName = (q.clientName || '').toLowerCase();
    if (cName && (qName.includes(cName) || cName.includes(qName))) return true;
    if (currentUser.name && (q.contactPerson || '').toLowerCase().includes(currentUser.name.toLowerCase())) return true;
    if (q.siteName && clientSiteNames.some(s => s.toLowerCase() === (q.siteName || '').toLowerCase())) return true;
    return false;
  });

  // Dynamic Total Due calculation strictly from real invoices (NO hardcoded fake amounts!)
  const clientInvoices = (invoices || []).filter(inv => {
    if (!currentUser) return false;
    if (inv.clientId && inv.clientId === currentUser.id) return true;
    const cName = (currentUser.companyName || currentUser.name || '').toLowerCase();
    const invClient = (inv.clientName || '').toLowerCase();
    return cName && (invClient.includes(cName) || cName.includes(invClient));
  });

  const totalDueAmount = clientInvoices.length > 0
    ? clientInvoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'paid').reduce((sum, inv) => sum + (Number(inv.grandTotal || inv.amount) || 0), 0)
    : 0;

  // Derived calculation: Length x Breadth
  const calculatedAreaSqft = (Number(quotationRequest.lengthFt) || 0) * (Number(quotationRequest.breadthFt) || 0);
  const calculatedTenureDays = Math.round((Number(quotationRequest.tenureMonths) || 1) * 30);

  // Handle Item Row Editing (Name, Quantity, Unit)
  const handleItemChange = (index, field, value) => {
    const updated = [...quotationRequest.itemsNeeded];
    updated[index] = {
      ...updated[index],
      [field]: field === 'qty' ? (Number(value) || 0) : value
    };
    setQuotationRequest(prev => ({ ...prev, itemsNeeded: updated }));
  };

  // Add Custom or Preset Item to Quotation
  const handleAddItem = (defaultName = '', defaultQty = 100, defaultUnit = 'Pcs') => {
    setQuotationRequest(prev => ({
      ...prev,
      itemsNeeded: [
        ...prev.itemsNeeded,
        { 
          name: typeof defaultName === 'string' && defaultName ? defaultName : '', 
          qty: Number(defaultQty) || 100, 
          unit: defaultUnit 
        }
      ]
    }));
    setShowEstimatedItems(true);
  };

  // Remove Item from Quotation
  const handleRemoveItem = (index) => {
    if (quotationRequest.itemsNeeded.length <= 1) {
      alert("Quotation must have at least one equipment item.");
      return;
    }
    setQuotationRequest(prev => ({
      ...prev,
      itemsNeeded: prev.itemsNeeded.filter((_, i) => i !== index)
    }));
  };

  // Submit Quotation Request to Owner with Mandatory Company Name, Building Name & GST Number
  const handleSubmitQuotationRequest = (e) => {
    e.preventDefault();

    const company = (quotationRequest.companyName || '').trim();
    const site = (quotationRequest.siteName || '').trim();
    const gst = (quotationRequest.gstin || '').trim().toUpperCase();

    // Mandatory fields enforcement (User requirement 5)
    if (!company) {
      alert("Please enter Company Name (Mandatory).");
      return;
    }
    if (!site) {
      alert("Please enter Building / Site Name (Mandatory).");
      return;
    }
    if (!gst) {
      alert("Please enter GST Number (Mandatory).");
      return;
    }

    // Auto-register typed site into client profile if not already present
    const exists = clientSites.some(s => s.name.toLowerCase() === site.toLowerCase());
    const newSiteObj = {
      id: `site_${Date.now()}`,
      name: site,
      companyName: company,
      gstin: gst,
      location: quotationRequest.workPurpose ? `${quotationRequest.workPurpose} Site` : 'Site Location',
      city: 'Bangalore',
      siteEngineer: currentUser?.name || 'Er. Site In-Charge',
      phone: currentUser?.phone || '',
      slabAreaSqft: calculatedAreaSqft || 0,
      dueAmount: 0, // Strictly calculated from bills, NO hardcoded amount
      totalPcs: quotationRequest.itemsNeeded.reduce((s, it) => s + (Number(it.qty) || 0), 0),
      lastDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
      badgeType: 'Sqft Area Mix',
      active: true,
      isApproved: false
    };

    if (!exists) {
      const updatedSites = [...clientSites, newSiteObj];
      const updatedUser = {
        ...currentUser,
        companyName: currentUser?.companyName || company,
        gstin: currentUser?.gstin || gst,
        sites: updatedSites
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('scaffbuild_current_user', JSON.stringify(updatedUser));
      if (setUsers) {
        setUsers(prev => prev.map(u => u.id === currentUser?.id ? updatedUser : u));
      }
    }

    const newQuot = {
      id: `QUOT-${Date.now()}`,
      quotationNo: `QR/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(100 + Math.random() * 900)}`,
      clientId: currentUser.id,
      clientName: company,
      companyName: company,
      gstin: gst,
      contactPerson: currentUser.name,
      siteName: site,
      date: new Date().toISOString().slice(0, 10),
      validTill: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      status: 'requested',
      workOrderNo: '',
      workPurpose: quotationRequest.workPurpose || 'Slab Staging & Shuttering',
      lengthFt: Number(quotationRequest.lengthFt) || 0,
      breadthFt: Number(quotationRequest.breadthFt) || 0,
      requestedAreaSqft: calculatedAreaSqft,
      tenureMonths: Number(quotationRequest.tenureMonths) || 1,
      tenureDays: calculatedTenureDays,
      items: quotationRequest.itemsNeeded.map(it => ({
        name: it.name || 'Custom Equipment Item',
        qty: Number(it.qty) || 0,
        unit: it.unit || 'Pcs',
        ratePerDay: 0,
        days: calculatedTenureDays,
        amount: 0
      })),
      transportFreight: 0,
      loadingHamali: 0,
      taxableAmount: 0,
      gstRate: 18,
      gstAmount: 0,
      grandTotal: 0,
      clientNotes: `[Company: ${company}] [GST: ${gst}] ${quotationRequest.workPurpose ? `[Purpose: ${quotationRequest.workPurpose}] ` : ''}Dimensions: ${quotationRequest.lengthFt} Ft x ${quotationRequest.breadthFt} Ft (${calculatedAreaSqft.toLocaleString()} Sq.Ft). Duration: ${quotationRequest.tenureMonths} Month(s). ${quotationRequest.notes || ''}`.trim(),
      ownerReply: ''
    };

    setQuotations(prev => [newQuot, ...prev]);
    setLastSubmittedQuotation(newQuot);
    setIsQuotationFormCollapsed(true);

    // Dropdown collapses back to normal (requirement 6)
    setIsQuotationDropdownOpen(false);

    // Append to system notifications
    setSystemNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: `Quotation Requested: ${newQuot.quotationNo}`,
        body: `Quotation requirement for "${site}" (${company}) submitted. Track updates under Quotations.`,
        sender: 'Yard Request Desk',
        category: 'Quotation',
        time: 'Just now',
        date: new Date().toISOString().slice(0, 10),
        isRead: false
      },
      ...prev
    ]);

    setSuccessBanner(`✅ Quotation request "${newQuot.quotationNo}" submitted! View status under Approvals.`);
  };

  // Client Accepts Owner Quotation & Issues Work Order
  const handleAcceptQuotation = (quotation) => {
    const generatedWoNo = `WO/${currentUser.companyName?.slice(0, 3).toUpperCase() || 'ASG'}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;

    setQuotations(prev => prev.map(q => {
      if (q.id === quotation.id) {
        return {
          ...q,
          status: 'work_order_created',
          workOrderNo: generatedWoNo
        };
      }
      return q;
    }));

    alert(`🎉 Work Order Issued!\nWork Order No: ${generatedWoNo}\nThe shuttering yard has been notified to commence dispatch.`);
  };

  // Client Deletes an Individual Older Quotation Request (Approved quotations CANNOT be deleted)
  const handleDeleteQuotation = (quotationId, quotationNo) => {
    const targetQuot = quotations.find(q => q.id === quotationId || (quotationNo && q.quotationNo === quotationNo));
    if (targetQuot && (targetQuot.status === 'work_order_created' || targetQuot.status === 'approved')) {
      alert("⚠️ Approved quotations and active work orders cannot be deleted.");
      return;
    }

    const displayLabel = quotationNo || quotationId;
    if (!window.confirm(`Are you sure you want to delete quotation request "${displayLabel}"?\n\nThis will remove the unapproved inquiry permanently.`)) {
      return;
    }

    setQuotations(prev => prev.filter(q => q.id !== quotationId && (!quotationNo || q.quotationNo !== quotationNo) && q.quotationNo !== quotationId));

    if (lastSubmittedQuotation?.id === quotationId || (quotationNo && lastSubmittedQuotation?.quotationNo === quotationNo)) {
      setLastSubmittedQuotation(null);
      setIsQuotationFormCollapsed(false);
    }

    setSuccessBanner(`🗑️ Quotation "${displayLabel}" deleted successfully.`);
  };

  // Client Deletes All Unapproved Older Quotations (Approved quotations are strictly preserved)
  const handleDeleteAllClientQuotations = () => {
    const unapproved = clientQuotations.filter(q => q.status !== 'work_order_created' && q.status !== 'approved');
    if (!unapproved.length) {
      alert("No unapproved quotation requests to delete. Approved work orders cannot be deleted.");
      return;
    }
    const count = unapproved.length;
    if (!window.confirm(`Are you sure you want to delete ${count} unapproved quotation request(s)?\n\nApproved quotations and active work orders will NOT be affected.`)) {
      return;
    }

    const toDeleteIds = new Set(unapproved.map(q => q.id));
    const toDeleteNos = new Set(unapproved.map(q => q.quotationNo));

    setQuotations(prev => prev.filter(q => !toDeleteIds.has(q.id) && !toDeleteNos.has(q.quotationNo)));
    if (lastSubmittedQuotation && (toDeleteIds.has(lastSubmittedQuotation.id) || toDeleteNos.has(lastSubmittedQuotation.quotationNo))) {
      setLastSubmittedQuotation(null);
      setIsQuotationFormCollapsed(false);
    }
    setSuccessBanner(`🗑️ ${count} unapproved quotation requests deleted successfully.`);
  };

  // Calculate Labour Billing amount for a worker log
  const calculateLabourBilling = (log, ratePerSqft = labourRatePerSqft, ratePerManDay = labourManDayRate, basis = labourBillingBasis) => {
    if (basis === 'manday') {
      const days = (Number(log.laborCount) || 1) * ((Number(log.hoursWorked) || 8) / 8);
      return Math.round(days * ratePerManDay);
    }
    return Math.round((Number(log.areaCompletedSqft) || 0) * ratePerSqft);
  };

  // Client Approves Worker Daily Log & Certifies Labour Billing
  const handleConfirmApproval = (log, approved = true) => {
    const calculatedBilling = calculateLabourBilling(log);

    setWorkerLogs(prev => prev.map(l => {
      if (l.id === log.id) {
        return {
          ...l,
          status: approved ? 'approved' : 'rejected',
          ratePerSqft: labourRatePerSqft,
          billingAmount: calculatedBilling,
          approvedBy: `${currentUser.name} (${currentUser.companyName || 'Client Engineer'})`,
          approvalTimestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          approvalComments: approvalComment || 'Work inspected and certified as per site structural layout.'
        };
      }
      return l;
    }));

    setSelectedLogToApprove(null);
    setSuccessBanner(approved ? `✓ Worker progress approved & certified! Approved Labour Bill: ₹${calculatedBilling.toLocaleString('en-IN')}` : "Worker log flagged with revision notes.");
  };

  // Client / Supervisor Adds Daily Labour Work Entry
  const handleAddNewLabourLog = (e) => {
    e.preventDefault();
    const billingAmt = calculateLabourBilling({
      areaCompletedSqft: Number(newLabourForm.areaCompletedSqft) || 0,
      laborCount: Number(newLabourForm.laborCount) || 1,
      hoursWorked: Number(newLabourForm.hoursWorked) || 8
    });

    const newLogObj = {
      id: `WLOG-${Date.now().toString().slice(-4)}`,
      date: newLabourForm.date || new Date().toISOString().slice(0, 10),
      workerId: `usr_worker_${Date.now()}`,
      workerName: newLabourForm.workerName,
      workerPhone: '+91 98200 88210',
      siteName: newLabourForm.siteName,
      clientCompanyName: currentUser?.companyName || 'Shapoorji Pallonji Construction',
      clientId: currentUser?.id || 'usr_client_1',
      workType: newLabourForm.workType,
      floorLevel: newLabourForm.floorLevel,
      workCompletedSummary: newLabourForm.workCompletedSummary,
      areaCompletedSqft: Number(newLabourForm.areaCompletedSqft) || 0,
      volumeCompletedCum: Math.round((Number(newLabourForm.areaCompletedSqft) || 0) / 10),
      laborCount: Number(newLabourForm.laborCount) || 1,
      hoursWorked: Number(newLabourForm.hoursWorked) || 8,
      status: newLabourForm.autoApprove ? 'approved' : 'pending_approval',
      ratePerSqft: labourRatePerSqft,
      billingAmount: billingAmt,
      approvedBy: newLabourForm.autoApprove ? `${currentUser?.name} (${currentUser?.companyName || 'Client Engineer'})` : '',
      approvalTimestamp: newLabourForm.autoApprove ? new Date().toISOString().slice(0, 16).replace('T', ' ') : '',
      approvalComments: newLabourForm.autoApprove ? 'Certified and approved on site by client engineer.' : '',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=500&auto=format&fit=crop&q=60'
    };

    setWorkerLogs(prev => [newLogObj, ...prev]);
    setIsAddLabourModalOpen(false);
    setSuccessBanner(`👷 Daily labour work entry recorded for ${newLogObj.siteName}! ${newLabourForm.autoApprove ? 'Marked as Approved & Certified.' : 'Added to Pending Sign-off queue.'}`);
  };

  // Register New Site from Modal
  const handleSaveNewSite = (e) => {
    e.preventDefault();
    if (!newSiteInput.name.trim()) return;

    const createdSite = {
      id: `site_${Date.now()}`,
      name: newSiteInput.name.trim(),
      location: newSiteInput.location.trim() || 'Site Address',
      city: newSiteInput.city || 'Navi Mumbai',
      siteEngineer: newSiteInput.siteEngineer || currentUser.name,
      phone: newSiteInput.phone || currentUser.phone,
      slabAreaSqft: Number(newSiteInput.slabAreaSqft) || 12000,
      dueAmount: Number(newSiteInput.dueAmount) || 0,
      totalPcs: Number(newSiteInput.totalPcs) || 0,
      lastDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
      badgeType: newSiteInput.badgeType || 'Sqft Area Mix',
      active: true
    };

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser?.id) {
        return {
          ...u,
          sites: [...(u.sites || []), createdSite]
        };
      }
      return u;
    }));

    setIsNewSiteModalOpen(false);
    alert(`✅ New site "${createdSite.name}" registered successfully!`);
  };

  // Helpers for Multiple Items in Request Items (Issue Items) Modal
  const handleIssueAddItem = (name = "MS Shuttering Plates 900x600 (3'x2')", qty = 50, unit = "Pcs") => {
    setIssueFormData(prev => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { name, qty: Number(qty) || 50, unit }
      ]
    }));
  };

  const handleIssueItemChange = (index, field, value) => {
    setIssueFormData(prev => {
      const updated = [...(prev.items || [])];
      updated[index] = {
        ...updated[index],
        [field]: field === 'qty' ? (Number(value) || 0) : value
      };
      return { ...prev, items: updated };
    });
  };

  const handleIssueRemoveItem = (index) => {
    if ((issueFormData.items || []).length <= 1) {
      alert("At least one equipment item is required in the request.");
      return;
    }
    setIssueFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  // Submit Request for Extra Items (Multiple Items Needed More)
  const handleSubmitIssueItems = (e) => {
    e.preventDefault();
    const itemsList = issueFormData.items || [];
    const totalQtyRequested = itemsList.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    const itemsCount = itemsList.length;
    
    // Update pieces for this site
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser?.id) {
        return {
          ...u,
          sites: (u.sites || clientSites).map(s => {
            if (s.id === selectedSiteForIssue?.id) {
              return {
                ...s,
                totalPcs: (s.totalPcs || 0) + totalQtyRequested,
                lastDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
              };
            }
            return s;
          })
        };
      }
      return u;
    }));

    const siteName = selectedSiteForIssue?.name || 'Selected Site';
    const siteLoc = selectedSiteForIssue?.location || selectedSiteForIssue?.city || 'Bengaluru';

    // Record Activity Entry
    const newActivity = {
      id: `act_${Date.now()}`,
      siteName,
      location: siteLoc,
      type: 'request',
      title: 'Extra Materials Requested',
      refNo: issueFormData.challanNo,
      dateTime: `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Yard Processing',
      statusColor: '#ea580c',
      items: [...itemsList],
      totalPcs: totalQtyRequested,
      notes: issueFormData.notes || 'Additional materials requested for site work'
    };
    setSiteMaterialActivities(prev => [newActivity, ...prev]);

    setSelectedSiteForIssue(null);
    setSuccessBanner(`✅ Material request for ${totalQtyRequested} pcs across ${itemsCount} items submitted for "${siteName}" to ScaffBuild Yard!`);
  };

  // Submit Take Back Notification
  const handleSubmitReceiveItems = (e) => {
    if (e) e.preventDefault();
    const siteName = selectedSiteForReceive?.name || 'Selected Site';
    const siteLoc = selectedSiteForReceive?.location || selectedSiteForReceive?.city || 'Bengaluru';

    // Record Take Back Activity Entry
    const newActivity = {
      id: `act_${Date.now()}`,
      siteName,
      location: siteLoc,
      type: 'take_back',
      title: 'Take Back Pickup Notification',
      refNo: `RC/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      dateTime: `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Transport Scheduled',
      statusColor: '#16a34a',
      items: [
        { name: "Dismantled Equipment Ready for Pickup", qty: selectedSiteForReceive?.totalPcs || 65, unit: "Pcs" }
      ],
      totalPcs: selectedSiteForReceive?.totalPcs || 65,
      notes: receiveFormData.notes || 'Dismantling completed, surplus material ready for pickup'
    };
    setSiteMaterialActivities(prev => [newActivity, ...prev]);

    setSelectedSiteForReceive(null);
    setSuccessBanner(`🔔 Take Back Notification Sent! ScaffBuild Logistics & Yard team have been notified to dispatch transport pickup for "${siteName}".`);
  };

  // Send Take Back Notification directly via WhatsApp
  const handleSendTakeBackWhatsApp = () => {
    const siteName = selectedSiteForReceive?.name || 'Selected Site';
    const siteLoc = selectedSiteForReceive?.location || selectedSiteForReceive?.city || 'Bengaluru';
    const notesText = receiveFormData.notes ? `%0A📝 *Notes:* ${encodeURIComponent(receiveFormData.notes)}` : '';
    const text = `🚨 *SCAFFBUILD TAKE BACK NOTIFICATION*%0A%0AHello ScaffBuild Logistics Team, shuttering material dismantling is completed and surplus equipment is ready for pickup at:%0A%0A📍 *Site:* ${encodeURIComponent(siteName)}%0A📦 *Current Equipment on Site:* ${selectedSiteForReceive?.totalPcs || 65} pcs${notesText}%0A%0APlease schedule transport pickup.`;

    // Record Take Back Activity Entry
    const newActivity = {
      id: `act_${Date.now()}`,
      siteName,
      location: siteLoc,
      type: 'take_back',
      title: 'Take Back Pickup via WhatsApp',
      refNo: `RC/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      dateTime: `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'WhatsApp Dispatched',
      statusColor: '#16a34a',
      items: [
        { name: "Dismantled Equipment (WhatsApp Notified)", qty: selectedSiteForReceive?.totalPcs || 65, unit: "Pcs" }
      ],
      totalPcs: selectedSiteForReceive?.totalPcs || 65,
      notes: receiveFormData.notes || 'Dispatched via WhatsApp message'
    };
    setSiteMaterialActivities(prev => [newActivity, ...prev]);

    window.open(`https://wa.me/919820099999?text=${text}`, '_blank');
    setSelectedSiteForReceive(null);
    setSuccessBanner(`🔔 Take Back Notification dispatched via WhatsApp to ScaffBuild Yard!`);
  };

  // Default Ledger & Material Transaction Records for Site Details Screen (Matching 5 Screenshots)
  const getSiteLedgerData = (site) => {
    const isIconMicasa = !site || site.name?.includes('ICON MICASA');

    return {
      companyName: currentUser?.companyName || 'ASG WIN INDIA PRIVATE LIMITED',
      siteName: site?.name || 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      shortSiteName: (site?.name || 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD').length > 22 
        ? (site?.name || 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD').substring(0, 22) + '...'
        : (site?.name || 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD'),
      ratePerSqft: site?.ratePerSqft || 3,
      balanceAreaSqft: site?.balanceAreaSqft || (isIconMicasa ? 25000 : 20000),

      // Balance Breakdown (Screenshot 1)
      balanceItems: isIconMicasa ? [
        {
          group: "3m Vertical",
          name: "3m Vertical 3m 10ft",
          issued: 70,
          returned: 10,
          balance: 60,
          calcStr: "70 - 10 = 60"
        },
        {
          group: "Farma",
          name: "Farma 9x9",
          issued: 5,
          returned: 0,
          balance: 5,
          calcStr: "5 - 0 = 5"
        }
      ] : [
        {
          group: "3m Vertical",
          name: "3m Vertical 3m 10ft",
          issued: 200,
          returned: 20,
          balance: 180,
          calcStr: "200 - 20 = 180"
        },
        {
          group: "Farma",
          name: "Farma 9x9",
          issued: 85,
          returned: 5,
          balance: 80,
          calcStr: "85 - 5 = 80"
        }
      ],
      balanceSum: isIconMicasa ? "75 - 10 = 65" : "285 - 25 = 260",

      // Inward Returns / Pickups (Screenshot 2)
      inChallans: isIconMicasa ? [
        {
          id: "rc_1",
          dateStr: "26 Sep 2026 9:25 AM",
          chlNo: "RC0001",
          items: [
            { name: "3m Vertical 3m 10ft", qty: 10, totalGroup: "TOTAL 3m Vertical (1)" }
          ],
          totalPcs: 10
        }
      ] : [
        {
          id: "rc_gw_1",
          dateStr: "28 Sep 2026 11:30 AM",
          chlNo: "RC0005",
          items: [
            { name: "3m Vertical 3m 10ft", qty: 20, totalGroup: "TOTAL 3m Vertical (1)" },
            { name: "Farma 9x9", qty: 5, totalGroup: "TOTAL Farma (1)" }
          ],
          totalPcs: 25
        }
      ],

      // Outward Deliveries (Screenshot 5)
      outChallans: isIconMicasa ? [
        {
          id: "dc_3",
          dateStr: "26 Sep 2026 4:56 PM",
          chlNo: "DC0003",
          items: [
            { name: "3m Vertical 3m 10ft", qty: 40, totalGroup: "TOTAL 3m Vertical (1)" },
            { name: "Farma 9x9", qty: 5, totalGroup: "TOTAL Farma (1)" }
          ],
          totalPcs: 45
        },
        {
          id: "dc_2",
          dateStr: "26 Sep 2026 9:34 AM",
          chlNo: "DC0002",
          items: [
            { name: "3m Vertical 3m 10ft", qty: 5, totalGroup: "TOTAL 3m Vertical (1)" }
          ],
          totalPcs: 5
        }
      ] : [
        {
          id: "dc_gw_1",
          dateStr: "15 Sep 2026 2:15 PM",
          chlNo: "DC0012",
          items: [
            { name: "3m Vertical 3m 10ft", qty: 150, totalGroup: "TOTAL 3m Vertical (1)" },
            { name: "Farma 9x9", qty: 60, totalGroup: "TOTAL Farma (1)" }
          ],
          totalPcs: 210
        }
      ],

      // Invoices & Bills (Screenshot 3)
      bills: isIconMicasa ? [
        {
          invNo: "INV0001",
          period: "1 Sep 26 to 30 Sep 26",
          amount: 2655000,
          amountStr: "₹ 26,55,000",
          status: "Unpaid Balance"
        }
      ] : [
        {
          invNo: "INV0002",
          period: "1 Aug 26 to 30 Sep 26",
          amount: 1484000,
          amountStr: "₹ 14,84,000",
          status: "Due"
        }
      ],
      billsTotalDiffWarning: "Your invoices total as of 30-09-2026 is 2655000, which differs from the actual total: 88500",

      // Payments Received
      payments: isIconMicasa ? [
        {
          id: "pay_1",
          dateStr: "26 Oct 2026 2:26 PM",
          title: "Payment Received",
          amount: 20000,
          mode: "RTGS / NEFT - Bank Transfer",
          ref: "UTR202610260081"
        },
        {
          id: "pay_2",
          dateStr: "26 Oct 2026 11:15 AM",
          title: "Payment Received",
          amount: 6000,
          mode: "UPI - Immediate",
          ref: "UPI2610269921"
        }
      ] : [
        {
          id: "pay_gw_1",
          dateStr: "20 Sep 2026 4:10 PM",
          title: "Payment Received",
          amount: 50000,
          mode: "Cheque Deposit",
          ref: "CHQ-88219"
        }
      ],

      // Unified Chronological Stream for "All" Tab (Screenshot 4)
      allActivities: isIconMicasa ? [
        {
          type: "payments_group",
          dateStr: "26 Oct 2026 2:26 PM",
          items: [
            { title: "Payment Received", amount: 20000, dotColor: "#8b5cf6" },
            { title: "Payment Received", amount: 6000, dotColor: "#8b5cf6" }
          ]
        },
        {
          type: "outward_challan",
          dateStr: "26 Sep 2026 4:56 PM",
          chlNo: "DC0003",
          items: [
            { name: "3m Vertical 3m 10ft", rateStr: "0₹", qty: 40, dotColor: "#dc2626" },
            { name: "Farma 9x9", rateStr: "0₹", qty: 5, dotColor: "#dc2626" }
          ]
        },
        {
          type: "outward_challan",
          dateStr: "26 Sep 2026 9:34 AM",
          chlNo: "DC0002",
          items: [
            { name: "3m Vertical 3m 10ft", rateStr: "0₹", qty: 5, dotColor: "#dc2626" }
          ]
        },
        {
          type: "inward_challan",
          dateStr: "26 Sep 2026 9:25 AM",
          chlNo: "RC0001",
          items: [
            { name: "3m Vertical 3m 10ft", qty: 10, dotColor: "#16a34a" }
          ]
        }
      ] : [
        {
          type: "outward_challan",
          dateStr: "15 Sep 2026 2:15 PM",
          chlNo: "DC0012",
          items: [
            { name: "3m Vertical 3m 10ft", rateStr: "0₹", qty: 150, dotColor: "#dc2626" },
            { name: "Farma 9x9", rateStr: "0₹", qty: 60, dotColor: "#dc2626" }
          ]
        }
      ]
    };
  };

  // Filtered & sorted sites for client main page based on search query & sort order
  const filteredSites = clientSites.filter(site => {
    if (!mainPageSearchQuery.trim()) return true;
    const q = mainPageSearchQuery.trim().toLowerCase();
    const nameMatch = (site.name || '').toLowerCase().includes(q);
    const locMatch = (site.location || '').toLowerCase().includes(q);
    const cityMatch = (site.city || '').toLowerCase().includes(q);
    const engMatch = (site.siteEngineer || '').toLowerCase().includes(q);
    const badgeMatch = (site.badgeType || '').toLowerCase().includes(q);
    const dueMatch = String(site.dueAmount || '').includes(q);
    return nameMatch || locMatch || cityMatch || engMatch || badgeMatch || dueMatch;
  }).sort((a, b) => {
    if (siteSortBy === 'due') {
      return (Number(b.dueAmount) || 0) - (Number(a.dueAmount) || 0);
    }
    if (siteSortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  // Filtered worker logs for progress slide
  const filteredWorkerLogs = selectedSiteFilter === 'ALL'
    ? clientWorkerLogs
    : clientWorkerLogs.filter(l => l.siteName === selectedSiteFilter);

  const pendingApprovalsCount = clientWorkerLogs.filter(l => l.status === 'pending_approval').length;
  const pendingQuotations = clientQuotations.filter(q => q.status === 'requested' || q.status === 'quotation_sent');
  const pendingLabourLogs = clientWorkerLogs.filter(l => l.status === 'pending_approval');
  const totalPendingActionsCount = pendingQuotations.length + pendingLabourLogs.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '640px', margin: '0 auto', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ========================================================================= */}
      {/* CLIENT TOP IDENTITY BAR WITH 3-DOTS MENU (MATERIALS, PASSWORD, PHONE)    */}
      {/* ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e5e7eb',
        padding: '0.75rem 1rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            {currentUser?.avatar || '🏢'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', lineHeight: 1.2 }}>
              {currentUser?.name || 'Client User'}
            </div>
          </div>
        </div>

        {/* 3-DOTS MENU (Replaces direct logout: Available Materials, Forgot password, Change phone, Log out) */}
        <ClientThreeDotMenu 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
          onLogout={onLogout}
          onOpenSettings={() => setActiveSlide('more')}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onRequestMaterial={(item) => {
            setActiveSlide('projects');
            setIsQuotationDropdownOpen(true);
            handleAddItem(item.name, 50, 'Pcs');
            setSuccessBanner(`Added "${item.name}" to your quotation form.`);
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* SLIDE NAVIGATION BAR: 3 TABS (PROJECTS, NOTIFICATIONS, SETTINGS)          */}
      {/* ========================================================================= */}
      <nav 
        aria-label="Client Portal Sections"
        style={{
          display: 'flex',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          gap: '4px'
        }}
      >
        {/* Slide Tab 1: Projects & Sites */}
        <button
          type="button"
          id="client-nav-projects"
          className={`btn ${activeSlide === 'projects' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            flex: 1,
            borderRadius: '8px',
            border: activeSlide === 'projects' ? 'none' : '1px solid transparent',
            padding: '0.55rem 0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: 'clamp(0.74rem, 2.7vw, 0.85rem)',
            fontWeight: 700,
            minWidth: 0,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSlide('projects')}
        >
          <Building2 size={15} style={{ flexShrink: 0 }} />
          <span>Projects</span>
          <span style={{ 
            background: activeSlide === 'projects' ? 'rgba(255,255,255,0.25)' : '#f3f4f6', 
            color: activeSlide === 'projects' ? '#ffffff' : '#4b5563',
            fontSize: '0.65rem', 
            padding: '1px 5px', 
            borderRadius: '999px',
            fontWeight: 800,
            flexShrink: 0
          }}>
            {clientSites.length}
          </span>
        </button>

        {/* Slide Tab 2: Approvals (Unifies Equipment Quotations & Daily Labour Sign-Offs) */}
        <button
          type="button"
          id="client-nav-approvals"
          className={`btn ${activeSlide === 'notifications' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            flex: 1,
            borderRadius: '8px',
            border: activeSlide === 'notifications' ? 'none' : '1px solid transparent',
            padding: '0.55rem 0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: 'clamp(0.74rem, 2.7vw, 0.85rem)',
            fontWeight: 700,
            minWidth: 0,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSlide('notifications')}
        >
          <FileCheck2 size={15} style={{ flexShrink: 0 }} />
          <span>Approvals</span>
          {totalPendingActionsCount > 0 ? (
            <span style={{ 
              background: '#e11d48', 
              color: '#ffffff', 
              fontSize: '0.65rem', 
              padding: '1px 5px', 
              borderRadius: '999px', 
              fontWeight: 800,
              flexShrink: 0
            }}>
              {totalPendingActionsCount}
            </span>
          ) : (
            <span style={{ 
              background: activeSlide === 'notifications' ? 'rgba(255,255,255,0.25)' : '#f3f4f6', 
              color: activeSlide === 'notifications' ? '#ffffff' : '#4b5563',
              fontSize: '0.65rem', 
              padding: '1px 5px', 
              borderRadius: '999px', 
              fontWeight: 800,
              flexShrink: 0
            }}>
              {clientQuotations.length + clientWorkerLogs.length}
            </span>
          )}
        </button>

        {/* Slide Tab 3: More Settings */}
        <button
          type="button"
          id="client-nav-more-settings"
          className={`btn ${activeSlide === 'more' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            flex: 1,
            borderRadius: '8px',
            border: activeSlide === 'more' ? 'none' : '1px solid transparent',
            padding: '0.55rem 0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: 'clamp(0.74rem, 2.7vw, 0.85rem)',
            fontWeight: 700,
            minWidth: 0,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSlide('more')}
        >
          <Settings size={15} style={{ flexShrink: 0 }} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Success Banner Notification */}
      {successBanner && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} color="#059669" />
            <span>{successBanner}</span>
          </div>
          <button 
            onClick={() => setSuccessBanner('')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#065f46', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE 2: MY PROJECTS & SITES (EXACT SCREENSHOT UI MATCH)                  */}
      {/* ========================================================================= */}
      {activeSlide === 'projects' && (
        selectedSiteForDetails ? (
          /* ======================================================================= */
          /* SCREEN: SITE DETAILS & MATERIAL LEDGER (MATCHING 5 MOBILE SCREENSHOTS)  */
          /* ======================================================================= */
          (() => {
            const siteData = getSiteLedgerData(selectedSiteForDetails);
            const query = siteDetailsSearchQuery.trim().toLowerCase();

            // Filter balance items
            const filteredBalanceItems = siteData.balanceItems.filter(it => 
              !query || it.name.toLowerCase().includes(query) || it.group.toLowerCase().includes(query)
            );

            // Filter inward challans
            const filteredInChallans = siteData.inChallans.map(ch => ({
              ...ch,
              items: ch.items.filter(it => !query || it.name.toLowerCase().includes(query))
            })).filter(ch => ch.items.length > 0 || !query);

            // Filter outward challans
            const filteredOutChallans = siteData.outChallans.map(ch => ({
              ...ch,
              items: ch.items.filter(it => !query || it.name.toLowerCase().includes(query))
            })).filter(ch => ch.items.length > 0 || !query);

            // Filter bills
            const filteredBills = siteData.bills.filter(b => 
              !query || b.invNo.toLowerCase().includes(query) || b.period.toLowerCase().includes(query)
            );

            // Compute unified site labour & material bills for this specific site
            const siteNameTarget = (selectedSiteForDetails.name || '').toLowerCase();
            const matchedLogs = clientWorkerLogs.filter(l => 
              (l.siteName || '').toLowerCase().includes(siteNameTarget) || 
              siteNameTarget.includes((l.siteName || '').toLowerCase())
            );
            const siteLogs = matchedLogs.length > 0 ? matchedLogs : clientWorkerLogs;

            const siteApprovedLogs = siteLogs.filter(l => l.status === 'approved');
            const sitePendingLogs = siteLogs.filter(l => l.status === 'pending_approval');
            const siteTotalApprovedBilling = siteApprovedLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
            const siteTotalApprovedArea = siteApprovedLogs.reduce((sum, l) => sum + (Number(l.areaCompletedSqft) || 0), 0);
            const siteTotalPendingBilling = sitePendingLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
            const siteTotalPendingArea = sitePendingLogs.reduce((sum, l) => sum + (Number(l.areaCompletedSqft) || 0), 0);

            // Material rental bill total
            const materialRentalTotal = siteData.bills.reduce((sum, b) => {
              const num = Number((b.amountStr || '').replace(/[^0-9.-]+/g, '')) || 0;
              return sum + num;
            }, 0) || 2655000;
            const grandTotalAllBills = materialRentalTotal + siteTotalApprovedBilling;

            return (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                minHeight: '82vh'
              }}>
                {/* 1. TOP HEADER BAR: Back Arrow, Item Name Search, Print, PDF, 3-dots */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.5rem',
                  background: '#ffffff',
                  borderBottom: '1px solid #f1f5f9',
                  gap: '0.5rem'
                }}>
                  {/* Left: Back button ← */}
                  <button
                    type="button"
                    onClick={() => setSelectedSiteForDetails(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#000000'
                    }}
                    title="Back to Sites"
                  >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                  </button>

                  {/* Center: Search input: [Item Name        🔍] */}
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text"
                      placeholder="Item Name"
                      value={siteDetailsSearchQuery}
                      onChange={(e) => setSiteDetailsSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 34px 6px 12px',
                        borderRadius: '6px',
                        border: '1.5px solid #d1d5db',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                        color: '#000000',
                        background: '#ffffff'
                      }}
                    />
                    <Search size={18} color="#9ca3af" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
                  </div>

                  {/* Right: Print, PDF, 3-dots */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#000000', display: 'flex' }}
                      title="Print Statement"
                    >
                      <Printer size={22} strokeWidth={2.2} />
                    </button>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading official PDF Statement for ${selectedSiteForDetails.name}...`)}
                      style={{
                        background: 'none',
                        border: '2px solid #000000',
                        borderRadius: '4px',
                        padding: '0px 3px',
                        cursor: 'pointer',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        color: '#000000',
                        lineHeight: 1.2
                      }}
                      title="PDF Export"
                    >
                      PDF
                    </button>

                    {/* 3-DOTS MENU IN SITE DETAILS */}
                    <ClientThreeDotMenu 
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      users={users}
                      setUsers={setUsers}
                      onLogout={onLogout}
                      onOpenSettings={() => {
                        setSelectedSiteForDetails(null);
                        setActiveSlide('more');
                      }}
                      currentLanguage={currentLanguage}
                      onLanguageChange={setCurrentLanguage}
                      onRequestMaterial={(item) => {
                        setSelectedSiteForDetails(null);
                        setActiveSlide('request');
                        setReqItems(prev => [
                          ...prev,
                          { name: item.name, category: item.category, qty: 50, unit: 'Pcs' }
                        ]);
                        setSuccessBanner(`Added "${item.name}" to your quotation request draft.`);
                      }}
                      buttonStyle={{ padding: '3px 6px', border: '1.5px solid #000000', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                {/* 2. QUICK ACTION PILLS: + Issue, + Receive, + Payment, + Bill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem 0.65rem',
                  background: '#ffffff',
                  overflowX: 'auto',
                  scrollbarWidth: 'none'
                }}>
                  {/* + Request Items */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSiteForIssue(selectedSiteForDetails);
                      setIssueFormData(prev => ({
                        ...prev,
                        challanNo: `REQ/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      border: '1.5px solid #ea768b',
                      background: '#ffffff',
                      color: '#111827',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ color: '#ea768b', fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>+</span>
                    <span>Request Items</span>
                  </button>

                  {/* + Take Back */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSiteForReceive(selectedSiteForDetails);
                      setReceiveFormData(prev => ({
                        ...prev,
                        returnChallanNo: `RC/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      border: '1.5px solid #34a853',
                      background: '#ffffff',
                      color: '#111827',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ color: '#34a853', fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>+</span>
                    <span>Take Back</span>
                  </button>

                  {/* + Bill */}
                  <button
                    type="button"
                    onClick={() => setSiteDetailsActiveTab('bills')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      border: '1.5px solid #28445d',
                      background: '#ffffff',
                      color: '#111827',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ color: '#28445d', fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>+</span>
                    <span>Bill</span>
                  </button>
                </div>

                {/* 3. HORIZONTAL NAVIGATION TABS: All, Out, In, Balance, Bills, Ledger */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  borderBottom: '1px solid #e5e7eb',
                  overflowX: 'auto',
                  scrollbarWidth: 'none'
                }}>
                  {[
                    { id: 'requests', label: 'Requested & Take Back' },
                    { id: 'quotations', label: 'Quotations' },
                    { id: 'labour', label: 'Daily Labour Approvals' },
                    { id: 'all', label: 'All' },
                    { id: 'out', label: 'Out' },
                    { id: 'in', label: 'In' },
                    { id: 'balance', label: 'Balance' },
                    { id: 'bills', label: 'Bills (All Invoices)' },
                    { id: 'ledger', label: 'Ledger' }
                  ].map(t => {
                    const isActive = siteDetailsActiveTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSiteDetailsActiveTab(t.id)}
                        style={{
                          flex: 'none',
                          padding: '0.65rem 1.15rem',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: isActive ? '3.5px solid #f59e0b' : '3.5px solid transparent',
                          color: isActive ? '#000000' : '#4b5563',
                          fontWeight: isActive ? 800 : 500,
                          fontSize: '0.94rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* 4. GREY SITE INFO BANNER */}
                <div style={{
                  background: '#eeeeee',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#111827',
                      textTransform: 'uppercase',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {siteData.companyName}, {siteData.shortSiteName}
                    </div>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: '#000000',
                      marginTop: '2px'
                    }}>
                      Rate: {siteData.ratePerSqft}₹ Per Sqft, Balance Area: {siteData.balanceAreaSqft} FT²
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, color: '#111827', flexShrink: 0 }}>
                    <input 
                      type="checkbox"
                      checked={siteDetailsShowTotal}
                      onChange={(e) => setSiteDetailsShowTotal(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#2e4255', cursor: 'pointer' }}
                    />
                    <span>Show Total</span>
                  </label>
                </div>

                {/* 5. TAB VIEW CONTENTS (MATCHING SCREENSHOTS 1 TO 5 & REQUESTS/TAKE BACK) */}
                <div style={{ padding: '0.85rem 0', flex: 1 }}>

                  {/* TAB: REQUESTED & TAKE BACK (WHERE, WHEN, AND ALL REQUESTED / TAKE BACK) */}
                  {siteDetailsActiveTab === 'requests' && (() => {
                    const siteNameTarget = (selectedSiteForDetails.name || '').toLowerCase();
                    const filteredActivities = siteMaterialActivities.filter(act => {
                      const matchesSite = (act.siteName || '').toLowerCase().includes(siteNameTarget) || 
                                          siteNameTarget.includes((act.siteName || '').toLowerCase());
                      const matchesFilter = activityFilter === 'ALL' || 
                                            (activityFilter === 'REQUESTS' && act.type === 'request') || 
                                            (activityFilter === 'TAKE_BACK' && act.type === 'take_back');
                      const matchesQuery = !siteDetailsSearchQuery || 
                                           act.title.toLowerCase().includes(siteDetailsSearchQuery.toLowerCase()) || 
                                           act.refNo.toLowerCase().includes(siteDetailsSearchQuery.toLowerCase()) ||
                                           (act.items || []).some(it => it.name.toLowerCase().includes(siteDetailsSearchQuery.toLowerCase()));
                      return matchesSite && matchesFilter && matchesQuery;
                    });

                    const reqCount = siteMaterialActivities.filter(a => ((a.siteName || '').toLowerCase().includes(siteNameTarget) || siteNameTarget.includes((a.siteName || '').toLowerCase())) && a.type === 'request').length;
                    const tbCount = siteMaterialActivities.filter(a => ((a.siteName || '').toLowerCase().includes(siteNameTarget) || siteNameTarget.includes((a.siteName || '').toLowerCase())) && a.type === 'take_back').length;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0 0.85rem' }}>
                        
                        {/* Section Header & Filter Pills */}
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span>📋</span>
                                <span>Requests & Take Back Movement Log</span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                Complete record of <strong>where</strong>, <strong>when</strong>, and <strong>all items</strong> requested & taken back
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button
                                type="button"
                                className={`btn btn-sm ${activityFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '9999px' }}
                                onClick={() => setActivityFilter('ALL')}
                              >
                                All ({reqCount + tbCount})
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${activityFilter === 'REQUESTS' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: activityFilter === 'REQUESTS' ? '#e6657c' : 'transparent', borderColor: '#e6657c', color: activityFilter === 'REQUESTS' ? '#fff' : '#e6657c' }}
                                onClick={() => setActivityFilter('REQUESTS')}
                              >
                                📦 Requests ({reqCount})
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${activityFilter === 'TAKE_BACK' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: activityFilter === 'TAKE_BACK' ? '#37a23a' : 'transparent', borderColor: '#37a23a', color: activityFilter === 'TAKE_BACK' ? '#fff' : '#15803d' }}
                                onClick={() => setActivityFilter('TAKE_BACK')}
                              >
                                🚚 Take Back ({tbCount})
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* List of Material Movement Cards */}
                        {filteredActivities.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {filteredActivities.map(act => {
                              const isRequest = act.type === 'request';
                              return (
                                <div 
                                  key={act.id}
                                  style={{
                                    background: '#ffffff',
                                    borderRadius: '12px',
                                    border: isRequest ? '1.5px solid #fecdd3' : '1.5px solid #bbf7d0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {/* Top Ribbon */}
                                  <div style={{
                                    background: isRequest ? '#fff1f2' : '#f0fdf4',
                                    padding: '0.65rem 0.85rem',
                                    borderBottom: isRequest ? '1px solid #ffe4e6' : '1px solid #dcfce7',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{
                                        background: isRequest ? '#e6657c' : '#37a23a',
                                        color: '#ffffff',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.02em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                      }}>
                                        {isRequest ? '📦 MATERIAL REQUESTED' : '🚚 TAKE BACK PICKUP'}
                                      </span>
                                      <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                                        Ref: {act.refNo}
                                      </span>
                                    </div>

                                    <div style={{
                                      background: '#ffffff',
                                      border: `1px solid ${act.statusColor}`,
                                      color: act.statusColor,
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700
                                    }}>
                                      ● {act.status}
                                    </div>
                                  </div>

                                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    
                                    {/* WHERE AND WHEN BOX */}
                                    <div style={{
                                      background: '#f8fafc',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '8px',
                                      padding: '0.65rem 0.85rem',
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                      gap: '0.5rem'
                                    }}>
                                      <div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                          📍 WHERE (SITE LOCATION)
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', marginTop: '1px' }}>
                                          {act.siteName}
                                        </div>
                                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                          {act.location}
                                        </div>
                                      </div>

                                      <div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                          🕒 WHEN (DATE & TIME)
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', marginTop: '1px' }}>
                                          {act.dateTime}
                                        </div>
                                        <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                                          Logged & Verified in ScaffBuild Portal
                                        </div>
                                      </div>
                                    </div>

                                    {/* ALL ITEMS REQUESTED / TAKEN BACK */}
                                    <div>
                                      <div style={{
                                        fontSize: '0.74rem',
                                        fontWeight: 800,
                                        color: '#334155',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.35rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}>
                                        <span>
                                          {isRequest ? 'ALL ITEMS REQUESTED' : 'ALL ITEMS TAKEN BACK'} ({(act.items || []).length} items)
                                        </span>
                                        <span style={{ fontWeight: 800, color: isRequest ? '#e11d48' : '#15803d' }}>
                                          Total: {act.totalPcs} Pcs
                                        </span>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        {(act.items || []).map((it, idx) => (
                                          <div
                                            key={idx}
                                            style={{
                                              background: '#ffffff',
                                              border: '1px solid #f1f5f9',
                                              padding: '0.45rem 0.75rem',
                                              borderRadius: '6px',
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center'
                                            }}
                                          >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                              <div style={{
                                                width: '7px',
                                                height: '7px',
                                                borderRadius: '50%',
                                                background: isRequest ? '#f43f5e' : '#10b981'
                                              }} />
                                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                                                {it.name}
                                              </span>
                                            </div>
                                            <span className="mono badge badge-neutral" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                                              {it.qty} {it.unit || 'Pcs'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Notes if present */}
                                    {act.notes && (
                                      <div style={{
                                        background: '#fafafa',
                                        borderLeft: `3px solid ${isRequest ? '#f43f5e' : '#10b981'}`,
                                        padding: '0.45rem 0.65rem',
                                        fontSize: '0.78rem',
                                        color: '#475569',
                                        borderRadius: '0 6px 6px 0'
                                      }}>
                                        <strong>Notes:</strong> "{act.notes}"
                                      </div>
                                    )}

                                    {/* Action row */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.2rem' }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const text = encodeURIComponent(`Hi ScaffBuild Team, inquiring about ${isRequest ? 'Material Request' : 'Take Back Pickup'} ${act.refNo} for site: ${act.siteName}`);
                                          window.open(`https://wa.me/919820099999?text=${text}`, '_blank');
                                        }}
                                        style={{
                                          background: 'transparent',
                                          border: '1px solid #25D366',
                                          color: '#15803d',
                                          borderRadius: '6px',
                                          padding: '3px 10px',
                                          fontSize: '0.76rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.3rem'
                                        }}
                                      >
                                        <MessageCircle size={13} color="#25D366" />
                                        <span>Inquire via WhatsApp</span>
                                      </button>
                                    </div>

                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '1px dashed #cbd5e1',
                            padding: '2.5rem 1rem',
                            textAlign: 'center',
                            color: '#64748b'
                          }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📦</div>
                            <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#1e293b' }}>No Material Movement Found</div>
                            <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                              Click <strong>+ Request Items</strong> to request extra material, or <strong>+ Take Back</strong> to notify yard for pickup.
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })()}

                  {/* TAB: QUOTATIONS & WORK ORDERS FOR THIS SITE (WITH DELETE OPTION) */}
                  {siteDetailsActiveTab === 'quotations' && (() => {
                    const siteNameTarget = (selectedSiteForDetails.name || '').toLowerCase();
                    const siteQuotations = quotations.filter(q => {
                      const qSite = (q.siteName || '').toLowerCase();
                      return qSite.includes(siteNameTarget) || siteNameTarget.includes(qSite);
                    });

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0 0.85rem' }}>
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span>📋</span>
                              <span>Quotations & Work Orders for this Site ({siteQuotations.length})</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              Site: <strong>{selectedSiteForDetails.name}</strong> • Review rates, issue work orders, or delete older quotations
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {(() => {
                              const unapprovedSiteQuotations = siteQuotations.filter(q => q.status !== 'work_order_created' && q.status !== 'approved');
                              if (unapprovedSiteQuotations.length <= 1) return null;
                              return (
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#fff', fontSize: '0.76rem' }}
                                  onClick={() => {
                                    if (window.confirm(`Delete all ${unapprovedSiteQuotations.length} unapproved older quotations for ${selectedSiteForDetails.name}?\n\nApproved quotations and active work orders will NOT be deleted.`)) {
                                      const toDel = new Set(unapprovedSiteQuotations.map(q => q.id));
                                      const toDelNos = new Set(unapprovedSiteQuotations.map(q => q.quotationNo));
                                      setQuotations(prev => prev.filter(q => !toDel.has(q.id) && !toDelNos.has(q.quotationNo)));
                                      setSuccessBanner(`🗑️ ${unapprovedSiteQuotations.length} unapproved quotations for ${selectedSiteForDetails.name} deleted.`);
                                    }
                                  }}
                                >
                                  <Trash2 size={13} />
                                  <span>Delete Older Requests ({unapprovedSiteQuotations.length})</span>
                                </button>
                              );
                            })()}

                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setQuotationRequest(prev => ({ ...prev, siteName: selectedSiteForDetails.name }));
                                setSelectedSiteForDetails(null);
                                setActiveSlide('request');
                                setIsQuotationFormCollapsed(false);
                              }}
                              style={{ fontSize: '0.76rem' }}
                            >
                              <Plus size={13} />
                              <span>+ Request New Quotation</span>
                            </button>
                          </div>
                        </div>

                        {siteQuotations.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {siteQuotations.map((quot) => {
                              const isWorkOrder = quot.status === 'work_order_created';
                              const isQuotationSent = quot.status === 'quotation_sent';
                              const isRequested = quot.status === 'requested';
                              const isApproved = isWorkOrder || quot.status === 'approved';

                              return (
                                <div 
                                  key={quot.id} 
                                  style={{ 
                                    background: '#ffffff', 
                                    border: `1.5px solid ${isWorkOrder ? '#10b981' : isQuotationSent ? 'var(--orange-primary)' : '#e2e8f0'}`,
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {/* Header ribbon */}
                                  <div style={{
                                    background: isWorkOrder ? '#f0fdf4' : isQuotationSent ? '#fff7ed' : '#f8fafc',
                                    padding: '0.65rem 0.85rem',
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '0.45rem'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                      <span className="mono" style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--orange-primary)' }}>
                                        {quot.quotationNo}
                                      </span>
                                      {isRequested && (
                                        <span className="badge badge-non-gst" style={{ fontSize: '0.7rem' }}>
                                          ⚡ AWAITING OWNER RATES
                                        </span>
                                      )}
                                      {isQuotationSent && (
                                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                                          📩 QUOTATION RECEIVED
                                        </span>
                                      )}
                                      {isWorkOrder && (
                                        <span className="badge badge-gst" style={{ fontSize: '0.7rem' }}>
                                          ✓ WORK ORDER: {quot.workOrderNo}
                                        </span>
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-mono)' }}>
                                        TOTAL: ₹{(quot.grandTotal || 0).toLocaleString('en-IN')}
                                      </span>
                                      {!isApproved && (
                                        <button
                                          type="button"
                                          className="btn btn-outline btn-sm"
                                          style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#fff', padding: '0.25rem 0.55rem', fontSize: '0.74rem' }}
                                          onClick={() => handleDeleteQuotation(quot.id, quot.quotationNo)}
                                          title="Delete this unapproved quotation"
                                        >
                                          <Trash2 size={13} />
                                          <span>Delete</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Body */}
                                  <div style={{ padding: '0.85rem' }}>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.45rem' }}>
                                      Date: <strong>{quot.date}</strong> • Required Area: <strong>{quot.requestedAreaSqft?.toLocaleString()} Sq.Ft</strong> • Duration: <strong>{quot.tenureMonths || 1} Month(s)</strong>
                                    </div>

                                    {quot.clientNotes && (
                                      <div style={{ fontSize: '0.8rem', color: '#1e293b', fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #f1f5f9', marginBottom: '0.65rem' }}>
                                        "{quot.clientNotes}"
                                      </div>
                                    )}

                                    {/* Items pills */}
                                    {quot.items && quot.items.length > 0 && (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.45rem' }}>
                                        {quot.items.map((it, idx) => (
                                          <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                            {it.name}: <strong>{it.qty} {it.unit}</strong>
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {quot.ownerReply && (
                                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--orange-primary)', fontWeight: 600 }}>
                                        Owner Reply: "{quot.ownerReply}"
                                      </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                                      {!isApproved && (
                                        <button
                                          type="button"
                                          className="btn btn-outline btn-sm"
                                          style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#fff' }}
                                          onClick={() => handleDeleteQuotation(quot.id, quot.quotationNo)}
                                        >
                                          <Trash2 size={13} />
                                          <span>Delete Quotation</span>
                                        </button>
                                      )}

                                      {isQuotationSent && (
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm"
                                          onClick={() => handleAcceptQuotation(quot)}
                                        >
                                          <FileCheck2 size={13} />
                                          <span>Accept & Issue Work Order</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{
                            textAlign: 'center',
                            padding: '2.5rem 1rem',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px dashed #cbd5e1'
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                              No Quotations Found for {selectedSiteForDetails.name}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '340px', margin: '0.35rem auto 1rem auto' }}>
                              You haven't requested any quotations or work orders for this site yet.
                            </p>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setQuotationRequest(prev => ({ ...prev, siteName: selectedSiteForDetails.name }));
                                setSelectedSiteForDetails(null);
                                setActiveSlide('request');
                                setIsQuotationFormCollapsed(false);
                              }}
                            >
                              <Plus size={14} />
                              <span>Request Quotation for this Site</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* TAB: DAILY LABOUR WORK APPROVALS & QUALITY CERTIFICATION FOR THIS SITE */}
                  {siteDetailsActiveTab === 'labour' && (() => {
                    const displayLogs = labourBillingActiveSubTab === 'approved' 
                      ? siteApprovedLogs 
                      : labourBillingActiveSubTab === 'pending' 
                        ? sitePendingLogs 
                        : siteLogs;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0 0.85rem' }}>
                        
                        {/* Header Banner */}
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span>👷</span>
                              <span>Daily Labour Approvals & Quality Sign-Off</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              Site: <strong>{selectedSiteForDetails.name}</strong> • Inspect crew staging, verify sq.ft, and issue quality certifications
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                              onClick={() => {
                                setNewLabourForm(prev => ({ ...prev, siteName: selectedSiteForDetails.name }));
                                setIsAddLabourModalOpen(true);
                              }}
                            >
                              <Plus size={13} />
                              <span>+ Record Daily Labour</span>
                            </button>
                          </div>
                        </div>

                        {/* Notice Banner: All Labour Bills are under Bills */}
                        <div style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.78rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1e40af' }}>
                            <span>💼</span>
                            <span><strong>Looking for Labour Bills?</strong> All Labour Bills are unified with Material Invoices under the <strong>Bills</strong> tab.</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ background: '#ffffff', borderColor: '#93c5fd', color: '#1d4ed8', fontSize: '0.74rem', padding: '3px 8px', fontWeight: 700 }}
                            onClick={() => setSiteDetailsActiveTab('bills')}
                          >
                            Go to Bills →
                          </button>
                        </div>

                        {/* 4 Summary KPI Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                          <div style={{ background: '#ffffff', border: '1.5px solid #fecdd3', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #e11d48' }}>
                            <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 700 }}>PENDING APPROVALS</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#9f1239', marginTop: '2px' }}>
                              {sitePendingLogs.length} Logs
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              Valued at ₹{siteTotalPendingBilling.toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div style={{ background: '#ffffff', border: '1.5px solid #fed7aa', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid var(--orange-primary)' }}>
                            <div style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: 700 }}>APPROVED THINGS</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#9a3412', marginTop: '2px' }}>
                              {siteApprovedLogs.length} Logs
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              Quality Certified
                            </div>
                          </div>

                          <div style={{ background: '#ffffff', border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #10b981' }}>
                            <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>CERTIFIED AREA</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#065f46', marginTop: '2px' }}>
                              {siteTotalApprovedArea.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              Sq.Ft Staging Verified
                            </div>
                          </div>

                          <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #64748b' }}>
                            <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700 }}>ACTIVE CREW</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e293b', marginTop: '2px' }}>
                              {siteLogs.reduce((sum, l) => sum + (Number(l.laborCount) || 1), 0)}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              Workers Reported
                            </div>
                          </div>
                        </div>

                        {/* Sub-Tabs: Pending Sign-off, Approved Things, All Labour Work (ONLY APPROVALS!) */}
                        <div style={{
                          display: 'flex',
                          gap: '0.35rem',
                          background: '#f1f5f9',
                          padding: '3px',
                          borderRadius: '8px',
                          overflowX: 'auto'
                        }}>
                          {[
                            { id: 'pending', label: `⏱ Pending Sign-Off (${sitePendingLogs.length})` },
                            { id: 'approved', label: `✓ Approved Things (${siteApprovedLogs.length})` },
                            { id: 'all', label: `All Labour Logs (${siteLogs.length})` }
                          ].map(sub => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setLabourBillingActiveSubTab(sub.id)}
                              style={{
                                flex: 1,
                                padding: '0.45rem 0.65rem',
                                border: 'none',
                                borderRadius: '6px',
                                background: labourBillingActiveSubTab === sub.id ? '#ffffff' : 'transparent',
                                color: labourBillingActiveSubTab === sub.id ? '#000000' : '#64748b',
                                fontWeight: labourBillingActiveSubTab === sub.id ? 800 : 600,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                boxShadow: labourBillingActiveSubTab === sub.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>

                        {/* CARDS LIST FOR ALL, PENDING, OR APPROVED THINGS */}
                        {displayLogs.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {displayLogs.map((log) => {
                              const isApproved = log.status === 'approved';
                              const isPending = log.status === 'pending_approval';

                              return (
                                <div
                                  key={log.id}
                                  style={{
                                    background: '#ffffff',
                                    border: isApproved ? '1.5px solid #a7f3d0' : isPending ? '1.5px solid #fdba74' : '1.5px solid #fecdd3',
                                    borderLeft: isApproved ? '4px solid #10b981' : isPending ? '4px solid #ff6b00' : '4px solid #e11d48',
                                    borderRadius: '12px',
                                    padding: '0.85rem',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.45rem' }}>
                                    <div>
                                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>
                                        {log.workType}
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                        Floor: <strong>{log.floorLevel}</strong> • Date: <strong>{log.date}</strong>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                      <span className={`badge ${isApproved ? 'badge-gst' : isPending ? 'badge-non-gst' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                                        {isApproved ? '✓ APPROVED THING' : isPending ? '⏱ PENDING SIGN-OFF' : 'REVISION'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Crew & Area Bar */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.45rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', margin: '0.5rem 0' }}>
                                    <div>Gang / In-charge: <strong>{log.workerName}</strong> ({log.laborCount} crew • {log.hoursWorked || 8}h)</div>
                                    <div className="mono" style={{ fontWeight: 800, color: 'var(--orange-primary)' }}>
                                      {log.areaCompletedSqft} Sq.Ft Certified Area
                                    </div>
                                  </div>

                                  <p style={{ fontSize: '0.78rem', color: '#374151', margin: '0.4rem 0', fontStyle: 'italic' }}>
                                    "{log.workCompletedSummary}"
                                  </p>

                                  {/* APPROVED THING: OFFICIAL QUALITY CERTIFICATION BOX */}
                                  {isApproved && (
                                    <div style={{
                                      background: '#ecfdf5',
                                      border: '1px solid #a7f3d0',
                                      borderRadius: '8px',
                                      padding: '0.6rem 0.75rem',
                                      marginTop: '0.5rem',
                                      fontSize: '0.76rem',
                                      color: '#065f46'
                                    }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                        <strong>✓ Certified & Approved Work Log</strong>
                                        <span style={{ fontSize: '0.7rem', color: '#047857' }}>{log.approvalTimestamp}</span>
                                      </div>
                                      <div>Inspected & Certified by: <strong>{log.approvedBy}</strong></div>
                                      <div style={{ marginTop: '2px', color: '#047857' }}>Quality Sign-off: "{log.approvalComments}"</div>
                                      <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: '#065f46' }}>
                                          Certified Area: {log.areaCompletedSqft} Sq.Ft (Certified for billing release)
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const text = encodeURIComponent(`Quality Sign-off Certificate for ${log.siteName} (${log.workType}) - Certified Area: ${log.areaCompletedSqft} Sq.Ft - Inspected by: ${log.approvedBy}`);
                                            window.open(`https://wa.me/?text=${text}`, '_blank');
                                          }}
                                          style={{
                                            background: '#10b981',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '2px 8px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                          }}
                                        >
                                          WhatsApp Certificate
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* PENDING APPROVAL ACTIONS */}
                                  {isPending && (
                                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.55rem' }}>
                                      <button 
                                        className="btn btn-success btn-sm"
                                        style={{ flex: 2, padding: '0.45rem', fontSize: '0.8rem' }}
                                        onClick={() => setSelectedLogToApprove(log)}
                                      >
                                        <Check size={13} />
                                        <span>Approve Daily Work & Certify Area ({log.areaCompletedSqft} Sq.Ft)</span>
                                      </button>
                                      <button 
                                        className="btn btn-danger btn-sm"
                                        style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                                        onClick={() => handleConfirmApproval(log, false)}
                                      >
                                        <X size={13} />
                                        <span>Reject</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <HardHat size={32} style={{ opacity: 0.35, margin: '0 auto 0.5rem', color: 'var(--orange-primary)' }} />
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                              {labourBillingActiveSubTab === 'approved' 
                                ? 'No Approved Things Yet' 
                                : labourBillingActiveSubTab === 'pending' 
                                  ? 'No Pending Approvals for this site' 
                                  : 'No Labour Work Logs Reported'}
                            </div>
                            <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                              All submitted worker staging progress will appear here for engineering inspection and approval.
                            </p>
                          </div>
                        )}

                      </div>
                    );
                  })()}

                  {/* TAB: BALANCE (SCREENSHOT 1) */}
                  {siteDetailsActiveTab === 'balance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {/* Section 1: 3m Vertical */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          fontWeight: 700,
                          fontSize: '0.92rem'
                        }}>
                          3m Vertical
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff' }}>
                          {filteredBalanceItems.filter(it => it.group === '3m Vertical').map((it, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{it.name}</span>
                              </div>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{it.calcStr}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 2: Farma */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          fontWeight: 700,
                          fontSize: '0.92rem'
                        }}>
                          Farma
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff' }}>
                          {filteredBalanceItems.filter(it => it.group === 'Farma').map((it, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{it.name}</span>
                              </div>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{it.calcStr}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Divider and SUM */}
                      <div style={{ height: '1px', background: '#e5e7eb', margin: '0.25rem 1rem' }} />
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 1rem',
                        fontWeight: 700,
                        fontSize: '0.96rem',
                        color: '#000000'
                      }}>
                        <span>SUM</span>
                        <span>{siteData.balanceSum}</span>
                      </div>
                    </div>
                  )}

                  {/* TAB: IN (SCREENSHOT 2) */}
                  {siteDetailsActiveTab === 'in' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {filteredInChallans.map(ch => (
                        <div key={ch.id}>
                          {/* Navy Inward Header */}
                          <div style={{
                            background: '#2e4255',
                            color: '#ffffff',
                            padding: '0.55rem 1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{ch.dateStr}</div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>CHL No: {ch.chlNo}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ border: '1.5px solid #ffffff', borderRadius: '3px', padding: '0px 3px', fontSize: '0.58rem', fontWeight: 900 }}>PDF</span>
                              <Printer size={18} />
                            </div>
                          </div>

                          {/* Rows with Green Dots */}
                          <div style={{ padding: '0.75rem 1rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {ch.items.map((it, idx) => (
                              <React.Fragment key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{it.name}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{it.qty}</span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />
                                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#000000' }}>{it.totalGroup}</span>
                                  </div>
                                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>{it.qty}</span>
                                </div>
                              </React.Fragment>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />
                                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>TOTAL PCS</span>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>{ch.totalPcs}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB: UNIFIED BILLS (ALL BILLS: MATERIAL RENTAL + LABOUR BILLS) */}
                  {siteDetailsActiveTab === 'bills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 0.85rem' }}>
                      
                      {/* Master Header Banner */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span>📑</span>
                            <span>Consolidated Site Bills & Invoices</span>
                            <span style={{ fontSize: '0.66rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 7px', borderRadius: '4px', fontWeight: 800 }}>
                              ALL BILLS UNIFIED
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Site: <strong>{selectedSiteForDetails.name}</strong> • All Material Rental Invoices and Certified Labour Staging Bills in one master section
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.76rem', background: '#ffffff', color: '#111827', borderColor: '#d1d5db', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            onClick={() => setIsLabourStatementModalOpen(true)}
                          >
                            <FileText size={13} color="var(--orange-primary)" />
                            <span>Labour Statement</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            onClick={() => window.print()}
                          >
                            <Printer size={13} />
                            <span>Print All Bills</span>
                          </button>
                        </div>
                      </div>

                      {/* 4 Financial KPI Overview Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.65rem' }}>
                        
                        {/* 1. Material Bills */}
                        <div style={{ background: '#ffffff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #2563eb' }}>
                          <div style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 700 }}>MATERIAL RENTAL BILLS</div>
                          <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e3a8a', marginTop: '2px' }}>
                            ₹{materialRentalTotal.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                            {filteredBills.length} Active Tax Invoices
                          </div>
                        </div>

                        {/* 2. Labour Bills */}
                        <div style={{ background: '#ffffff', border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #10b981' }}>
                          <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>CERTIFIED LABOUR BILLS</div>
                          <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#065f46', marginTop: '2px' }}>
                            ₹{siteTotalApprovedBilling.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                            {siteTotalApprovedArea.toLocaleString()} Sq.Ft Certified
                          </div>
                        </div>

                        {/* 3. Grand Total */}
                        <div style={{ background: '#ffffff', border: '1.5px solid #fed7aa', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid var(--orange-primary)' }}>
                          <div style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: 800 }}>GRAND TOTAL (ALL BILLS)</div>
                          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--orange-primary)', marginTop: '2px' }}>
                            ₹{grandTotalAllBills.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                            Material + Certified Labour
                          </div>
                        </div>

                        {/* 4. Pending Labour Sign-Off */}
                        <div style={{ background: '#ffffff', border: '1.5px solid #fecdd3', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #e11d48' }}>
                          <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 700 }}>PENDING LABOUR SIGN-OFF</div>
                          <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#9f1239', marginTop: '2px' }}>
                            ₹{siteTotalPendingBilling.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                            {sitePendingLogs.length} Logs Awaiting Sign-off
                          </div>
                        </div>

                      </div>

                      {/* Sub-View Filter Pills: All Bills, Material Bills, Labour Bills */}
                      <div style={{
                        display: 'flex',
                        gap: '0.4rem',
                        background: '#f1f5f9',
                        padding: '4px',
                        borderRadius: '10px',
                        overflowX: 'auto'
                      }}>
                        {[
                          { id: 'all', label: `📑 All Bills (Grand Total: ₹${grandTotalAllBills.toLocaleString('en-IN')})` },
                          { id: 'material', label: `📦 Material Rental Invoices (${filteredBills.length})` },
                          { id: 'labour', label: `👷 Labour Staging Bills (${siteLogs.length})` }
                        ].map(sub => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setBillsViewFilter(sub.id)}
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.85rem',
                              border: 'none',
                              borderRadius: '8px',
                              background: billsViewFilter === sub.id ? '#ffffff' : 'transparent',
                              color: billsViewFilter === sub.id ? '#000000' : '#64748b',
                              fontWeight: billsViewFilter === sub.id ? 800 : 600,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              boxShadow: billsViewFilter === sub.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>

                      {/* ================================================================= */}
                      {/* SECTION 1: MATERIAL RENTAL INVOICES                               */}
                      {/* ================================================================= */}
                      {(billsViewFilter === 'all' || billsViewFilter === 'material') && (
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          overflow: 'hidden',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                          {/* Card Header */}
                          <div style={{
                            padding: '0.75rem 1rem',
                            background: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <Package size={16} color="#2563eb" />
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                                Material Rental & Equipment Hire Invoices
                              </span>
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                              Monthly Hire & Dispatch Challans
                            </span>
                          </div>

                          {/* Warning Notice Banner from Screenshot 3 */}
                          {siteData.billsTotalDiffWarning && (
                            <div style={{
                              background: '#fffbeb',
                              borderBottom: '1px solid #fef3c7',
                              padding: '0.65rem 1rem',
                              fontSize: '0.82rem',
                              color: '#92400e',
                              lineHeight: 1.35
                            }}>
                              {siteData.billsTotalDiffWarning}
                            </div>
                          )}

                          {/* Invoice Rows */}
                          <div style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredBills.map((b, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: idx < filteredBills.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#000000' }}>No: {b.invNo}</span>
                                    <span className="badge badge-gst" style={{ fontSize: '0.65rem' }}>GST Tax Invoice</span>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                                    Period: <strong>{b.period}</strong> • Due: 15 Days
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                  <span className="mono" style={{ fontWeight: 900, fontSize: '1.05rem', color: '#000000' }}>{b.amountStr}</span>
                                  <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                                    onClick={() => alert(`Opening GST Tax Invoice ${b.invNo} for ${selectedSiteForDetails.name}...`)}
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}

                            <div style={{ height: '1px', background: '#e5e7eb', margin: '0.15rem 0' }} />

                            {/* Material Subtotal */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.94rem', color: '#1e3a8a', padding: '0.25rem 0' }}>
                              <span>Total Material Rental Invoices:</span>
                              <span className="mono" style={{ fontSize: '1.05rem' }}>₹{materialRentalTotal.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================================================================= */}
                      {/* SECTION 2: CERTIFIED DAILY LABOUR STAGING BILLS                   */}
                      {/* ================================================================= */}
                      {(billsViewFilter === 'all' || billsViewFilter === 'labour') && (
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1.5px solid #a7f3d0',
                          overflow: 'hidden',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                          {/* Card Header */}
                          <div style={{
                            padding: '0.75rem 1rem',
                            background: '#f0fdf4',
                            borderBottom: '1px solid #bbf7d0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.45rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <HardHat size={16} color="#059669" />
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#065f46' }}>
                                Certified Daily Labour Work & Staging Bills
                              </span>
                            </div>

                            {/* Rate Customizer Widget */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem' }}>
                              <span style={{ color: '#047857', fontWeight: 700 }}>Labour Rate:</span>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid #86efac', borderRadius: '6px', padding: '2px 6px' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>₹</span>
                                <input
                                  type="number"
                                  className="mono"
                                  style={{ width: '48px', border: 'none', outline: 'none', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', color: '#065f46' }}
                                  value={labourRatePerSqft}
                                  onChange={(e) => setLabourRatePerSqft(Number(e.target.value) || 0)}
                                />
                                <span style={{ color: '#6b7280', fontSize: '0.72rem' }}>/Sq.Ft</span>
                              </div>
                            </div>
                          </div>

                          {/* Labour Staging Bills Table: Shows all certified & pending work */}
                          {siteLogs.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                                <thead>
                                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '7px 10px' }}>Date</th>
                                    <th style={{ padding: '7px 10px' }}>Work / Floor</th>
                                    <th style={{ padding: '7px 10px' }}>Gang / Crew</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'right' }}>Certified Area</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'right' }}>Rate (₹)</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'right' }}>Labour Bill (₹)</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'center' }}>Sign-off Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {siteLogs.map((log) => {
                                    const logBilling = calculateLabourBilling(log);
                                    const isApproved = log.status === 'approved';
                                    return (
                                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', background: isApproved ? '#fafdfb' : '#fffbeb' }}>
                                        <td style={{ padding: '7px 10px', fontWeight: 600 }}>{log.date}</td>
                                        <td style={{ padding: '7px 10px' }}>
                                          <strong>{log.workType}</strong>
                                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Floor: {log.floorLevel}</div>
                                        </td>
                                        <td style={{ padding: '7px 10px' }}>{log.workerName} ({log.laborCount} crew)</td>
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                          {log.areaCompletedSqft} Sq.Ft
                                        </td>
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{labourRatePerSqft}</td>
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: isApproved ? '#047857' : '#b45309' }}>
                                          ₹{logBilling.toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                                          {isApproved ? (
                                            <span className="badge badge-gst" style={{ fontSize: '0.66rem' }}>
                                              ✓ CERTIFIED
                                            </span>
                                          ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                                              <span className="badge badge-non-gst" style={{ fontSize: '0.66rem' }}>
                                                ⏱ PENDING
                                              </span>
                                              <button
                                                type="button"
                                                className="btn btn-success btn-xs"
                                                style={{ fontSize: '0.68rem', padding: '2px 6px', fontWeight: 800 }}
                                                onClick={() => handleConfirmApproval(log, true)}
                                              >
                                                Approve
                                              </button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                <tfoot>
                                  <tr style={{ background: '#f0fdf4', fontWeight: 800, borderTop: '2px solid #86efac' }}>
                                    <td colSpan="3" style={{ padding: '8px 10px', color: '#065f46' }}>
                                      ✓ Total Certified Bills ({siteApprovedLogs.length}):
                                    </td>
                                    <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#065f46' }}>
                                      {siteTotalApprovedArea.toLocaleString()} Sq.Ft
                                    </td>
                                    <td style={{ padding: '8px 10px' }}></td>
                                    <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#047857', fontSize: '0.98rem' }}>
                                      ₹{siteTotalApprovedBilling.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#047857', fontSize: '0.72rem' }}>
                                      Certified Sign-off
                                    </td>
                                  </tr>
                                  {sitePendingLogs.length > 0 && (
                                    <tr style={{ background: '#fffbeb', fontWeight: 800, borderTop: '1px dashed #fcd34d' }}>
                                      <td colSpan="3" style={{ padding: '8px 10px', color: '#92400e' }}>
                                        ⏱ Pending Sign-Off Bills ({sitePendingLogs.length}):
                                      </td>
                                      <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#92400e' }}>
                                        {siteTotalPendingArea.toLocaleString()} Sq.Ft
                                      </td>
                                      <td style={{ padding: '8px 10px' }}></td>
                                      <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#b45309', fontSize: '0.98rem' }}>
                                        ₹{siteTotalPendingBilling.toLocaleString('en-IN')}
                                      </td>
                                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#b45309', fontSize: '0.72rem' }}>
                                        Awaiting Client Review
                                      </td>
                                    </tr>
                                  )}
                                  <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #cbd5e1' }}>
                                    <td colSpan="3" style={{ padding: '9px 10px', color: '#0f172a' }}>
                                      GRAND TOTAL LABOUR BILLS ({siteLogs.length} Entries):
                                    </td>
                                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                                      {(siteTotalApprovedArea + siteTotalPendingArea).toLocaleString()} Sq.Ft
                                    </td>
                                    <td style={{ padding: '9px 10px' }}></td>
                                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--orange-primary)', fontSize: '1.05rem' }}>
                                      ₹{(siteTotalApprovedBilling + siteTotalPendingBilling).toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '9px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.72rem' }}>
                                      Consolidated
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          ) : (
                            <div style={{ padding: '1.5rem', textAlign: 'center', background: '#ffffff', color: '#64748b' }}>
                              <p style={{ margin: 0, fontSize: '0.82rem' }}>
                                No labour work logs recorded for this site yet.
                              </p>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ marginTop: '0.65rem', fontSize: '0.78rem' }}
                                onClick={() => setIsAddLabourModalOpen(true)}
                              >
                                + Record Daily Labour Entry
                              </button>
                            </div>
                          )}

                          {/* Footer Action */}
                          <div style={{ padding: '0.65rem 1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              Official contractor certified staging measurement sheet
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.76rem', gap: '0.35rem' }}
                              onClick={() => setIsLabourStatementModalOpen(true)}
                            >
                              <FileText size={13} color="var(--orange-primary)" />
                              <span>View / Print Labour Bill Statement</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ================================================================= */}
                      {/* SECTION 3: GRAND CONSOLIDATED TOTAL SUMMARY CARD                  */}
                      {/* ================================================================= */}
                      {billsViewFilter === 'all' && (
                        <div style={{
                          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                          color: '#ffffff',
                          borderRadius: '14px',
                          padding: '1.25rem',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.65rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontSize: '1.2rem' }}>💰</span>
                              <div>
                                <div style={{ fontSize: '0.96rem', fontWeight: 800 }}>Master Account Statement Total</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                  Consolidated Payable for {selectedSiteForDetails.name}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              ALL BILLS INCLUDED
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                              <span>1. Material Equipment Rental Invoices:</span>
                              <span className="mono" style={{ fontWeight: 700, color: '#ffffff' }}>₹{materialRentalTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                              <span>2. Certified Daily Labour Staging Bills:</span>
                              <span className="mono" style={{ fontWeight: 700, color: '#34d399' }}>₹{siteTotalApprovedBilling.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                              <span>3. Applicable GST on Material Hire (18%):</span>
                              <span style={{ color: '#94a3b8' }}>Included in Invoices</span>
                            </div>
                          </div>

                          <div style={{ borderTop: '1.5px dashed rgba(255,255,255,0.25)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                                COMBINED TOTAL PAYABLE (ALL BILLS)
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>
                                Due within 15 days of billing cycle
                              </div>
                            </div>
                            <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--orange-primary)' }}>
                              ₹{grandTotalAllBills.toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                            <span>Bank: <strong>HDFC Bank Ltd</strong> • A/c: <strong>50200088991122</strong> • IFSC: <strong>HDFC0001234</strong></span>
                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>ScaffBuild Shuttering ERP</span>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB: ALL (SCREENSHOT 4) */}
                  {siteDetailsActiveTab === 'all' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {/* 1. Payments Group (Purple Dots) */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          fontWeight: 700,
                          fontSize: '0.92rem'
                        }}>
                          26 Oct 2026 2:26 PM
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Payment Received</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>20000</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Payment Received</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>6000</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. DC0003 (Red Dots) */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>26 Sep 2026 4:56 PM</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>CHL No: DC0003</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ border: '1.5px solid #ffffff', borderRadius: '3px', padding: '0px 3px', fontSize: '0.58rem', fontWeight: 900 }}>PDF</span>
                            <Printer size={18} />
                          </div>
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>3m Vertical 3m 10ft &nbsp; 0₹</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>40</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Farma 9x9 &nbsp; 0₹</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>5</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. DC0002 (Red Dots) */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>26 Sep 2026 9:34 AM</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>CHL No: DC0002</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ border: '1.5px solid #ffffff', borderRadius: '3px', padding: '0px 3px', fontSize: '0.58rem', fontWeight: 900 }}>PDF</span>
                            <Printer size={18} />
                          </div>
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>3m Vertical 3m 10ft &nbsp; 0₹</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>5</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. RC0001 (Green Dots) */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>26 Sep 2026 9:25 AM</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>CHL No: RC0001</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ border: '1.5px solid #ffffff', borderRadius: '3px', padding: '0px 3px', fontSize: '0.58rem', fontWeight: 900 }}>PDF</span>
                            <Printer size={18} />
                          </div>
                        </div>
                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>3m Vertical 3m 10ft</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: OUT (SCREENSHOT 5) */}
                  {siteDetailsActiveTab === 'out' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {/* Section 1: DC0003 */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>26 Sep 2026 4:56 PM</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>CHL No: DC0003</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ border: '1.5px solid #ffffff', borderRadius: '3px', padding: '0px 3px', fontSize: '0.58rem', fontWeight: 900 }}>PDF</span>
                            <Printer size={18} />
                          </div>
                        </div>

                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>3m Vertical 3m 10ft</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>40</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>Farma 9x9</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>5</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#000000' }}>TOTAL 3m Vertical (1)</span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>40</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#000000' }}>TOTAL Farma (1)</span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>5</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>TOTAL PCS</span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>45</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: DC0002 */}
                      <div>
                        <div style={{
                          background: '#2e4255',
                          color: '#ffffff',
                          padding: '0.55rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>26 Sep 2026 9:34 AM</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>CHL No: DC0002</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ border: '1.5px solid #ffffff', borderRadius: '3px', padding: '0px 3px', fontSize: '0.58rem', fontWeight: 900 }}>PDF</span>
                            <Printer size={18} />
                          </div>
                        </div>

                        <div style={{ padding: '0.75rem 1rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>3m Vertical 3m 10ft</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>5</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#000000' }}>TOTAL 3m Vertical (1)</span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* TAB: LEDGER */}
                  {siteDetailsActiveTab === 'ledger' && (
                    <div style={{ padding: '0 0.5rem', overflowX: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '8px' }}>Date</th>
                            <th style={{ padding: '8px' }}>Ref</th>
                            <th style={{ padding: '8px' }}>Particulars</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Debit (₹)</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Credit (₹)</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Balance (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px' }}>01-Sep-26</td>
                            <td style={{ padding: '8px' }}>INV0001</td>
                            <td style={{ padding: '8px' }}>Slab Shuttering Rent</td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#dc2626' }}>26,55,000</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>26,55,000</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px' }}>26-Sep-26</td>
                            <td style={{ padding: '8px' }}>DC0003</td>
                            <td style={{ padding: '8px' }}>Dispatched 45 pcs Equipment</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>45 pcs</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px' }}>26-Oct-26</td>
                            <td style={{ padding: '8px' }}>PAY01</td>
                            <td style={{ padding: '8px' }}>Bank Transfer (RTGS)</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#059669' }}>20,000</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>68,500</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px' }}>26-Oct-26</td>
                            <td style={{ padding: '8px' }}>PAY02</td>
                            <td style={{ padding: '8px' }}>UPI Payment</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#059669' }}>6,000</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>62,500</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>
            );
          })()
        ) : (
          /* ======================================================================= */
          /* SCREEN: MAIN SITES LIST (MATCHING 1ST SCREENSHOT)                       */
          /* ======================================================================= */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. TOP HEADER SUMMARY ROW: Acc Count, Due Amount, Search Button, and Sort Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '0.2rem 0.25rem 0.65rem 0.25rem',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                {filteredSites.length}{mainPageSearchQuery ? `/${clientSites.length}` : ''} Acc, ₹{filteredSites.reduce((sum, s) => sum + (Number(s.dueAmount) || 0), 0).toLocaleString('en-IN')} due
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Search Button */}
                <button
                  type="button"
                  id="client-main-search-btn"
                  onClick={() => setIsMainSearchOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isMainSearchOpen || mainPageSearchQuery ? '#eff6ff' : '#ffffff',
                    border: isMainSearchOpen || mainPageSearchQuery ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '9999px',
                    padding: '4px 11px',
                    color: isMainSearchOpen || mainPageSearchQuery ? '#1d4ed8' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                  title="Search project sites"
                >
                  <Search size={15} color={isMainSearchOpen || mainPageSearchQuery ? '#1d4ed8' : '#64748b'} strokeWidth={2.5} />
                  <span>Search</span>
                  {mainPageSearchQuery && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainPageSearchQuery('');
                      }}
                      style={{
                        marginLeft: '3px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 900
                      }}
                      title="Clear Search"
                    >
                      ✕
                    </span>
                  )}
                </button>

                {/* Sort Button */}
                <button 
                  type="button"
                  onClick={() => {
                    const nextSort = siteSortBy === 'date' ? 'due' : siteSortBy === 'due' ? 'name' : 'date';
                    setSiteSortBy(nextSort);
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem', 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#223344', 
                    fontWeight: 500, 
                    fontSize: '0.94rem', 
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {/* 3-line descending sort icon matching screenshot (#6093b7) */}
                  <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
                    <line x1="1" y1="2" x2="17" y2="2" stroke="#6093b7" strokeWidth="2.4" strokeLinecap="round" />
                    <line x1="1" y1="7.5" x2="11" y2="7.5" stroke="#6093b7" strokeWidth="2.4" strokeLinecap="round" />
                    <line x1="1" y1="13" x2="6" y2="13" stroke="#6093b7" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                  <span>By {siteSortBy === 'date' ? 'Date' : siteSortBy === 'due' ? 'Due' : 'Name'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Search Input Box on Client Main Page */}
            {isMainSearchOpen && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '1.5px solid #2563eb',
                borderRadius: '12px',
                padding: '0.45rem 0.75rem',
                marginBottom: '0.85rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
              }}>
                <Search size={18} color="#2563eb" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by site name, location, engineer, area..."
                  value={mainPageSearchQuery}
                  onChange={(e) => setMainPageSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    background: 'transparent'
                  }}
                />
                {mainPageSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMainPageSearchQuery('')}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}
                    title="Clear query"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (!mainPageSearchQuery) {
                      setIsMainSearchOpen(false);
                    }
                  }}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {mainPageSearchQuery ? `Search (${filteredSites.length})` : 'Done'}
                </button>
              </div>
            )}



            {/* Always Visible [+ Request Equipment Quotation] Button with Dropdown Form */}
            <div style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                id="client-btn-request-quotation-dropdown"
                onClick={() => setIsQuotationDropdownOpen(!isQuotationDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.15rem',
                  background: isQuotationDropdownOpen 
                    ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' 
                    : 'linear-gradient(135deg, var(--orange-primary) 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: isQuotationDropdownOpen ? '14px 14px 0 0' : '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Send size={18} />
                  <span>+ Request Equipment Quotation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', opacity: 0.9 }}>
                  <span>{isQuotationDropdownOpen ? 'Hide Form ▲' : 'Open Form ▼'}</span>
                </div>
              </button>

              {/* Dropdown Form (Collapses back to normal after submit) */}
              {isQuotationDropdownOpen && (
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #ea580c',
                  borderTop: 'none',
                  borderRadius: '0 0 14px 14px',
                  padding: '1.25rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <div style={{ marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                      Request Equipment Quotation Order
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Fill in Company Name, Building Name, and GST Number mandatorily to receive commercial rates.
                    </div>
                  </div>

                  <form onSubmit={handleSubmitQuotationRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {/* Mandatory Fields: Company Name, Building Name, GST Number */}
                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Required Company &amp; Building Details (Mandatory)
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                          Company Name <span style={{ color: '#e11d48' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. ASG WIN INDIA PRIVATE LIMITED"
                          value={quotationRequest.companyName}
                          onChange={(e) => setQuotationRequest({ ...quotationRequest, companyName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid-2" style={{ gap: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                            Building / Site Name <span style={{ color: '#e11d48' }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Tower B Commercial Hub"
                            value={quotationRequest.siteName}
                            onChange={(e) => setQuotationRequest({ ...quotationRequest, siteName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                            GST Number <span style={{ color: '#e11d48' }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-input mono"
                            placeholder="e.g. 29ABCDE1234F1Z5"
                            value={quotationRequest.gstin}
                            onChange={(e) => setQuotationRequest({ ...quotationRequest, gstin: e.target.value.toUpperCase() })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Staging & Dimensions Details */}
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                          Work Purpose
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Slab Staging &amp; Shuttering"
                          value={quotationRequest.workPurpose}
                          onChange={(e) => setQuotationRequest({ ...quotationRequest, workPurpose: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                          Rental Duration (Months)
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="form-input mono"
                          value={quotationRequest.tenureMonths}
                          onChange={(e) => setQuotationRequest({ ...quotationRequest, tenureMonths: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                          Slab Length (Ft)
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="form-input mono"
                          value={quotationRequest.lengthFt}
                          onChange={(e) => setQuotationRequest({ ...quotationRequest, lengthFt: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                          Slab Breadth (Ft)
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="form-input mono"
                          value={quotationRequest.breadthFt}
                          onChange={(e) => setQuotationRequest({ ...quotationRequest, breadthFt: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Items Needed Section */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>
                          Requested Equipment Items ({quotationRequest.itemsNeeded.length})
                        </label>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                          onClick={() => handleAddItem()}
                        >
                          + Add Item
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                        {quotationRequest.itemsNeeded.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                              value={it.name}
                              placeholder="Item description"
                              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            />
                            <input
                              type="number"
                              className="form-input mono"
                              style={{ width: '80px', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                              value={it.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#64748b', width: '32px' }}>{it.unit || 'Pcs'}</span>
                            {quotationRequest.itemsNeeded.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                        Special Instructions / Notes
                      </label>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="e.g. Urgent staging required for casting by weekend..."
                        value={quotationRequest.notes}
                        onChange={(e) => setQuotationRequest({ ...quotationRequest, notes: e.target.value })}
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                        onClick={() => setIsQuotationDropdownOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 2, justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--orange-primary) 0%, #ea580c 100%)' }}
                      >
                        Submit Quotation Request →
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 3. SITE CARDS LIST GROUPED BY COMPANY & GST NUMBER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredSites.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px dashed #cbd5e1',
                  marginTop: '0.5rem'
                }}>
                  <Search size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>
                    No project sites found
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    No sites matching "{mainPageSearchQuery}". Try another keyword or location.
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => setMainPageSearchQuery('')}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (() => {
                // Group sites by Company Name and GST Number
                const sitesByCompany = filteredSites.reduce((acc, site) => {
                  const sName = (site.name || '').trim().toLowerCase();
                  const matchingQuot = clientQuotations.find(q => 
                    (q.siteName || '').trim().toLowerCase() === sName ||
                    (q.siteId && q.siteId === site.id)
                  );
                  const companyKey = (site.companyName || matchingQuot?.companyName || currentUser?.companyName || 'General Projects').trim();
                  const gstinKey = (site.gstin || matchingQuot?.gstin || currentUser?.gstin || '').trim();
                  const groupKey = `${companyKey}:::${gstinKey}`;

                  if (!acc[groupKey]) {
                    acc[groupKey] = {
                      companyName: companyKey,
                      gstin: gstinKey,
                      items: []
                    };
                  }
                  acc[groupKey].items.push({ site, siteQuot: matchingQuot });
                  return acc;
                }, {});

                return Object.values(sitesByCompany).map((group, groupIndex) => (
                  <div key={groupIndex} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    {/* Company Name & GST Heading (Shown ONCE per company, not repeated for same company!) */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '0.65rem 0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <span style={{ fontSize: '1.15rem' }}>🏢</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', lineHeight: 1.2 }}>
                            {group.companyName}
                          </div>
                          {group.gstin && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                              <span style={{ color: '#38bdf8', fontWeight: 700 }}>GST:</span>
                              <span className="mono" style={{ color: '#f1f5f9', letterSpacing: '0.04em' }}>{group.gstin}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: 'rgba(255,255,255,0.12)',
                        color: '#e2e8f0',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {group.items.length} {group.items.length === 1 ? 'Site' : 'Sites'}
                      </span>
                    </div>

                    {/* All Sites under this Company */}
                    {group.items.map(({ site, siteQuot }, index) => {
                      const sName = (site.name || '').trim().toLowerCase();

                      // Demo user 'tempory2911@gmail.com' has pre-approved sites
                      const isDemoClient = currentUser?.email === 'tempory2911@gmail.com';

                      // Site is approved ONLY if owner approved quotation or created work order, or demo user
                      const isApprovedByOwner = isDemoClient || Boolean(
                        site.isApproved || 
                        (siteQuot && (siteQuot.status === 'work_order_created' || siteQuot.status === 'quotation_sent'))
                      );

                      const isPendingReview = Boolean(siteQuot && siteQuot.status === 'requested');

                      // If NOT approved by owner: show clean pending/needs-quotation status card!
                      if (!isApprovedByOwner) {
                        return (
                          <div 
                            key={site.id || index}
                            style={{
                              background: '#ffffff',
                              borderRadius: '20px',
                              border: '1.5px dashed #cbd5e1',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                              padding: '1.15rem 1.15rem 1rem 1.15rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                              <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                  {site.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                  {site.location ? `${site.location} • ` : ''}Registered Site #{index + 1}
                                </div>
                              </div>

                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: isPendingReview ? '#fef3c7' : '#f1f5f9',
                                color: isPendingReview ? '#b45309' : '#475569',
                                border: `1px solid ${isPendingReview ? '#fde68a' : '#e2e8f0'}`
                              }}>
                                {isPendingReview ? '⏳ Quotation Under Owner Review' : '📝 Quotation Required'}
                              </span>
                            </div>

                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: '#475569', 
                              background: '#f8fafc', 
                              padding: '0.65rem 0.85rem', 
                              borderRadius: '10px', 
                              border: '1px solid #e2e8f0',
                              lineHeight: 1.45
                            }}>
                              {isPendingReview 
                                ? 'Quotation request has been sent to ScaffBuild Yard. Once approved by the owner and work order is issued, site inventory, Request Items, Take Back & billing actions will be unlocked here.'
                                : 'This site is registered. Please submit an equipment quotation request. Once approved by the owner, active inventory, material dispatch & billing will appear here.'}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                              {isPendingReview ? (
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                                  onClick={() => {
                                    setActiveSlide('notifications');
                                    setNotificationsActiveTab('quotations');
                                  }}
                                >
                                  <span>View Quotation Status</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                                  onClick={() => {
                                    setQuotationRequest(prev => ({ 
                                      ...prev, 
                                      siteName: site.name,
                                      companyName: site.companyName || currentUser?.companyName || '',
                                      gstin: site.gstin || currentUser?.gstin || ''
                                    }));
                                    setIsQuotationDropdownOpen(true);
                                  }}
                                >
                                  <Plus size={14} />
                                  <span>+ Request Equipment Quotation for {site.name}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // Real Due Amount: strictly calculated from active unpaid invoices for this site
                      const siteInvoices = (invoices || []).filter(inv => {
                        const matchSite = (inv.siteName || '').trim().toLowerCase() === sName;
                        const matchId = inv.siteId && inv.siteId === site.id;
                        return matchSite || matchId;
                      });

                      const calculatedDue = siteInvoices
                        .filter(inv => inv.status !== 'Paid' && inv.status !== 'paid')
                        .reduce((sum, inv) => sum + (Number(inv.grandTotal || inv.amount) || 0), 0);

                      const dueAmountDisplay = calculatedDue;

                      // Real Total Pieces: from actual delivery/inward challans for this site
                      const siteChallans = (challans || []).filter(ch => {
                        const matchSite = (ch.siteName || '').trim().toLowerCase() === sName;
                        const matchId = ch.siteId && ch.siteId === site.id;
                        return matchSite || matchId;
                      });

                      const calculatedPcs = siteChallans
                        .filter(ch => ch.type === 'delivery' || ch.type === 'inward')
                        .reduce((sum, ch) => sum + (ch.items || []).reduce((iSum, it) => iSum + (Number(it.qty) || 0), 0), 0);

                      const totalPcsDisplay = calculatedPcs > 0 ? calculatedPcs : (site.totalPcs || 0);

                      // Real Latest Date
                      const lastDateDisplay = site.lastDate || siteChallans[0]?.date || siteQuot?.date || 'Active';

                      // Real Badge
                      const badgeDisplay = site.badgeType || (
                        siteQuot?.status === 'work_order_created' 
                          ? 'Work Order Active' 
                          : siteQuot?.status === 'quotation_sent' 
                            ? 'Quotation Approved' 
                            : 'Active Site'
                      );

                      return (
                        <div 
                          key={site.id || index}
                          style={{
                            background: '#ffffff',
                            borderRadius: '20px',
                            border: '1px solid #d8d8d8',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                            padding: '1.15rem 1.15rem 0.5rem 1.15rem',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                          }}
                        >
                          {/* Site Name */}
                          <div style={{ 
                            fontSize: '1.02rem', 
                            fontWeight: 800, 
                            color: '#000000', 
                            lineHeight: 1.35,
                            marginBottom: '0.35rem'
                          }}>
                            {site.name}
                          </div>

                          {/* Subline: # 1   Due: 0₹   0 pcs   Date */}
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginTop: '2px',
                            marginBottom: '0.45rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.98rem', fontWeight: 600, color: '#000000' }}>
                                # {index + 1}
                              </span>
                              <span style={{ 
                                fontSize: '1.08rem', 
                                fontWeight: 900, 
                                color: '#ffffff',
                                WebkitTextStroke: '0.9px #000000',
                                letterSpacing: '-0.2px'
                              }}>
                                Due: {dueAmountDisplay.toLocaleString('en-IN')}₹
                              </span>
                              <span style={{ fontSize: '0.92rem', color: '#111827', fontWeight: 500 }}>
                                {totalPcsDisplay} pcs
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 500 }}>
                                {lastDateDisplay}
                              </span>
                            </div>
                          </div>

                          {/* Badge */}
                          <div style={{ marginTop: '1px', marginBottom: '0.65rem' }}>
                            <span style={{
                              background: '#ef8697',
                              color: '#000000',
                              padding: '2.5px 8px',
                              borderRadius: '5px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              display: 'inline-block'
                            }}>
                              {badgeDisplay}
                            </span>
                          </div>

                          {/* 3 Column Action Buttons: [Request Items]  |  [Take Back]  |  [Details] */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            margin: '0 -1.15rem',
                            paddingTop: '0.35rem'
                          }}>
                            {/* 1. Request Items (Items Needed More) */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSiteForIssue(site);
                                setIssueFormData(prev => ({
                                  ...prev,
                                  challanNo: `REQ/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
                                }));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.45rem',
                                background: 'transparent',
                                border: 'none',
                                borderRight: '1px solid #f3f3f3',
                                padding: '0.65rem 0.2rem',
                                cursor: 'pointer',
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                color: '#000000'
                              }}
                            >
                              <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#e6657c', // Pinkish red circle from screenshot
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {/* [-> icon */}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                  <polyline points="16 17 21 12 16 7" />
                                  <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                              </div>
                              <span>Request Items</span>
                            </button>

                            {/* 2. Take Back */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSiteForReceive(site);
                                setReceiveFormData(prev => ({
                                  ...prev,
                                  returnChallanNo: `RC/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
                                }));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.45rem',
                                background: 'transparent',
                                border: 'none',
                                borderRight: '1px solid #f3f3f3',
                                padding: '0.65rem 0.2rem',
                                cursor: 'pointer',
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                color: '#000000'
                              }}
                            >
                              <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#37a23a', // Emerald green circle from screenshot
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {/* ->] icon */}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                  <polyline points="10 17 15 12 10 7" />
                                  <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                              </div>
                              <span>Take Back</span>
                            </button>

                            {/* 3. Details */}
                            <button
                              type="button"
                              onClick={() => setSelectedSiteForDetails(site)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.45rem',
                                background: 'transparent',
                                border: 'none',
                                padding: '0.65rem 0.2rem',
                                cursor: 'pointer',
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                color: '#000000'
                              }}
                            >
                              <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#444444', // Dark circle from screenshot
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 1-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <span>Details</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>

          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* NOTIFICATIONS TAB: 3 SECTIONS (QUOTATIONS, LABOUR APPROVALS, GENERAL MAIL)*/}
      {/* ========================================================================= */}
      {activeSlide === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Sub-Navigation: Pending Approvals | Quotation History | Daily Labour History */}
          <div style={{
            display: 'flex',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '4px',
            gap: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${notificationsActiveTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                flex: '1 0 auto',
                justifyContent: 'center',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: notificationsActiveTab === 'pending' ? 'none' : '1px solid transparent',
                padding: '0.55rem 0.65rem',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
              onClick={() => setNotificationsActiveTab('pending')}
            >
              <Clock size={14} style={{ flexShrink: 0 }} />
              <span>Pending Approvals</span>
              {totalPendingActionsCount > 0 ? (
                <span style={{
                  background: '#e11d48',
                  color: '#ffffff',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {totalPendingActionsCount}
                </span>
              ) : (
                <span style={{
                  background: notificationsActiveTab === 'pending' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: notificationsActiveTab === 'pending' ? '#ffffff' : '#475569',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  0
                </span>
              )}
            </button>

            <button
              type="button"
              className={`btn btn-sm ${notificationsActiveTab === 'quotations' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                flex: '1 0 auto',
                justifyContent: 'center',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: notificationsActiveTab === 'quotations' ? 'none' : '1px solid transparent',
                padding: '0.55rem 0.65rem',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
              onClick={() => setNotificationsActiveTab('quotations')}
            >
              <Send size={14} style={{ flexShrink: 0 }} />
              <span>Quotation History</span>
              <span style={{
                background: notificationsActiveTab === 'quotations' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: notificationsActiveTab === 'quotations' ? '#ffffff' : '#475569',
                padding: '1px 5px',
                borderRadius: '999px',
                fontSize: '0.65rem',
                fontWeight: 800,
                flexShrink: 0
              }}>
                {clientQuotations.length}
              </span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${notificationsActiveTab === 'labour' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                flex: '1 0 auto',
                justifyContent: 'center',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: notificationsActiveTab === 'labour' ? 'none' : '1px solid transparent',
                padding: '0.55rem 0.65rem',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
              onClick={() => setNotificationsActiveTab('labour')}
            >
              <HardHat size={14} style={{ flexShrink: 0 }} />
              <span>Daily Labour</span>
              {pendingApprovalsCount > 0 ? (
                <span style={{
                  background: '#e11d48',
                  color: '#ffffff',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {pendingApprovalsCount}
                </span>
              ) : (
                <span style={{
                  background: notificationsActiveTab === 'labour' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: notificationsActiveTab === 'labour' ? '#ffffff' : '#475569',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {clientWorkerLogs.length}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`btn btn-sm ${notificationsActiveTab === 'notifications' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                flex: '1 0 auto',
                justifyContent: 'center',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: notificationsActiveTab === 'notifications' ? 'none' : '1px solid transparent',
                padding: '0.55rem 0.65rem',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
              onClick={() => setNotificationsActiveTab('notifications')}
            >
              <Bell size={14} style={{ flexShrink: 0 }} />
              <span>Notifications</span>
              {unreadNotificationCount > 0 ? (
                <span style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {unreadNotificationCount}
                </span>
              ) : (
                <span style={{
                  background: notificationsActiveTab === 'notifications' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: notificationsActiveTab === 'notifications' ? '#ffffff' : '#475569',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {systemNotifications.length}
                </span>
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* SUB-SECTION 1: UNIFIED PENDING APPROVALS & ACTION ITEMS                   */}
          {/* ========================================================================= */}
          {notificationsActiveTab === 'pending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Header Info */}
              <div style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: totalPendingActionsCount > 0 ? '#fff1f2' : '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {totalPendingActionsCount > 0 ? (
                        <Clock size={18} color="#e11d48" />
                      ) : (
                        <CheckCircle2 size={18} color="#10b981" />
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Pending Approvals &amp; Sign-Offs
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
                    Actionable items: review quotation rate proposals &amp; certify daily labour logs in one place.
                  </p>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: totalPendingActionsCount > 0 ? '#ffe4e6' : '#dcfce7',
                  color: totalPendingActionsCount > 0 ? '#be123c' : '#15803d'
                }}>
                  {totalPendingActionsCount} Action Item{totalPendingActionsCount === 1 ? '' : 's'} Pending
                </div>
              </div>

              {/* Empty State when everything is approved */}
              {totalPendingActionsCount === 0 && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1.5px dashed #cbd5e1',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a'
                  }}>
                    <CheckCircle2 size={30} />
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    All Caught Up!
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '380px', lineHeight: 1.5 }}>
                    There are no pending quotations awaiting work order approval, and no daily labour logs awaiting sign-off.
                  </div>
                </div>
              )}

              {/* 1. Pending Quotations Section */}
              {pendingQuotations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <FileText size={16} color="var(--orange-primary)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                        Quotation Requests Awaiting Action ({pendingQuotations.length})
                      </span>
                    </div>
                  </div>

                  {pendingQuotations.map(quot => {
                    const isRatesProposed = quot.status === 'quotation_sent';
                    return (
                      <div
                        key={quot.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '14px',
                          border: `1.5px solid ${isRatesProposed ? '#fbbf24' : '#93c5fd'}`,
                          padding: '1rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                              <span className="mono" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--orange-primary)' }}>
                                {quot.quotationNo}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                                📍 {quot.siteName}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              Purpose: <strong>{quot.workPurpose}</strong>
                            </div>
                          </div>

                          <div>
                            {isRatesProposed ? (
                              <span style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '999px',
                                border: '1px solid #fde68a'
                              }}>
                                Rates Proposed • Awaiting Sign-Off
                              </span>
                            ) : (
                              <span style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '999px',
                                border: '1px solid #bfdbfe'
                              }}>
                                ⏱ Awaiting Yard Rates
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Items preview */}
                        {quot.items && quot.items.length > 0 && (
                          <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Equipment Items ({quot.items.length})
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {quot.items.slice(0, 4).map((it, idx) => (
                                <span key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 7px', fontSize: '0.73rem', color: '#334155' }}>
                                  {it.name}: <strong>{it.qty} {it.unit || 'Pcs'}</strong>
                                </span>
                              ))}
                              {quot.items.length > 4 && (
                                <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: 'center' }}>
                                  +{quot.items.length - 4} more items
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.45rem', borderTop: '1px dashed #e2e8f0' }}>
                          <span style={{ fontSize: '0.73rem', color: '#64748b' }}>
                            Submitted on {quot.date || 'Recent'}
                          </span>

                          <div style={{ display: 'flex', gap: '0.45rem' }}>
                            {isRatesProposed && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', fontWeight: 800 }}
                                onClick={() => handleAcceptQuotation(quot)}
                              >
                                <CheckCircle2 size={14} />
                                <span>Accept &amp; Issue Work Order</span>
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                              onClick={() => setNotificationsActiveTab('quotations')}
                            >
                              <span>View Full Quotation</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. Pending Labour Approvals Section */}
              {pendingLabourLogs.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: pendingQuotations.length > 0 ? '0.5rem' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <HardHat size={16} color="#e11d48" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                        Daily Labour Logs Awaiting Sign-Off ({pendingLabourLogs.length})
                      </span>
                    </div>
                  </div>

                  {pendingLabourLogs.map(log => {
                    const billing = calculateLabourBilling(log);
                    return (
                      <div
                        key={log.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '14px',
                          border: '1.5px solid #fecdd3',
                          borderLeft: '5px solid #e11d48',
                          padding: '1rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                              <span className="mono" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#9f1239' }}>
                                {log.id}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                                📍 {log.siteName}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              Supervisor / Gang: <strong>{log.workerName}</strong> • {log.date}
                            </div>
                          </div>

                          <div>
                            <span style={{
                              background: '#ffe4e6',
                              color: '#be123c',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '999px',
                              border: '1px solid #fecdd3'
                            }}>
                              Awaiting Client Sign-Off
                            </span>
                          </div>
                        </div>

                        {/* Staging Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Work Executed</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                              {log.workType || 'Slab Shuttering & Prop Staging'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Floor / Location</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                              {log.floorLevel || 'General Site Staging'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Area Certified</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--orange-primary)', marginTop: '2px' }}>
                              {log.areaCompletedSqft || 0} Sq.Ft
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Staging Bill</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                              ₹{billing.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.45rem', paddingTop: '0.45rem', borderTop: '1px dashed #e2e8f0' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                            onClick={() => setSelectedLogToApprove(log)}
                          >
                            <span>Inspect &amp; Review</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', fontWeight: 800, background: '#e11d48', borderColor: '#e11d48' }}
                            onClick={() => handleConfirmApproval(log, true)}
                          >
                            <CheckCircle2 size={14} />
                            <span>Sign-Off &amp; Approve</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* SUB-SECTION 2: QUOTATION HISTORY */}
          {notificationsActiveTab === 'quotations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <section id="client-quotation-request-form" className="card" style={{
          borderTop: '4px solid var(--orange-primary)',
          boxShadow: 'var(--shadow-md)',
          padding: '1.25rem'
        }}>
          {isQuotationFormCollapsed && lastSubmittedQuotation ? (
            /* COLLAPSED VIEW: DISPLAY ABOUT THE SUBMITTED QUOTATION */
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span className="badge badge-gst" style={{ fontSize: '0.72rem' }}>
                      QUOTATION REQUEST SUBMITTED
                    </span>
                    <span className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--orange-primary)' }}>
                      {lastSubmittedQuotation.quotationNo}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    Quotation Order Awaiting Owner Rates
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Requirement recorded. The ScaffBuild yard owner has been notified to quote commercial rates and schedule dispatch.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveSlide('projects')}
                  >
                    <Building2 size={14} />
                    <span>View Projects & Sites →</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsQuotationFormCollapsed(false)}
                  >
                    <Plus size={14} />
                    <span>+ New Request</span>
                  </button>

                  {!(lastSubmittedQuotation?.status === 'work_order_created' || lastSubmittedQuotation?.status === 'approved') && (
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#ffffff', fontWeight: 700 }}
                      onClick={() => handleDeleteQuotation(lastSubmittedQuotation.id, lastSubmittedQuotation.quotationNo)}
                      title="Delete this quotation request"
                    >
                      <Trash2 size={14} />
                      <span>Delete Request</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Submitted Quotation Details Grid */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>PROJECT SITE</div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{lastSubmittedQuotation.siteName}</strong>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>WORK PURPOSE</div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{lastSubmittedQuotation.workPurpose || 'Slab Staging'}</strong>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>DIMENSIONS & SLAB AREA</div>
                    <strong className="mono" style={{ fontSize: '0.9rem', color: 'var(--orange-primary)' }}>
                      {lastSubmittedQuotation.lengthFt}' × {lastSubmittedQuotation.breadthFt}' ({lastSubmittedQuotation.requestedAreaSqft?.toLocaleString()} Sq.Ft)
                    </strong>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>RENTAL TENURE</div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {lastSubmittedQuotation.tenureMonths} Month(s) (~{lastSubmittedQuotation.tenureDays} Days)
                    </strong>
                  </div>
                </div>

                {/* Equipment Items Requested */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    EQUIPMENT ITEMS REQUESTED ({lastSubmittedQuotation.items.length}):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {lastSubmittedQuotation.items.map((it, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: '#ffffff', 
                          padding: '0.45rem 0.75rem', 
                          borderRadius: 'var(--radius-sm)', 
                          border: '1px solid var(--border-light)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}
                      >
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{it.name}</span>
                        <span className="mono badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                          {it.qty} {it.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {lastSubmittedQuotation.clientNotes && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Site Notes: "{lastSubmittedQuotation.clientNotes}"
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                {!(lastSubmittedQuotation?.status === 'work_order_created' || lastSubmittedQuotation?.status === 'approved') && (
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#ffffff', fontWeight: 700 }}
                    onClick={() => handleDeleteQuotation(lastSubmittedQuotation.id, lastSubmittedQuotation.quotationNo)}
                  >
                    <Trash2 size={14} />
                    <span>Delete Quotation ({lastSubmittedQuotation.quotationNo})</span>
                  </button>
                )}

                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveSlide('projects')}
                >
                  <span>Go to Projects & Sites View →</span>
                </button>
              </div>
            </div>
          ) : (
            /* EXPANDED VIEW: REQUEST FORM */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Request Material Quotation</h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Enter site dimensions to receive an official scaffolding & shuttering quotation order.
                  </p>
                </div>

                {lastSubmittedQuotation && (
                  <button 
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setIsQuotationFormCollapsed(true)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    ▲ View Submitted Request
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitQuotationRequest}>
                
                {/* Row 1: Select / Type Project Site & Work Purpose */}
                <div className="grid-2" style={{ gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Select or Type Project Site</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>Select existing or type new</span>
                    </label>
                    <input 
                      list="client-project-sites-list"
                      type="text"
                      className="form-input"
                      placeholder="Select or type project site"
                      value={quotationRequest.siteName}
                      onChange={(e) => setQuotationRequest({ ...quotationRequest, siteName: e.target.value })}
                      required
                    />
                    <datalist id="client-project-sites-list">
                      {clientSites.map((s, idx) => (
                        <option key={s.id || idx} value={s.name}>
                          {s.name} ({s.location || s.city || 'Site'})
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Work Purpose
                    </label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. 5th Floor Slab Casting"
                      value={quotationRequest.workPurpose}
                      onChange={(e) => setQuotationRequest({ ...quotationRequest, workPurpose: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Length (Ft), Breadth (Ft), and Rental Duration (Months) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Length (Ft)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        min="1"
                        step="any"
                        className="form-input mono"
                        placeholder="100"
                        value={quotationRequest.lengthFt}
                        onChange={(e) => setQuotationRequest({ ...quotationRequest, lengthFt: e.target.value })}
                        required
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Ft
                      </span>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Breadth (Ft)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        min="1"
                        step="any"
                        className="form-input mono"
                        placeholder="120"
                        value={quotationRequest.breadthFt}
                        onChange={(e) => setQuotationRequest({ ...quotationRequest, breadthFt: e.target.value })}
                        required
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Ft
                      </span>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Duration (Months)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        min="0.5"
                        step="0.5"
                        className="form-input mono"
                        placeholder="1"
                        value={quotationRequest.tenureMonths}
                        onChange={(e) => setQuotationRequest({ ...quotationRequest, tenureMonths: e.target.value })}
                        required
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Mo
                      </span>
                    </div>
                  </div>

                </div>

                {/* Live Calculated Area Banner */}
                <div style={{
                  background: 'linear-gradient(90deg, #f8fafc, #fff7ed)',
                  border: '1px solid var(--border-orange)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ruler size={16} color="var(--orange-primary)" />
                    <span>Area: <strong style={{ color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)' }}>{calculatedAreaSqft.toLocaleString()} Sq.Ft</strong></span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {quotationRequest.tenureMonths || 1} Month(s) (~{calculatedTenureDays} Days)
                  </div>
                </div>

                {/* Row 3: Estimated Items Needed (Optional & in Dropdown / Accordion) */}
                <div style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  background: '#ffffff'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowEstimatedItems(!showEstimatedItems)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 0.85rem',
                      background: showEstimatedItems ? '#f8fafc' : '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Layers size={16} color="var(--orange-primary)" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          Estimated Items Needed <span className="badge badge-neutral" style={{ fontSize: '0.65rem', marginLeft: '4px' }}>Optional</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--orange-primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span>{showEstimatedItems ? 'Hide Items' : 'Customize Items'}</span>
                      {showEstimatedItems ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </div>
                  </button>

                  {/* Dropdown Content with Editable Items */}
                  {showEstimatedItems && (
                    <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-light)', background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                          Edit quantities or add custom items:
                        </p>
                        <button 
                          type="button" 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleAddItem()}
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--orange-primary)', fontSize: '0.75rem' }}
                        >
                          <Plus size={12} />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {quotationRequest.itemsNeeded.map((it, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.4rem',
                              background: '#ffffff',
                              padding: '0.5rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-light)'
                            }}
                          >
                            <input 
                              type="text" 
                              className="form-input"
                              style={{ flex: 2, padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
                              value={it.name}
                              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                              required
                            />
                            <input 
                              type="number" 
                              min="0"
                              className="form-input mono" 
                              style={{ width: '70px', padding: '0.35rem 0.4rem', textAlign: 'center', fontSize: '0.82rem' }}
                              value={it.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                              required
                            />
                            <select 
                              className="form-select"
                              style={{ width: '65px', padding: '0.35rem 0.4rem', fontSize: '0.78rem' }}
                              value={it.unit || 'Pcs'}
                              onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                            >
                              <option value="Pcs">Pcs</option>
                              <option value="Sets">Sets</option>
                              <option value="Nos">Nos</option>
                              <option value="Mtr">Mtr</option>
                            </select>
                            <button 
                              type="button" 
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.35rem 0.5rem', color: '#e11d48' }}
                              onClick={() => handleRemoveItem(idx)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 4: Special Notes */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Special Notes / Site Requirements
                  </label>
                  <textarea 
                    className="form-textarea" 
                    rows="2"
                    value={quotationRequest.notes}
                    onChange={(e) => setQuotationRequest({ ...quotationRequest, notes: e.target.value })}
                    placeholder="Specify delivery timing, unloading access..."
                  />
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.92rem' }}
                  >
                    <Send size={15} />
                    <span>Submit Quotation Request</span>
                  </button>
                </div>

              </form>
            </div>
          )}
        </section>

        {/* Older Quotations / History for Client with Delete Options */}
        {(() => {
          const query = quotationHistorySearch.trim().toLowerCase();
          const filteredHistory = clientQuotations.filter(quot => {
            const matchesQuery = !query || 
              (quot.quotationNo || '').toLowerCase().includes(query) ||
              (quot.siteName || '').toLowerCase().includes(query) ||
              (quot.workPurpose || '').toLowerCase().includes(query) ||
              (quot.clientNotes || '').toLowerCase().includes(query) ||
              (quot.items || []).some(it => (it.name || '').toLowerCase().includes(query));

            const matchesStatus = quotationHistoryFilter === 'ALL' ||
              (quotationHistoryFilter === 'AWAITING' && quot.status === 'requested') ||
              (quotationHistoryFilter === 'RECEIVED' && quot.status === 'quotation_sent') ||
              (quotationHistoryFilter === 'WORK_ORDER' && quot.status === 'work_order_created');

            return matchesQuery && matchesStatus;
          });

          const countAwaiting = clientQuotations.filter(q => q.status === 'requested').length;
          const countSent = clientQuotations.filter(q => q.status === 'quotation_sent').length;
          const countWo = clientQuotations.filter(q => q.status === 'work_order_created').length;

          return (
            <section id="client-quotations-history" className="card" style={{
              marginTop: '1.25rem',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '0.85rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={20} color="var(--orange-primary)" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                      Quotation Requests History ({clientQuotations.length})
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                    View status, commercial rates, or manage older unapproved quotation requests and staging inquiries
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(() => {
                    const unapprovedCount = clientQuotations.filter(q => q.status !== 'work_order_created' && q.status !== 'approved').length;
                    if (unapprovedCount <= 1) return null;
                    return (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#ffffff', fontWeight: 700, fontSize: '0.78rem' }}
                        onClick={handleDeleteAllClientQuotations}
                        title="Delete unapproved older quotation requests"
                      >
                        <Trash2 size={13} />
                        <span>Delete Older Inquiries ({unapprovedCount})</span>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem'
              }}>
                {/* Search */}
                <div style={{ flex: '1 1 220px', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search by QR No, site name, purpose..."
                    className="form-input"
                    style={{ padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.82rem' }}
                    value={quotationHistorySearch}
                    onChange={(e) => setQuotationHistorySearch(e.target.value)}
                  />
                  <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${quotationHistoryFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '9999px' }}
                    onClick={() => setQuotationHistoryFilter('ALL')}
                  >
                    All ({clientQuotations.length})
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${quotationHistoryFilter === 'AWAITING' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '9999px' }}
                    onClick={() => setQuotationHistoryFilter('AWAITING')}
                  >
                    ⚡ Awaiting Rates ({countAwaiting})
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${quotationHistoryFilter === 'RECEIVED' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '9999px' }}
                    onClick={() => setQuotationHistoryFilter('RECEIVED')}
                  >
                    📩 Rates Received ({countSent})
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${quotationHistoryFilter === 'WORK_ORDER' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '9999px' }}
                    onClick={() => setQuotationHistoryFilter('WORK_ORDER')}
                  >
                    ✓ Work Orders ({countWo})
                  </button>
                </div>
              </div>

              {/* Quotations List */}
              {filteredHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {filteredHistory.map((quot) => {
                    const isWorkOrder = quot.status === 'work_order_created';
                    const isQuotationSent = quot.status === 'quotation_sent';
                    const isRequested = quot.status === 'requested';
                    const isApproved = isWorkOrder || quot.status === 'approved';

                    return (
                      <div
                        key={quot.id}
                        style={{
                          background: '#ffffff',
                          border: `1.5px solid ${isWorkOrder ? '#10b981' : isQuotationSent ? 'var(--orange-primary)' : 'var(--border-light)'}`,
                          borderRadius: 'var(--radius-md)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          overflow: 'hidden',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Top Ribbon */}
                        <div style={{
                          background: isWorkOrder ? '#f0fdf4' : isQuotationSent ? '#fff7ed' : '#f8fafc',
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--border-light)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                            <span className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--orange-primary)' }}>
                              {quot.quotationNo}
                            </span>

                            {isRequested && (
                              <span className="badge badge-non-gst" style={{ fontSize: '0.72rem' }}>
                                ⚡ AWAITING OWNER RATES
                              </span>
                            )}

                            {isQuotationSent && (
                              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                                📩 QUOTATION ORDER RECEIVED
                              </span>
                            )}

                            {isWorkOrder && (
                              <span className="badge badge-gst" style={{ fontSize: '0.72rem' }}>
                                ✓ WORK ORDER: {quot.workOrderNo}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>TOTAL</div>
                              <div className="mono" style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                ₹{(quot.grandTotal || 0).toLocaleString('en-IN')}
                              </div>
                            </div>

                            {/* Direct Delete button - never shown for approved quotations */}
                            {!isApproved && (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{
                                  color: '#e11d48',
                                  borderColor: '#fca5a5',
                                  background: '#ffffff',
                                  padding: '0.3rem 0.6rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}
                                onClick={() => handleDeleteQuotation(quot.id, quot.quotationNo)}
                                title="Delete this unapproved quotation request"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div style={{ padding: '0.95rem 1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.65rem' }}>
                            <div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>PROJECT SITE</div>
                              <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{quot.siteName}</strong>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>WORK PURPOSE</div>
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{quot.workPurpose || 'Slab Staging'}</span>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>DIMENSIONS & AREA</div>
                              <span className="mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--orange-primary)' }}>
                                {quot.lengthFt || 0}' × {quot.breadthFt || 0}' ({quot.requestedAreaSqft?.toLocaleString()} Sq.Ft)
                              </span>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>DATE & TENURE</div>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                {quot.date} • {quot.tenureMonths || 1} Mo (~{quot.tenureDays || 30} Days)
                              </span>
                            </div>
                          </div>

                          {/* Client Notes / Message */}
                          {quot.clientNotes && (
                            <div style={{
                              background: '#f8fafc',
                              border: '1px solid #f1f5f9',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.45rem 0.65rem',
                              fontSize: '0.78rem',
                              color: 'var(--text-muted)',
                              fontStyle: 'italic',
                              marginBottom: '0.65rem'
                            }}>
                              "{quot.clientNotes}"
                            </div>
                          )}

                          {/* Items requested badges */}
                          {quot.items && quot.items.length > 0 && (
                            <div style={{ marginBottom: '0.65rem' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                                REQUESTED ITEMS ({quot.items.length}):
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {quot.items.map((it, idx) => (
                                  <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                    {it.name}: <strong>{it.qty} {it.unit}</strong>
                                    {it.ratePerDay ? ` (@ ₹${it.ratePerDay}/d)` : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {quot.ownerReply && (
                            <div style={{
                              background: '#fff7ed',
                              border: '1px solid #fed7aa',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.8rem',
                              color: '#9a3412',
                              marginBottom: '0.65rem'
                            }}>
                              <strong>Owner Quotation Note:</strong> "{quot.ownerReply}"
                            </div>
                          )}

                          {/* Actions Footer */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            paddingTop: '0.65rem',
                            borderTop: '1px solid var(--border-light)'
                          }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <a
                                href={`https://wa.me/?text=Hi%20ScaffBuild,%20inquiring%20about%20Quotation%20${encodeURIComponent(quot.quotationNo)}%20for%20${encodeURIComponent(quot.siteName)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem', color: '#15803d', borderColor: '#bbf7d0' }}
                              >
                                <MessageCircle size={13} color="#25D366" />
                                <span>WhatsApp Yard</span>
                              </a>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {/* Prominent Delete Quotation Button - never shown for approved quotations */}
                              {!isApproved && (
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{
                                    color: '#e11d48',
                                    borderColor: '#fca5a5',
                                    background: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.76rem'
                                  }}
                                  onClick={() => handleDeleteQuotation(quot.id, quot.quotationNo)}
                                >
                                  <Trash2 size={13} />
                                  <span>Delete Quotation</span>
                                </button>
                              )}

                              {isQuotationSent && (
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  style={{ fontSize: '0.76rem' }}
                                  onClick={() => handleAcceptQuotation(quot)}
                                >
                                  <FileCheck2 size={14} />
                                  <span>Accept & Issue Work Order</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed #cbd5e1',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>📂</div>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#1e293b' }}>
                    {quotationHistorySearch || quotationHistoryFilter !== 'ALL'
                      ? 'No Quotation Requests match your filter'
                      : 'No Previous Quotations Recorded'}
                  </div>
                  <p style={{ fontSize: '0.78rem', margin: '4px auto 0 auto', maxWidth: '300px' }}>
                    {quotationHistorySearch || quotationHistoryFilter !== 'ALL'
                      ? 'Try clearing the search text or changing the status filter above.'
                      : 'Fill out the form above to submit your first equipment quotation request.'}
                  </p>
                </div>
              )}
            </section>
          );
        })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 2: DAILY LABOUR WORK & APPROVALS                              */}
      {/* ========================================================================= */}
      {notificationsActiveTab === 'labour' && (() => {
        const filteredLogs = selectedSiteFilter === 'ALL'
          ? clientWorkerLogs
          : clientWorkerLogs.filter(l => (l.siteName || '').toLowerCase().includes(selectedSiteFilter.toLowerCase()) || selectedSiteFilter.toLowerCase().includes((l.siteName || '').toLowerCase()));

        const approvedLogs = filteredLogs.filter(l => l.status === 'approved');
        const pendingLogs = filteredLogs.filter(l => l.status === 'pending_approval');
        const displayLogs = labourBillingActiveSubTab === 'approved' 
          ? approvedLogs 
          : labourBillingActiveSubTab === 'pending' 
            ? pendingLogs 
            : filteredLogs;

        return (
          <section id="client-worker-progress-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Site Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', flexShrink: 0 }}>Site:</span>
              <button
                className={`btn btn-sm ${selectedSiteFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', flexShrink: 0 }}
                onClick={() => setSelectedSiteFilter('ALL')}
              >
                All Sites ({clientWorkerLogs.length})
              </button>
              {clientSites.map((site) => (
                <button
                  key={site.id}
                  className={`btn btn-sm ${selectedSiteFilter === site.name ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', flexShrink: 0 }}
                  onClick={() => setSelectedSiteFilter(site.name)}
                >
                  {site.name.slice(0, 22)}...
                </button>
              ))}
            </div>

            {/* 4. Sub-Navigation Tabs: Only Approvals */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {[
                { id: 'pending', label: `⏱ Pending Sign-Off (${pendingLogs.length})` },
                { id: 'approved', label: `✓ Approved Things (${approvedLogs.length})` },
                { id: 'all', label: `All Labour Logs (${filteredLogs.length})` }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setLabourBillingActiveSubTab(sub.id)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: labourBillingActiveSubTab === sub.id ? '#ffffff' : 'transparent',
                    color: labourBillingActiveSubTab === sub.id ? '#000000' : '#64748b',
                    fontWeight: labourBillingActiveSubTab === sub.id ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: labourBillingActiveSubTab === sub.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* 5. Sub-Tab Content: Approvals Cards List */}
            {displayLogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {displayLogs.map((log) => {
                    const isPending = log.status === 'pending_approval';
                    const isApproved = log.status === 'approved';
                    const logBilling = calculateLabourBilling(log);

                    return (
                      <div 
                        key={log.id}
                        style={{
                          background: '#ffffff',
                          border: `1.5px solid ${isApproved ? '#a7f3d0' : isPending ? '#fdba74' : '#fecdd3'}`,
                          borderLeft: `5px solid ${isApproved ? '#10b981' : isPending ? '#ff6b00' : '#e11d48'}`,
                          borderRadius: '14px',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                        }}
                      >
                        {/* Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
                              📍 {log.siteName}
                            </div>
                            <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                              {log.workType}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              Floor Level: <strong>{log.floorLevel}</strong> • Date: <strong>{log.date}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>LABOUR BILL</div>
                              <div className="mono" style={{ fontSize: '1rem', fontWeight: 900, color: isApproved ? '#059669' : '#d97706' }}>
                                ₹{logBilling.toLocaleString('en-IN')}
                              </div>
                            </div>

                            <span className={`badge ${isApproved ? 'badge-gst' : isPending ? 'badge-non-gst' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                              {isApproved ? '✓ APPROVED THING' : isPending ? '⏱ PENDING' : 'REVISION'}
                            </span>
                          </div>
                        </div>

                        {/* Crew & Measurement Bar */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          background: '#f8fafc',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem'
                        }}>
                          <div>
                            Gang / Worker: <strong>{log.workerName}</strong> ({log.laborCount} crew members • {log.hoursWorked || 8}h)
                          </div>
                          <div className="mono" style={{ fontWeight: 800, color: 'var(--orange-primary)', fontSize: '0.92rem' }}>
                            {log.areaCompletedSqft} Sq.Ft (@ ₹{labourRatePerSqft}/ft)
                          </div>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0, fontStyle: 'italic' }}>
                          "{log.workCompletedSummary}"
                        </p>

                        {/* Photo Proof */}
                        {log.photoUrl && (
                          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', maxHeight: '140px' }}>
                            <img 
                              src={log.photoUrl} 
                              alt="Site Inspection Proof" 
                              style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                            />
                          </div>
                        )}

                        {/* APPROVED THING: OFFICIAL QUALITY CERTIFICATION & SIGN-OFF BOX */}
                        {isApproved && (
                          <div style={{
                            background: '#ecfdf5',
                            border: '1.5px solid #a7f3d0',
                            borderRadius: '10px',
                            padding: '0.75rem 0.85rem',
                            fontSize: '0.78rem',
                            color: '#065f46'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '0.35rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
                                <CheckCircle2 size={16} color="#059669" />
                                <span>Official Inspection Sign-off & Quality Certificate</span>
                              </div>
                              <span className="mono" style={{ fontSize: '0.72rem', color: '#047857' }}>{log.approvalTimestamp}</span>
                            </div>

                            <div>Certified by: <strong>{log.approvedBy}</strong></div>
                            {log.approvalComments && (
                              <div style={{ marginTop: '3px', color: '#047857' }}>
                                Remarks: "<em>{log.approvalComments}</em>"
                              </div>
                            )}

                            <div style={{ marginTop: '5px', paddingTop: '4px', borderTop: '1px dashed #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
                              <span>Approved Labour Amount:</span>
                              <span className="mono" style={{ fontSize: '0.92rem', color: '#065f46' }}>
                                ₹{logBilling.toLocaleString('en-IN')} (Passed for billing)
                              </span>
                            </div>
                          </div>
                        )}

                        {/* PENDING APPROVAL ACTIONS */}
                        {isPending && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                            <button 
                              className="btn btn-success"
                              style={{ flex: 2, padding: '0.55rem', fontSize: '0.85rem', fontWeight: 700 }}
                              onClick={() => setSelectedLogToApprove(log)}
                            >
                              <Check size={15} />
                              <span>Approve Daily Work & Certify Bill (₹{logBilling.toLocaleString('en-IN')})</span>
                            </button>
                            <button 
                              className="btn btn-danger"
                              style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                              onClick={() => handleConfirmApproval(log, false)}
                            >
                              <X size={15} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        {/* Approved Action Buttons: WhatsApp & Print voucher */}
                        {isApproved && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                              onClick={() => {
                                const text = encodeURIComponent(`Quality Sign-off Certificate for ${log.siteName} (${log.workType}) - Certified Area: ${log.areaCompletedSqft} Sq.Ft - Approved Labour Bill: ₹${logBilling.toLocaleString('en-IN')}`);
                                window.open(`https://wa.me/?text=${text}`, '_blank');
                              }}
                            >
                              <MessageCircle size={13} color="#25D366" />
                              <span>WhatsApp Sign-off</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                              onClick={() => window.print()}
                            >
                              <Printer size={13} />
                              <span>Print Voucher</span>
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <HardHat size={38} style={{ opacity: 0.35, margin: '0 auto 0.75rem', color: 'var(--orange-primary)' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                    {labourBillingActiveSubTab === 'approved' 
                      ? 'No Approved Things Recorded Yet' 
                      : labourBillingActiveSubTab === 'pending' 
                        ? 'No Pending Sign-offs for this filter' 
                        : 'No Worker Logs Reported Yet'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    No staging progress logs submitted for this filter.
                  </p>
                </div>
              )}

          </section>
        );
      })()}

          {/* ========================================================================= */}
          {/* SUB-SECTION 4: SYSTEM NOTIFICATIONS (RENAMED FROM MAIL TO NOTIFICATIONS) */}
          {/* ========================================================================= */}
          {notificationsActiveTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
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
                      <Bell size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Notifications
                      </h3>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '1px 0 0 0' }}>
                        {unreadNotificationCount} unread • Logistics, invoices, work orders &amp; site alerts
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', background: '#f8fafc', padding: '2px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <button
                        type="button"
                        onClick={() => setNotificationFilter('ALL')}
                        style={{
                          background: notificationFilter === 'ALL' ? '#ffffff' : 'transparent',
                          color: notificationFilter === 'ALL' ? '#0f172a' : '#64748b',
                          fontWeight: notificationFilter === 'ALL' ? 700 : 500,
                          border: 'none',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          boxShadow: notificationFilter === 'ALL' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                        }}
                      >
                        All ({systemNotifications.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotificationFilter('UNREAD')}
                        style={{
                          background: notificationFilter === 'UNREAD' ? '#ffffff' : 'transparent',
                          color: notificationFilter === 'UNREAD' ? '#2563eb' : '#64748b',
                          fontWeight: notificationFilter === 'UNREAD' ? 700 : 500,
                          border: 'none',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          boxShadow: notificationFilter === 'UNREAD' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                        }}
                      >
                        Unread ({unreadNotificationCount})
                      </button>
                    </div>

                    {unreadNotificationCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px' }}
                      >
                        Mark All as Read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {systemNotifications
                    .filter(n => notificationFilter === 'ALL' ? true : !n.isRead)
                    .map((item) => {
                      const isUnread = !item.isRead;
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleNotificationReadStatus(item.id)}
                          style={{
                            background: isUnread ? '#f0f9ff' : '#ffffff',
                            border: `1.5px solid ${isUnread ? '#bae6fd' : '#e2e8f0'}`,
                            borderRadius: '12px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isUnread ? '0 2px 8px rgba(14, 165, 233, 0.08)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isUnread ? (
                                <span style={{
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  background: '#0284c7',
                                  display: 'inline-block',
                                  boxShadow: '0 0 6px #0284c7',
                                  flexShrink: 0
                                }} />
                              ) : (
                                <span style={{
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  background: '#cbd5e1',
                                  display: 'inline-block',
                                  flexShrink: 0
                                }} />
                              )}
                              
                              <div style={{ fontWeight: isUnread ? 800 : 600, fontSize: '0.88rem', color: isUnread ? '#0369a1' : '#1e293b' }}>
                                {item.title}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '999px',
                                background: isUnread ? '#0284c7' : '#f1f5f9',
                                color: isUnread ? '#ffffff' : '#64748b'
                              }}>
                                {isUnread ? 'UNREAD' : 'READ'}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                {item.time}
                              </span>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: isUnread ? '#334155' : '#64748b', lineHeight: 1.45, paddingLeft: '17px' }}>
                            {item.body}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', borderTop: '1px dashed #e2e8f0', marginTop: '2px', paddingLeft: '17px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                              Source: <strong style={{ color: '#0f172a' }}>{item.sender}</strong> • <span style={{ color: '#0284c7' }}>{item.category}</span>
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>
                              {isUnread ? 'Click to mark as read' : 'Click to mark as unread'}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {systemNotifications.filter(n => notificationFilter === 'ALL' ? true : !n.isRead).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                      <CheckCircle2 size={32} color="#10b981" style={{ marginBottom: '0.35rem' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>No notifications in this filter</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>You are completely caught up!</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE TAB 3: MORE / SETTINGS                                              */}
      {/* ========================================================================= */}
      {activeSlide === 'more' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <MoreSettingsPage 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            company={company}
            setCompany={setCompany}
            users={users}
            setUsers={setUsers}
            inventory={inventory}
            setInventory={setInventory}
            challans={challans}
            invoices={invoices}
            quotations={quotations}
            onLogout={onLogout}
            onBack={() => setActiveSlide('projects')}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: REQUEST EXTRA ITEMS (Needed More Shuttering / Staging Material)   */}
      {/* ========================================================================= */}
      {selectedSiteForIssue && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e6657c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Plus size={18} strokeWidth={2.8} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Request Items (Needed More)</h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>Request extra shuttering & staging equipment needed on site</p>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedSiteForIssue(null)}>✕</button>
            </div>

            <form onSubmit={handleSubmitIssueItems}>
              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem', fontSize: '0.82rem' }}>
                  <div>Site: <strong>{selectedSiteForIssue.name}</strong></div>
                  <div>Current On-Site Material: <strong>{selectedSiteForIssue.totalPcs || 65} pcs</strong></div>
                  <div>Indent Request No: <strong className="mono">{issueFormData.challanNo}</strong></div>
                </div>

                {/* MULTIPLE MATERIAL ITEMS SELECTION */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '0.5rem',
                    paddingBottom: '0.35rem',
                    borderBottom: '1.5px solid #f1f5f9'
                  }}>
                    <label className="form-label" style={{ fontWeight: 800, margin: 0, fontSize: '0.88rem', color: '#111827' }}>
                      Material Items Needed ({(issueFormData.items || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => handleIssueAddItem()}
                      style={{
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '6px',
                        padding: '3px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Plus size={13} strokeWidth={2.8} />
                      <span>+ Add Item</span>
                    </button>
                  </div>

                  {/* List of Multiple Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '2px' }}>
                    {(issueFormData.items || []).map((it, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: '#f8fafc',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {/* Item Name with datalist suggestions */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <input
                            list={`issue-item-options-${idx}`}
                            type="text"
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.82rem', padding: '0.35rem 0.5rem', background: '#ffffff' }}
                            placeholder="Select or type item name"
                            value={it.name}
                            onChange={(e) => handleIssueItemChange(idx, 'name', e.target.value)}
                            required
                          />
                          <datalist id={`issue-item-options-${idx}`}>
                            <option value="Cuplock Standard Vertical Pipes 3.0m" />
                            <option value="Cuplock Standard Vertical Pipes 2.0m" />
                            <option value="Cuplock Ledgers / Horizontals 1.2m" />
                            <option value="Cuplock Ledgers / Horizontals 1.8m" />
                            <option value="MS Shuttering Plates 900x600 (3'x2')" />
                            <option value="MS Shuttering Plates 1200x600 (4'x2')" />
                            <option value="MS Shuttering Plates 900x300 (3'x1')" />
                            <option value="Telescopic Steel Props (2.0m - 3.5m)" />
                            <option value="Telescopic Steel Props (3.0m - 4.5m)" />
                            <option value="Acrow Telescopic Spans (2.5m - 4.2m)" />
                            <option value="Stirrup U-Jacks & Base Jacks" />
                            <option value="Farma 900x300" />
                            <option value="Joint Pins / Couplers" />
                          </datalist>
                        </div>

                        {/* Quantity */}
                        <div style={{ width: '75px', flexShrink: 0 }}>
                          <input
                            type="number"
                            min="1"
                            className="form-input mono"
                            style={{ width: '100%', fontSize: '0.82rem', padding: '0.35rem 0.4rem', textAlign: 'center', background: '#ffffff' }}
                            placeholder="Qty"
                            value={it.qty}
                            onChange={(e) => handleIssueItemChange(idx, 'qty', e.target.value)}
                            required
                          />
                        </div>

                        {/* Unit */}
                        <div style={{ width: '65px', flexShrink: 0 }}>
                          <select
                            className="form-select"
                            style={{ width: '100%', fontSize: '0.78rem', padding: '0.35rem 0.3rem', background: '#ffffff' }}
                            value={it.unit || 'Pcs'}
                            onChange={(e) => handleIssueItemChange(idx, 'unit', e.target.value)}
                          >
                            <option value="Pcs">Pcs</option>
                            <option value="Sets">Sets</option>
                            <option value="Nos">Nos</option>
                            <option value="Mtr">Mtr</option>
                          </select>
                        </div>

                        {/* Remove Item */}
                        {(issueFormData.items || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleIssueRemoveItem(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              flexShrink: 0
                            }}
                            title="Remove this item"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Total Summary Badge */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f1f5f9',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    marginTop: '0.55rem',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    <span style={{ color: '#475569' }}>Total Items: {(issueFormData.items || []).length}</span>
                    <span style={{ color: '#0f172a' }}>
                      Total Requested: <strong style={{ color: '#e11d48' }}>{(issueFormData.items || []).reduce((sum, it) => sum + (Number(it.qty) || 0), 0)} Pcs</strong>
                    </span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Required on Site Date</label>
                    <input 
                      type="date" 
                      className="form-input mono"
                      value={issueFormData.date}
                      onChange={(e) => setIssueFormData({ ...issueFormData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Notes / Requirement (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Needed for 5th slab casting on Friday"
                      value={issueFormData.notes || ''}
                      onChange={(e) => setIssueFormData({ ...issueFormData, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedSiteForIssue(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#e6657c', borderColor: '#e6657c', fontWeight: 700 }}>
                  Submit Request ({(issueFormData.items || []).reduce((sum, it) => sum + (Number(it.qty) || 0), 0)} Pcs)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TAKE BACK NOTIFICATION (Alert ScaffBuild to Pick Up Material)    */}
      {/* ========================================================================= */}
      {selectedSiteForReceive && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#37a23a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={17} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Take Back Notification</h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>Notify ScaffBuild yard to dispatch pickup for dismantled material</p>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedSiteForReceive(null)}>✕</button>
            </div>

            <form onSubmit={handleSubmitReceiveItems}>
              <div className="modal-body">
                {/* Site Info Header */}
                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem', fontSize: '0.84rem', border: '1px solid #e2e8f0' }}>
                  <div>Pickup Site: <strong>{selectedSiteForReceive.name}</strong></div>
                  <div>Current Equipment on Site: <strong>{selectedSiteForReceive.totalPcs || 65} pcs</strong></div>
                  {selectedSiteForReceive.location && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.76rem', marginTop: '2px' }}>{selectedSiteForReceive.location}</div>
                  )}
                </div>

                {/* Dispatch Callout Box */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ fontSize: '1.3rem', lineHeight: 1 }}>📢</div>
                  <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.45 }}>
                    <strong>Material Dismantling Finished:</strong>
                    <div style={{ marginTop: '3px' }}>
                      Sending this notification informs the ScaffBuild yard & transport team that shuttering/scaffolding equipment is ready to be taken back.
                    </div>
                  </div>
                </div>

                {/* Optional Site Notes */}
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Site Notes / Gate Pass Info (Optional)</label>
                  <textarea 
                    className="form-textarea" 
                    rows="2"
                    placeholder="e.g. Material stacked near Gate 2. Call Er. Rajesh for site gate pass..."
                    value={receiveFormData.notes}
                    onChange={(e) => setReceiveFormData({ ...receiveFormData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedSiteForReceive(null)}>
                  Cancel
                </button>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={handleSendTakeBackWhatsApp}
                    style={{ borderColor: '#25D366', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                    title="Send Take Back Notification directly to ScaffBuild WhatsApp"
                  >
                    <MessageCircle size={15} color="#25D366" />
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success" 
                    style={{ background: '#37a23a', borderColor: '#37a23a', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    <Truck size={16} />
                    <span>Send Notification</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ========================================================================= */}
      {/* MODAL 4: NEW SITE (Triggered by [New site] button in Dark Capsule Bar)     */}
      {/* ========================================================================= */}
      {isNewSiteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Register New Construction Site</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsNewSiteModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveNewSite}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Building / Site Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. ICON MICASA JIGANI BOMMAANDRA LINK ROAD"
                    value={newSiteInput.name}
                    onChange={(e) => setNewSiteInput({ ...newSiteInput, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Site Address / Landmark</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Link Road, Near Industrial Gate 2"
                    value={newSiteInput.location}
                    onChange={(e) => setNewSiteInput({ ...newSiteInput, location: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Initial Due Balance (₹)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      placeholder="62500"
                      value={newSiteInput.dueAmount}
                      onChange={(e) => setNewSiteInput({ ...newSiteInput, dueAmount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Equipment (Pcs)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      placeholder="65"
                      value={newSiteInput.totalPcs}
                      onChange={(e) => setNewSiteInput({ ...newSiteInput, totalPcs: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Site Engineer Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newSiteInput.siteEngineer}
                      onChange={(e) => setNewSiteInput({ ...newSiteInput, siteEngineer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Badge Label</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newSiteInput.badgeType}
                      onChange={(e) => setNewSiteInput({ ...newSiteInput, badgeType: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewSiteModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Register Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CERTIFY DAILY WORKER PROGRESS & LABOUR BILLING                   */}
      {/* ========================================================================= */}
      {selectedLogToApprove && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={18} color="var(--orange-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Certify Daily Labour Work & Billing</h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedLogToApprove(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Detailed Summary Card */}
              <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Worker / Gang</span>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{selectedLogToApprove.workerName}</div>
                  </div>
                  <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                    <Clock size={11} /> Pending Inspection
                  </span>
                </div>

                <div className="grid-2" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Project Site:</span>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{selectedLogToApprove.siteName}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Floor / Location:</span>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{selectedLogToApprove.floorLevel || 'General Floor'}</div>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Work Activity:</span>
                    <div style={{ fontWeight: 600, color: '#0284c7' }}>{selectedLogToApprove.workType || 'Shuttering & Staging'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Measured Output:</span>
                    <div style={{ fontWeight: 800, color: '#0f172a' }} className="mono">
                      {selectedLogToApprove.areaCompletedSqft || 0} Sq.Ft 
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginLeft: '0.25rem' }}>
                        ({selectedLogToApprove.laborCount || 1} workers × {selectedLogToApprove.hoursWorked || 8}h)
                      </span>
                    </div>
                  </div>
                </div>

                {selectedLogToApprove.workCompletedSummary && (
                  <div style={{ fontSize: '0.77rem', color: '#475569', background: '#ffffff', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '0.65rem' }}>
                    <strong>Work Summary:</strong> {selectedLogToApprove.workCompletedSummary}
                  </div>
                )}

                {/* Billing Release Calculation Highlight */}
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.65rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>Certified Billable Labour Value</div>
                    <div style={{ fontSize: '0.72rem', color: '#047857' }}>
                      {labourBillingBasis === 'sqft'
                        ? `${selectedLogToApprove.areaCompletedSqft || 0} Sq.Ft × ₹${labourRatePerSqft}/Sq.Ft`
                        : `${((Number(selectedLogToApprove.laborCount) || 1) * ((Number(selectedLogToApprove.hoursWorked) || 8) / 8)).toFixed(1)} Man-Days × ₹${labourManDayRate}/Day`}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#047857' }} className="mono">
                    ₹{calculateLabourBilling(selectedLogToApprove).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  Client Inspection Remarks & Quality Certification
                </label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="e.g. Scaffolding alignment, prop bracing, and shuttering level inspected and approved as per structural drawings."
                  required
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-danger btn-sm"
                onClick={() => handleConfirmApproval(selectedLogToApprove, false)}
              >
                Reject / Revision Needed
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedLogToApprove(null)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success btn-sm" 
                  onClick={() => handleConfirmApproval(selectedLogToApprove, true)}
                >
                  <Check size={14} /> Approve & Certify ₹{calculateLabourBilling(selectedLogToApprove).toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: RECORD DAILY LABOUR WORK ENTRY                                  */}
      {/* ========================================================================= */}
      {isAddLabourModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <HardHat size={18} color="var(--orange-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Record Daily Labour Work Entry</h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setIsAddLabourModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddNewLabourLog}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Date of Work</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={newLabourForm.date}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project Site</label>
                    <select 
                      className="form-input"
                      value={newLabourForm.siteName}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, siteName: e.target.value })}
                      required
                    >
                      {clientSites.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Gang Leader / Labour Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Sunil Kumar (Labour Gang Leader)"
                      value={newLabourForm.workerName}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, workerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Category / Type</label>
                    <select 
                      className="form-input"
                      value={newLabourForm.workType}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, workType: e.target.value })}
                    >
                      <option value="Slab Shuttering & Staging">Slab Shuttering & Staging</option>
                      <option value="Column & Beam Shuttering">Column & Beam Shuttering</option>
                      <option value="Wall Formwork Erection">Wall Formwork Erection</option>
                      <option value="Cuplock Scaffolding Erection">Cuplock Scaffolding Erection</option>
                      <option value="De-shuttering & Striping">De-shuttering & Striping</option>
                      <option value="Safety Net & Handrail Erection">Safety Net & Handrail Erection</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Floor / Grid Location</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Tower B - 3rd Floor Slab Grid 4-9"
                      value={newLabourForm.floorLevel}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, floorLevel: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Measured Area Output (Sq.Ft)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      placeholder="e.g. 1200"
                      value={newLabourForm.areaCompletedSqft}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, areaCompletedSqft: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Labour Gang Size (Workers)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      placeholder="6"
                      value={newLabourForm.laborCount}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, laborCount: Number(e.target.value) || 1 })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shift Hours Worked</label>
                    <input 
                      type="number" 
                      step="0.5"
                      className="form-input mono"
                      placeholder="8.0"
                      value={newLabourForm.hoursWorked}
                      onChange={(e) => setNewLabourForm({ ...newLabourForm, hoursWorked: Number(e.target.value) || 8 })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Work Completed Summary</label>
                  <textarea 
                    className="form-textarea" 
                    rows="2"
                    placeholder="Describe tasks completed, props erected, plates laid, alignment checked..."
                    value={newLabourForm.workCompletedSummary}
                    onChange={(e) => setNewLabourForm({ ...newLabourForm, workCompletedSummary: e.target.value })}
                  />
                </div>

                {/* Live Billing Output Preview */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>ESTIMATED LABOUR BILL AMOUNT</div>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                      {newLabourForm.areaCompletedSqft} Sq.Ft × ₹{labourRatePerSqft}/Sq.Ft = 
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803d' }} className="mono">
                    ₹{(Number(newLabourForm.areaCompletedSqft || 0) * labourRatePerSqft).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="autoApproveCheck"
                    checked={newLabourForm.autoApprove}
                    onChange={(e) => setNewLabourForm({ ...newLabourForm, autoApprove: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--orange-primary)' }}
                  />
                  <label htmlFor="autoApproveCheck" style={{ fontSize: '0.8rem', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
                    Mark directly as Inspected & Certified (Approved Thing with certified bill)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddLabourModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={15} /> Save & Record Labour Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: PRINTABLE LABOUR WORK BILLING & CERTIFICATION STATEMENT          */}
      {/* ========================================================================= */}
      {/* LABOUR WORK BILLING & CERTIFICATION STATEMENT MODAL                       */}
      {/* ========================================================================= */}
      {isLabourStatementModalOpen && (() => {
        const activeTargetSite = selectedSiteForDetails ? selectedSiteForDetails.name : selectedSiteFilter;
        const matched = (activeTargetSite && activeTargetSite !== 'ALL')
          ? clientWorkerLogs.filter(l => 
              (l.siteName || '').toLowerCase().includes(activeTargetSite.toLowerCase()) || 
              activeTargetSite.toLowerCase().includes((l.siteName || '').toLowerCase())
            )
          : clientWorkerLogs;
        const statementLogs = matched.length > 0 ? matched : clientWorkerLogs;
        
        const approvedStatementLogs = statementLogs.filter(l => l.status === 'approved');
        const totalStatementSqft = statementLogs.reduce((sum, l) => sum + (Number(l.areaCompletedSqft) || 0), 0);
        const totalApprovedStatementSqft = approvedStatementLogs.reduce((sum, l) => sum + (Number(l.areaCompletedSqft) || 0), 0);
        const totalStatementBill = statementLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
        const totalApprovedBill = approvedStatementLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
        const totalManDays = statementLogs.reduce((sum, l) => sum + ((Number(l.laborCount) || 1) * ((Number(l.hoursWorked) || 8) / 8)), 0);

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '820px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header" style={{ borderBottom: '2px solid #0f172a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--orange-primary)" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                      LABOUR WORK BILLING & CERTIFICATION STATEMENT
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Official Measurement Sheet, Progress Verification & Subcontractor Labour Bill
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm" 
                    onClick={() => window.print()}
                    style={{ gap: '0.35rem' }}
                  >
                    <Printer size={14} /> Print / Export PDF
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsLabourStatementModalOpen(false)}>
                    ✕
                  </button>
                </div>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem' }}>
                {/* Statement Sub-Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Client Organization</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{currentUser?.companyName || currentUser?.name || 'Client Representative'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>Site: <strong>{selectedSiteFilter === 'ALL' ? 'All Active Project Sites' : selectedSiteFilter}</strong></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Statement Reference</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ff6b00' }} className="mono">
                      LBS-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>

                {/* Summary Metric Chips */}
                <div className="grid-4" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TOTAL LABOUR ENTRIES</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }} className="mono">{statementLogs.length}</div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>{approvedStatementLogs.length} Certified Approved</div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TOTAL AREA EXECUTED</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7' }} className="mono">{totalStatementSqft.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>Sq.Ft</span></div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{totalApprovedStatementSqft.toLocaleString()} Sq.Ft Certified</div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>WORKER MAN-DAYS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#8b5cf6' }} className="mono">{totalManDays.toFixed(1)} <span style={{ fontSize: '0.75rem' }}>Days</span></div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Basis: {labourBillingBasis.toUpperCase()}</div>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#065f46', fontWeight: 700 }}>CERTIFIED BILL VALUE</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }} className="mono">₹{totalApprovedBill.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.7rem', color: '#059669' }}>Total: ₹{totalStatementBill.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {/* Itemized Labour Work & Billing Table */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700 }}>#</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700 }}>Date</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700 }}>Site & Location</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700 }}>Work Description & Gang</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700, textAlign: 'right' }}>Measurement</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700, textAlign: 'right' }}>Unit Rate</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700, textAlign: 'right' }}>Bill Value</th>
                        <th style={{ padding: '0.65rem 0.6rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementLogs.map((log, idx) => {
                        const bill = calculateLabourBilling(log);
                        const isAppr = log.status === 'approved';
                        return (
                          <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '0.6rem', color: '#64748b' }} className="mono">{idx + 1}</td>
                            <td style={{ padding: '0.6rem', whiteSpace: 'nowrap', fontWeight: 600 }} className="mono">{log.date}</td>
                            <td style={{ padding: '0.6rem' }}>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{log.siteName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.floorLevel || 'Ground'}</div>
                            </td>
                            <td style={{ padding: '0.6rem' }}>
                              <div style={{ fontWeight: 600, color: '#0284c7' }}>{log.workType || 'Formwork'}</div>
                              <div style={{ fontSize: '0.72rem', color: '#475569' }}>Gang: {log.workerName}</div>
                              {log.approvalComments && (
                                <div style={{ fontSize: '0.7rem', color: '#059669', fontStyle: 'italic' }}>
                                  ✓ "{log.approvalComments}"
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '0.6rem', textAlign: 'right' }} className="mono">
                              <div style={{ fontWeight: 700 }}>{log.areaCompletedSqft || 0} Sq.Ft</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{log.laborCount || 1} wkr × {log.hoursWorked || 8}h</div>
                            </td>
                            <td style={{ padding: '0.6rem', textAlign: 'right', color: '#64748b' }} className="mono">
                              ₹{labourRatePerSqft}/Sq.Ft
                            </td>
                            <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 800, color: isAppr ? '#047857' : '#94a3b8' }} className="mono">
                              ₹{bill.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                              {isAppr ? (
                                <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <CheckCircle size={10} /> Certified
                                </span>
                              ) : (
                                <span style={{ background: '#fffbeb', color: '#d97706', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <Clock size={10} /> Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #0f172a', fontWeight: 800 }}>
                        <td colSpan="4" style={{ padding: '0.75rem 0.6rem', textAlign: 'right', textTransform: 'uppercase' }}>
                          Grand Certified Bill Total:
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right' }} className="mono">
                          {totalApprovedStatementSqft.toLocaleString()} Sq.Ft
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem' }}></td>
                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', fontSize: '1.05rem', color: '#047857' }} className="mono">
                          ₹{totalApprovedBill.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontSize: '0.72rem', color: '#059669' }}>
                          ✓ Approved Things Only
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Signatures & Certification Box */}
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#334155', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    <strong>Quality & Billing Certification:</strong> We hereby certify that the shuttering, staging, and scaffolding labour work detailed in this statement was executed in accordance with approved safety plans, structural specifications, and inspected on-site. Approved measurements are certified for subcontractor payment release.
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', paddingTop: '0.5rem' }}>
                    <div style={{ borderTop: '1px solid #94a3b8', width: '220px', paddingTop: '0.35rem', textAlign: 'center', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Subcontractor Supervisor</div>
                      <div style={{ color: '#64748b' }}>Gang In-Charge Stamp</div>
                    </div>

                    <div style={{ borderTop: '1px solid #94a3b8', width: '220px', paddingTop: '0.35rem', textAlign: 'center', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{currentUser?.name || 'Er. Site In-Charge'}</div>
                      <div style={{ color: '#059669', fontWeight: 600 }}>Client Certified / Passed For Payment</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLabourStatementModalOpen(false)}>
                  Close Statement
                </button>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  <Printer size={15} /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
