import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Truck, 
  Building2, 
  Sparkles, 
  IndianRupee,
  FileCheck2,
  HardHat
} from 'lucide-react';

export default function OwnerQuotationManager({ 
  quotations, 
  setQuotations, 
  clients, 
  inventory, 
  company,
  onConvertQuotationToInvoice,
  onConvertQuotationToChallan 
}) {
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable Quotation Form for Owner
  const [editingQuot, setEditingQuot] = useState(null);

  const handleOpenSendQuotation = (quot) => {
    setEditingQuot({
      ...quot,
      items: quot.items.map(it => {
        const invMatch = inventory.find(i => i.name.toLowerCase().includes(it.name.toLowerCase().slice(0, 10)));
        const rate = it.ratePerDay || invMatch?.dailyRent || 2;
        const days = it.days || 30;
        return {
          ...it,
          ratePerDay: rate,
          days,
          amount: Number((it.qty * rate * days).toFixed(2))
        };
      }),
      transportFreight: quot.transportFreight || 4500,
      loadingHamali: quot.loadingHamali || 2500,
      ownerReply: quot.ownerReply || "Special commercial rates applied with 100% inspected props & plates. Immediate dispatch available."
    });
    setIsEditModalOpen(true);
  };

  const handleItemRateChange = (idx, newRate) => {
    const updated = [...editingQuot.items];
    const r = Number(newRate) || 0;
    updated[idx].ratePerDay = r;
    updated[idx].amount = Number((updated[idx].qty * r * (updated[idx].days || 30)).toFixed(2));
    setEditingQuot({ ...editingQuot, items: updated });
  };

  const handleSaveAndSendQuotation = (e) => {
    e.preventDefault();

    const itemsSubtotal = editingQuot.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const extra = (Number(editingQuot.transportFreight) || 0) + (Number(editingQuot.loadingHamali) || 0);
    const taxable = itemsSubtotal + extra;
    const gst = Number(((taxable * 18) / 100).toFixed(2));
    const grand = Math.round(taxable + gst);

    const finalizedQuot = {
      ...editingQuot,
      status: 'quotation_sent', // Sent to builder for acceptance!
      taxableAmount: taxable,
      gstAmount: gst,
      grandTotal: grand
    };

    setQuotations(prev => prev.map(q => q.id === finalizedQuot.id ? finalizedQuot : q));
    setIsEditModalOpen(false);
    alert(`✅ Quotation Order "${finalizedQuot.quotationNo}" sent to ${finalizedQuot.clientName}! The builder can now accept it and issue a Work Order.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Client Quotation Orders & Work Orders Hub</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Review incoming builder inquiries, send customized quotation orders, and receive official work orders
          </p>
        </div>

        <span className="badge badge-gst">
          Total Quotations: {quotations.length}
        </span>
      </div>

      {/* Quotations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {quotations.map((quot) => {
          const isRequested = quot.status === 'requested';
          const isQuotationSent = quot.status === 'quotation_sent';
          const isWorkOrder = quot.status === 'work_order_created';

          return (
            <div key={quot.id} className="card">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--orange-primary)' }}>
                      {quot.quotationNo}
                    </span>

                    {isRequested && (
                      <span className="badge badge-non-gst">
                        ⚡ NEW CLIENT INQUIRY (AWAITING YOUR RATES)
                      </span>
                    )}

                    {isQuotationSent && (
                      <span className="badge badge-info">
                        QUOTATION ORDER SENT TO BUILDER
                      </span>
                    )}

                    {isWorkOrder && (
                      <span className="badge badge-gst">
                        ✓ WORK ORDER ISSUED: {quot.workOrderNo}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.35rem', fontWeight: 700 }}>
                    Builder: {quot.clientName} ({quot.contactPerson}) {quot.workPurpose && <span className="badge badge-neutral" style={{ fontSize: '0.72rem', marginLeft: '6px' }}>{quot.workPurpose}</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Site: <strong>{quot.siteName}</strong> • Date: {quot.date} • Required Area: <strong>{quot.requestedAreaSqft?.toLocaleString()} Sq.Ft</strong>{quot.tenureMonths ? ` • Duration: ${quot.tenureMonths} Month(s)` : ''}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>QUOTATION AMOUNT (INCL. GST)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                    ₹{(quot.grandTotal || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="table-responsive" style={{ margin: '1rem 0' }}>
                <table className="erp-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Equipment / Shuttering Item</th>
                      <th>Qty Requested</th>
                      <th>Unit</th>
                      <th>Daily Rent (₹)</th>
                      <th>Days</th>
                      <th style={{ textAlign: 'right' }}>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quot.items.map((it, idx) => (
                      <tr key={idx}>
                        <td><strong>{it.name}</strong></td>
                        <td className="mono">{it.qty}</td>
                        <td>{it.unit}</td>
                        <td className="mono">{it.ratePerDay ? `₹${it.ratePerDay}/d` : <span style={{ color: 'var(--orange-primary)' }}>Not priced</span>}</td>
                        <td className="mono">{it.days || 30}</td>
                        <td className="mono" style={{ textAlign: 'right' }}>
                          ₹{(it.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes & Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div>Client Message: <em>"{quot.clientNotes}"</em></div>
                  {quot.ownerReply && <div style={{ color: 'var(--orange-primary)', marginTop: '2px' }}>Your Reply: <strong>"{quot.ownerReply}"</strong></div>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isRequested && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleOpenSendQuotation(quot)}
                    >
                      <Send size={14} />
                      <span>Prepare & Send Quotation Order</span>
                    </button>
                  )}

                  {isQuotationSent && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenSendQuotation(quot)}
                    >
                      <span>Update Rates / Resend</span>
                    </button>
                  )}

                  {isWorkOrder && (
                    <>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onConvertQuotationToInvoice(quot)}
                      >
                        <FileText size={14} />
                        <span>Generate Invoice</span>
                      </button>

                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onConvertQuotationToChallan(quot)}
                      >
                        <Truck size={14} />
                        <span>Issue Challan</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL: PREPARE & SEND QUOTATION ORDER */}
      {isEditModalOpen && editingQuot && (() => {
        const currentSubtotal = editingQuot.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
        const currentExtras = (Number(editingQuot.transportFreight) || 0) + (Number(editingQuot.loadingHamali) || 0);
        const currentTaxable = currentSubtotal + currentExtras;
        const currentGst = Number(((currentTaxable * 18) / 100).toFixed(2));
        const currentGrand = Math.round(currentTaxable + currentGst);

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '820px', maxHeight: 'calc(100vh - 3rem)', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    Prepare Quotation Order for {editingQuot.clientName}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Quotation No: <strong>{editingQuot.quotationNo}</strong> • Site: <strong>{editingQuot.siteName}</strong>
                  </p>
                </div>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditModalOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleSaveAndSendQuotation} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div className="modal-body" style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0, padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--orange-primary)' }}>
                    Set Daily Rental Rates for Client's Requested Items:
                  </div>

                  <div className="table-responsive">
                    <table className="erp-table">
                      <thead>
                        <tr>
                          <th>Material</th>
                          <th>Qty</th>
                          <th>Days</th>
                          <th>Your Daily Rate (₹)</th>
                          <th style={{ textAlign: 'right' }}>Line Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingQuot.items.map((it, idx) => (
                          <tr key={idx}>
                            <td><strong>{it.name}</strong></td>
                            <td className="mono">{it.qty} {it.unit}</td>
                            <td className="mono">{it.days || 30}</td>
                            <td>
                              <input 
                                type="number" 
                                step="0.1"
                                className="form-input mono"
                                style={{ width: '100px' }}
                                value={it.ratePerDay}
                                onChange={(e) => handleItemRateChange(idx, e.target.value)}
                                required
                              />
                            </td>
                            <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                              ₹{(it.amount || 0).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid-2" style={{ margin: '1rem 0' }}>
                    <div className="form-group">
                      <label className="form-label">Transport Freight Charges (₹)</label>
                      <input 
                        type="number" 
                        className="form-input mono"
                        value={editingQuot.transportFreight}
                        onChange={(e) => setEditingQuot({ ...editingQuot, transportFreight: Number(e.target.value) })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Loading / Unloading Hamali (₹)</label>
                      <input 
                        type="number" 
                        className="form-input mono"
                        value={editingQuot.loadingHamali}
                        onChange={(e) => setEditingQuot({ ...editingQuot, loadingHamali: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Offer / Reply Message to Builder</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2"
                      value={editingQuot.ownerReply}
                      onChange={(e) => setEditingQuot({ ...editingQuot, ownerReply: e.target.value })}
                    />
                  </div>

                  {/* Real-time Financial Calculation Summary Card */}
                  <div style={{ 
                    background: 'var(--orange-soft)', 
                    border: '1px solid var(--orange-soft-border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '0.85rem 1rem', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginTop: '0.75rem' 
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taxable Subtotal (Items + Freight + Hamali)</div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        ₹{currentTaxable.toLocaleString('en-IN')} + 18% GST (₹{currentGst.toLocaleString('en-IN')})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Final Quotation Value</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)' }}>
                        ₹{currentGrand.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ flexShrink: 0 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Send size={15} />
                    <span>Send Quotation Order (₹{currentGrand.toLocaleString('en-IN')})</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
