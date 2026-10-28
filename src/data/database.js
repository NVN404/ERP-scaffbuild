// Centralized In-Browser Database with LocalStorage Persistence for 3 User Roles:
// 1. Company Owner (ERP)
// 2. Client / Builder (Project Sites, Quotations, Work Orders, Worker Approval)
// 3. Worker / Site Supervisor (Daily Work Upload, Attendance, Service Delivery)

import { 
  DEFAULT_COMPANY, 
  INITIAL_INVENTORY, 
  INITIAL_CLIENTS, 
  INITIAL_CHALLANS, 
  INITIAL_INVOICES 
} from './defaultData';

export const INITIAL_USERS = [
  {
    id: "usr_owner_santosh",
    role: "owner", // 'owner', 'client', 'worker'
    name: "Santosh",
    username: "santosh",
    title: "Owner & Managing Director",
    companyName: "ScaffBuild Shuttering & Scaffolding Co.",
    email: "santosh@scaffbuild.com",
    phone: "+91 98201 54321",
    avatar: "👑"
  },
  {
    id: "usr_client_1",
    role: "client",
    name: "Amit Patil",
    title: "Procurement & Site Head",
    companyName: "Shapoorji Pallonji Construction",
    clientProfileId: "CLI-002",
    email: "client@shapoorji.com",
    phone: "+91 98112 34567",
    gstin: "27AAACS1234M1Z8",
    avatar: "🏢",
    sites: [
      {
        id: "site_sp_1",
        name: "SP Imperial Tower B & C",
        location: "Sector 20, Kharghar, Navi Mumbai",
        city: "Navi Mumbai",
        state: "Maharashtra",
        siteEngineer: "Er. Amit Patil",
        phone: "+91 98112 34567",
        active: true,
        slabAreaSqft: 18500
      },
      {
        id: "site_sp_2",
        name: "Kharghar Valley Commercial Plaza",
        location: "Near Central Park, Kharghar",
        city: "Navi Mumbai",
        state: "Maharashtra",
        siteEngineer: "Sanjay More",
        phone: "+91 98334 11223",
        active: true,
        slabAreaSqft: 9200
      }
    ]
  },
  {
    id: "356bb2cd-ee50-42d6-ae58-97952b9f5dfe",
    role: "client",
    name: "ASG WIN INDIA Project Head",
    title: "Project Procurement Head",
    companyName: "ASG WIN INDIA PRIVATE LIMITED",
    clientProfileId: "CLI-ASG-01",
    email: "tempory2911@gmail.com",
    phone: "+91 98200 99999",
    gstin: "29AABCA1234F1Z5",
    avatar: "🏢",
    sites: [
      {
        id: "site_icon_micasa",
        name: "ICON MICASA JIGANI BOMMAANDRA LINK ROAD",
        location: "Jigani Bommasandra Link Road, Industrial Area",
        city: "Bangalore",
        state: "Karnataka",
        siteEngineer: "Er. Rajesh Patil",
        phone: "+91 98200 99999",
        dueAmount: 62500,
        totalPcs: 65,
        ratePerSqft: 3,
        balanceAreaSqft: 25000,
        lastDate: "26 Oct 26",
        badgeType: "Sqft Area Mix",
        active: true,
        slabAreaSqft: 18500
      },
      {
        id: "site_greenwood",
        name: "GREEN Wood High School",
        location: "Sarjapur Main Road, Chikkawadayarapura",
        city: "Bangalore",
        state: "Karnataka",
        siteEngineer: "Sanjay More",
        phone: "+91 98334 11223",
        dueAmount: 1484000,
        totalPcs: 260,
        ratePerSqft: 3,
        balanceAreaSqft: 20000,
        lastDate: "1 Oct 26",
        badgeType: "Sqft Area Mix",
        active: true,
        slabAreaSqft: 24000
      }
    ]
  },
  {
    id: "usr_worker_1",
    role: "worker",
    name: "Sunil Kumar",
    trade: "Senior Shuttering & Scaffolding Foreman",
    workerCode: "WRK-108",
    email: "worker@scaffbuild.com",
    phone: "+91 97654 88210",
    assignedSites: ["SP Imperial Tower B & C", "Navi Mumbai Metro Line 1"],
    avatar: "👷",
    skills: ["Slab Staging", "Cuplock Erection", "Safety Harness Level 2"]
  }
];

