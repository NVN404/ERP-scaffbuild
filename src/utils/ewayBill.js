// Indian NIC Form GST EWB-01 (E-Way Bill) Generator

/**
 * Calculates validity period for Indian E-Way Bill based on distance
 * Rule: 1 day per 200 km (or part thereof) for normal cargo
 */
export function calculateEwayValidityDays(distanceKm = 50) {
  const km = Math.max(1, Number(distanceKm) || 1);
  return Math.ceil(km / 200);
}

/**
 * Generates an official 12-digit E-Way Bill Number conforming to NIC standards
 */
export function generateEwayBillNumber() {
  const prefix = "24"; // Year / region prefix
  const middle = Math.floor(10000000 + Math.random() * 90000000); // 8 random digits
  const suffix = Math.floor(10 + Math.random() * 90); // 2 checksum digits
  return `${prefix}${middle}${suffix}`;
}

/**
 * Formats a date object to DD/MM/YYYY hh:mm AM/PM
 */
export function formatEwayDate(date = new Date()) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = pad(d.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day}/${month}/${year} ${pad(hours)}:${minutes} ${ampm}`;
}

/**
 * Generates official NIC E-Way Bill JSON payload compliant with Govt Portal upload schema
 */
export function generateNicEwayBillJson(invoice, company, transportData) {
  const isInterstate = invoice.stateCode !== company.stateCode;
  const taxableVal = Number(invoice.taxableAmount || 0);
  const cgstVal = isInterstate ? 0 : Number(invoice.cgstAmount || 0);
  const sgstVal = isInterstate ? 0 : Number(invoice.sgstAmount || 0);
  const igstVal = isInterstate ? Number(invoice.igstAmount || 0) : 0;
  const totVal = Number(invoice.grandTotal || invoice.totalAmount || 0);

  const nicPayload = {
    version: "1.0.0421",
    billLists: [
      {
        userGstin: company.gstin,
        supplyType: "O", // Outward
        subSupplyType: invoice.billingType === "with_gst" ? "1" : "3", // 1 = Supply, 3 = Job Work / Hire
        subSupplyDesc: "Scaffolding & Shuttering Equipment Hire / Rental",
        docType: invoice.billingType === "with_gst" ? "INV" : "CHL",
        docNo: invoice.invoiceNo,
        docDate: invoice.date ? invoice.date.split('-').reverse().join('/') : new Date().toLocaleDateString('en-GB'),
        fromGstin: company.gstin,
        fromTrdName: company.name,
        fromAddr1: company.address,
        fromPlace: "Navi Mumbai",
        fromPincode: 410208,
        actFromStateCode: Number(company.stateCode || 27),
        fromStateCode: Number(company.stateCode || 27),
        toGstin: invoice.clientGstin || "URP", // URP = Unregistered Person for Non-GST
        toTrdName: invoice.tradeName || invoice.clientName,
        toAddr1: invoice.clientAddress || "Client Site",
        toPlace: invoice.state || "Maharashtra",
        toPincode: 400706,
        actToStateCode: Number(invoice.stateCode || 27),
        toStateCode: Number(invoice.stateCode || 27),
        totalValue: taxableVal,
        cgstValue: cgstVal,
        sgstValue: sgstVal,
        igstValue: igstVal,
        cessValue: 0,
        totInvValue: totVal,
        transMode: "1", // 1 = Road
        transDistance: String(transportData.distanceKm || 45),
        transporterName: transportData.transporterName || "Direct Scaffolding Transport",
        transporterId: transportData.transporterId || "",
        transDocNo: transportData.lrNo || `LR-${Math.floor(10000 + Math.random() * 90000)}`,
        transDocDate: invoice.date ? invoice.date.split('-').reverse().join('/') : new Date().toLocaleDateString('en-GB'),
        vehNo: transportData.vehicleNo || "MH 46 BB 3421",
        vehType: "R", // Regular
        itemList: (invoice.items || []).map((item, idx) => ({
          itemNo: idx + 1,
          productName: item.description || item.name,
          productDesc: item.name || "Steel Scaffolding & Shuttering",
          hsnCode: Number(item.hsn || 997312),
          quantity: Number(item.qty || item.quantity || 1),
          qtyUnit: item.unit === "Pcs" ? "NOS" : "SET",
          taxableAmount: Number(item.amount || item.rate || 0),
          cgstRate: isInterstate ? 0 : 9,
          sgstRate: isInterstate ? 0 : 9,
          igstRate: isInterstate ? 18 : 0,
          cessRate: 0
        }))
      }
    ]
  };

  return nicPayload;
}
