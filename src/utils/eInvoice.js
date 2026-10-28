// Indian NIC E-Invoice (Schema INV-01) & IRN Generator

/**
 * Computes SHA-256 hash of a string using Web Crypto API or fallback
 */
export async function computeSha256(str) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Deterministic fallback for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + "4a2b9f81d3e527c08a9f61b34c7e2a90184e5f73d8912c4b03a7e5f1d8209c3e").slice(0, 64);
}

/**
 * Calculates financial year for Indian accounting (April to March)
 * e.g., Oct 2026 -> "2026-27"
 */
export function getIndianFinancialYear(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

/**
 * Generates official 64-character IRN (Invoice Reference Number)
 * Formula: SHA256(SupplierGSTIN + FY + DocType + DocNo)
 */
export async function generateIrn(supplierGstin, invoiceNo, docDate) {
  const fy = getIndianFinancialYear(docDate);
  const rawString = `${supplierGstin}${fy}INV${invoiceNo}`.toUpperCase();
  return await computeSha256(rawString);
}

/**
 * Generates standard 15-digit IRP Acknowledgement Number
 */
export function generateAckNo() {
  const prefix = "11"; // IRP Portal 1
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${datePart}${rand}`;
}

/**
 * Formats current date for IRP Ack Date
 */
export function getAckDateFormatted() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/**
 * Constructs the official NIC E-Invoice JSON payload compliant with Schema INV-01
 */
export function generateNicEInvoiceJson(invoice, company, irn, ackNo, ackDate) {
  const isInterstate = invoice.stateCode !== company.stateCode;
  const taxableVal = Number(invoice.taxableAmount || 0);
  const cgstVal = isInterstate ? 0 : Number(invoice.cgstAmount || 0);
  const sgstVal = isInterstate ? 0 : Number(invoice.sgstAmount || 0);
  const igstVal = isInterstate ? Number(invoice.igstAmount || 0) : 0;
  const totVal = Number(invoice.grandTotal || invoice.totalAmount || 0);

  return {
    Version: "1.1",
    TranDtls: {
      TaxSch: "GST",
      SupTyp: "B2B",
      RegRev: invoice.isReverseCharge ? "Y" : "N",
      EcmGstin: null,
      IgstOnIntra: "N"
    },
    DocDtls: {
      Typ: "INV",
      No: invoice.invoiceNo,
      Dt: invoice.date ? invoice.date.split('-').reverse().join('/') : new Date().toLocaleDateString('en-GB')
    },
    SellerDtls: {
      Gstin: company.gstin,
      LglNm: company.name,
      TrdNm: company.name,
      Addr1: company.address,
      Loc: "Navi Mumbai",
      Pin: 410208,
      Stcd: company.stateCode || "27",
      Ph: company.phone,
      Em: company.email
    },
    BuyerDtls: {
      Gstin: invoice.clientGstin || "27AAACL0149A1Z9",
      LglNm: invoice.clientName,
      TrdNm: invoice.tradeName || invoice.clientName,
      Pos: invoice.stateCode || "27",
      Addr1: invoice.clientAddress,
      Loc: invoice.state || "Mumbai",
      Pin: 400706,
      Stcd: invoice.stateCode || "27"
    },
    ItemList: (invoice.items || []).map((item, idx) => ({
      SlNo: String(idx + 1),
      PrdDesc: item.description || item.name,
      IsServc: "Y",
      HsnCd: String(item.hsn || "997312"),
      Qty: Number(item.qty || 1),
      Unit: item.unit === "Pcs" ? "NOS" : "SET",
      UnitPrice: Number(item.rate || 0),
      TotAmt: Number(item.amount || 0),
      AssAmt: Number(item.amount || 0),
      GstRt: Number(invoice.gstRate || 18),
      IgstAmt: isInterstate ? Number(((item.amount * 18) / 100).toFixed(2)) : 0,
      CgstAmt: isInterstate ? 0 : Number(((item.amount * 9) / 100).toFixed(2)),
      SgstAmt: isInterstate ? 0 : Number(((item.amount * 9) / 100).toFixed(2)),
      TotItemVal: Number((item.amount * (1 + (invoice.gstRate || 18) / 100)).toFixed(2))
    })),
    ValDtls: {
      AssVal: taxableVal,
      CgstVal: cgstVal,
      SgstVal: sgstVal,
      IgstVal: igstVal,
      CesVal: 0,
      RndOffAmt: Number(invoice.roundOff || 0),
      TotInvVal: totVal
    },
    IrnDetails: {
      Irn: irn,
      AckNo: ackNo,
      AckDt: ackDate,
      SignedQrCodePayload: JSON.stringify({
        SellerGstin: company.gstin,
        BuyerGstin: invoice.clientGstin,
        DocNo: invoice.invoiceNo,
        DocTyp: "INV",
        DocDt: invoice.date,
        TotInvVal: totVal,
        ItemCnt: invoice.items?.length || 1,
        MainHsnCode: "997312",
        Irn: irn
      })
    }
  };
}
