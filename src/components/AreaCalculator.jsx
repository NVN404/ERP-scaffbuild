import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Box, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Truck, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  calculateSlabShuttering, 
  calculateColumnShuttering, 
  calculateCuplockScaffolding 
} from '../utils/areaCalculator';

export default function AreaCalculator({ 
  onSendToInvoice, 
  onSendToChallan 
}) {
  const [calcTab, setCalcTab] = useState('slab'); // 'slab', 'column', 'cuplock'

  // Slab Form
  const [slabParams, setSlabParams] = useState({
    unit: 'feet',
    length: 50,
    width: 30,
    slabThicknessMm: 150,
    clearHeight: 10.5,
    propSpacingSqft: 9,
    plateType: 'SH-PL-900600'
  });

  // Column Form
  const [columnParams, setColumnParams] = useState({
    unit: 'feet',
    columnLength: 1.5,
    columnWidth: 1.0,
    columnHeight: 10,
    numberOfColumns: 12
  });

  // Cuplock Form
  const [cuplockParams, setCuplockParams] = useState({
    unit: 'metre',
    length: 30,
    height: 15,
    bayDepth: 1.2,
    tierLifts: 2.0
  });

  // Calculate results
  const slabResult = calculateSlabShuttering(slabParams);
  const columnResult = calculateColumnShuttering(columnParams);
  const cuplockResult = calculateCuplockScaffolding(cuplockParams);

  // Helper to send to Invoice
  const handlePushToInvoice = (materials, title) => {
    onSendToInvoice(materials, title);
  };

  // Helper to send to Challan
  const handlePushToChallan = (materials, title) => {
    onSendToChallan(materials, title);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Civil Scaffolding & Shuttering Area / Volume Estimator</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Instant Sq.Ft & Cubic Metre ($m^3$) calculations for slabs, columns & multi-tier staging with material bill-of-quantities
          </p>
        </div>

        {/* Calculator Selector Tabs */}
        <div className="nav-tabs">
          <button 
            className={`nav-tab-btn ${calcTab === 'slab' ? 'active' : ''}`}
            onClick={() => setCalcTab('slab')}
          >
            <Layers size={15} />
            <span>Slab Shuttering & Props</span>
          </button>

          <button 
            className={`nav-tab-btn ${calcTab === 'column' ? 'active' : ''}`}
            onClick={() => setCalcTab('column')}
          >
            <Box size={15} />
            <span>Column Box Shuttering</span>
          </button>

          <button 
            className={`nav-tab-btn ${calcTab === 'cuplock' ? 'active' : ''}`}
            onClick={() => setCalcTab('cuplock')}
          >
            <Building size={15} />
            <span>Scaffolding Volume (Cu.M & Sq.Ft)</span>
          </button>
        </div>
      </div>

      {/* CALCULATOR 1: SLAB SHUTTERING */}
      {calcTab === 'slab' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          
          {/* Inputs Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Slab Dimensions & Parameters</h3>
              
              <div className="toggle-group">
                <button 
                  type="button" 
                  className={`toggle-btn ${slabParams.unit === 'feet' ? 'active' : ''}`}
                  onClick={() => setSlabParams({ ...slabParams, unit: 'feet' })}
                >
                  Feet
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${slabParams.unit === 'metre' ? 'active' : ''}`}
                  onClick={() => setSlabParams({ ...slabParams, unit: 'metre' })}
                >
                  Metres
                </button>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Slab Length ({slabParams.unit})</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  value={slabParams.length}
                  onChange={(e) => setSlabParams({ ...slabParams, length: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slab Width ({slabParams.unit})</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  value={slabParams.width}
                  onChange={(e) => setSlabParams({ ...slabParams, width: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Slab Thickness (mm)</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  placeholder="e.g. 150mm (6 inch)"
                  value={slabParams.slabThicknessMm}
                  onChange={(e) => setSlabParams({ ...slabParams, slabThicknessMm: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Floor Height ({slabParams.unit})</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input mono"
                  value={slabParams.clearHeight}
                  onChange={(e) => setSlabParams({ ...slabParams, clearHeight: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Prop Spacing (Sq.Ft / Prop)</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  placeholder="Standard 8 - 10 sq.ft"
                  value={slabParams.propSpacingSqft}
                  onChange={(e) => setSlabParams({ ...slabParams, propSpacingSqft: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Standard Plate Size</label>
                <select 
                  className="form-select"
                  value={slabParams.plateType}
                  onChange={(e) => setSlabParams({ ...slabParams, plateType: e.target.value })}
                >
                  <option value="SH-PL-900600">MS Plate 900x600 mm (3' x 2')</option>
                  <option value="SH-PL-1200600">MS Plate 1200x600 mm (4' x 2')</option>
                </select>
              </div>
            </div>

            {/* Visual 2D Slab Schematic */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                SLAB FORM & STAGING GRID SCHEMATIC
              </div>
              <svg width="100%" height="110" viewBox="0 0 320 110" style={{ maxWidth: '320px' }}>
                <rect x="10" y="10" width="300" height="90" fill="rgba(255, 107, 0, 0.06)" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 4" rx="4" />
                <line x1="10" y1="40" x2="310" y2="40" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="10" y1="70" x2="310" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="110" y1="10" x2="110" y2="100" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="210" y1="10" x2="210" y2="100" stroke="#cbd5e1" strokeWidth="1" />
                
                {/* Prop markers */}
                {[55, 160, 260].map(cx => (
                  [25, 55, 85].map(cy => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" fill="#10b981" />
                  ))
                ))}

                <text x="160" y="8" fill="#ea580c" fontSize="10" fontWeight="bold" textAnchor="middle">Length: {slabParams.length} {slabParams.unit}</text>
                <text x="6" y="55" fill="#ea580c" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 6 55)">Width: {slabParams.width}</text>
              </svg>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                ● Green dots indicate estimated Telescopic Props staging points
              </div>
            </div>
          </div>

          {/* Results & Material BOQ Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--amber-light)' }}>
                  Calculation Output & Bill of Materials
                </h3>
                <span className="badge badge-gst">Accurate Indian Norms</span>
              </div>

              {/* Area & Volume Primary Indicators */}
              <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL SLAB SHUTTERING AREA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {slabResult.area.sqft.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem' }}>Sq.Ft</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    = {slabResult.area.sqm} Sq. Metre ($m^2$)
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONCRETE SLAB VOLUME</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {slabResult.volume.cum.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem' }}>$m^3$ (Cu.M)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    = {slabResult.volume.cuft} Cubic Feet ($ft^3$)
                  </div>
                </div>
              </div>

              {/* Material BOQ List */}
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                ESTIMATED SCAFFOLDING & SHUTTERING EQUIPMENT REQUIRED:
              </div>

              <div className="table-responsive">
                <table className="erp-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Qty Required</th>
                      <th>Unit</th>
                      <th>Rent Rate</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slabResult.materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{mat.name}</td>
                        <td className="mono" style={{ fontWeight: 700, color: 'var(--amber-light)' }}>
                          {mat.quantity.toLocaleString()}
                        </td>
                        <td>{mat.unit}</td>
                        <td className="mono" style={{ color: '#34d399' }}>₹{mat.ratePerDay}/d</td>
                        <td style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{mat.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handlePushToInvoice(slabResult.materials, `Slab Shuttering (${slabResult.area.sqft} Sq.Ft)`)}
              >
                <FileText size={15} />
                <span>Send to New Invoice / Quotation</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => handlePushToChallan(slabResult.materials, `Slab Staging (${slabResult.area.sqft} Sq.Ft)`)}
              >
                <Truck size={15} />
                <span>Send to Delivery Challan</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* CALCULATOR 2: COLUMN SHUTTERING */}
      {calcTab === 'column' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Column Box Dimensions</h3>
              
              <div className="toggle-group">
                <button 
                  type="button" 
                  className={`toggle-btn ${columnParams.unit === 'feet' ? 'active' : ''}`}
                  onClick={() => setColumnParams({ ...columnParams, unit: 'feet' })}
                >
                  Feet
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${columnParams.unit === 'metre' ? 'active' : ''}`}
                  onClick={() => setColumnParams({ ...columnParams, unit: 'metre' })}
                >
                  Metres
                </button>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Column Length / Face ({columnParams.unit})</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input mono"
                  value={columnParams.columnLength}
                  onChange={(e) => setColumnParams({ ...columnParams, columnLength: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Column Width / Breadth ({columnParams.unit})</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input mono"
                  value={columnParams.columnWidth}
                  onChange={(e) => setColumnParams({ ...columnParams, columnWidth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Column Height ({columnParams.unit})</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input mono"
                  value={columnParams.columnHeight}
                  onChange={(e) => setColumnParams({ ...columnParams, columnHeight: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Number of Columns</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  value={columnParams.numberOfColumns}
                  onChange={(e) => setColumnParams({ ...columnParams, numberOfColumns: e.target.value })}
                />
              </div>
            </div>

            {/* Column Cross Section Diagram */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                COLUMN BOX CROSS SECTION & CLAMP TIE SCHEMATIC
              </div>
              <svg width="180" height="130" viewBox="0 0 180 130">
                <rect x="40" y="25" width="100" height="75" fill="rgba(37, 99, 235, 0.08)" stroke="#2563eb" strokeWidth="2" />
                {/* Clamps */}
                <line x1="25" y1="20" x2="155" y2="20" stroke="#ea580c" strokeWidth="3" />
                <line x1="25" y1="105" x2="155" y2="105" stroke="#ea580c" strokeWidth="3" />
                <line x1="35" y1="10" x2="35" y2="115" stroke="#ea580c" strokeWidth="3" />
                <line x1="145" y1="10" x2="145" y2="115" stroke="#ea580c" strokeWidth="3" />
                <text x="90" y="66" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">Concrete Core</text>
              </svg>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Orange frame shows MS 4-Arm Clamps & Tie Rods
              </div>
            </div>
          </div>

          {/* Column Output */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--amber-light)' }}>
                  Column Output & Required Items
                </h3>
                <span className="badge badge-info">{columnParams.numberOfColumns} Columns</span>
              </div>

              <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL SHUTTERING CONTACT AREA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {columnResult.area.sqft} <span style={{ fontSize: '0.85rem' }}>Sq.Ft</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    = {columnResult.area.sqm} Sq. Metre ($m^2$)
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL COLUMN CONCRETE VOLUME</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {columnResult.volume.cum} <span style={{ fontSize: '0.85rem' }}>$m^3$ (Cu.M)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    = {columnResult.volume.cuft} Cubic Feet ($ft^3$)
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                REQUIRED COLUMN PLATES, CLAMPS & TIE RODS:
              </div>

              <div className="table-responsive">
                <table className="erp-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Qty Required</th>
                      <th>Unit</th>
                      <th>Daily Rent</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnResult.materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{mat.name}</td>
                        <td className="mono" style={{ fontWeight: 700, color: 'var(--amber-light)' }}>
                          {mat.quantity.toLocaleString()}
                        </td>
                        <td>{mat.unit}</td>
                        <td className="mono" style={{ color: '#34d399' }}>₹{mat.ratePerDay}/d</td>
                        <td style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{mat.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handlePushToInvoice(columnResult.materials, `Column Shuttering (${columnParams.numberOfColumns} Cols - ${columnResult.area.sqft} Sq.Ft)`)}
              >
                <FileText size={15} />
                <span>Send to New Invoice / Quotation</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => handlePushToChallan(columnResult.materials, `Column Shuttering (${columnParams.numberOfColumns} Cols)`)}
              >
                <Truck size={15} />
                <span>Send to Delivery Challan</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* CALCULATOR 3: EXTERNAL CUPLOCK / PIPE SCAFFOLDING VOLUME */}
      {calcTab === 'cuplock' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Staging Elevation & Bay Dimensions</h3>
              
              <div className="toggle-group">
                <button 
                  type="button" 
                  className={`toggle-btn ${cuplockParams.unit === 'metre' ? 'active' : ''}`}
                  onClick={() => setCuplockParams({ ...cuplockParams, unit: 'metre' })}
                >
                  Metres
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${cuplockParams.unit === 'feet' ? 'active' : ''}`}
                  onClick={() => setCuplockParams({ ...cuplockParams, unit: 'feet' })}
                >
                  Feet
                </button>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Facade / Wall Length ({cuplockParams.unit})</label>
                <input 
                  type="number" 
                  step="0.5"
                  className="form-input mono"
                  value={cuplockParams.length}
                  onChange={(e) => setCuplockParams({ ...cuplockParams, length: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scaffolding Height ({cuplockParams.unit})</label>
                <input 
                  type="number" 
                  step="0.5"
                  className="form-input mono"
                  value={cuplockParams.height}
                  onChange={(e) => setCuplockParams({ ...cuplockParams, height: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Bay Depth / Width ({cuplockParams.unit})</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input mono"
                  value={cuplockParams.bayDepth}
                  onChange={(e) => setCuplockParams({ ...cuplockParams, bayDepth: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tier Lift Spacing ({cuplockParams.unit})</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input mono"
                  value={cuplockParams.tierLifts}
                  onChange={(e) => setCuplockParams({ ...cuplockParams, tierLifts: e.target.value })}
                />
              </div>
            </div>

            {/* 3D Staging Volume Diagram */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                CUPLOCK 3D STAGING VOLUME (L × H × W)
              </div>
              <svg width="240" height="130" viewBox="0 0 240 130">
                {/* Isometric Box representation */}
                <polygon points="30,80 150,80 200,40 80,40" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="1.5" />
                <polygon points="30,80 150,80 150,20 30,20" fill="rgba(255, 107, 0, 0.1)" stroke="#ea580c" strokeWidth="1.5" />
                <polygon points="150,80 200,40 200,0 150,20" fill="rgba(37, 99, 235, 0.08)" stroke="#2563eb" strokeWidth="1.5" />
                
                {/* Vertical Lines */}
                <line x1="70" y1="20" x2="70" y2="80" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="2 2" />
                <line x1="110" y1="20" x2="110" y2="80" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="2 2" />

                <text x="90" y="98" fill="#ea580c" fontSize="10" fontWeight="bold" textAnchor="middle">Length: {cuplockParams.length} {cuplockParams.unit}</text>
                <text x="185" y="65" fill="#2563eb" fontSize="10" fontWeight="bold" textAnchor="middle">Depth: {cuplockParams.bayDepth}</text>
                <text x="16" y="50" fill="#059669" fontSize="10" fontWeight="bold" textAnchor="middle">Height: {cuplockParams.height}</text>
              </svg>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Multi-tier modular Cuplock staging volume
              </div>
            </div>
          </div>

          {/* Cuplock Output */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--amber-light)' }}>
                  Scaffolding Volume & Component Schedule
                </h3>
                <span className="badge badge-gst">Cubic Metre Output</span>
              </div>

              {/* Volume & Area Big Cards */}
              <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL STAGING VOLUME</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {cuplockResult.volume.stagingCum.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem' }}>$m^3$ (Cu.M)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    = {cuplockResult.volume.stagingCuft.toLocaleString('en-IN')} Cubic Feet ($ft^3$)
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ELEVATION CONTACT AREA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {cuplockResult.area.elevationSqft.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem' }}>Sq.Ft</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    = {cuplockResult.area.elevationSqm.toLocaleString('en-IN')} Sq. Metres ($m^2$)
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                REQUIRED CUPLOCK STANDARDS, LEDGERS & CHALLI PLANKS:
              </div>

              <div className="table-responsive">
                <table className="erp-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Material Component</th>
                      <th>Qty Required</th>
                      <th>Unit</th>
                      <th>Daily Rent</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuplockResult.materials.map((mat, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{mat.name}</td>
                        <td className="mono" style={{ fontWeight: 700, color: 'var(--amber-light)' }}>
                          {mat.quantity.toLocaleString()}
                        </td>
                        <td>{mat.unit}</td>
                        <td className="mono" style={{ color: '#34d399' }}>₹{mat.ratePerDay}/d</td>
                        <td style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{mat.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handlePushToInvoice(cuplockResult.materials, `Cuplock Scaffolding (${cuplockResult.volume.stagingCum} Cu.M / ${cuplockResult.area.elevationSqft} Sq.Ft)`)}
              >
                <FileText size={15} />
                <span>Send to New Invoice / Quotation</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => handlePushToChallan(cuplockResult.materials, `Cuplock Staging (${cuplockResult.volume.stagingCum} Cu.M)`)}
              >
                <Truck size={15} />
                <span>Send to Delivery Challan</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
