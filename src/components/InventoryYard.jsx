import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Wrench,
  ArrowRight
} from 'lucide-react';

export default function InventoryYard({ inventory, setInventory, onSendToCalculator }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Shuttering Plates',
    hsn: '73084000',
    unit: 'Pcs',
    weightKg: 10,
    dailyRent: 2,
    monthlyRent: 50,
    replacementCost: 500,
    totalStock: 500,
    onRent: 0,
    underRepair: 0,
    location: 'Bay 1'
  });

  const categories = [
    'All',
    'Shuttering Plates',
    'Telescopic Props',
    'Cuplock System',
    'Spans & Beams',
    'Jacks & Bases',
    'Pipes & Couplers',
    'Planks & Accessories'
  ];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'Shuttering Plates',
      hsn: '73084000',
      unit: 'Pcs',
      weightKg: 12,
      dailyRent: 2,
      monthlyRent: 50,
      replacementCost: 600,
      totalStock: 200,
      onRent: 0,
      underRepair: 0,
      location: 'Main Yard'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this shuttering material item?")) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter the material name.");
      return;
    }

    if (editingItem) {
      setInventory(prev => prev.map(item => item.id === editingItem.id ? { ...formData } : item));
    } else {
      setInventory(prev => [formData, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Shuttering & Scaffolding Yard Inventory</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time tracking of plates, props, cuplock standards, acrow spans & pipe stock
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add New Material Item</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="card" style={{ padding: '0.85rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div className="input-with-icon" style={{ flex: '1 1 280px' }}>
            <Search size={16} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search plates, props, cuplocks, HSN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Material Inventory Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Material Description</th>
                <th>Category</th>
                <th>HSN / Unit</th>
                <th>Weight (Kg)</th>
                <th>Daily / Mo. Rent</th>
                <th>Total Stock</th>
                <th>On Site / Rent</th>
                <th>Available Yard</th>
                <th>In Repair</th>
                <th>Replacement Value</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const available = (item.totalStock || 0) - (item.onRent || 0) - (item.underRepair || 0);
                const isLow = available < 50;
                return (
                  <tr key={item.id}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--amber-light)', fontSize: '0.78rem' }}>
                      {item.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Yard Loc: {item.location}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: '0.8rem' }}>
                      <div>HSN: {item.hsn}</div>
                      <div style={{ color: 'var(--text-muted)' }}>Unit: {item.unit}</div>
                    </td>
                    <td className="mono">{item.weightKg} kg</td>
                    <td className="mono">
                      <div style={{ color: '#34d399', fontWeight: 600 }}>₹{item.dailyRent}/day</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>₹{item.monthlyRent}/mo</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 700 }}>
                      {item.totalStock.toLocaleString()}
                    </td>
                    <td className="mono" style={{ color: '#60a5fa', fontWeight: 700 }}>
                      {item.onRent.toLocaleString()}
                    </td>
                    <td className="mono" style={{ color: isLow ? '#fbbf24' : '#34d399', fontWeight: 700 }}>
                      {available.toLocaleString()}
                    </td>
                    <td className="mono" style={{ color: item.underRepair > 0 ? '#fb7185' : 'var(--text-dim)' }}>
                      {item.underRepair}
                    </td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      ₹{item.replacementCost}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-outline btn-sm" 
                          title="Edit Item"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          title="Delete Item"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={13} />
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

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editingItem ? 'Edit Shuttering Material' : 'Add New Shuttering / Scaffolding Material'}
              </h3>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Item Code / SKU</label>
                    <input 
                      type="text" 
                      className="form-input mono"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Material Description (e.g. MS Plate 900x600, Prop 2-3.5m)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Enter full specification & dimensions..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">HSN Code</label>
                    <input 
                      type="text" 
                      className="form-input mono"
                      value={formData.hsn}
                      onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit of Measure</label>
                    <select 
                      className="form-select"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="Pcs">Pcs (Numbers)</option>
                      <option value="Set">Set</option>
                      <option value="Mtr">Metre</option>
                      <option value="Sq.Ft">Sq.Ft</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Weight (Kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input mono"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Daily Rental Rate (₹)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input mono"
                      value={formData.dailyRent}
                      onChange={(e) => setFormData({ ...formData, dailyRent: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Rental Rate (₹)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Damage / Loss Cost (₹)</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.replacementCost}
                      onChange={(e) => setFormData({ ...formData, replacementCost: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Total Stock Quantity</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.totalStock}
                      onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dispatched on Rent</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.onRent}
                      onChange={(e) => setFormData({ ...formData, onRent: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Under Repair</label>
                    <input 
                      type="number" 
                      className="form-input mono"
                      value={formData.underRepair}
                      onChange={(e) => setFormData({ ...formData, underRepair: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Yard Location / Bay</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Add Material to Yard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
