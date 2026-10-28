import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function CompanySettings({ 
  company, 
  setCompany, 
  onResetAllData, 
  onExportAllData,
  onImportAllData
}) {
  const [formData, setFormData] = useState({ ...company });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setCompany({ ...formData });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTermsChange = (index, value) => {
    const updated = [...(formData.termsAndConditions || [])];
    updated[index] = value;
    setFormData({ ...formData, termsAndConditions: updated });
  };

  const handleAddTerm = () => {
    setFormData({
      ...formData,
      termsAndConditions: [...(formData.termsAndConditions || []), `${formData.termsAndConditions.length + 1}. `]
    });
  };

  const handleRemoveTerm = (index) => {
    setFormData({
      ...formData,
      termsAndConditions: formData.termsAndConditions.filter((_, i) => i !== index)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Yard Business Profile & Tax Settings</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Configure your GSTIN, registered yard address, bank details, and invoice terms
          </p>
        </div>

        {savedSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Company Identity */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--amber-light)' }}>
            1. Company Legal & GST Registration
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Company Legal Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Tagline / Trade Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">GSTIN Number (15 Characters)</label>
              <input 
                type="text" 
                className="form-input mono"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company PAN</label>
              <input 
                type="text" 
                className="form-input mono"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State & State Code</label>
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
          </div>

          <div className="form-group">
            <label className="form-label">Main Yard / Registered Address</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Phone Number(s)</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Email</label>
              <input 
                type="email" 
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--amber-light)' }}>
            2. Bank Account Details (Printed on Invoices for RTGS/NEFT)
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch & City</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.bankBranch}
                onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Current Account Number</label>
              <input 
                type="text" 
                className="form-input mono"
                value={formData.accountNo}
                onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input 
                type="text" 
                className="form-input mono"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
        </div>

        {/* Standard Terms */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--amber-light)' }}>
              3. Standard Shuttering Hire Terms & Conditions
            </h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleAddTerm}>
              + Add Term
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {formData.termsAndConditions?.map((term, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input"
                  value={term}
                  onChange={(e) => handleTermsChange(idx, e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveTerm(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* IRIS IRP & NIC E-Way Bill Integration Hub (₹0 Free Core APIs) */}
        <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid var(--orange-primary)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                  4. IRIS IRP & NIC E-Way Bill Integration Hub
                </h3>
                <span className="badge badge-gst">Published Core APIs: FREE</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Official GSTN / IRP developer routes for sandbox testing, IRN generation, and E-Way bill operations
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a 
                href="https://einvoice6.gst.gov.in/content/e-invoice-apis-for-solution-providers/" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                <span>IRIS IRP Docs</span>
              </a>
              <a 
                href="https://docs.ewaybillgst.gov.in/apidocs/" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                <span>NIC E-Way Bill Portal</span>
              </a>
            </div>
          </div>

          <div style={{ background: 'var(--orange-soft)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-orange)', fontSize: '0.82rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--orange-dark)', marginBottom: '3px' }}>
              💡 ₹0 Architecture Recommendation:
            </div>
            <div>
              1. <strong>Local Invoice Engine (Active)</strong>: In-app tax calculation (CGST/SGST/IGST), Rule 46 numbering, and offline JSON generation are 100% free with zero recurring cost.
            </div>
            <div style={{ marginTop: '2px' }}>
              2. <strong>IRIS IRP (einvoice6.gst.gov.in)</strong>: Free core APIs for IRN generation, cancellation, and invoice retrieval upon solution provider registration & sandbox validation.
            </div>
            <div style={{ marginTop: '2px' }}>
              3. <strong>NIC Sandbox (`einv-apisandbox.nic.in`)</strong>: Validate payloads and test B2B workflows before production onboarding.
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">IRP / Solution Provider Client ID</label>
              <input 
                type="text" 
                className="form-input mono"
                placeholder="e.g. IRIS_GSP_CLIENT_44912"
                defaultValue="IRIS_SANDBOX_DEMO_SCAFF"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client Secret / API Key</label>
              <input 
                type="password" 
                className="form-input mono"
                placeholder="••••••••••••••••••••••••"
                defaultValue="secret_sandbox_gstn_key_2026"
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">API Gateway Environment</label>
              <select className="form-select" defaultValue="sandbox">
                <option value="sandbox">IRIS IRP Sandbox (einv-apisandbox.nic.in) [Free Testing]</option>
                <option value="production">Govt Production IRP (einvoice6.gst.gov.in) [Registered GSTIN]</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default NIC HSN/SAC Code</label>
              <input 
                type="text" 
                className="form-input mono"
                defaultValue="997312"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>SAC 997312 = Scaffolding & Machinery Rental</span>
            </div>

            <div className="form-group">
              <label className="form-label">E-Way Bill Integration</label>
              <select className="form-select" defaultValue="auto">
                <option value="auto">Auto-Generate for Consignments &gt; ₹50,000</option>
                <option value="manual">Manual E-Way Bill Creation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
            <Save size={16} />
            <span>Save Company Profile & API Config</span>
          </button>
        </div>
      </form>

      {/* Data Management & Backup */}
      <div className="card" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Data Backup & System Maintenance</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Export all shuttering inventory, challans, invoices, and client records as a single JSON backup.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onExportAllData}>
            <Download size={14} />
            <span>Export Full ERP Backup (JSON)</span>
          </button>

          <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={14} />
            <span>Restore Backup JSON</span>
            <input 
              type="file" 
              accept=".json"
              style={{ display: 'none' }}
              onChange={onImportAllData}
            />
          </label>

          <button className="btn btn-danger" onClick={onResetAllData}>
            <RotateCcw size={14} />
            <span>Reset to Demo Sample Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
