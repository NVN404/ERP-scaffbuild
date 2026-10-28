import React from 'react';
import { 
  Layers, 
  Truck, 
  IndianRupee, 
  Calculator, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2, 
  Wrench,
  TrendingUp,
  FileText,
  ShieldCheck,
  PlusCircle,
  Send,
  HardHat
} from 'lucide-react';

export default function Dashboard({ 
  inventory = [], 
  challans = [], 
  invoices = [], 
  clients = [], 
  setActiveTab,
  onOpenNewInvoice,
  onOpenNewChallan
}) {
  // Aggregate Inventory
  const totalPcs = inventory.reduce((sum, item) => sum + (item.totalStock || 0), 0);
  const onRentPcs = inventory.reduce((sum, item) => sum + (item.onRent || 0), 0);
  const repairPcs = inventory.reduce((sum, item) => sum + (item.underRepair || 0), 0);
  const availablePcs = totalPcs - onRentPcs - repairPcs;
  
  // Total Tonnage
  const totalWeightTonnes = (inventory.reduce((sum, item) => sum + ((item.totalStock || 0) * (item.weightKg || 0)), 0) / 1000).toFixed(1);
  const onRentWeightTonnes = (inventory.reduce((sum, item) => sum + ((item.onRent || 0) * (item.weightKg || 0)), 0) / 1000).toFixed(1);

  // Financials
  const gstInvoices = invoices.filter(i => i.billingType === 'with_gst');
  const nonGstInvoices = invoices.filter(i => i.billingType === 'without_gst');

  const gstBilled = gstInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const nonGstBilled = nonGstInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const totalBilled = gstBilled + nonGstBilled;

  const totalOutstanding = clients.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
  const totalDeposits = clients.reduce((sum, c) => sum + (c.securityDeposit || 0), 0);

  // Active Challans
  const activeChallans = challans.filter(c => c.status === 'active');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
      
      {/* Top Banner / Quick Action Bar */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #ffffff 40%, #fff7ed 100%)',
        border: '1px solid var(--border-orange)',
        padding: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-gst">YARD STATUS: OPERATIONAL</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--orange-primary)' }}>
              Navi Mumbai Heavy Yard 3
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
            Shuttering & Scaffolding Operations Hub
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Dual billing (With GST 18% & Without GST Cash Challan), Builder Quotations, and Field Service Deliveries.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onOpenNewInvoice('with_gst')}
          >
            <PlusCircle size={16} />
            <span>New Tax Invoice (GST)</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => onOpenNewInvoice('without_gst')}
            style={{ borderColor: 'var(--border-orange)', color: 'var(--orange-dark)' }}
          >
            <FileText size={16} />
            <span>New Non-GST Estimate</span>
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => setActiveTab('quotations')}
          >
            <Send size={15} />
            <span>Send Quotation to Builder</span>
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => setActiveTab('calculator')}
          >
            <Calculator size={15} />
            <span>Area & Cu.M Calculator</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid-4">
        {/* Total Stock */}
        <div className="card" style={{ borderLeft: '4px solid var(--orange-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL YARD INVENTORY</span>
            <div style={{ background: 'var(--orange-soft)', padding: '6px', borderRadius: '8px', color: 'var(--orange-primary)' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
            {totalPcs.toLocaleString('en-IN')} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Pcs</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Total Weight: <strong style={{ color: 'var(--orange-dark)' }}>{totalWeightTonnes} Metric Tonnes</strong>
          </div>
        </div>

        {/* On Rent / Site */}
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>DISPATCHED ON SITE</span>
            <div style={{ background: 'var(--blue-soft)', padding: '6px', borderRadius: '8px', color: '#2563eb' }}>
              <Truck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: 'var(--font-mono)', color: '#2563eb' }}>
            {onRentPcs.toLocaleString('en-IN')} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Pcs</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {((onRentPcs / (totalPcs || 1)) * 100).toFixed(0)}% utilization ({onRentWeightTonnes} Tonnes)
          </div>
        </div>

        {/* Available in Yard */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>AVAILABLE IN YARD</span>
            <div style={{ background: 'var(--emerald-soft)', padding: '6px', borderRadius: '8px', color: '#059669' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: 'var(--font-mono)', color: '#059669' }}>
            {availablePcs.toLocaleString('en-IN')} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Pcs</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Ready for instant dispatch & delivery
          </div>
        </div>

        {/* Under Repair / Damage */}
        <div className="card" style={{ borderLeft: '4px solid #e11d48' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>UNDER REPAIR / DAMAGE</span>
            <div style={{ background: 'var(--rose-soft)', padding: '6px', borderRadius: '8px', color: '#e11d48' }}>
              <Wrench size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: 'var(--font-mono)', color: '#e11d48' }}>
            {repairPcs.toLocaleString('en-IN')} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Pcs</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Straightening, cup-welding & reconditioning
          </div>
        </div>
      </div>

      {/* Financial Split: GST vs Non-GST & Receivables */}
      <div className="grid-3">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Total Billing Revenue</h3>
            <span className="badge badge-info">This Month</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
                Tax Invoices (With 18% GST)
              </span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#059669' }}>₹{gstBilled.toLocaleString('en-IN')}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--orange-primary)' }}></span>
                Non-GST Challans / Estimates
              </span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--orange-dark)' }}>₹{nonGstBilled.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Client Receivables & Security</h3>
            <span className="badge badge-non-gst">Credit Ledger</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>OUTSTANDING BALANCE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SECURITY DEPOSITS HELD</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                ₹{totalDeposits.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Active Construction Clients</span>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('contractors')}>
              <span>View Clients</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Indian Statutory Compliance</h3>
            <span className="badge badge-gst">Govt Portal Ready</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Free GSTIN Instant Validation with Luhn Checksum</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Govt Form GST EWB-01 (NIC E-Way Bill) JSON</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>IRP Schema INV-01 E-Invoice 64-char IRN & QR</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>HSN 7308 & SAC 9973 Automatic CGST/SGST/IGST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Site Dispatches & Challans Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Active Material Dispatches at Sites</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Currently rented scaffolding materials accumulating daily hire charges
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('challans')}>
            <Truck size={14} />
            <span>Manage All Challans</span>
          </button>
        </div>

        <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Date</th>
                <th>Contractor / Client</th>
                <th>Site Location</th>
                <th>Vehicle No</th>
                <th>Items Dispatched</th>
                <th>Total Weight</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeChallans.map((challan) => (
                <tr key={challan.id}>
                  <td className="mono" style={{ fontWeight: 800, color: 'var(--orange-primary)' }}>
                    {challan.challanNo}
                  </td>
                  <td>{challan.date}</td>
                  <td style={{ fontWeight: 700 }}>{challan.clientName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{challan.siteName}</td>
                  <td className="mono">{challan.vehicleNo}</td>
                  <td>
                    {challan.items.map((it, idx) => (
                      <span key={idx} style={{ display: 'block', fontSize: '0.78rem' }}>
                        • {it.quantity} {it.unit} - {it.name.split('(')[0]}
                      </span>
                    ))}
                  </td>
                  <td className="mono">{(challan.totalWeightKg / 1000).toFixed(2)} MT</td>
                  <td>
                    <span className="badge badge-info">ON SITE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Stock Utilization Snapshot */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Yard Material Categories & Stock Health</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Breakdown of props, plates, cuplock verticals, ledgers, and acrow spans
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('inventory')}>
            <span>View Full Inventory</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {['Shuttering Plates', 'Telescopic Props', 'Cuplock System', 'Spans & Beams', 'Pipes & Couplers'].map((cat) => {
            const catItems = inventory.filter(i => i.category === cat);
            const total = catItems.reduce((acc, i) => acc + (i.totalStock || 0), 0);
            const onRent = catItems.reduce((acc, i) => acc + (i.onRent || 0), 0);
            const pct = total > 0 ? Math.round((onRent / total) * 100) : 0;
            return (
              <div key={cat} style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cat}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--orange-dark)' }}>{pct}% On Rent</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #ff6b00, #fb923c)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>Dispatched: {onRent.toLocaleString()}</span>
                  <span>Total: {total.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
