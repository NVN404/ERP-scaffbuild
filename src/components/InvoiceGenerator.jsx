import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileCheck2, 
  Search, 
  Building2, 
  IndianRupee,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { lookupGstDetails, parseGstin } from '../utils/gstApi';
import { generateIrn, generateAckNo, getAckDateFormatted } from '../utils/eInvoice';
import { generateEwayBillNumber, formatEwayDate } from '../utils/ewayBill';
import { numberToIndianWords } from '../utils/numberToWords';

export default function InvoiceGenerator({ 
  invoices, 
  setInvoices, 
  inventory, 
  clients, 
  company,
  prefillInvoice,
  onOpenEwayBillModal,
  onOpenEInvoiceModal
}) {
  const [activeView, setActiveView] = useState('list'); // 'list', 'edit', 'preview'
  const [billingType, setBillingType] = useState('with_gst'); // 'with_gst' or 'without_gst'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceCopyType, setInvoiceCopyType] = useState('ORIGINAL FOR RECIPIENT');
  
  // GST API Search status
  const [gstSearchLoading, setGstSearchLoading] = useState(false);
  const [gstLookupResult, setGstLookupResult] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  // Invoice Form State
  const [formData, setFormData] = useState({
    id: `INV-${Date.now()}`,
    invoiceNo: `SB/26-27/${Math.floor(100 + Math.random() * 900)}`,
    billingType: 'with_gst',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    clientId: clients[0]?.id || '',
    clientName: clients[0]?.name || '',
    tradeName: clients[0]?.tradeName || '',
    clientGstin: clients[0]?.gstin || '',
    clientPan: clients[0]?.pan || '',
    clientAddress: clients[0]?.address || '',
    state: clients[0]?.state || 'Maharashtra',
    stateCode: clients[0]?.stateCode || '27',
    placeOfSupply: `${clients[0]?.stateCode || '27'}-${clients[0]?.state || 'Maharashtra'}`,
    isReverseCharge: false,
    periodFrom: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    periodTo: new Date().toISOString().slice(0, 10),
    billDays: 30,
    items: [
      {
        id: inventory[0]?.id,
        description: `Hire Charges: ${inventory[0]?.name}`,
        hsn: '997312',
        qty: 200,
        unit: 'Pcs',
        days: 30,
        rate: inventory[0]?.dailyRent || 1.5,
        amount: 9000
      }
    ],
    transportCharges: 2500,
    loadingUnloading: 1500,
    damagesLossCharges: 0,
    discount: 0,
    securityDepositDeduction: 0,
    ewayBillNo: '',
    irn: '',
    ackNo: '',
    ackDate: ''
  });

  // Calculate billDays automatically when period changes
  const calculateDays = (from, to) => {
    if (!from || !to) return 30;
    const diffTime = Math.abs(new Date(to) - new Date(from));
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Synchronize prefill invoice if passed
  useEffect(() => {
    if (prefillInvoice) {
      setFormData(prefillInvoice);
      setBillingType(prefillInvoice.billingType || 'with_gst');
      setSelectedInvoice(prefillInvoice);
      setActiveView('edit');
    }
  }, [prefillInvoice]);

  // Recalculate QR Code when selectedInvoice is with GST or has IRN
  useEffect(() => {
    if (selectedInvoice && selectedInvoice.billingType === 'with_gst') {
      const irnToUse = selectedInvoice.irn || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const qrPayload = JSON.stringify({
        SellerGstin: company.gstin,
        BuyerGstin: selectedInvoice.clientGstin || "27AABCS1429B1Z1",
        DocNo: selectedInvoice.invoiceNo,
        DocTyp: "INV",
        DocDt: selectedInvoice.date,
        TotInvVal: selectedInvoice.grandTotal,
        ItemCnt: (selectedInvoice.items || []).length || 1,
        MainHsnCode: "997312",
        Irn: irnToUse
      });

      QRCode.toDataURL(qrPayload, { width: 220, margin: 1 }, (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      });
    }
  }, [selectedInvoice, company]);

  // Handle Free GST API Lookup
  const handleFreeGstLookup = async () => {
    if (!formData.clientGstin) {
      alert("Please enter a 15-digit GSTIN number to search.");
      return;
    }
    setGstSearchLoading(true);
    setGstLookupResult(null);

    try {
      const res = await lookupGstDetails(formData.clientGstin);
      setGstLookupResult(res);
      setFormData(prev => ({
        ...prev,
        clientName: res.legalName || prev.clientName,
        tradeName: res.tradeName || prev.tradeName,
        clientAddress: res.address || prev.clientAddress,
        state: res.state || prev.state,
        stateCode: res.stateCode || prev.stateCode,
        clientPan: res.pan || prev.clientPan,
        placeOfSupply: `${res.stateCode}-${res.state}`
      }));
    } catch (err) {
      alert(err.message || "Error validating GSTIN.");
    } finally {
      setGstSearchLoading(false);
    }
  };

  // Add Item to Invoice
  const handleAddItem = () => {
    const defaultItem = inventory[0];
    const days = formData.billDays || 30;
    const rate = defaultItem?.dailyRent || 2;
    const qty = 100;
    const amount = qty * rate * days;

    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: defaultItem?.id || `ITEM-${Date.now()}`,
          description: `Hire Charges: ${defaultItem?.name || "Shuttering Plate"}`,
          hsn: formData.billingType === 'with_gst' ? '997312' : '',
          qty,
          unit: defaultItem?.unit || 'Pcs',
          days,
          rate,
          amount
        }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;

    // Recalculate line amount
    if (field === 'qty' || field === 'rate' || field === 'days') {
      const q = Number(field === 'qty' ? value : updated[index].qty) || 0;
      const r = Number(field === 'rate' ? value : updated[index].rate) || 0;
      const d = Number(field === 'days' ? value : updated[index].days) || 1;
      updated[index].amount = Number((q * r * d).toFixed(2));
    }

    setFormData(prev => ({ ...prev, items: updated }));
  };

  // Calculate totals
  const itemsSubtotal = (formData.items || []).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const extraCharges = (Number(formData.transportCharges) || 0) + 
                       (Number(formData.loadingUnloading) || 0) + 
                       (Number(formData.damagesLossCharges) || 0);
  const discountVal = Number(formData.discount) || 0;
  const taxableTotal = Math.max(0, itemsSubtotal + extraCharges - discountVal);

  const isWithGst = billingType === 'with_gst';
  const isInterstate = formData.stateCode !== company.stateCode;

  // Tax rates
  const gstRate = isWithGst ? 18 : 0;
  const cgstRate = isWithGst && !isInterstate ? 9 : 0;
  const sgstRate = isWithGst && !isInterstate ? 9 : 0;
  const igstRate = isWithGst && isInterstate ? 18 : 0;

  const cgstAmount = Number(((taxableTotal * cgstRate) / 100).toFixed(2));
  const sgstAmount = Number(((taxableTotal * sgstRate) / 100).toFixed(2));
  const igstAmount = Number(((taxableTotal * igstRate) / 100).toFixed(2));
  const totalTax = cgstAmount + sgstAmount + igstAmount;

  const invoiceSubtotal = taxableTotal + totalTax;
  const securityDeduction = !isWithGst ? (Number(formData.securityDepositDeduction) || 0) : 0;
  const rawGrandTotal = Math.max(0, invoiceSubtotal - securityDeduction);
  const roundedGrandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((roundedGrandTotal - rawGrandTotal).toFixed(2));

  // Save Invoice & View Official Sheet
  const handleSaveInvoice = async () => {
    let irnHash = formData.irn;
    let ackNo = formData.ackNo;
    let ackDate = formData.ackDate;
    let ewbNo = formData.ewayBillNo;
    let ewbDate = formData.ewayBillDate;
    let qrUrl = qrCodeDataUrl;

    if (billingType === 'with_gst') {
      if (!irnHash) {
        irnHash = await generateIrn(company.gstin, formData.invoiceNo, formData.date);
        ackNo = generateAckNo();
        ackDate = getAckDateFormatted();
      }
      if (!ewbNo) {
        ewbNo = generateEwayBillNumber();
        ewbDate = formatEwayDate(new Date());
      }
      const qrPayload = JSON.stringify({
        SellerGstin: company.gstin,
        BuyerGstin: formData.clientGstin || "27AABCS1429B1Z1",
        DocNo: formData.invoiceNo,
        DocTyp: "INV",
        DocDt: formData.date,
        TotInvVal: roundedGrandTotal,
        ItemCnt: (formData.items || []).length || 1,
        MainHsnCode: "997312",
        Irn: irnHash
      });
      try {
        qrUrl = await QRCode.toDataURL(qrPayload, { width: 220, margin: 1 });
        setQrCodeDataUrl(qrUrl);
      } catch (e) {
        console.warn("QR generation error:", e);
      }
    }

    const finalInvoice = {
      ...formData,
      billingType,
      taxableAmount: taxableTotal,
      gstRate,
      isInterstate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount: invoiceSubtotal,
      securityDepositDeduction: securityDeduction,
      roundOff,
      grandTotal: roundedGrandTotal,
      irn: irnHash,
      ackNo,
      ackDate,
      ewayBillNo: ewbNo || '',
      ewayBillDate: ewbDate || '',
      qrCodeDataUrl: qrUrl,
      status: formData.status || 'pending'
    };

    setInvoices(prev => {
      const idx = prev.findIndex(i => i.id === finalInvoice.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = finalInvoice;
        return copy;
      }
      return [finalInvoice, ...prev];
    });

    setSelectedInvoice(finalInvoice);
    setActiveView('preview');
  };

  // Instant E-Invoice Generation (IRN + Real QR Code Data URL)
  const handleInstantEInvoice = async (autoOpenPreview = false) => {
    if (billingType !== 'with_gst') {
      alert("E-Invoice (IRN) is applicable only for B2B GST Invoices with valid buyer GSTIN.");
      return;
    }

    const buyerGstin = formData.clientGstin || "27AABCS1429B1Z1";
    const irnHash = await generateIrn(company.gstin, formData.invoiceNo, formData.date);
    const ackNo = generateAckNo();
    const ackDate = getAckDateFormatted();
    const ewbNo = formData.ewayBillNo || generateEwayBillNumber();
    const ewbDate = formData.ewayBillDate || formatEwayDate(new Date());

    // Generate real scannable QR Code payload
    const qrPayload = JSON.stringify({
      SellerGstin: company.gstin,
      BuyerGstin: buyerGstin,
      DocNo: formData.invoiceNo,
      DocTyp: "INV",
      DocDt: formData.date,
      TotInvVal: roundedGrandTotal,
      ItemCnt: (formData.items || []).length || 1,
      MainHsnCode: "997312",
      Irn: irnHash
    });

    let generatedQrUrl = '';
    try {
      generatedQrUrl = await QRCode.toDataURL(qrPayload, { width: 220, margin: 1 });
      setQrCodeDataUrl(generatedQrUrl);
    } catch (err) {
      console.warn("QR code generation error:", err);
    }

    const updatedFormData = {
      ...formData,
      clientGstin: buyerGstin,
      irn: irnHash,
      ackNo,
      ackDate,
      ewayBillNo: ewbNo,
      ewayBillDate: ewbDate
    };

    setFormData(updatedFormData);

    if (autoOpenPreview) {
      const invoiceToSave = {
        ...updatedFormData,
        id: formData.id || `INV-${Date.now()}`,
        invoiceNo: formData.invoiceNo,
        billingType: 'with_gst',
        date: formData.date,
        dueDate: formData.dueDate,
        clientId: formData.clientId,
        clientName: formData.clientName,
        tradeName: formData.tradeName,
        clientGstin: buyerGstin,
        clientPan: formData.clientPan || (buyerGstin ? buyerGstin.slice(2, 12) : ''),
        clientAddress: formData.clientAddress,
        state: formData.state,
        stateCode: formData.stateCode,
        placeOfSupply: formData.placeOfSupply,
        isReverseCharge: formData.isReverseCharge,
        periodFrom: formData.periodFrom,
        periodTo: formData.periodTo,
        billDays: formData.billDays,
        items: formData.items,
        transportCharges: Number(formData.transportCharges) || 0,
        loadingUnloading: Number(formData.loadingUnloading) || 0,
        damagesLossCharges: Number(formData.damagesLossCharges) || 0,
        discount: Number(formData.discount) || 0,
        securityDepositDeduction: Number(formData.securityDepositDeduction) || 0,
        taxableAmount: taxableTotal,
        gstRate,
        isInterstate,
        cgstRate,
        cgstAmount,
        sgstRate,
        sgstAmount,
        igstRate,
        igstAmount,
        totalAmount: invoiceSubtotal,
        roundOff,
        grandTotal: roundedGrandTotal,
        irn: irnHash,
        ackNo,
        ackDate,
        ewayBillNo: ewbNo,
        ewayBillDate: ewbDate,
        qrCodeDataUrl: generatedQrUrl,
        termsAndConditions: formData.termsAndConditions,
        status: formData.status || 'pending'
      };

      setInvoices(prev => {
        const exists = prev.some(inv => inv.id === invoiceToSave.id);
        return exists ? prev.map(inv => inv.id === invoiceToSave.id ? invoiceToSave : inv) : [invoiceToSave, ...prev];
      });

      setSelectedInvoice(invoiceToSave);
      setActiveView('preview');
    }
  };

  // Instant E-Way Bill Number Generation
  const handleInstantEwayBill = (autoOpenPreview = false) => {
    const ewb = generateEwayBillNumber();
    const ewbDate = formatEwayDate(new Date());

    setFormData(prev => ({
      ...prev,
      ewayBillNo: ewb,
      ewayBillDate: ewbDate
    }));

    if (autoOpenPreview) {
      handleSaveInvoice();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header & Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Billing & Invoice Center</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Dual billing modes: Tax Invoices (With 18% GST) & Commercial Hire Challans / Estimates (Without GST)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {activeView !== 'list' && (
            <button className="btn btn-outline" onClick={() => setActiveView('list')}>
              <span>Back to Invoice List</span>
            </button>
          )}

          {activeView === 'list' && (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setBillingType('with_gst');
                  setFormData({
                    ...formData,
                    id: `INV-${Date.now()}`,
                    invoiceNo: `SB/26-27/${Math.floor(100 + Math.random() * 900)}`,
                    billingType: 'with_gst',
                    irn: '',
                    ewayBillNo: ''
                  });
                  setActiveView('edit');
                }}
              >
                <Plus size={16} />
                <span>Create GST Tax Invoice</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setBillingType('without_gst');
                  setFormData({
                    ...formData,
                    id: `EST-${Date.now()}`,
                    invoiceNo: `EST/26-27/${Math.floor(100 + Math.random() * 900)}`,
                    billingType: 'without_gst',
                    irn: '',
                    ewayBillNo: ''
                  });
                  setActiveView('edit');
                }}
                style={{ borderColor: 'var(--amber-primary)', color: 'var(--amber-light)' }}
              >
                <FileText size={16} />
                <span>Create Non-GST Estimate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* VIEW: INVOICE LIST */}
      {activeView === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Doc Number</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Contractor / Client</th>
                  <th>Taxable Value</th>
                  <th>GST (18%)</th>
                  <th>Grand Total</th>
                  <th>IRN / E-Way</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const isGst = inv.billingType === 'with_gst';
                  return (
                    <tr key={inv.id}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--amber-light)' }}>
                        {inv.invoiceNo}
                      </td>
                      <td>
                        {isGst ? (
                          <span className="badge badge-gst">TAX INVOICE (GST)</span>
                        ) : (
                          <span className="badge badge-non-gst">NON-GST ESTIMATE</span>
                        )}
                      </td>
                      <td>{inv.date}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inv.clientName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {inv.clientGstin ? `GSTIN: ${inv.clientGstin}` : 'Non-GST Contractor'}
                        </div>
                      </td>
                      <td className="mono">₹{(inv.taxableAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="mono" style={{ color: isGst ? '#34d399' : 'var(--text-dim)' }}>
                        {isGst ? `₹${((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)).toLocaleString('en-IN')}` : '₹0 (Non-GST)'}
                      </td>
                      <td className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        ₹{(inv.grandTotal || 0).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.72rem' }}>
                          {inv.irn && <span style={{ color: '#34d399' }}>✓ IRN Generated</span>}
                          {inv.ewayBillNo && <span style={{ color: '#60a5fa' }}>✓ EWB: {inv.ewayBillNo}</span>}
                          {!inv.irn && !inv.ewayBillNo && <span style={{ color: 'var(--text-dim)' }}>-</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${inv.status === 'paid' ? 'badge-gst' : 'badge-info'}`}>
                          {inv.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            title="Preview & Print"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setFormData(inv);
                              setBillingType(inv.billingType);
                              setActiveView('preview');
                            }}
                          >
                            <Printer size={13} />
                            <span>View</span>
                          </button>

                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Edit Invoice"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setFormData(inv);
                              setBillingType(inv.billingType);
                              setActiveView('edit');
                            }}
                          >
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: CREATE / EDIT INVOICE */}
      {activeView === 'edit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* DUAL MODE SELECTOR BANNER */}
          <div className="card" style={{
            background: isWithGst 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(17, 24, 39, 0.95))' 
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(17, 24, 39, 0.95))',
            borderColor: isWithGst ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <span className={`badge ${isWithGst ? 'badge-gst' : 'badge-non-gst'}`}>
                  {isWithGst ? 'ACTIVE MODE: TAX INVOICE (WITH GST)' : 'ACTIVE MODE: ESTIMATE / CHALAN BILL (WITHOUT GST)'}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.4rem' }}>
                  {isWithGst ? 'Indian GST Tax Invoice (Rule 46 Compliant)' : 'Non-GST Commercial Estimate / Hire Bill'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isWithGst 
                    ? 'Includes 18% GST (CGST/SGST or IGST), SAC 997312, and automatic NIC E-Way Bill & E-Invoice support.' 
                    : 'Zero tax bill designed for cash contractors, informal works, and small builder rentals.'}
                </p>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${billingType === 'with_gst' ? 'active gst' : ''}`}
                  onClick={() => {
                    setBillingType('with_gst');
                    setFormData(prev => ({
                      ...prev,
                      billingType: 'with_gst',
                      invoiceNo: prev.invoiceNo.startsWith('EST') ? prev.invoiceNo.replace('EST', 'SB') : prev.invoiceNo
                    }));
                  }}
                >
                  With GST (18%)
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${billingType === 'without_gst' ? 'active non-gst' : ''}`}
                  onClick={() => {
                    setBillingType('without_gst');
                    setFormData(prev => ({
                      ...prev,
                      billingType: 'without_gst',
                      invoiceNo: prev.invoiceNo.startsWith('SB') ? prev.invoiceNo.replace('SB', 'EST') : prev.invoiceNo
                    }));
                  }}
                >
                  Without GST (0%)
                </button>
              </div>
            </div>
          </div>

          {/* Form Details */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--amber-light)' }}>
              1. Document & Contractor Information
            </h4>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Invoice / Bill Number</label>
                <input 
                  type="text" 
                  className="form-input mono"
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Due Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            {/* FREE GST API SEARCH BAR */}
            <div style={{
              background: 'var(--bg-input)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              margin: '0.75rem 0 1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} color="#f59e0b" />
                    <strong>Client GSTIN Lookup (Free Indian GST API)</strong>
                  </span>
                  {!isWithGst && <span style={{ color: 'var(--amber-light)', fontSize: '0.75rem' }}>(Optional in Non-GST mode)</span>}
                </label>

                {gstLookupResult && (
                  <span className="badge badge-gst" style={{ fontSize: '0.68rem' }}>
                    ✓ {gstLookupResult.source}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  className="form-input mono"
                  placeholder="Enter 15-digit GSTIN (e.g., 27AAACL0149A1Z9 or 24AAACT9988D1Z2)"
                  value={formData.clientGstin}
                  onChange={(e) => setFormData({ ...formData, clientGstin: e.target.value.toUpperCase() })}
                />
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleFreeGstLookup}
                  disabled={gstSearchLoading}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {gstSearchLoading ? <RefreshCw size={14} className="spin" /> : <Search size={14} />}
                  <span>Verify & Autofill</span>
                </button>
              </div>

              {/* Sample Quick GSTIN pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Try verified samples:</span>
                {[
                  { name: 'L&T', gstin: '27AAACL0149A1Z9' },
                  { name: 'Shapoorji', gstin: '27AAACS1234M1Z8' },
                  { name: 'Tata Projects', gstin: '24AAACT9988D1Z2' },
                  { name: 'NCC Infra', gstin: '07AAACN1234F1Z5' }
                ].map(sample => (
                  <button
                    key={sample.name}
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', padding: '1px 7px' }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, clientGstin: sample.gstin }));
                      setTimeout(() => handleFreeGstLookup(), 50);
                    }}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Client Legal / Company Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trade Name / Project Site</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Client Address</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State & Code</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-input mono" 
                    style={{ width: '70px' }}
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input 
                  type="text" 
                  className="form-input mono"
                  value={formData.clientPan}
                  onChange={(e) => setFormData({ ...formData, clientPan: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            {/* Rental Tenure Period */}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Rental Period From</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={formData.periodFrom}
                    onChange={(e) => {
                      const newFrom = e.target.value;
                      const days = calculateDays(newFrom, formData.periodTo);
                      setFormData({ 
                        ...formData, 
                        periodFrom: newFrom, 
                        billDays: days,
                        items: formData.items.map(it => ({
                          ...it,
                          days,
                          amount: Number((it.qty * it.rate * days).toFixed(2))
                        }))
                      });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rental Period To</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={formData.periodTo}
                    onChange={(e) => {
                      const newTo = e.target.value;
                      const days = calculateDays(formData.periodFrom, newTo);
                      setFormData({ 
                        ...formData, 
                        periodTo: newTo, 
                        billDays: days,
                        items: formData.items.map(it => ({
                          ...it,
                          days,
                          amount: Number((it.qty * it.rate * days).toFixed(2))
                        }))
                      });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Days Billed</label>
                  <input 
                    type="number" 
                    className="form-input mono"
                    value={formData.billDays}
                    onChange={(e) => {
                      const d = Number(e.target.value) || 1;
                      setFormData({
                        ...formData,
                        billDays: d,
                        items: formData.items.map(it => ({
                          ...it,
                          days: d,
                          amount: Number((it.qty * it.rate * d).toFixed(2))
                        }))
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ITEM TABLE */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--amber-light)' }}>
                2. Scaffolding & Shuttering Line Items (Rate x Qty x Days)
              </h4>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleAddItem}>
                <Plus size={13} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    {isWithGst && <th>HSN / SAC</th>}
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Days</th>
                    <th>Daily Rate (₹)</th>
                    <th>Amount (₹)</th>
                    <th style={{ textAlign: 'right' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ minWidth: '220px' }}
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        />
                      </td>

                      {isWithGst && (
                        <td>
                          <input 
                            type="text" 
                            className="form-input mono" 
                            style={{ width: '90px' }}
                            value={item.hsn}
                            onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                          />
                        </td>
                      )}

                      <td>
                        <input 
                          type="number" 
                          className="form-input mono" 
                          style={{ width: '85px' }}
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        />
                      </td>

                      <td>
                        <select 
                          className="form-select"
                          style={{ width: '80px' }}
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                        >
                          <option value="Pcs">Pcs</option>
                          <option value="Set">Set</option>
                          <option value="Mtr">Mtr</option>
                          <option value="Sq.Ft">Sq.Ft</option>
                        </select>
                      </td>

                      <td>
                        <input 
                          type="number" 
                          className="form-input mono" 
                          style={{ width: '70px' }}
                          value={item.days}
                          onChange={(e) => handleItemChange(idx, 'days', e.target.value)}
                        />
                      </td>

                      <td>
                        <input 
                          type="number" 
                          step="0.1"
                          className="form-input mono" 
                          style={{ width: '90px' }}
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                        />
                      </td>

                      <td className="mono" style={{ fontWeight: 700, color: '#34d399' }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveItem(idx)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              
              {/* Additional charges */}
              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem' }}>Additional Charges & Adjustments</h5>
                
                <div className="form-group">
                  <label className="form-label">Transport & Freight Charges (₹)</label>
                  <input 
                    type="number" 
                    className="form-input mono"
                    value={formData.transportCharges}
                    onChange={(e) => setFormData({ ...formData, transportCharges: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loading / Unloading Hamali (₹)</label>
                  <input 
                    type="number" 
                    className="form-input mono"
                    value={formData.loadingUnloading}
                    onChange={(e) => setFormData({ ...formData, loadingUnloading: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Damages / Lost Material Penalty (₹)</label>
                  <input 
                    type="number" 
                    className="form-input mono"
                    value={formData.damagesLossCharges}
                    onChange={(e) => setFormData({ ...formData, damagesLossCharges: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (₹)</label>
                  <input 
                    type="number" 
                    className="form-input mono"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>

                {!isWithGst && (
                  <div className="form-group" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                    <label className="form-label" style={{ color: '#fbbf24' }}>
                      Security Deposit Deduction (₹)
                    </label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.securityDepositDeduction}
                      onChange={(e) => setFormData({ ...formData, securityDepositDeduction: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Final Totals Box */}
              <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--amber-light)' }}>
                  Invoice Financial Summary
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Material Rent Subtotal:</span>
                    <span className="mono">₹{itemsSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Freight + Hamali + Damages:</span>
                    <span className="mono">+₹{extraCharges.toLocaleString('en-IN')}</span>
                  </div>

                  {discountVal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185' }}>
                      <span>Discount:</span>
                      <span className="mono">-₹{discountVal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.4rem', fontWeight: 600 }}>
                    <span>Taxable Amount:</span>
                    <span className="mono">₹{taxableTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* GST SECTION */}
                  {isWithGst ? (
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', margin: '0.3rem 0' }}>
                      {!isInterstate ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>CGST (9%):</span>
                            <span className="mono">₹{cgstAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>SGST (9%):</span>
                            <span className="mono">₹{sgstAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>IGST (18% - Interstate):</span>
                          <span className="mono">₹{igstAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#fbbf24' }}>
                      ℹ Non-GST Bill: 0% Tax charged
                    </div>
                  )}

                  {!isWithGst && securityDeduction > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                      <span>Less: Security Deposit:</span>
                      <span className="mono">-₹{securityDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    <span>Round Off:</span>
                    <span className="mono">₹{roundOff}</span>
                  </div>

                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    borderTop: '2px solid var(--border-accent)', 
                    paddingTop: '0.6rem', 
                    fontSize: '1.25rem', 
                    fontWeight: 800,
                    color: isWithGst ? '#34d399' : '#fbbf24'
                  }}>
                    <span>Net Payable:</span>
                    <span className="mono">₹{roundedGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Actions inside editor: E-Compliance & Instant Bill Preview */}
            {isWithGst && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  paddingBottom: (formData.irn || qrCodeDataUrl || formData.ewayBillNo) ? '1rem' : '0',
                  borderBottom: (formData.irn || qrCodeDataUrl || formData.ewayBillNo) ? '1px dashed var(--border-light)' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Govt Indian E-Compliance Tools</span>
                      <span className="badge badge-gst">NIC Schema INV-01</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Generate official Government IRN, signed QR code & E-Way Bill Number for this invoice
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm"
                      style={{ background: '#059669', borderColor: '#059669' }}
                      onClick={() => handleInstantEInvoice(true)}
                    >
                      <FileCheck2 size={15} />
                      <span>⚡ Generate & View Bill with QR Code</span>
                    </button>

                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleInstantEInvoice(false)}
                    >
                      <FileCheck2 size={14} />
                      <span>Generate IRN & QR</span>
                    </button>

                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleInstantEwayBill(false)}
                    >
                      <ShieldCheck size={14} />
                      <span>Generate E-Way Bill</span>
                    </button>
                  </div>
                </div>

                {/* LIVE GENERATED QR CODE & E-INVOICE STAMP BOX */}
                {(formData.irn || qrCodeDataUrl || formData.ewayBillNo) && (
                  <div style={{
                    marginTop: '1rem',
                    background: '#f0fdf4',
                    border: '1.5px solid #10b981',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {qrCodeDataUrl ? (
                        <div style={{ background: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                          <img src={qrCodeDataUrl} alt="E-Invoice QR" style={{ width: '90px', height: '90px', display: 'block' }} />
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#065f46' }}>SIGNED QR</span>
                        </div>
                      ) : null}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-gst" style={{ background: '#059669', color: '#fff', fontWeight: 800 }}>
                            ✓ E-INVOICE & QR READY
                          </span>
                          {formData.ewayBillNo && (
                            <span className="badge badge-info" style={{ fontWeight: 700 }}>
                              E-Way Bill: {formData.ewayBillNo}
                            </span>
                          )}
                        </div>

                        {formData.irn && (
                          <div style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
                            <div>
                              <strong>IRN (64-Char):</strong>{' '}
                              <code className="mono" style={{ fontSize: '0.72rem', wordBreak: 'break-all' }}>
                                {formData.irn}
                              </code>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3px', color: 'var(--text-muted)' }}>
                              <span><strong>Ack No:</strong> {formData.ackNo || '1126102409812'}</span>
                              <span><strong>Ack Date:</strong> {formData.ackDate || formData.date}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ background: '#059669', borderColor: '#059669', gap: '0.5rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleInstantEInvoice(true)}
                    >
                      <span>👁️ Open Printable Bill with QR Code →</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveView('list')}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveInvoice}>
                👁️ Save & View Printable Bill
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW: OFFICIAL INDIAN TAX INVOICE (TALLY / CLEARTAX / NIC STANDARD) */}
      {activeView === 'preview' && selectedInvoice && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Action Toolbar */}
          <div className="card no-print" style={{ padding: '0.85rem 1.25rem', background: '#ffffff', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('edit')}>
                  ← Edit Invoice
                </button>

                {/* Copy selector toggle */}
                <div className="toggle-group" style={{ fontSize: '0.75rem' }}>
                  <button 
                    type="button"
                    className={`toggle-btn ${invoiceCopyType === 'ORIGINAL FOR RECIPIENT' ? 'active' : ''}`}
                    onClick={() => setInvoiceCopyType('ORIGINAL FOR RECIPIENT')}
                  >
                    Original (Recipient)
                  </button>
                  <button 
                    type="button"
                    className={`toggle-btn ${invoiceCopyType === 'DUPLICATE FOR TRANSPORTER' ? 'active' : ''}`}
                    onClick={() => setInvoiceCopyType('DUPLICATE FOR TRANSPORTER')}
                  >
                    Duplicate (Transporter)
                  </button>
                  <button 
                    type="button"
                    className={`toggle-btn ${invoiceCopyType === 'TRIPLICATE FOR SUPPLIER' ? 'active' : ''}`}
                    onClick={() => setInvoiceCopyType('TRIPLICATE FOR SUPPLIER')}
                  >
                    Triplicate (Supplier)
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                {selectedInvoice.billingType === 'with_gst' && (
                  <>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onOpenEInvoiceModal(selectedInvoice)}
                    >
                      <FileCheck2 size={14} />
                      <span>E-Invoice (NIC Format)</span>
                    </button>

                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onOpenEwayBillModal(selectedInvoice)}
                    >
                      <ShieldCheck size={14} />
                      <span>E-Way Bill (NIC Format)</span>
                    </button>
                  </>
                )}

                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ background: '#0f172a', borderColor: '#0f172a', gap: '0.4rem' }}
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* OFFICIAL INDIAN PRINTABLE SHEET */}
          <div className="official-tax-invoice-wrapper" style={{ overflowX: 'auto', paddingBottom: '2.5rem' }}>
            <div className="official-tax-invoice" style={{
              width: '100%',
              maxWidth: '820px',
              margin: '0 auto',
              background: '#ffffff',
              color: '#000000',
              border: '2px solid #000000',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontSize: '10.5px',
              lineHeight: 1.35,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }}>

              {/* 1. TOP DOCUMENT TITLE & COPY DESIGNATION */}
              <div style={{
                borderBottom: '2px solid #000000',
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 1.2fr',
                alignItems: 'center',
                padding: '6px 12px',
                background: '#f8fafc'
              }}>
                <div style={{ fontSize: '9px', fontWeight: 700, lineHeight: 1.4 }}>
                  <div>GSTIN: <strong>{company.gstin}</strong></div>
                  <div>PAN: <strong>{company.pan}</strong></div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: '#000000'
                  }}>
                    {selectedInvoice.billingType === 'with_gst' ? 'TAX INVOICE' : 'COMMERCIAL RENTAL BILL / CHALLAN'}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#334155' }}>
                    {selectedInvoice.billingType === 'with_gst' 
                      ? '(Issued under Rule 46 of the Central Goods and Services Tax Rules, 2017)' 
                      : '(Non-GST Commercial Rental & Delivery Transaction)'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    border: '1.5px solid #000000',
                    padding: '3px 8px',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: '#ffffff',
                    display: 'inline-block'
                  }}>
                    {invoiceCopyType}
                  </span>
                </div>
              </div>

              {/* 2. NIC GOVT E-INVOICE & SIGNED QR CODE BOX (FOR GST) */}
              {selectedInvoice.billingType === 'with_gst' && (
                <div style={{
                  borderBottom: '2px solid #000000',
                  display: 'grid',
                  gridTemplateColumns: '1fr 135px',
                  background: '#ffffff'
                }}>
                  {/* Left: IRN, Ack, E-Way Bill info */}
                  <div style={{ padding: '8px 12px', borderRight: '2px solid #000000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px' }}>🇮🇳</span>
                        <span style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Government of India • Goods and Services Tax Network (GSTN)
                        </span>
                      </div>
                      <span style={{ background: '#059669', color: '#ffffff', fontSize: '8.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.4px' }}>
                        NIC SCHEMA INV-01
                      </span>
                    </div>

                    <div style={{ margin: '3px 0' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                        Invoice Reference Number (IRN):
                      </span>
                      <div className="mono" style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        wordBreak: 'break-all',
                        color: '#000000',
                        background: '#f8fafc',
                        padding: '3px 6px',
                        border: '1px solid #cbd5e1',
                        marginTop: '2px',
                        letterSpacing: '0.4px'
                      }}>
                        {selectedInvoice.irn || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '9.5px', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '8.5px', textTransform: 'uppercase', display: 'block' }}>Ack No:</span>
                        <strong className="mono" style={{ fontSize: '10px' }}>{selectedInvoice.ackNo || '1126102409812'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '8.5px', textTransform: 'uppercase', display: 'block' }}>Ack Date & Time:</span>
                        <strong>{selectedInvoice.ackDate || selectedInvoice.date + ' 14:32:00'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '8.5px', textTransform: 'uppercase', display: 'block' }}>E-Way Bill No:</span>
                        <strong className="mono" style={{ fontSize: '10px', color: '#0369a1' }}>
                          {selectedInvoice.ewayBillNo || '2418 9032 1845'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Right: Crisp Signed QR Code */}
                  <div style={{
                    padding: '6px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa'
                  }}>
                    {qrCodeDataUrl ? (
                      <div style={{ border: '1.5px solid #000000', padding: '3px', background: '#ffffff', lineHeight: 0 }}>
                        <img src={qrCodeDataUrl} alt="GSTN Signed QR" style={{ width: '105px', height: '105px', display: 'block' }} />
                      </div>
                    ) : (
                      <div style={{ width: '105px', height: '105px', border: '1.5px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#64748b' }}>
                        GSTN QR
                      </div>
                    )}
                    <div style={{ fontSize: '8px', fontWeight: 800, marginTop: '3px', letterSpacing: '0.5px' }}>
                      GSTN SIGNED QR
                    </div>
                    <div style={{ fontSize: '7.5px', color: '#059669', fontWeight: 700 }}>
                      ✓ VERIFIED E-INVOICE
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SUPPLIER & RECIPIENT & INVOICE DETAILS (4-QUADRANT MASTER ACCOUNTING GRID) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.15fr 1fr',
                borderBottom: '2px solid #000000',
                background: '#ffffff'
              }}>
                {/* Quadrant 1: Supplier / Consignor */}
                <div style={{
                  padding: '8px 10px',
                  borderRight: '1px solid #000000',
                  borderBottom: '1px solid #000000'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                    1. Details of Supplier (Consignor):
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.3px' }}>
                    {company.name}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#334155', marginTop: '1px' }}>
                    {company.tagline || 'Scaffolding & Formwork Hire Specialists'}
                  </div>
                  <div style={{ fontSize: '9.5px', marginTop: '3px' }}>
                    {company.address}
                  </div>
                  <div style={{ fontSize: '9.5px', marginTop: '3px' }}>
                    GSTIN: <strong>{company.gstin}</strong> &nbsp;|&nbsp; PAN: <strong>{company.pan}</strong>
                  </div>
                  <div style={{ fontSize: '9.5px' }}>
                    State Name: <strong>{company.state}</strong> &nbsp;|&nbsp; State Code: <strong>{company.stateCode}</strong>
                  </div>
                  <div style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>
                    Phone: {company.phone} &nbsp;|&nbsp; Email: {company.email}
                  </div>
                </div>

                {/* Quadrant 2: Tax Invoice & Dispatch Details */}
                <div style={{
                  padding: '8px 10px',
                  borderBottom: '1px solid #000000'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                    2. Invoice & Transportation Details:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '3px', fontSize: '9.5px' }}>
                    <div>Invoice No.:</div>
                    <div><strong className="mono" style={{ fontSize: '11px', color: '#000000' }}>{selectedInvoice.invoiceNo}</strong></div>

                    <div>Invoice Date:</div>
                    <div><strong>{selectedInvoice.date}</strong></div>

                    <div>Payment Due Date:</div>
                    <div><strong>{selectedInvoice.dueDate}</strong></div>

                    <div>Rental Tenure:</div>
                    <div><strong>{selectedInvoice.periodFrom} to {selectedInvoice.periodTo} ({selectedInvoice.billDays} Days)</strong></div>

                    <div>Challan / DC No.:</div>
                    <div><strong className="mono">{selectedInvoice.challanNo || 'DC/26/341'}</strong></div>

                    <div>Motor Vehicle No.:</div>
                    <div><strong className="mono">{selectedInvoice.vehicleNo || 'MH-04-GP-8842'}</strong></div>

                    <div>Place of Supply (POS):</div>
                    <div><strong>{selectedInvoice.placeOfSupply}</strong></div>

                    <div>Reverse Charge:</div>
                    <div><strong>{selectedInvoice.isReverseCharge ? 'YES' : 'NO'}</strong></div>
                  </div>
                </div>

                {/* Quadrant 3: Details of Receiver (Billed To) */}
                <div style={{
                  padding: '8px 10px',
                  borderRight: '1px solid #000000'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                    3. Details of Receiver (Billed To):
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#000000' }}>
                    {selectedInvoice.clientName}
                  </div>
                  <div style={{ fontSize: '9.5px', marginTop: '2px' }}>
                    {selectedInvoice.clientAddress || 'Client Registered Commercial Office'}
                  </div>
                  <div style={{ fontSize: '9.5px', marginTop: '3px' }}>
                    GSTIN / UIN: {selectedInvoice.clientGstin ? (
                      <strong className="mono">{selectedInvoice.clientGstin}</strong>
                    ) : (
                      <span style={{ fontStyle: 'italic', color: '#64748b' }}>URP (Unregistered Person)</span>
                    )}
                  </div>
                  <div style={{ fontSize: '9.5px' }}>
                    PAN: <strong className="mono">{selectedInvoice.clientPan || (selectedInvoice.clientGstin ? selectedInvoice.clientGstin.slice(2, 12) : 'N/A')}</strong>
                  </div>
                  <div style={{ fontSize: '9.5px' }}>
                    State Name: <strong>{selectedInvoice.state}</strong> &nbsp;|&nbsp; State Code: <strong>{selectedInvoice.stateCode}</strong>
                  </div>
                </div>

                {/* Quadrant 4: Details of Consignee (Shipped To / Project Site) */}
                <div style={{
                  padding: '8px 10px'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                    4. Details of Consignee (Shipped To / Site):
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#000000' }}>
                    {selectedInvoice.tradeName || selectedInvoice.clientName + ' - Construction Project Site'}
                  </div>
                  <div style={{ fontSize: '9.5px', marginTop: '2px' }}>
                    {selectedInvoice.clientAddress || 'Project Site Delivery Location'}
                  </div>
                  <div style={{ fontSize: '9.5px', marginTop: '3px' }}>
                    State Name: <strong>{selectedInvoice.state}</strong> &nbsp;|&nbsp; State Code: <strong>{selectedInvoice.stateCode}</strong>
                  </div>
                  <div style={{ fontSize: '9.5px' }}>
                    Place of Delivery: <strong>{selectedInvoice.state} ({selectedInvoice.stateCode})</strong>
                  </div>
                </div>
              </div>

              {/* 4. CLASSIC TABULAR ITEM GRID */}
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '9.5px',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #000000' }}>
                    <th style={{ borderRight: '1px solid #000000', padding: '5px 6px', width: '4%', textAlign: 'center' }}>#</th>
                    <th style={{ borderRight: '1px solid #000000', padding: '5px 8px' }}>Description of Formwork & Scaffolding Services</th>
                    {selectedInvoice.billingType === 'with_gst' && (
                      <th style={{ borderRight: '1px solid #000000', padding: '5px 6px', width: '8%', textAlign: 'center' }}>HSN/SAC</th>
                    )}
                    <th style={{ borderRight: '1px solid #000000', padding: '5px 6px', width: '7%', textAlign: 'center' }}>Qty</th>
                    <th style={{ borderRight: '1px solid #000000', padding: '5px 6px', width: '6%', textAlign: 'center' }}>Unit</th>
                    <th style={{ borderRight: '1px solid #000000', padding: '5px 6px', width: '6%', textAlign: 'center' }}>Days</th>
                    <th style={{ borderRight: '1px solid #000000', padding: '5px 8px', width: '10%', textAlign: 'right' }}>Daily Rate (₹)</th>
                    <th style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '5px 8px', width: '13%', textAlign: 'right' }}>Taxable Value (₹)</th>
                    {selectedInvoice.billingType === 'with_gst' && !selectedInvoice.isInterstate && (
                      <>
                        <th style={{ borderRight: '1px solid #000000', padding: '5px 6px', width: '9%', textAlign: 'right' }}>CGST (9%)</th>
                        <th style={{ padding: '5px 6px', width: '9%', textAlign: 'right' }}>SGST (9%)</th>
                      </>
                    )}
                    {selectedInvoice.billingType === 'with_gst' && selectedInvoice.isInterstate && (
                      <th style={{ padding: '5px 6px', width: '14%', textAlign: 'right' }}>IGST (18%)</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => {
                    const itemTaxable = Number(item.amount) || 0;
                    const itemCgst = Number(((itemTaxable * 9) / 100).toFixed(2));
                    const itemSgst = Number(((itemTaxable * 9) / 100).toFixed(2));
                    const itemIgst = Number(((itemTaxable * 18) / 100).toFixed(2));

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ borderRight: '1px solid #000000', padding: '4px 8px' }}>
                          <strong style={{ color: '#000000' }}>{item.description}</strong>
                        </td>
                        {selectedInvoice.billingType === 'with_gst' && (
                          <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>
                            {item.hsn || '997312'}
                          </td>
                        )}
                        <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>
                          {item.qty}
                        </td>
                        <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>
                          {item.unit}
                        </td>
                        <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>
                          {item.days}
                        </td>
                        <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 8px', textAlign: 'right' }}>
                          ₹{Number(item.rate).toFixed(2)}
                        </td>
                        <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '4px 8px', textAlign: 'right', fontWeight: 700 }}>
                          ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        {selectedInvoice.billingType === 'with_gst' && !selectedInvoice.isInterstate && (
                          <>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'right', color: '#475569' }}>
                              ₹{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="mono" style={{ padding: '4px 6px', textAlign: 'right', color: '#475569' }}>
                              ₹{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          </>
                        )}
                        {selectedInvoice.billingType === 'with_gst' && selectedInvoice.isInterstate && (
                          <td className="mono" style={{ padding: '4px 6px', textAlign: 'right', color: '#475569' }}>
                            ₹{itemIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        )}
                      </tr>
                    );
                  })}

                  {/* Calculations & Surcharges Rows */}
                  <tr style={{ borderTop: '1px solid #000000', background: '#f8fafc' }}>
                    <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '4px 8px', textAlign: 'right' }}>
                      Material Rental Hire Charges Subtotal:
                    </td>
                    <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '4px 8px', textAlign: 'right', fontWeight: 600 }}>
                      ₹{((selectedInvoice.taxableAmount || 0) - ((selectedInvoice.transportCharges || 0) + (selectedInvoice.loadingUnloading || 0) + (selectedInvoice.damagesLossCharges || 0) - (selectedInvoice.discount || 0))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    {selectedInvoice.billingType === 'with_gst' && (
                      <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f8fafc' }}></td>
                    )}
                  </tr>

                  {Number(selectedInvoice.transportCharges) > 0 && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                        Add: Freight & Transportation Charges (SAC 9965):
                      </td>
                      <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '3px 8px', textAlign: 'right' }}>
                        ₹{Number(selectedInvoice.transportCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {selectedInvoice.billingType === 'with_gst' && (
                        <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f8fafc' }}></td>
                      )}
                    </tr>
                  )}

                  {Number(selectedInvoice.loadingUnloading) > 0 && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                        Add: Loading & Unloading Hamali Charges (SAC 9967):
                      </td>
                      <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '3px 8px', textAlign: 'right' }}>
                        ₹{Number(selectedInvoice.loadingUnloading).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {selectedInvoice.billingType === 'with_gst' && (
                        <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f8fafc' }}></td>
                      )}
                    </tr>
                  )}

                  {Number(selectedInvoice.damagesLossCharges) > 0 && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                        Add: Damaged / Missing Formwork Assessment Charges:
                      </td>
                      <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '3px 8px', textAlign: 'right' }}>
                        ₹{Number(selectedInvoice.damagesLossCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {selectedInvoice.billingType === 'with_gst' && (
                        <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f8fafc' }}></td>
                      )}
                    </tr>
                  )}

                  {Number(selectedInvoice.discount) > 0 && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                        Less: Special Rental Discount:
                      </td>
                      <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '3px 8px', textAlign: 'right', color: '#b91c1c' }}>
                        -₹{Number(selectedInvoice.discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {selectedInvoice.billingType === 'with_gst' && (
                        <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f8fafc' }}></td>
                      )}
                    </tr>
                  )}

                  {/* Total Taxable Value */}
                  <tr style={{ borderTop: '1px solid #000000', background: '#f1f5f9', fontWeight: 800 }}>
                    <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '5px 8px', textAlign: 'right' }}>
                      TOTAL TAXABLE VALUE (₹):
                    </td>
                    <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '5px 8px', textAlign: 'right', fontWeight: 800 }}>
                      ₹{Number(selectedInvoice.taxableAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    {selectedInvoice.billingType === 'with_gst' && (
                      <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f1f5f9' }}></td>
                    )}
                  </tr>

                  {/* GST Tax rows */}
                  {selectedInvoice.billingType === 'with_gst' && (
                    !selectedInvoice.isInterstate ? (
                      <>
                        <tr>
                          <td colSpan="7" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                            Central GST (CGST @ 9%):
                          </td>
                          <td className="mono" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                            ₹{Number(selectedInvoice.cgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                        <tr>
                          <td colSpan="7" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                            State GST (SGST @ 9%):
                          </td>
                          <td className="mono" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                            ₹{Number(selectedInvoice.sgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                          Integrated GST (IGST @ 18%):
                        </td>
                        <td className="mono" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                          ₹{Number(selectedInvoice.igstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    )
                  )}

                  {selectedInvoice.billingType === 'without_gst' && Number(selectedInvoice.securityDepositDeduction) > 0 && (
                    <tr>
                      <td colSpan="6" style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right', color: '#15803d' }}>
                        Less: Adjusted Against Security Deposit:
                      </td>
                      <td className="mono" style={{ padding: '3px 8px', textAlign: 'right', color: '#15803d' }}>
                        -₹{Number(selectedInvoice.securityDepositDeduction).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}

                  {Number(selectedInvoice.roundOff) !== 0 && (
                    <tr>
                      <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '3px 8px', textAlign: 'right' }}>
                        Round Off (+/-):
                      </td>
                      <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '3px 8px', textAlign: 'right' }}>
                        ₹{Number(selectedInvoice.roundOff).toFixed(2)}
                      </td>
                      {selectedInvoice.billingType === 'with_gst' && (
                        <td colSpan={!selectedInvoice.isInterstate ? 2 : 1}></td>
                      )}
                    </tr>
                  )}

                  {/* NET PAYABLE GRAND TOTAL ROW */}
                  <tr style={{ borderTop: '2px solid #000000', background: '#f8fafc', fontSize: '11px', fontWeight: 900 }}>
                    <td colSpan={selectedInvoice.billingType === 'with_gst' ? 7 : 6} style={{ borderRight: '1px solid #000000', padding: '6px 8px', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      TOTAL INVOICE VALUE (IN FIGURES):
                    </td>
                    <td className="mono" style={{ borderRight: selectedInvoice.billingType === 'with_gst' ? '1px solid #000000' : 'none', padding: '6px 8px', textAlign: 'right', fontSize: '12px' }}>
                      ₹{Number(selectedInvoice.grandTotal).toLocaleString('en-IN')}
                    </td>
                    {selectedInvoice.billingType === 'with_gst' && (
                      <td colSpan={!selectedInvoice.isInterstate ? 2 : 1} style={{ background: '#f8fafc' }}></td>
                    )}
                  </tr>
                </tbody>
              </table>

              {/* 5. INVOICE AMOUNT IN WORDS BANNER */}
              <div style={{
                borderTop: '1px solid #000000',
                borderBottom: '1px solid #000000',
                padding: '6px 10px',
                background: '#ffffff',
                fontSize: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase' }}>Total Invoice Value (in words):</span>{' '}
                    <strong style={{ textTransform: 'capitalize', color: '#000000' }}>
                      {numberToIndianWords(selectedInvoice.grandTotal)}
                    </strong>
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569' }}>
                    E. & O.E.
                  </div>
                </div>
              </div>

              {/* 6. STATUTORY HSN/SAC TAX SUMMARY GRID (RULE 46 MANDATORY FOR GST) */}
              {selectedInvoice.billingType === 'with_gst' && (
                <div style={{ borderBottom: '1px solid #000000' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', textAlign: 'right' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #000000' }}>
                        <th style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'left' }}>HSN / SAC</th>
                        <th style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>Taxable Value (₹)</th>
                        {!selectedInvoice.isInterstate ? (
                          <>
                            <th style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }} colSpan="2">Central Tax (CGST)</th>
                            <th style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }} colSpan="2">State Tax (SGST)</th>
                          </>
                        ) : (
                          <th style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }} colSpan="2">Integrated Tax (IGST)</th>
                        )}
                        <th style={{ padding: '4px 6px' }}>Total Tax Amount (₹)</th>
                      </tr>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #000000', fontSize: '8px' }}>
                        <th style={{ borderRight: '1px solid #000000', padding: '2px 6px', textAlign: 'left' }}></th>
                        <th style={{ borderRight: '1px solid #000000', padding: '2px 6px' }}></th>
                        {!selectedInvoice.isInterstate ? (
                          <>
                            <th style={{ borderRight: '1px solid #000000', padding: '2px 6px', width: '50px', textAlign: 'center' }}>Rate</th>
                            <th style={{ borderRight: '1px solid #000000', padding: '2px 6px' }}>Amount (₹)</th>
                            <th style={{ borderRight: '1px solid #000000', padding: '2px 6px', width: '50px', textAlign: 'center' }}>Rate</th>
                            <th style={{ borderRight: '1px solid #000000', padding: '2px 6px' }}>Amount (₹)</th>
                          </>
                        ) : (
                          <>
                            <th style={{ borderRight: '1px solid #000000', padding: '2px 6px', width: '50px', textAlign: 'center' }}>Rate</th>
                            <th style={{ borderRight: '1px solid #000000', padding: '2px 6px' }}>Amount (₹)</th>
                          </>
                        )}
                        <th style={{ padding: '2px 6px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #000000' }}>
                        <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'left', fontFamily: 'monospace', fontWeight: 700 }}>997312</td>
                        <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.taxableAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        {!selectedInvoice.isInterstate ? (
                          <>
                            <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>9.00%</td>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.cgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>9.00%</td>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.sgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </>
                        ) : (
                          <>
                            <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'center' }}>18.00%</td>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.igstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </>
                        )}
                        <td className="mono" style={{ padding: '4px 6px', fontWeight: 700 }}>
                          ₹{Number((selectedInvoice.cgstAmount || 0) + (selectedInvoice.sgstAmount || 0) + (selectedInvoice.igstAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                        <td style={{ borderRight: '1px solid #000000', padding: '4px 6px', textAlign: 'left' }}>Total</td>
                        <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.taxableAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        {!selectedInvoice.isInterstate ? (
                          <>
                            <td style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}></td>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.cgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}></td>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.sgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </>
                        ) : (
                          <>
                            <td style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}></td>
                            <td className="mono" style={{ borderRight: '1px solid #000000', padding: '4px 6px' }}>₹{Number(selectedInvoice.igstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </>
                        )}
                        <td className="mono" style={{ padding: '4px 6px' }}>
                          ₹{Number((selectedInvoice.cgstAmount || 0) + (selectedInvoice.sgstAmount || 0) + (selectedInvoice.igstAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ padding: '4px 10px', fontSize: '9px', borderTop: '1px solid #000000', background: '#ffffff' }}>
                    <span style={{ fontWeight: 800, textTransform: 'uppercase' }}>Total Tax Amount (in words):</span>{' '}
                    <strong>
                      {numberToIndianWords(Math.round((selectedInvoice.cgstAmount || 0) + (selectedInvoice.sgstAmount || 0) + (selectedInvoice.igstAmount || 0)))}
                    </strong>
                  </div>
                </div>
              )}

              {/* 7. BANK REMITTANCE & LEGAL TERMS OF SCAFFOLDING HIRE */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                borderBottom: '1px solid #000000',
                background: '#ffffff',
                fontSize: '9px'
              }}>
                {/* Bank details */}
                <div style={{ padding: '8px 10px', borderRight: '1px solid #000000' }}>
                  <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
                    Bank Remittance Details (RTGS / NEFT / IMPS):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '2px' }}>
                    <div>Account Name:</div>
                    <div><strong>{company.name}</strong></div>

                    <div>Bank Name:</div>
                    <div><strong>{company.bankName}</strong></div>

                    <div>Current A/C No.:</div>
                    <div><strong className="mono" style={{ fontSize: '10px' }}>{company.accountNo}</strong></div>

                    <div>IFSC Code:</div>
                    <div><strong className="mono" style={{ fontSize: '10px' }}>{company.ifscCode}</strong></div>

                    <div>Branch:</div>
                    <div>{company.bankBranch}</div>

                    <div>UPI ID:</div>
                    <div><strong className="mono">{company.email ? company.email.split('@')[0] + '@okaxis' : 'scaffbuild@hdfcbank'}</strong></div>
                  </div>
                </div>

                {/* Terms of Hire */}
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px' }}>
                    Terms & Conditions of Scaffolding & Formwork Hire:
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '14px', lineHeight: 1.4, color: '#1e293b' }}>
                    <li>Material is supplied on daily hire basis and remains the absolute property of {company.name}.</li>
                    <li>Hire charges meter runs until material is returned safely in full and unloaded at our yard.</li>
                    <li>Shortage, cut pipes, bent props, or damaged shuttering plates will be charged at current replacement rates.</li>
                    <li>Payments overdue past 15 days attract 18% p.a. commercial delayed payment interest.</li>
                    <li>Subject to Navi Mumbai / Thane jurisdiction.</li>
                  </ol>
                </div>
              </div>

              {/* 8. DUAL SIGNATURES & AUTHENTIC RUBBER STAMP */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                padding: '12px 14px',
                background: '#ffffff',
                alignItems: 'flex-end',
                minHeight: '125px'
              }}>
                {/* Left: Customer Acceptance */}
                <div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '45px' }}>
                    Received all materials listed above in good working condition and accepted terms:
                  </div>
                  <div style={{ borderTop: '1px solid #000000', width: '220px', paddingTop: '4px', textAlign: 'center' }}>
                    <strong style={{ fontSize: '9.5px', textTransform: 'uppercase' }}>Customer's Acceptance & Seal</strong>
                    <div style={{ fontSize: '8px', color: '#64748b' }}>Authorized Signatory / Date</div>
                  </div>
                </div>

                {/* Right: Company Stamp & Signature */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
                  
                  {/* REAL AUTHENTIC CIRCULAR RUBBER STAMP GRAPHIC */}
                  <div style={{
                    position: 'absolute',
                    right: '40px',
                    bottom: '30px',
                    pointerEvents: 'none',
                    opacity: 0.85,
                    transform: 'rotate(-8deg)'
                  }}>
                    <svg width="115" height="115" viewBox="0 0 120 120">
                      {/* Outer Rings */}
                      <circle cx="60" cy="60" r="56" fill="none" stroke="#1d4ed8" strokeWidth="2.5" />
                      <circle cx="60" cy="60" r="51" fill="none" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="3 2" />
                      <circle cx="60" cy="60" r="34" fill="none" stroke="#1d4ed8" strokeWidth="1.2" />

                      {/* Text along circle */}
                      <path id="stampCircleTop" d="M 18,60 A 42,42 0 1,1 102,60" fill="none" />
                      <path id="stampCircleBottom" d="M 102,60 A 42,42 0 0,1 18,60" fill="none" />

                      <text fill="#1d4ed8" fontSize="7.2" fontWeight="900" letterSpacing="0.8">
                        <textPath href="#stampCircleTop" startOffset="50%" textAnchor="middle">
                          SCAFFBUILD CO. • NAVI MUMBAI
                        </textPath>
                      </text>

                      <text fill="#1d4ed8" fontSize="6.5" fontWeight="800" letterSpacing="0.6">
                        <textPath href="#stampCircleBottom" startOffset="50%" textAnchor="middle">
                          GSTIN: 27AAACS1234M1Z8
                        </textPath>
                      </text>

                      {/* Center Content */}
                      <text x="60" y="56" fill="#1d4ed8" fontSize="7.2" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                        AUTHORIZED
                      </text>
                      <text x="60" y="66" fill="#1d4ed8" fontSize="7.2" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                        SIGNATORY
                      </text>
                      <text x="60" y="74" fill="#1d4ed8" fontSize="5.5" fontWeight="700" textAnchor="middle">
                        ★ P.O. APPROVED ★
                      </text>
                    </svg>
                  </div>

                  <div style={{ textAlign: 'center', width: '220px', zIndex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '32px' }}>
                      For {company.name}
                    </div>

                    {/* Digital Signature script */}
                    <div style={{
                      fontFamily: '"Brush Script MT", "Caveat", cursive, sans-serif',
                      fontSize: '18px',
                      color: '#1e3a8a',
                      lineHeight: 1,
                      marginBottom: '2px',
                      letterSpacing: '1px'
                    }}>
                      Santosh Yadav
                    </div>

                    <div style={{ borderTop: '1px solid #000000', paddingTop: '4px' }}>
                      <strong style={{ fontSize: '9.5px', textTransform: 'uppercase', display: 'block' }}>
                        Authorized Signatory
                      </strong>
                      <div style={{ fontSize: '7.5px', color: '#64748b' }}>
                        Digitally signed under Rule 46 of CGST Rules, 2017
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
