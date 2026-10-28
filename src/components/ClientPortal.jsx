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
  CreditCard
} from 'lucide-react';

export default function ClientPortal({ 
  currentUser, 
  users, 
  setUsers, 
  quotations, 
  setQuotations, 
  workerLogs, 
  setWorkerLogs,
  company 
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
    dueAmount: 62500,
    totalPcs: 65,
    ratePerSqft: 3,
    balanceAreaSqft: 25000,
    badgeType: 'Sqft Area Mix'
  });

  // Quotation Request Form State
  const defaultSiteName = currentUser?.sites?.[0]?.name || 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD';

  const [quotationRequest, setQuotationRequest] = useState({
    siteName: defaultSiteName,
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

  // Labour Work, Billing & Approvals Section State
  const [labourBillingActiveSubTab, setLabourBillingActiveSubTab] = useState('all'); // 'all', 'pending', 'approved', 'billing'
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

  // Default Project Sites matching screenshot (ICON MICASA + GREEN Wood High School + Main Project Site)
  const defaultIndustrySites = [
    {
      id: 'site_icon_micasa',
      name: 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD',
      location: 'Jigani Bommasandra Link Road, Industrial Area',
      city: 'Bangalore',
      state: 'Karnataka',
      siteEngineer: 'Er. Rajesh Patil',
      phone: '+91 98200 99999',
      slabAreaSqft: 18500,
      dueAmount: 62500,
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
      location: 'Sarjapur Main Road, Chikkawadayarapura',
      city: 'Bangalore',
      state: 'Karnataka',
      siteEngineer: 'Sanjay More',
      phone: '+91 98334 11223',
      slabAreaSqft: 24000,
      dueAmount: 1484000,
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
    : defaultIndustrySites;

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

  // Total Due calculation (e.g. 62,500 + 14,84,000 = 15,46,500)
  const totalDueAmount = clientSites.reduce((sum, s) => sum + (Number(s.dueAmount) || 0), 0);

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

  // Submit Quotation Request to Owner
  const handleSubmitQuotationRequest = (e) => {
    e.preventDefault();
    const enteredSite = quotationRequest.siteName.trim() || 'ICON MICASA JIGANI BOMMAANDRA LINK ROAD';

    // Auto-register typed site into client profile if not already present
    const exists = clientSites.some(s => s.name.toLowerCase() === enteredSite.toLowerCase());
    if (!exists) {
      const newSiteObj = {
        id: `site_${Date.now()}`,
        name: enteredSite,
        location: quotationRequest.workPurpose ? `${quotationRequest.workPurpose} Site Location` : 'Site Location',
        city: 'Navi Mumbai',
        siteEngineer: currentUser?.name || 'Er. Site In-Charge',
        phone: currentUser?.phone || '',
        slabAreaSqft: calculatedAreaSqft || 14000,
        dueAmount: 75000,
        totalPcs: 120,
        lastDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),
        badgeType: 'Sqft Area Mix',
        active: true
      };

      setUsers(prev => prev.map(u => {
        if (u.id === currentUser?.id) {
          return {
            ...u,
            sites: [...(u.sites || []), newSiteObj]
          };
        }
        return u;
      }));
    }

    const newQuot = {
      id: `QUOT-${Date.now()}`,
      quotationNo: `QR/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(100 + Math.random() * 900)}`,
      clientId: currentUser.id,
      clientName: currentUser.companyName || currentUser.name,
      contactPerson: currentUser.name,
      siteName: enteredSite,
      date: new Date().toISOString().slice(0, 10),
      validTill: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      status: 'requested',
      workOrderNo: '',
      workPurpose: quotationRequest.workPurpose,
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
      clientNotes: `${quotationRequest.workPurpose ? `[Purpose: ${quotationRequest.workPurpose}] ` : ''}Dimensions: ${quotationRequest.lengthFt} Ft x ${quotationRequest.breadthFt} Ft (${calculatedAreaSqft.toLocaleString()} Sq.Ft). Duration: ${quotationRequest.tenureMonths} Month(s). ${quotationRequest.notes || ''}`.trim(),
      ownerReply: ''
    };

    setQuotations(prev => [newQuot, ...prev]);
    setLastSubmittedQuotation(newQuot);
    setIsQuotationFormCollapsed(true);
    setSuccessBanner(`✅ Quotation requirement "${newQuot.quotationNo}" for "${enteredSite}" submitted!`);
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

  // Client Deletes an Individual Older Quotation Request
  const handleDeleteQuotation = (quotationId, quotationNo) => {
    const displayLabel = quotationNo || quotationId;
    if (!window.confirm(`Are you sure you want to delete quotation request "${displayLabel}"?\n\nThis will remove the quotation and work order details permanently.`)) {
      return;
    }

    setQuotations(prev => prev.filter(q => q.id !== quotationId && q.quotationNo !== quotationId));

    if (lastSubmittedQuotation?.id === quotationId || lastSubmittedQuotation?.quotationNo === quotationNo) {
      setLastSubmittedQuotation(null);
      setIsQuotationFormCollapsed(false);
    }

    setSuccessBanner(`🗑️ Quotation "${displayLabel}" deleted successfully.`);
  };

  // Client Deletes All Older Quotations
  const handleDeleteAllClientQuotations = () => {
    if (!clientQuotations.length) return;
    const count = clientQuotations.length;
    if (!window.confirm(`Are you sure you want to delete all ${count} older quotation request(s) for this account?\n\nThis action cannot be undone.`)) {
      return;
    }

    const toDeleteIds = new Set(clientQuotations.map(q => q.id));
    const toDeleteNos = new Set(clientQuotations.map(q => q.quotationNo));

    setQuotations(prev => prev.filter(q => !toDeleteIds.has(q.id) && !toDeleteNos.has(q.quotationNo)));
    setLastSubmittedQuotation(null);
    setIsQuotationFormCollapsed(false);
    setSuccessBanner(`🗑️ All ${count} older quotation requests deleted successfully.`);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '640px', margin: '0 auto', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ========================================================================= */}
      {/* SLIDE NAVIGATION BAR: SEPARATE PAGES LIKE SLIDES                         */}
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
          gap: '4px',
          overflowX: 'auto'
        }}
      >
        {/* Slide Tab 2: Projects & Sites (Matching Screenshot) */}
        <button
          type="button"
          className={`btn ${activeSlide === 'projects' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            flex: 1,
            borderRadius: '8px',
            border: activeSlide === 'projects' ? 'none' : '1px solid transparent',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            minWidth: '150px',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSlide('projects')}
        >
          <Building2 size={15} />
          <span>Projects & Sites</span>
          <span style={{ 
            background: activeSlide === 'projects' ? 'rgba(255,255,255,0.25)' : '#f3f4f6', 
            color: activeSlide === 'projects' ? '#ffffff' : '#4b5563',
            fontSize: '0.7rem', 
            padding: '2px 7px', 
            borderRadius: '999px',
            fontWeight: 800 
          }}>
            {clientSites.length}
          </span>
        </button>

        {/* Slide Tab 1: Request Quotation */}
        <button
          type="button"
          className={`btn ${activeSlide === 'request' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            flex: 1,
            borderRadius: '8px',
            border: activeSlide === 'request' ? 'none' : '1px solid transparent',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            minWidth: '150px',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSlide('request')}
        >
          <Send size={15} />
          <span>Request Quotation</span>
        </button>

        {/* Slide Tab 3: Daily Worker Progress Approval */}
        <button
          type="button"
          className={`btn ${activeSlide === 'worker_progress' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            flex: 1,
            borderRadius: '8px',
            border: activeSlide === 'worker_progress' ? 'none' : '1px solid transparent',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            minWidth: '160px',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSlide('worker_progress')}
        >
          <HardHat size={15} />
          <span>Daily Labour & Billing</span>
          {pendingApprovalsCount > 0 ? (
            <span style={{ background: '#e11d48', color: '#ffffff', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '999px', fontWeight: 800 }}>
              {pendingApprovalsCount}
            </span>
          ) : (
            <span style={{ 
              background: activeSlide === 'worker_progress' ? 'rgba(255,255,255,0.25)' : '#f3f4f6', 
              color: activeSlide === 'worker_progress' ? '#ffffff' : '#4b5563',
              fontSize: '0.7rem', 
              padding: '2px 7px', 
              borderRadius: '999px',
              fontWeight: 800 
            }}>
              {clientWorkerLogs.length}
            </span>
          )}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
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
                    { id: 'labour', label: 'Labour & Billing' },
                    { id: 'all', label: 'All' },
                    { id: 'out', label: 'Out' },
                    { id: 'in', label: 'In' },
                    { id: 'balance', label: 'Balance' },
                    { id: 'bills', label: 'Bills' },
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

                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {siteQuotations.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#fff', fontSize: '0.76rem' }}
                                onClick={() => {
                                  if (window.confirm(`Delete all ${siteQuotations.length} older quotations for ${selectedSiteForDetails.name}?`)) {
                                    const toDel = new Set(siteQuotations.map(q => q.id));
                                    const toDelNos = new Set(siteQuotations.map(q => q.quotationNo));
                                    setQuotations(prev => prev.filter(q => !toDel.has(q.id) && !toDelNos.has(q.quotationNo)));
                                    setSuccessBanner(`🗑️ All ${siteQuotations.length} quotations for ${selectedSiteForDetails.name} deleted.`);
                                  }
                                }}
                              >
                                <Trash2 size={13} />
                                <span>Delete All Older ({siteQuotations.length})</span>
                              </button>
                            )}

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
                                      <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#fff', padding: '0.25rem 0.55rem', fontSize: '0.74rem' }}
                                        onClick={() => handleDeleteQuotation(quot.id, quot.quotationNo)}
                                        title="Delete this older quotation"
                                      >
                                        <Trash2 size={13} />
                                        <span>Delete</span>
                                      </button>
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
                                      <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#fff' }}
                                        onClick={() => handleDeleteQuotation(quot.id, quot.quotationNo)}
                                      >
                                        <Trash2 size={13} />
                                        <span>Delete Quotation</span>
                                      </button>

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

                  {/* TAB: DAILY LABOUR WORK, BILLING & APPROVED THINGS FOR THIS SITE */}
                  {siteDetailsActiveTab === 'labour' && (() => {
                    const siteNameTarget = (selectedSiteForDetails.name || '').toLowerCase();
                    const siteLogs = clientWorkerLogs.filter(l => 
                      (l.siteName || '').toLowerCase().includes(siteNameTarget) || 
                      siteNameTarget.includes((l.siteName || '').toLowerCase())
                    );

                    const siteApprovedLogs = siteLogs.filter(l => l.status === 'approved');
                    const sitePendingLogs = siteLogs.filter(l => l.status === 'pending_approval');
                    const siteTotalApprovedBilling = siteApprovedLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
                    const siteTotalApprovedArea = siteApprovedLogs.reduce((sum, l) => sum + (Number(l.areaCompletedSqft) || 0), 0);
                    const siteTotalPendingBilling = sitePendingLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);

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
                              <span>Daily Labour Work, Billing & Approvals</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              Site: <strong>{selectedSiteForDetails.name}</strong> • Crew staging logs, certified approvals, and labor billing in one section
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
                              <span>Labour Bill Statement</span>
                            </button>

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

                        {/* 4 Summary KPI Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                          <div style={{ background: '#ffffff', border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #10b981' }}>
                            <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>CERTIFIED LABOUR BILL</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#065f46', marginTop: '2px' }}>
                              ₹{siteTotalApprovedBilling.toLocaleString('en-IN')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              {siteTotalApprovedArea.toLocaleString()} Sq.Ft Certified
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

                          <div style={{ background: '#ffffff', border: '1.5px solid #fecdd3', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #e11d48' }}>
                            <div style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 700 }}>PENDING APPROVALS</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#9f1239', marginTop: '2px' }}>
                              {sitePendingLogs.length} Logs
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              Valued at ₹{siteTotalPendingBilling.toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', borderLeft: '4px solid #64748b' }}>
                            <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700 }}>LABOUR RATE</div>
                            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e293b', marginTop: '2px' }}>
                              ₹{labourRatePerSqft}/Sq.Ft
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                              Slab Staging Rate
                            </div>
                          </div>
                        </div>

                        {/* Sub-Tabs: All Labour Work, Pending Sign-off, Approved Things, Labour Billing */}
                        <div style={{
                          display: 'flex',
                          gap: '0.35rem',
                          background: '#f1f5f9',
                          padding: '3px',
                          borderRadius: '8px',
                          overflowX: 'auto'
                        }}>
                          {[
                            { id: 'all', label: `All Labour Work (${siteLogs.length})` },
                            { id: 'pending', label: `⏱ Pending Sign-Off (${sitePendingLogs.length})` },
                            { id: 'approved', label: `✓ Approved Things (${siteApprovedLogs.length})` },
                            { id: 'billing', label: `💵 Labour Billing Table` }
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

                        {/* SUB-TAB: BILLING TABLE */}
                        {labourBillingActiveSubTab === 'billing' ? (
                          <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ padding: '0.75rem 0.85rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#111827' }}>
                                Site Labour Work Billing Breakdown
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                                <span style={{ color: '#64748b' }}>Rate:</span>
                                <input
                                  type="number"
                                  className="form-input mono"
                                  style={{ width: '65px', padding: '2px 6px', fontSize: '0.78rem', textAlign: 'center' }}
                                  value={labourRatePerSqft}
                                  onChange={(e) => setLabourRatePerSqft(Number(e.target.value) || 0)}
                                />
                                <span style={{ color: '#64748b' }}>₹/Sq.Ft</span>
                              </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                                <thead>
                                  <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '7px 10px' }}>Date</th>
                                    <th style={{ padding: '7px 10px' }}>Work / Floor</th>
                                    <th style={{ padding: '7px 10px' }}>Gang / Crew</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'right' }}>Area (Sq.Ft)</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'right' }}>Rate (₹)</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'right' }}>Labour Bill (₹)</th>
                                    <th style={{ padding: '7px 10px', textAlign: 'center' }}>Approval Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {siteLogs.map((log) => {
                                    const logBilling = calculateLabourBilling(log);
                                    const isApproved = log.status === 'approved';
                                    return (
                                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '7px 10px', fontWeight: 600 }}>{log.date}</td>
                                        <td style={{ padding: '7px 10px' }}>
                                          <strong>{log.workType}</strong>
                                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.floorLevel}</div>
                                        </td>
                                        <td style={{ padding: '7px 10px' }}>{log.workerName} ({log.laborCount} crew)</td>
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{log.areaCompletedSqft}</td>
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{labourRatePerSqft}</td>
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: isApproved ? '#059669' : '#d97706' }}>
                                          ₹{logBilling.toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                                          <span className={`badge ${isApproved ? 'badge-gst' : 'badge-non-gst'}`} style={{ fontSize: '0.66rem' }}>
                                            {isApproved ? '✓ APPROVED' : '⏱ PENDING'}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                <tfoot>
                                  <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #e2e8f0' }}>
                                    <td colSpan="3" style={{ padding: '9px 10px' }}>TOTAL CERTIFIED LABOUR BILL:</td>
                                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{siteTotalApprovedArea.toLocaleString()}</td>
                                    <td style={{ padding: '9px 10px' }}></td>
                                    <td style={{ padding: '9px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#047857', fontSize: '0.94rem' }}>
                                      ₹{siteTotalApprovedBilling.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '9px 10px', textAlign: 'center', color: '#059669', fontSize: '0.72rem' }}>
                                      {siteApprovedLogs.length} Approved Things
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        ) : (
                          /* CARDS LIST FOR ALL, PENDING, OR APPROVED THINGS */
                          displayLogs.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {displayLogs.map((log) => {
                                const isApproved = log.status === 'approved';
                                const isPending = log.status === 'pending_approval';
                                const logBilling = calculateLabourBilling(log);

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
                                        <div style={{ textAlign: 'right' }}>
                                          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>LABOUR BILL</div>
                                          <div className="mono" style={{ fontSize: '0.92rem', fontWeight: 900, color: isApproved ? '#059669' : '#d97706' }}>
                                            ₹{logBilling.toLocaleString('en-IN')}
                                          </div>
                                        </div>

                                        <span className={`badge ${isApproved ? 'badge-gst' : isPending ? 'badge-non-gst' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                                          {isApproved ? '✓ APPROVED THING' : isPending ? '⏱ PENDING' : 'REVISION'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Crew & Area Bar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.45rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', margin: '0.5rem 0' }}>
                                      <div>Gang / In-charge: <strong>{log.workerName}</strong> ({log.laborCount} crew • {log.hoursWorked || 8}h)</div>
                                      <div className="mono" style={{ fontWeight: 800, color: 'var(--orange-primary)' }}>
                                        {log.areaCompletedSqft} Sq.Ft (@ ₹{labourRatePerSqft}/ft)
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
                                        <div style={{ marginTop: '3px', fontWeight: 700, color: '#065f46' }}>
                                          Approved Billed Amount: ₹{logBilling.toLocaleString('en-IN')} (Certified for payment release)
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
                                          <span>Approve Daily Work & Certify Bill (₹{logBilling.toLocaleString('en-IN')})</span>
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
                                Click "+ Record Daily Labour" above to log work and generate billing.
                              </p>
                            </div>
                          )
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

                  {/* TAB: BILLS (SCREENSHOT 3) */}
                  {siteDetailsActiveTab === 'bills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {/* Warning Notice Banner from Screenshot 3 */}
                      <div style={{
                        background: '#ffffff',
                        padding: '0.75rem 1rem',
                        fontSize: '0.86rem',
                        color: '#111827',
                        lineHeight: 1.35
                      }}>
                        {siteData.billsTotalDiffWarning}
                      </div>

                      {/* Invoice Rows */}
                      <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filteredBills.map((b, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#000000' }}>No: {b.invNo}</div>
                              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>{b.period}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#000000' }}>{b.amountStr}</span>
                            </div>
                          </div>
                        ))}

                        <div style={{ height: '1px', background: '#e5e7eb', margin: '0.25rem 0' }} />

                        {/* Total Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1rem', color: '#000000' }}>
                          <span>Total</span>
                          <span>{siteData.bills[0]?.amountStr || '₹ 26,55,000'}</span>
                        </div>
                      </div>
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

            {/* 2. DARK NAVY CLIENT CAPSULE BAR: User Icon + Company Name + WhatsApp + New site */}
            <div style={{
              background: '#2e4255',
              border: '2px solid #203548',
              borderRadius: '9999px',
              padding: '5px 6px 5px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              marginBottom: '0.9rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', paddingLeft: '2px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  background: '#2e4255',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={19} strokeWidth={2.4} />
                </div>
                <span style={{ 
                  fontWeight: 800, 
                  fontSize: '0.85rem', 
                  letterSpacing: '0.01em', 
                  textTransform: 'uppercase', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  maxWidth: '240px'
                }}>
                  {currentUser?.companyName && currentUser.companyName !== 'Temporary Construction Ltd' 
                    ? currentUser.companyName 
                    : 'ASG WIN INDIA PRIVATE LI...'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
                {/* WhatsApp White Speech Bubble with dark navy phone icon */}
                <a 
                  href={`https://wa.me/${(currentUser?.phone || '+919820099999').replace(/[^0-9]/g, '')}?text=Hello%20ScaffBuild%20Team`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    flexShrink: 0
                  }}
                  title="Chat on WhatsApp"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.07L2 22L7.07 20.67C8.52 21.52 10.21 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#ffffff" />
                    <path d="M16.5 14.5C16.2 14.3 14.8 13.6 14.6 13.5C14.3 13.4 14.1 13.4 14 13.6C13.8 13.8 13.4 14.3 13.2 14.5C13.1 14.6 12.9 14.6 12.7 14.5C12.1 14.2 11.2 13.8 10.3 12.9C9.5 12.2 9.1 11.4 8.9 11C8.8 10.8 8.9 10.6 9 10.5C9.1 10.4 9.2 10.2 9.4 10.1C9.5 9.9 9.5 9.8 9.6 9.6C9.7 9.5 9.6 9.3 9.6 9.2C9.5 9.1 9.1 8 8.9 7.6C8.7 7.1 8.5 7.2 8.3 7.2L7.9 7.2C7.7 7.2 7.4 7.3 7.2 7.5C6.9 7.8 6.3 8.4 6.3 9.6C6.3 10.7 7.2 11.8 7.3 12C7.5 12.1 9 14.6 11.3 15.6C13.2 16.4 13.8 16.3 14.4 16.2C15.1 16.1 16.3 15.4 16.6 14.7C16.8 14 16.8 13.5 16.7 13.4C16.6 13.3 16.7 14.6 16.5 14.5Z" fill="#2e4255" />
                  </svg>
                </a>

                {/* New Site Pill Button */}
                <button
                  type="button"
                  onClick={() => setIsNewSiteModalOpen(true)}
                  style={{
                    background: '#ffffff',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '5px 14px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  New site
                </button>
              </div>
            </div>

            {/* 3. SITE CARDS LIST (EXACT MATCH TO 1ST SCREENSHOT) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
              ) : (
                filteredSites.map((site, index) => (
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
                  {/* Building Name */}
                  <div style={{ 
                    fontSize: '1.02rem', 
                    fontWeight: 800, 
                    color: '#000000', 
                    lineHeight: 1.35,
                    marginBottom: '0.35rem'
                  }}>
                    Building: {site.name}
                  </div>

                  {/* Subline: # 1   Due: 62,500₹   65 pcs   26 Oct 26 ⋮ */}
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
                        Due: {(site.dueAmount || (index === 0 ? 62500 : 1484000)).toLocaleString('en-IN')}₹
                      </span>
                      <span style={{ fontSize: '0.92rem', color: '#111827', fontWeight: 500 }}>
                        {site.totalPcs || (index === 0 ? 65 : 260)} pcs
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 500 }}>
                        {site.lastDate || (index === 0 ? '26 Oct 26' : '1 Oct 26')}
                      </span>
                    </div>
                  </div>

                  {/* Salmon / Rose Badge: Sqft Area Mix (#ef8697) */}
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
                      {site.badgeType || 'Sqft Area Mix'}
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
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              )))}
            </div>

          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* SLIDE 1: REQUEST MATERIAL QUOTATION                                       */}
      {/* ========================================================================= */}
      {activeSlide === 'request' && (
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
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#ffffff', fontWeight: 700 }}
                  onClick={() => handleDeleteQuotation(lastSubmittedQuotation.id, lastSubmittedQuotation.quotationNo)}
                >
                  <Trash2 size={14} />
                  <span>Delete Quotation ({lastSubmittedQuotation.quotationNo})</span>
                </button>

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
                    View status, commercial rates, or delete older quotation requests and staging inquiries
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {clientQuotations.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#e11d48', borderColor: '#fca5a5', background: '#ffffff', fontWeight: 700, fontSize: '0.78rem' }}
                      onClick={handleDeleteAllClientQuotations}
                      title="Delete all older quotation requests"
                    >
                      <Trash2 size={13} />
                      <span>Delete All Older ({clientQuotations.length})</span>
                    </button>
                  )}
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

                            {/* Direct Delete button */}
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
                              title="Delete this older quotation request"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
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
                              {/* Prominent Delete Quotation Button */}
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
      {/* SLIDE 3: DAILY LABOUR WORK, BILLING & APPROVED THINGS HUB                 */}
      {/* ========================================================================= */}
      {activeSlide === 'worker_progress' && (() => {
        const filteredLogs = selectedSiteFilter === 'ALL'
          ? clientWorkerLogs
          : clientWorkerLogs.filter(l => (l.siteName || '').toLowerCase().includes(selectedSiteFilter.toLowerCase()) || selectedSiteFilter.toLowerCase().includes((l.siteName || '').toLowerCase()));

        const approvedLogs = filteredLogs.filter(l => l.status === 'approved');
        const pendingLogs = filteredLogs.filter(l => l.status === 'pending_approval');
        const totalApprovedBilling = approvedLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
        const totalApprovedArea = approvedLogs.reduce((sum, l) => sum + (Number(l.areaCompletedSqft) || 0), 0);
        const totalPendingBilling = pendingLogs.reduce((sum, l) => sum + calculateLabourBilling(l), 0);
        const totalCrewDays = filteredLogs.reduce((sum, l) => sum + (Number(l.laborCount) || 1), 0);

        const displayLogs = labourBillingActiveSubTab === 'approved' 
          ? approvedLogs 
          : labourBillingActiveSubTab === 'pending' 
            ? pendingLogs 
            : filteredLogs;

        return (
          <section id="client-worker-progress-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* 1. Header with Title & Action Buttons */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.15rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HardHat size={20} color="var(--orange-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                    Daily Labour Work, Billing & Approvals
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  Track crew progress, inspect & certify completed staging work, and compute official labour billing in one unified section
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{
                    fontSize: '0.8rem',
                    background: '#ffffff',
                    color: '#111827',
                    borderColor: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    fontWeight: 700
                  }}
                  onClick={() => setIsLabourStatementModalOpen(true)}
                >
                  <FileText size={15} color="var(--orange-primary)" />
                  <span>View Labour Bill Statement</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem'
                  }}
                  onClick={() => setIsAddLabourModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>+ Record Daily Labour</span>
                </button>
              </div>
            </div>

            {/* 2. Site Filter Pills */}
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

            {/* 3. Four Core Metrics (Certified Bill, Approved Things, Pending Approvals, Rate) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {/* Card 1: Certified Labour Bill */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #a7f3d0',
                borderRadius: '12px',
                padding: '0.9rem',
                borderLeft: '5px solid #10b981',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 800 }}>CERTIFIED LABOUR BILL</span>
                  <CreditCard size={15} color="#059669" />
                </div>
                <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#065f46', marginTop: '4px' }}>
                  ₹{totalApprovedBilling.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '3px' }}>
                  {totalApprovedArea.toLocaleString()} Sq.Ft Certified
                </div>
              </div>

              {/* Card 2: Approved Things */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #fed7aa',
                borderRadius: '12px',
                padding: '0.9rem',
                borderLeft: '5px solid var(--orange-primary)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: 800 }}>APPROVED THINGS</span>
                  <CheckCircle2 size={15} color="var(--orange-primary)" />
                </div>
                <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#9a3412', marginTop: '4px' }}>
                  {approvedLogs.length} Certified
                </div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '3px' }}>
                  Quality Inspected & Certified
                </div>
              </div>

              {/* Card 3: Pending Approvals */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #fecdd3',
                borderRadius: '12px',
                padding: '0.9rem',
                borderLeft: '5px solid #e11d48',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#be123c', fontWeight: 800 }}>PENDING SIGN-OFF</span>
                  <Clock size={15} color="#e11d48" />
                </div>
                <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#9f1239', marginTop: '4px' }}>
                  {pendingLogs.length} Awaiting
                </div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '3px' }}>
                  Estimated Value: ₹{totalPendingBilling.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Card 4: Labour Billing Rate Customizer */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.9rem',
                borderLeft: '5px solid #64748b',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 800 }}>LABOUR RATE SETTING</span>
                  <Ruler size={15} color="#64748b" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '4px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>₹</span>
                  <input
                    type="number"
                    className="form-input mono"
                    style={{ width: '70px', padding: '3px 6px', fontSize: '1.05rem', fontWeight: 800, textAlign: 'center' }}
                    value={labourRatePerSqft}
                    onChange={(e) => setLabourRatePerSqft(Number(e.target.value) || 0)}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>/ Sq.Ft</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                  Live rate recalculates all bills
                </div>
              </div>
            </div>

            {/* 4. Sub-Navigation Tabs within this One Section */}
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
                { id: 'all', label: `All Labour Work (${filteredLogs.length})` },
                { id: 'pending', label: `⏱ Pending Sign-Off (${pendingLogs.length})` },
                { id: 'approved', label: `✓ Approved Things (${approvedLogs.length})` },
                { id: 'billing', label: `💵 Labour Billing & Statement` }
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

            {/* 5. Sub-Tab Content */}

            {/* VIEW A: LABOUR BILLING TABLE & STATEMENT */}
            {labourBillingActiveSubTab === 'billing' && (
              <div style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  padding: '0.85rem 1.15rem',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.65rem'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                      Certified Labour Billing & Measurement Sheet
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      Itemized calculation based on verified staging area and certified gang logs
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                      onClick={() => window.print()}
                    >
                      <Printer size={14} />
                      <span>Print Table</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                      onClick={() => setIsLabourStatementModalOpen(true)}
                    >
                      <FileText size={14} />
                      <span>Formal Bill Statement</span>
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>Date</th>
                        <th style={{ padding: '8px 12px' }}>Project Site</th>
                        <th style={{ padding: '8px 12px' }}>Work Description & Floor</th>
                        <th style={{ padding: '8px 12px' }}>Gang Leader / Crew</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Certified Area</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Labour Rate</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Billed Amount (₹)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center' }}>Approval & Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => {
                        const logBilling = calculateLabourBilling(log);
                        const isApproved = log.status === 'approved';
                        return (
                          <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', background: isApproved ? '#fafdfb' : '#ffffff' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{log.date}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 700, color: '#111827' }}>{log.siteName}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <strong>{log.workType}</strong>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.floorLevel}</div>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              {log.workerName}
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.laborCount} crew • {log.hoursWorked || 8} hrs</div>
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                              {log.areaCompletedSqft} Sq.Ft
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                              ₹{labourRatePerSqft}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800, color: isApproved ? '#059669' : '#d97706', fontSize: '0.88rem' }}>
                              ₹{logBilling.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <span className={`badge ${isApproved ? 'badge-gst' : 'badge-non-gst'}`} style={{ fontSize: '0.68rem' }}>
                                {isApproved ? '✓ CERTIFIED' : '⏱ PENDING'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #cbd5e1' }}>
                        <td colSpan="4" style={{ padding: '10px 12px', fontSize: '0.85rem' }}>
                          TOTAL CERTIFIED LABOUR BILL ({approvedLogs.length} Approved Things):
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--orange-primary)' }}>
                          {totalApprovedArea.toLocaleString()} Sq.Ft
                        </td>
                        <td style={{ padding: '10px 12px' }}></td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#047857', fontSize: '1.05rem' }}>
                          ₹{totalApprovedBilling.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#059669', fontSize: '0.74rem' }}>
                          Sign-Off Verified
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW B: CARDS FOR ALL, PENDING, OR APPROVED THINGS */}
            {labourBillingActiveSubTab !== 'billing' && (
              displayLogs.length > 0 ? (
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
                    Click "+ Record Daily Labour" above to log staging progress and generate certified billing.
                  </p>
                </div>
              )
            )}

          </section>
        );
      })()}

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
      {isLabourStatementModalOpen && (() => {
        const statementLogs = selectedSiteFilter === 'ALL'
          ? clientWorkerLogs
          : clientWorkerLogs.filter(l => (l.siteName || '').toLowerCase().includes(selectedSiteFilter.toLowerCase()) || selectedSiteFilter.toLowerCase().includes((l.siteName || '').toLowerCase()));
        
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
