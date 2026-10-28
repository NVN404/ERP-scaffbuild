import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  Trash2, 
  FileText, 
  Truck,
  RefreshCw
} from 'lucide-react';
import { lookupGstDetails } from '../utils/gstApi';

export default function Contractors({ 
  clients, 
  setClients, 
  onNewInvoiceForClient, 
  onNewChallanForClient 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [gstSearchLoading, setGstSearchLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    tradeName: '',
    gstin: '',
    pan: '',
    state: 'Maharashtra',
    stateCode: '27',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    activeSites: ['Main Project Site'],
    billingTypePreference: 'with_gst',
    outstandingBalance: 0,
    securityDeposit: 0
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tradeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      tradeName: '',
      gstin: '',
      pan: '',
      state: 'Maharashtra',
      stateCode: '27',
      address: '',
      phone: '',
      email: '',
      contactPerson: '',
      activeSites: ['Main Project Site'],
      billingTypePreference: 'with_gst',
      outstandingBalance: 0,
      securityDeposit: 50000
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contractor profile?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleGstLookup = async () => {
    if (!formData.gstin) {
      alert("Please enter a 15-digit GSTIN.");
      return;
    }
    setGstSearchLoading(true);
    try {
      const res = await lookupGstDetails(formData.gstin);
      setFormData(prev => ({
        ...prev,
        name: res.legalName || prev.name,
        tradeName: res.tradeName || prev.tradeName,
        address: res.address || prev.address,
        state: res.state || prev.state,
        stateCode: res.stateCode || prev.stateCode,
        pan: res.pan || prev.pan,
        billingTypePreference: 'with_gst'
      }));
    } catch (err) {
      alert(err.message || "Could not fetch GST details.");
    } finally {
      setGstSearchLoading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please provide the contractor name.");
      return;
    }

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...formData } : c));
    } else {
      setClients(prev => [formData, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Contractors & Construction Client Accounts</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Manage GST verified builders, local cash contractors, sites, and security deposits
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add New Contractor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '0.85rem' }}>
        <div className="input-with-icon">
          <Search size={16} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search contractor name, GSTIN, trade name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid-2">
        {filteredClients.map((client) => {
          const hasGst = Boolean(client.gstin);
          return (
            <div key={client.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{client.name}</h3>
                    {client.tradeName && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--amber-light)', fontWeight: 600 }}>
                        {client.tradeName}
                      </div>
                    )}
                  </div>

                  <span className={`badge ${hasGst ? 'badge-gst' : 'badge-non-gst'}`}>
                    {hasGst ? 'GST REGISTERED' : 'NON-GST / CASH'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.75rem' }}>
                  <div>
                    <strong>GSTIN:</strong> <span className="mono" style={{ color: hasGst ? '#34d399' : 'inherit' }}>{client.gstin || 'None (Non-GST)'}</span>
                  </div>
                  <div><strong>State:</strong> {client.state} (Code {client.stateCode})</div>
                  <div><strong>Address:</strong> {client.address}</div>
                  <div><strong>Phone:</strong> {client.phone} | <strong>Contact:</strong> {client.contactPerson}</div>
                </div>

                {/* Active Sites */}
                {client.activeSites && client.activeSites.length > 0 && (
                  <div style={{ marginTop: '0.85rem', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-dim)', marginBottom: '3px' }}>ACTIVE SITES:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {client.activeSites.map((site, idx) => (
                        <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          📍 {site}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Balance & Deposit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>OUTSTANDING BALANCE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                      ₹{(client.outstandingBalance || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>SECURITY DEPOSIT HELD</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      ₹{(client.securityDeposit || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onNewInvoiceForClient(client)}
                  >
                    <FileText size={13} />
                    <span>Create Bill</span>
                  </button>

                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onNewChallanForClient(client)}
                  >
                    <Truck size={13} />
                    <span>Challan</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button 
                    className="btn btn-outline btn-sm"
                    title="Edit Contractor"
                    onClick={() => handleOpenEdit(client)}
                  >
                    <Edit3 size={13} />
                  </button>

                  <button 
                    className="btn btn-danger btn-sm"
                    title="Delete Contractor"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editingClient ? 'Edit Contractor Account' : 'Add New Contractor / Construction Client'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                
                {/* FREE GST API AUTOFILL */}
                <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1rem' }}>
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} color="#f59e0b" />
                      <strong>Autofill via Free GST API (Optional for Non-GST contractors)</strong>
                    </span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <input 
                      type="text" 
                      className="form-input mono"
                      placeholder="Enter 15-digit GSTIN (leave blank for Non-GST contractor)"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleGstLookup}
                      disabled={gstSearchLoading}
                    >
                      {gstSearchLoading ? <RefreshCw size={14} className="spin" /> : <Search size={14} />}
                      <span>Fetch</span>
                    </button>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Contractor Legal Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trade / Brand Name</label>
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
                    <label className="form-label">PAN Number</label>
                    <input 
                      type="text" 
                      className="form-input mono"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State Code</label>
                    <input 
                      type="text" 
                      className="form-input mono"
                      value={formData.stateCode}
                      onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Office / Site Address</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Billing Preference</label>
                    <select 
                      className="form-select"
                      value={formData.billingTypePreference}
                      onChange={(e) => setFormData({ ...formData, billingTypePreference: e.target.value })}
                    >
                      <option value="with_gst">With GST (Tax Invoice 18%)</option>
                      <option value="without_gst">Without GST (Challan / Estimate)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Opening / Outstanding Balance (₹)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.outstandingBalance}
                      onChange={(e) => setFormData({ ...formData, outstandingBalance: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Security Deposit Held (₹)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    />
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Save Changes' : 'Create Contractor Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
