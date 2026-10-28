// Compliant Consecutive Sequence Number Generator for GST Invoices, Challans, and Quotations
// Replaces fragile Math.random() with deterministic, collision-free numbers

const COUNTERS_KEY = 'scaffbuild_doc_counters';

function getCounters() {
  try {
    const raw = localStorage.getItem(COUNTERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    invoiceGst: 101,
    invoiceNonGst: 101,
    challan: 101,
    quotation: 101,
    request: 101
  };
}

function incrementCounter(type) {
  const counters = getCounters();
  const current = (counters[type] || 100) + 1;
  counters[type] = current;
  try {
    localStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));
  } catch (e) {
    // fallback
  }
  return current;
}

export function generateSequentialInvoiceNo(billingType = 'with_gst', existingInvoices = []) {
  const yearSuffix = '26-27';
  const prefix = billingType === 'with_gst' ? 'SB' : 'EST';
  
  // Calculate highest existing number in records if available
  let maxSeq = 100;
  if (Array.isArray(existingInvoices) && existingInvoices.length > 0) {
    existingInvoices.forEach(inv => {
      if (inv.invoiceNo && inv.invoiceNo.startsWith(prefix)) {
        const parts = inv.invoiceNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
  }

  const nextSeq = Math.max(incrementCounter(billingType === 'with_gst' ? 'invoiceGst' : 'invoiceNonGst'), maxSeq + 1);
  return `${prefix}/${yearSuffix}/${String(nextSeq).padStart(4, '0')}`;
}

export function generateSequentialChallanNo(existingChallans = []) {
  const yearSuffix = '26';
  const prefix = 'DC';
  
  let maxSeq = 100;
  if (Array.isArray(existingChallans) && existingChallans.length > 0) {
    existingChallans.forEach(ch => {
      if (ch.challanNo && ch.challanNo.startsWith(prefix)) {
        const parts = ch.challanNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
  }

  const nextSeq = Math.max(incrementCounter('challan'), maxSeq + 1);
  return `${prefix}/${yearSuffix}/${String(nextSeq).padStart(4, '0')}`;
}

export function generateSequentialQuotationNo(existingQuotations = []) {
  const yearSuffix = '26';
  const prefix = 'QR';
  
  let maxSeq = 100;
  if (Array.isArray(existingQuotations) && existingQuotations.length > 0) {
    existingQuotations.forEach(q => {
      if (q.quotationNo && q.quotationNo.startsWith(prefix)) {
        const parts = q.quotationNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
  }

  const nextSeq = Math.max(incrementCounter('quotation'), maxSeq + 1);
  return `${prefix}/${yearSuffix}/${String(nextSeq).padStart(4, '0')}`;
}