export const INITIAL_QUOTATIONS = [
  {
    id: "QUOT-2026-081",
    quotationNo: "QT/26-27/081",
    clientId: "usr_client_1",
    clientName: "Shapoorji Pallonji Construction",
    contactPerson: "Amit Patil",
    siteName: "SP Imperial Tower B & C",
    date: "2026-10-20",
    validTill: "2026-11-05",
    status: "work_order_created", // 'requested', 'quotation_sent', 'work_order_created', 'rejected'
    workOrderNo: "WO/SP/2026/042",
    requestedAreaSqft: 8500,
    requestedVolumeCum: 750,
    items: [
      { name: "MS Shuttering Plates 900x600 mm", qty: 600, unit: "Pcs", ratePerDay: 1.5, days: 30, amount: 27000 },
      { name: "Telescopic Steel Props 2.0m to 3.5m", qty: 450, unit: "Pcs", ratePerDay: 3.5, days: 30, amount: 47250 },
      { name: "Acrow Telescopic Spans (2.5m - 4.2m)", qty: 120, unit: "Pcs", ratePerDay: 6.0, days: 30, amount: 21600 },
      { name: "Adjustable Stirrup Head U-Jacks", qty: 450, unit: "Pcs", ratePerDay: 1.0, days: 30, amount: 13500 }
    ],
    transportFreight: 5000,
    loadingHamali: 3000,
    taxableAmount: 112350,
    gstRate: 18,
    gstAmount: 20223,
    grandTotal: 132573,
    clientNotes: "Need material delivery at Tower B 4th floor slab staging. Please send certified workers for fitting.",
    ownerReply: "Quotation order confirmed with 100% inspected props and plates. Mobilization ready."
  },
  {
    id: "QUOT-2026-084",
    quotationNo: "QT/26-27/084",
    clientId: "usr_client_1",
    clientName: "Shapoorji Pallonji Construction",
    contactPerson: "Amit Patil",
    siteName: "Kharghar Valley Commercial Plaza",
    date: "2026-10-25",
    validTill: "2026-11-10",
    status: "quotation_sent", // awaiting client acceptance
    workOrderNo: "",
    requestedAreaSqft: 5000,
    requestedVolumeCum: 450,
    items: [
      { name: "Cuplock Standard / Vertical 3.0m", qty: 250, unit: "Pcs", ratePerDay: 3.0, days: 30, amount: 22500 },
      { name: "Cuplock Ledger / Horizontal 2.0m", qty: 400, unit: "Pcs", ratePerDay: 1.8, days: 30, amount: 21600 },
      { name: "Steel Walkway Challi 2.0m x 300mm", qty: 120, unit: "Pcs", ratePerDay: 3.5, days: 30, amount: 12600 }
    ],
    transportFreight: 4000,
    loadingHamali: 2000,
    taxableAmount: 62700,
    gstRate: 18,
    gstAmount: 11286,
    grandTotal: 73986,
    clientNotes: "Requirement for exterior facade plastering & glazing staging.",
    ownerReply: "Discounted commercial rate applied for 30 days tenure."
  }
];

export const INITIAL_WORKER_LOGS = [
  {
    id: "WLOG-101",
    date: "2026-10-24",
    workerId: "usr_worker_1",
    workerName: "Sunil Kumar",
    workerPhone: "+91 97654 88210",
    siteName: "ICON MICASA JIGANI BOMMAANDRA LINK ROAD",
    clientCompanyName: "Shapoorji Pallonji Construction",
    clientId: "usr_client_1",
    workType: "Slab Shuttering & Staging", // 'Slab Shuttering & Staging', 'Cuplock Elevation', 'De-shuttering', 'Column Box Clamping'
    floorLevel: "Tower B - 4th Floor Slab",
    workCompletedSummary: "Erected 160 telescopic props, 120 shuttering plates, and cross horizontal pipe lacing for casting prep.",
    areaCompletedSqft: 1450,
    volumeCompletedCum: 130,
    laborCount: 6,
    hoursWorked: 8.5,
    ratePerSqft: 18,
    billingAmount: 26100, // 1450 * 18
    status: "approved", // 'pending_approval', 'approved', 'rejected'
    approvedBy: "Er. Amit Patil (Client Engineer)",
    approvalTimestamp: "2026-10-24 18:45",
    approvalComments: "Inspected by site team. Prop vertical alignment and U-jack level checked and certified. Quality approved.",
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "WLOG-102",
    date: "2026-10-26",
    workerId: "usr_worker_1",
    workerName: "Sunil Kumar",
    workerPhone: "+91 97654 88210",
    siteName: "ICON MICASA JIGANI BOMMAANDRA LINK ROAD",
    clientCompanyName: "Shapoorji Pallonji Construction",
    clientId: "usr_client_1",
    workType: "Slab Shuttering & Staging",
    floorLevel: "Tower B - 4th Floor Slab (Bay 3 & 4)",
    workCompletedSummary: "Completed span joist placing (45 Acrow spans) and fixed 180 plates (900x600). Tape sealed all joints.",
    areaCompletedSqft: 1800,
    volumeCompletedCum: 160,
    laborCount: 7,
    hoursWorked: 8.0,
    ratePerSqft: 18,
    billingAmount: 32400, // 1800 * 18
    status: "pending_approval", // client needs to approve this!
    approvedBy: "",
    approvalTimestamp: "",
    approvalComments: "",
    photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "WLOG-103",
    date: "2026-10-25",
    workerId: "usr_worker_2",
    workerName: "Ramesh Pawar (Gang In-Charge)",
    workerPhone: "+91 98334 55120",
    siteName: "GREEN Wood High School",
    clientCompanyName: "Shapoorji Pallonji Construction",
    clientId: "usr_client_1",
    workType: "Cuplock Elevation & Staging",
    floorLevel: "Main Academic Block - 2nd Floor Slab",
    workCompletedSummary: "Cuplock vertical 3.0m staging erected with ledger pipes 1.5m and jack bases. Beam bottom shuttering aligned.",
    areaCompletedSqft: 2200,
    volumeCompletedCum: 195,
    laborCount: 8,
    hoursWorked: 8.5,
    ratePerSqft: 18,
    billingAmount: 39600, // 2200 * 18
    status: "approved",
    approvedBy: "Er. Amit Patil (Client Engineer)",
    approvalTimestamp: "2026-10-25 19:10",
    approvalComments: "Plumb line verified for all cuplock standards. Solid base plates set on sole runners. Certified for pour.",
    photoUrl: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=500&auto=format&fit=crop&q=60"
  }
];

// Helper to get or initialize database collections
export function getDbCollection(key, initialData) {
  try {
    const saved = localStorage.getItem(`scaffbuild_${key}`);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(`scaffbuild_${key}`, JSON.stringify(initialData));
    return initialData;
  } catch (err) {
    console.warn(`Could not read scaffbuild_${key} from localStorage`, err);
    return initialData;
  }
}

export function saveDbCollection(key, data) {
  try {
    localStorage.setItem(`scaffbuild_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Could not save scaffbuild_${key} to localStorage`, err);
  }
}
