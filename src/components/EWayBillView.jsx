import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  Plus, 
  Truck, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  generateEwayBillNumber, 
  formatEwayDate, 
  calculateEwayValidityDays, 
  generateNicEwayBillJson 
} from '../utils/ewayBill';

export default function EWayBillView({ 
  invoices, 
  setInvoices, 
  company, 
  clients,
  prefillInvoice 
}) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(prefillInvoice?.id || invoices[0]?.id || '');
  const [distanceKm, setDistanceKm] = useState(45);
  const [vehicleNo, setVehicleNo] = useState('MH 46 BB 3421');
  const [transporterName, setTransporterName] = useState('Direct Scaffolding Fleet');
  const [transporterId, setTransporterId] = useState('');
  const [lrNo, setLrNo] = useState(`LR-${Math.floor(10000 + Math.random() * 90000)}`);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeEwbData, setActiveEwbData] = useState(null);

  const activeInvoice = invoices.find(i => i.id === selectedInvoiceId) || invoices[0];

  const handleGenerateEwayBill = (e) => {
    e.preventDefault();
    if (!activeInvoice) return;

    const ewbNumber = activeInvoice.ewayBillNo || generateEwayBillNumber();
    const ewbDate = formatEwayDate(new Date());
    const validityDays = calculateEwayValidityDays(distanceKm);
    const validUntilDate = formatEwayDate(new Date(Date.now() + validityDays * 86400000));

    const nicJson = generateNicEwayBillJson(activeInvoice, company, {
      distanceKm,
      vehicleNo,
      transporterName,
      transporterId,
      lrNo
    });

    const ewbDetails = {
      ewbNo: ewbNumber,
      ewbDate,
      validUntil: validUntilDate,
      validityDays,
      invoice: activeInvoice,
      distanceKm,
      vehicleNo,
      transporterName,
      transporterId,
      lrNo,
      nicJson
    };

    // Update invoice with E-Way Bill Number
    setInvoices(prev => prev.map(inv => {
      if (inv.id === activeInvoice.id) {
        return {
          ...inv,
          ewayBillNo: ewbNumber,
          ewayBillDate: ewbDate
        };
      }
      return inv;
    }));

    setActiveEwbData(ewbDetails);
    setIsGenerated(true);
  };

  const handleDownloadNicJson = () => {
    if (!activeEwbData?.nicJson) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(activeEwbData.nicJson, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `NIC_EWB_${activeEwbData.ewbNo}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>NIC E-Way Bill System (Form GST EWB-01)</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Mandatory for transporting scaffolding equipment above ₹50,000 consignment value
          </p>
        </div>

        <span className="badge badge-gst">
          NIC Portal Standard v1.0.0421
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        
        {/* Generator Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--amber-light)' }}>
            1. Select Invoice & Transport Details
          </h3>

          <form onSubmit={handleGenerateEwayBill}>
            <div className="form-group">
              <label className="form-label">Base Invoice / Document</label>
              <select 
                className="form-select"
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
              >
                {invoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNo} - {inv.clientName} (₹{(inv.grandTotal || 0).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {activeInvoice && (
              <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <div><strong>Consignee:</strong> {activeInvoice.clientName}</div>
                <div><strong>GSTIN:</strong> {activeInvoice.clientGstin || 'URP (Unregistered)'}</div>
                <div><strong>Consignment Value:</strong> ₹{(activeInvoice.grandTotal || 0).toLocaleString('en-IN')}</div>
              </div>
            )}

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Distance in Kilometres</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  min="1"
                  required
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Validity: {calculateEwayValidityDays(distanceKm)} Day(s) (1 day / 200 km)
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input 
                  type="text" 
                  className="form-input mono"
                  placeholder="e.g. MH 46 BB 3421"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Transporter Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transporter Doc / LR No</label>
                <input 
                  type="text" 
                  className="form-input mono"
                  value={lrNo}
                  onChange={(e) => setLrNo(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <ShieldCheck size={16} />
                <span>Generate Official NIC E-Way Bill</span>
              </button>
            </div>
          </form>
        </div>

        {/* E-Way Bill Preview / Slip */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>E-Way Bill Status & Output</h3>
              {activeEwbData ? (
                <span className="badge badge-gst">EWB ACTIVE</span>
              ) : (
                <span className="badge badge-neutral">PENDING GENERATION</span>
              )}
            </div>

            {activeEwbData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Barcode representation */}
                <div style={{
                  background: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#000',
                  textAlign: 'center',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    GOVERNMENT OF INDIA - E-WAY BILL SYSTEM
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>FORM GST EWB-01</div>

                  <div style={{ margin: '0.75rem 0' }}>
                    <div style={{
                      display: 'inline-block',
                      letterSpacing: '5px',
                      fontSize: '1.2rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      background: '#000',
                      color: '#fff',
                      padding: '4px 16px',
                      borderRadius: '4px'
                    }}>
                      ||||||| | ||||| |||| ||||||
                    </div>
                  </div>

                  <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace' }}>
                    E-Way Bill No: {activeEwbData.ewbNo}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                    Generated Date: {activeEwbData.ewbDate} | Valid Until: <strong>{activeEwbData.validUntil}</strong>
                  </div>
                </div>

                {/* EWB Summary Info */}
                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--amber-light)', marginBottom: '0.5rem' }}>PART - A: GOODS & CONSIGNMENT</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>From: <strong>{company.gstin}</strong></div>
                    <div>To: <strong>{activeEwbData.invoice.clientGstin || 'URP'}</strong></div>
                    <div>Doc No: <strong>{activeEwbData.invoice.invoiceNo}</strong></div>
                    <div>Value: <strong>₹{(activeEwbData.invoice.grandTotal || 0).toLocaleString('en-IN')}</strong></div>
                  </div>

                  <div style={{ fontWeight: 700, color: 'var(--amber-light)', margin: '0.8rem 0 0.4rem' }}>PART - B: VEHICLE & TRANSPORT</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>Mode: <strong>Road</strong></div>
                    <div>Vehicle: <strong className="mono">{activeEwbData.vehicleNo}</strong></div>
                    <div>Transporter: <strong>{activeEwbData.transporterName}</strong></div>
                    <div>LR / Doc No: <strong className="mono">{activeEwbData.lrNo}</strong></div>
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
                <ShieldCheck size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                <p>Fill in transport details and click "Generate Official NIC E-Way Bill" to generate Form GST EWB-01.</p>
              </div>
            )}
          </div>

          {activeEwbData && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownloadNicJson}>
                <Download size={14} />
                <span>Download NIC JSON</span>
              </button>

              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>
                <Printer size={14} />
                <span>Print EWB Slip</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
