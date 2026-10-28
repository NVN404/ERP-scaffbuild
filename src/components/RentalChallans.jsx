import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Printer, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function RentalChallans({ 
  challans, 
  setChallans, 
  inventory, 
  setInventory, 
  clients, 
  company,
  onGenerateInvoiceFromChallan,
  onGenerateEwayBillFromChallan
}) {
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [printChallan, setPrintChallan] = useState(null);

  // New Challan Form State
  const [newChallan, setNewChallan] = useState({
    challanNo: `DC/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().slice(0, 10),
    clientId: clients[0]?.id || '',
    siteName: 'Main Project Site',
    vehicleNo: 'MH 46 BB 3421',
    driverName: 'Ramesh Patil',
    driverPhone: '+91 98200 12345',
    remarks: 'Dispatched for slab staging. Daily rental basis.',
    items: [
      { itemId: inventory[0]?.id, quantity: 100 }
    ]
  });

  // Return Audit State
  const [returnAudit, setReturnAudit] = useState({
    returnDate: new Date().toISOString().slice(0, 10),
    items: []
  });

  const handleOpenNewModal = () => {
    setNewChallan({
      challanNo: `DC/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().slice(0, 10),
      clientId: clients[0]?.id || '',
      siteName: clients[0]?.activeSites?.[0] || 'Project Site',
      vehicleNo: 'MH 46 BB 3421',
      driverName: 'Santosh Yadav',
      driverPhone: '+91 98670 11234',
      remarks: 'Dispatched for slab staging. Daily rental basis.',
      items: [
        { itemId: inventory[0]?.id, quantity: 200 },
        { itemId: inventory[4]?.id, quantity: 150 }
      ]
    });
    setIsNewModalOpen(true);
  };

  const handleAddItemToNewChallan = () => {
    setNewChallan(prev => ({
      ...prev,
      items: [...prev.items, { itemId: inventory[0]?.id, quantity: 50 }]
    }));
  };

  const handleRemoveItemFromNewChallan = (index) => {
    setNewChallan(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleCreateChallan = (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === newChallan.clientId);

    const detailedItems = newChallan.items.map(it => {
      const invItem = inventory.find(i => i.id === it.itemId);
      return {
        itemId: it.itemId,
        name: invItem ? invItem.name : "Shuttering Item",
        quantity: Number(it.quantity) || 1,
        unit: invItem?.unit || "Pcs",
        ratePerDay: invItem?.dailyRent || 2,
        weightKg: invItem?.weightKg || 10
      };
    });

    const totalWeightKg = detailedItems.reduce((acc, it) => acc + (it.quantity * it.weightKg), 0);

    const createdChallan = {
      id: `DC-${Date.now()}`,
      type: 'outward',
      challanNo: newChallan.challanNo,
      date: newChallan.date,
      clientId: newChallan.clientId,
      clientName: client?.name || "Contractor",
      siteName: newChallan.siteName,
      vehicleNo: newChallan.vehicleNo,
      driverName: newChallan.driverName,
      driverPhone: newChallan.driverPhone,
      status: 'active',
      items: detailedItems,
      totalWeightKg,
      remarks: newChallan.remarks
    };

    // Update inventory (increase onRent stock)
    setInventory(prev => prev.map(inv => {
      const match = detailedItems.find(d => d.itemId === inv.id);
      if (match) {
        return {
          ...inv,
          onRent: (inv.onRent || 0) + match.quantity
        };
      }
      return inv;
    }));

    setChallans(prev => [createdChallan, ...prev]);
    setIsNewModalOpen(false);
  };

  const handleOpenReturnModal = (challan) => {
    setSelectedChallan(challan);
    setReturnAudit({
      returnDate: new Date().toISOString().slice(0, 10),
      items: challan.items.map(it => ({
        itemId: it.itemId,
        name: it.name,
        dispatchedQty: it.quantity,
        goodQty: it.quantity,
        damagedQty: 0,
        lostQty: 0,
        unit: it.unit
      }))
    });
    setIsReturnModalOpen(true);
  };

  const handleProcessReturn = (e) => {
    e.preventDefault();
    if (!selectedChallan) return;

    // Update inventory (decrease onRent, increase available or underRepair)
    setInventory(prev => prev.map(inv => {
      const match = returnAudit.items.find(r => r.itemId === inv.id);
      if (match) {
        const totalReturned = Number(match.goodQty) + Number(match.damagedQty);
        return {
          ...inv,
          onRent: Math.max(0, (inv.onRent || 0) - match.dispatchedQty),
          underRepair: (inv.underRepair || 0) + Number(match.damagedQty)
        };
      }
      return inv;
    }));

    // Mark challan as returned
    setChallans(prev => prev.map(c => {
      if (c.id === selectedChallan.id) {
        return {
          ...c,
          status: 'returned',
          returnDate: returnAudit.returnDate,
          returnAudit: returnAudit.items
        };
      }
      return c;
    }));

    setIsReturnModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Site Delivery & Return Challans</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Track outward site dispatches, physical return audit (Good, Damaged, Lost), and rental accumulation
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenNewModal}>
          <Plus size={16} />
          <span>New Delivery Challan (Outward)</span>
        </button>
      </div>

      {/* Challans List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Date</th>
                <th>Contractor & Site</th>
                <th>Vehicle & Driver</th>
                <th>Dispatched Items</th>
                <th>Weight (MT)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challans.map((challan) => {
                const isActive = challan.status === 'active';
                return (
                  <tr key={challan.id}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--amber-light)' }}>
                      {challan.challanNo}
                    </td>
                    <td>{challan.date}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{challan.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Site: {challan.siteName}</div>
                    </td>
                    <td>
                      <div className="mono" style={{ fontWeight: 600 }}>{challan.vehicleNo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{challan.driverName}</div>
                    </td>
                    <td>
                      {challan.items.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '0.78rem' }}>
                          • {it.quantity} {it.unit} {it.name.split('(')[0]}
                        </div>
                      ))}
                    </td>
                    <td className="mono">{((challan.totalWeightKg || 0) / 1000).toFixed(2)} MT</td>
                    <td>
                      {isActive ? (
                        <span className="badge badge-info">ON SITE (RENTING)</span>
                      ) : (
                        <span className="badge badge-gst">RETURNED & AUDITED</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        
                        {isActive && (
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Audit Inward Material Return"
                            onClick={() => handleOpenReturnModal(challan)}
                            style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                          >
                            <RotateCcw size={13} />
                            <span>Return</span>
                          </button>
                        )}

                        <button 
                          className="btn btn-outline btn-sm"
                          title="Generate Invoice / Bill from this Challan"
                          onClick={() => onGenerateInvoiceFromChallan(challan)}
                        >
                          <FileText size={13} />
                          <span>Bill</span>
                        </button>

                        <button 
                          className="btn btn-outline btn-sm"
                          title="Generate E-Way Bill for transport"
                          onClick={() => onGenerateEwayBillFromChallan(challan)}
                        >
                          <ShieldCheck size={13} />
                          <span>E-Way</span>
                        </button>

                        <button 
                          className="btn btn-outline btn-sm"
                          title="Print Official Delivery Challan"
                          onClick={() => setPrintChallan(challan)}
                        >
                          <Printer size={13} />
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

      {/* New Delivery Challan Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Generate Delivery Challan (Outward Dispatch)</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsNewModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateChallan}>
              <div className="modal-body">
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Challan Number</label>
                    <input 
                      type="text" 
                      className="form-input mono"
                      value={newChallan.challanNo}
                      onChange={(e) => setNewChallan({ ...newChallan, challanNo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dispatch Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={newChallan.date}
                      onChange={(e) => setNewChallan({ ...newChallan, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contractor / Client</label>
                    <select 
                      className="form-select"
                      value={newChallan.clientId}
                      onChange={(e) => {
                        const selClient = clients.find(c => c.id === e.target.value);
                        setNewChallan({ 
                          ...newChallan, 
                          clientId: e.target.value,
                          siteName: selClient?.activeSites?.[0] || 'Project Site'
                        });
                      }}
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Site Location</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newChallan.siteName}
                      onChange={(e) => setNewChallan({ ...newChallan, siteName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Number</label>
                    <input 
                      type="text" 
                      className="form-input mono"
                      placeholder="e.g. MH 46 BB 3421"
                      value={newChallan.vehicleNo}
                      onChange={(e) => setNewChallan({ ...newChallan, vehicleNo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Driver Name & Phone</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Driver Name"
                      value={newChallan.driverName}
                      onChange={(e) => setNewChallan({ ...newChallan, driverName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Dispatch Items List */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber-light)' }}>
                      Scaffolding & Shuttering Items to Dispatch:
                    </span>
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddItemToNewChallan}>
                      <Plus size={13} />
                      <span>Add Item</span>
                    </button>
                  </div>

                  {newChallan.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <select 
                        className="form-select" 
                        style={{ flex: 3 }}
                        value={it.itemId}
                        onChange={(e) => {
                          const updated = [...newChallan.items];
                          updated[idx].itemId = e.target.value;
                          setNewChallan({ ...newChallan, items: updated });
                        }}
                      >
                        {inventory.map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name} (Avail: {(inv.totalStock - inv.onRent - inv.underRepair)})
                          </option>
                        ))}
                      </select>

                      <input 
                        type="number" 
                        className="form-input mono" 
                        style={{ flex: 1 }}
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={(e) => {
                          const updated = [...newChallan.items];
                          updated[idx].quantity = e.target.value;
                          setNewChallan({ ...newChallan, items: updated });
                        }}
                        min="1"
                        required
                      />

                      <button 
                        type="button" 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItemFromNewChallan(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: '0.85rem' }}>
                  <label className="form-label">Remarks / Terms</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={newChallan.remarks}
                    onChange={(e) => setNewChallan({ ...newChallan, remarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Issue Delivery Challan & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Audit Modal */}
      {isReturnModalOpen && selectedChallan && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inward Return Audit - {selectedChallan.challanNo}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Audit returned items for damage, bending, or missing quantities
                </p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setIsReturnModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleProcessReturn}>
              <div className="modal-body">
                <div className="form-group" style={{ maxWidth: '240px', marginBottom: '1rem' }}>
                  <label className="form-label">Return Date</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={returnAudit.returnDate}
                    onChange={(e) => setReturnAudit({ ...returnAudit, returnDate: e.target.value })}
                    required
                  />
                </div>

                <div className="table-responsive">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Dispatched</th>
                        <th>Good / Reusable</th>
                        <th>Damaged / Bent</th>
                        <th>Lost / Missing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnAudit.items.map((it, idx) => (
                        <tr key={it.itemId}>
                          <td style={{ fontWeight: 600 }}>{it.name}</td>
                          <td className="mono">{it.dispatchedQty} {it.unit}</td>
                          <td>
                            <input 
                              type="number" 
                              className="form-input mono" 
                              style={{ width: '90px' }}
                              value={it.goodQty}
                              onChange={(e) => {
                                const updated = [...returnAudit.items];
                                updated[idx].goodQty = e.target.value;
                                setReturnAudit({ ...returnAudit, items: updated });
                              }}
                              min="0"
                            />
                          </td>
                          <td>
                            <input 
                              type="number" 
                              className="form-input mono" 
                              style={{ width: '90px', borderColor: it.damagedQty > 0 ? '#fbbf24' : 'inherit' }}
                              value={it.damagedQty}
                              onChange={(e) => {
                                const updated = [...returnAudit.items];
                                updated[idx].damagedQty = e.target.value;
                                setReturnAudit({ ...returnAudit, items: updated });
                              }}
                              min="0"
                            />
                          </td>
                          <td>
                            <input 
                              type="number" 
                              className="form-input mono" 
                              style={{ width: '90px', borderColor: it.lostQty > 0 ? '#fb7185' : 'inherit' }}
                              value={it.lostQty}
                              onChange={(e) => {
                                const updated = [...returnAudit.items];
                                updated[idx].lostQty = e.target.value;
                                setReturnAudit({ ...returnAudit, items: updated });
                              }}
                              min="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  💡 <strong>Audit Note:</strong> Good items will be returned to Yard Available stock. Damaged items will be moved to Repair bay and flagged for repair cost billing. Lost items can be billed at replacement value.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsReturnModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Complete Inward Return & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Delivery Challan Modal / Printable Sheet */}
      {printChallan && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', background: '#f8fafc' }}>
            <div className="modal-header no-print" style={{ background: '#0f172a', color: '#fff' }}>
              <h3>Official Delivery Challan Print Preview</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setPrintChallan(null)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="print-sheet" style={{ margin: 0, padding: '2rem' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase' }}>{company.name}</h2>
                <p style={{ fontSize: '0.8rem' }}>{company.address}</p>
                <p style={{ fontSize: '0.8rem' }}>GSTIN: <strong>{company.gstin}</strong> | State: <strong>{company.state} (Code: {company.stateCode})</strong> | Phone: {company.phone}</p>
                <div style={{ display: 'inline-block', border: '1px solid #000', padding: '3px 14px', fontWeight: 800, marginTop: '6px', fontSize: '0.9rem' }}>
                  MATERIAL DELIVERY CHALLAN (HIRE / RENTAL)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ border: '1px solid #94a3b8', padding: '0.6rem' }}>
                  <div><strong>Consignee / Client:</strong> {printChallan.clientName}</div>
                  <div><strong>Site Location:</strong> {printChallan.siteName}</div>
                </div>
                <div style={{ border: '1px solid #94a3b8', padding: '0.6rem' }}>
                  <div><strong>Challan No:</strong> {printChallan.challanNo}</div>
                  <div><strong>Date:</strong> {printChallan.date}</div>
                  <div><strong>Vehicle No:</strong> {printChallan.vehicleNo}</div>
                  <div><strong>Driver:</strong> {printChallan.driverName}</div>
                </div>
              </div>

              <table className="sheet-border-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Material Description</th>
                    <th>HSN</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Unit Wt (Kg)</th>
                    <th>Total Wt (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {printChallan.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{item.name}</strong></td>
                      <td>73084000</td>
                      <td><strong>{item.quantity}</strong></td>
                      <td>{item.unit}</td>
                      <td>{item.weightKg}</td>
                      <td>{(item.quantity * item.weightKg).toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total Consignment Weight:</strong></td>
                    <td colSpan="4"><strong>{(printChallan.totalWeightKg / 1000).toFixed(2)} Metric Tonnes ({printChallan.totalWeightKg} Kg)</strong></td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontSize: '0.78rem', marginTop: '1rem', borderTop: '1px solid #94a3b8', paddingTop: '0.5rem' }}>
                <p><strong>Terms:</strong> Material delivered in sound working condition on rental basis. Hirer is responsible for site safety, timely return, and damages/loss during hire tenure.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', fontSize: '0.85rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderTop: '1px solid #000', width: '180px', paddingTop: '4px' }}>Receiver's Signature & Stamp</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderTop: '1px solid #000', width: '180px', paddingTop: '4px' }}>For {company.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
