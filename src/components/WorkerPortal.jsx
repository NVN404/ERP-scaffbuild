import React, { useState } from 'react';
import { 
  HardHat, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Camera, 
  Layers, 
  FileCheck2, 
  AlertCircle,
  Plus,
  Send,
  Sparkles
} from 'lucide-react';

export default function WorkerPortal({ 
  currentUser, 
  workerLogs, 
  setWorkerLogs, 
  users 
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'history'

  // Available Sites for Worker
  const allSites = users
    .filter(u => u.role === 'client' && u.sites)
    .flatMap(u => (u.sites || []).map(s => ({ ...s, clientUser: u })));

  const defaultSite = allSites[0]?.name || "SP Imperial Tower B & C";

  // Daily Work Upload Form State
  const [logForm, setLogForm] = useState({
    siteName: defaultSite,
    date: new Date().toISOString().slice(0, 10),
    workType: "Slab Shuttering & Staging",
    floorLevel: "Tower B - 5th Floor Slab",
    workCompletedSummary: "Installed 140 telescopic props, 90 shuttering plates, and leveled joists with laser alignment.",
    areaCompletedSqft: 1500,
    volumeCompletedCum: 135,
    laborCount: 6,
    hoursWorked: 8.0,
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=500&auto=format&fit=crop&q=60"
  });

  const [previewImage, setPreviewImage] = useState(logForm.photoUrl);

  // Filter logs for this worker
  const myLogs = workerLogs.filter(l => l.workerId === currentUser?.id || l.workerName === currentUser?.name);

  // Handle Photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setLogForm(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Work Log
  const handleSubmitWorkLog = (e) => {
    e.preventDefault();

    // Find client owner for this site
    const siteObj = allSites.find(s => s.name === logForm.siteName);
    const clientId = siteObj?.clientUser?.id || "usr_client_1";
    const clientName = siteObj?.clientUser?.companyName || "Client Builder";

    const newLog = {
      id: `WLOG-${Date.now()}`,
      date: logForm.date,
      workerId: currentUser.id,
      workerName: currentUser.name,
      workerPhone: currentUser.phone || "+91 97654 88210",
      siteName: logForm.siteName,
      clientCompanyName: clientName,
      clientId: clientId,
      workType: logForm.workType,
      floorLevel: logForm.floorLevel,
      workCompletedSummary: logForm.workCompletedSummary,
      areaCompletedSqft: Number(logForm.areaCompletedSqft),
      volumeCompletedCum: Number(logForm.volumeCompletedCum),
      laborCount: Number(logForm.laborCount),
      hoursWorked: Number(logForm.hoursWorked),
      status: "pending_approval", // Awaiting client sign-off!
      approvedBy: "",
      approvalTimestamp: "",
      approvalComments: "",
      photoUrl: previewImage
    };

    setWorkerLogs(prev => [newLog, ...prev]);
    alert("✅ Daily Work Log uploaded successfully! It has been submitted to the Client Engineer for approval.");
    setActiveTab('history');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Worker Header Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #ffffff, #fff7ed)',
        borderColor: 'var(--border-orange)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-gst">WORKER / FIELD SERVICE PORTAL</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>•</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--orange-primary)' }}>
                Code: {currentUser?.workerCode || 'WRK-108'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Namaste, {currentUser?.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Upload your daily scaffolding & shuttering work for each site with photos and square feet for instant client sign-off.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button 
              className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={15} />
              <span>Upload Daily Work Log</span>
            </button>

            <button 
              className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('history')}
            >
              <FileCheck2 size={15} />
              <span>My Submissions ({myLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Assigned Sites bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)', fontSize: '0.82rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Assigned Project Sites:</span>
          {allSites.map(s => (
            <span key={s.id} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              📍 {s.name} ({s.location})
            </span>
          ))}
        </div>
      </div>

      {/* TAB 1: UPLOAD DAILY WORK */}
      {activeTab === 'upload' && (
        <div className="card" style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              Daily Work Progress Sheet (Service Delivery Upload)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Fill in today's work details. The client site engineer will review and digitally certify this progress.
            </p>
          </div>

          <form onSubmit={handleSubmitWorkLog}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Select Site</label>
                <select 
                  className="form-select"
                  value={logForm.siteName}
                  onChange={(e) => setLogForm({ ...logForm, siteName: e.target.value })}
                >
                  {allSites.map(s => (
                    <option key={s.id} value={s.name}>{s.name} — ({s.clientUser?.companyName})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Work Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Type of Work Executed</label>
                <select 
                  className="form-select"
                  value={logForm.workType}
                  onChange={(e) => setLogForm({ ...logForm, workType: e.target.value })}
                >
                  <option value="Slab Shuttering & Staging">Slab Shuttering & Prop Staging</option>
                  <option value="Cuplock Elevation & Staging">Cuplock Staging & Plastering Scaffolding</option>
                  <option value="Column Box Clamping & Casting Prep">Column Box Clamping & Beam Bottom</option>
                  <option value="De-shuttering & Dismantling">De-shuttering, Cleaning & Yard Return Stacking</option>
                  <option value="External Safety Netting & Walkways">Safety Netting & Steel Walkway Challis</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Floor Level / Bay Location</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Tower B - 4th Floor Slab (Grid 2 to 6)"
                  value={logForm.floorLevel}
                  onChange={(e) => setLogForm({ ...logForm, floorLevel: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Output Progress Measurements */}
            <div className="grid-2" style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '0.85rem 0' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--orange-primary)' }}>
                  Total Area Completed Today (Sq.Ft)
                </label>
                <input 
                  type="number" 
                  className="form-input mono"
                  placeholder="e.g. 1500"
                  value={logForm.areaCompletedSqft}
                  onChange={(e) => setLogForm({ ...logForm, areaCompletedSqft: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#2563eb' }}>
                  Staging Volume Completed ($m^3$ - Cu.Metre)
                </label>
                <input 
                  type="number" 
                  className="form-input mono"
                  placeholder="e.g. 140"
                  value={logForm.volumeCompletedCum}
                  onChange={(e) => setLogForm({ ...logForm, volumeCompletedCum: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Labor Crew Size (Workers)</label>
                <input 
                  type="number" 
                  className="form-input mono"
                  value={logForm.laborCount}
                  onChange={(e) => setLogForm({ ...logForm, laborCount: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Hours Worked</label>
                <input 
                  type="number" 
                  step="0.5"
                  className="form-input mono"
                  value={logForm.hoursWorked}
                  onChange={(e) => setLogForm({ ...logForm, hoursWorked: e.target.value })}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Work Description & Material Used</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                placeholder="List props erected, plates laid, alignment done, tie rods clamped..."
                value={logForm.workCompletedSummary}
                onChange={(e) => setLogForm({ ...logForm, workCompletedSummary: e.target.value })}
                required
              />
            </div>

            {/* Photo Proof Upload */}
            <div className="form-group" style={{ margin: '1rem 0' }}>
              <label className="form-label">
                <span>Upload Site Work Photo Proof</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>(Required by Client for daily approval)</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px dashed var(--border-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--orange-soft)' }}>
                  {previewImage ? (
                    <img src={previewImage} alt="Work Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Camera size={26} color="var(--orange-primary)" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', alignSelf: 'flex-start' }}>
                    <Camera size={14} />
                    <span>Choose Photo from Device / Camera</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  {/* Preset photo samples for instant testing */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Or use test photo:</span>
                    {[
                      { label: "Slab Shuttering", url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=500&auto=format&fit=crop&q=60" },
                      { label: "Cuplock Staging", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60" }
                    ].map(sample => (
                      <button
                        key={sample.label}
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.7rem', padding: '1px 8px' }}
                        onClick={() => {
                          setPreviewImage(sample.url);
                          setLogForm(prev => ({ ...prev, photoUrl: sample.url }));
                        }}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <button type="submit" className="btn btn-primary" style={{ minWidth: '240px' }}>
                <Send size={15} />
                <span>Submit Work for Client Approval</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MY WORK HISTORY & APPROVALS */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>My Uploaded Work Logs & Client Approval Certificates</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track real-time sign-offs by builder site engineers
              </p>
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('upload')}>
              <Plus size={14} />
              <span>Upload Today's Work</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {myLogs.map((log) => {
              const isApproved = log.status === 'approved';
              const isPending = log.status === 'pending_approval';

              return (
                <div 
                  key={log.id} 
                  className="card"
                  style={{
                    borderLeft: `4px solid ${isApproved ? '#10b981' : isPending ? '#ff6b00' : '#e11d48'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem', marginBottom: '3px' }}>
                          📍 {log.siteName}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '2px' }}>
                          {log.workType}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {log.floorLevel} • Date: {log.date}
                        </div>
                      </div>

                      <span className={`badge ${isApproved ? 'badge-gst' : isPending ? 'badge-non-gst' : 'badge-danger'}`}>
                        {isApproved ? '✓ APPROVED' : isPending ? '⏱ PENDING APPROVAL' : 'REVISION REQUESTED'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', margin: '0.75rem 0', background: '#f8fafc', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                      <div>Area: <strong>{log.areaCompletedSqft} Sq.Ft</strong></div>
                      <div>Volume: <strong>{log.volumeCompletedCum} $m^3$</strong></div>
                      <div>Crew: <strong>{log.laborCount} workers</strong></div>
                      <div>Hours: <strong>{log.hoursWorked} hrs</strong></div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', background: '#ffffff', border: '1px solid var(--border-light)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                      "{log.workCompletedSummary}"
                    </p>

                    {log.photoUrl && (
                      <div style={{ marginTop: '0.6rem' }}>
                        <img 
                          src={log.photoUrl} 
                          alt="Work" 
                          style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                        />
                      </div>
                    )}

                    {/* Certified Badge */}
                    {isApproved && (
                      <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: 'var(--emerald-soft)', border: '1px solid var(--emerald-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                        <div style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={14} />
                          <span>Certified by Client Engineer: {log.approvedBy}</span>
                        </div>
                        <div style={{ color: '#047857', marginTop: '2px' }}>
                          "{log.approvalComments}"
                        </div>
                        <div style={{ color: '#059669', fontSize: '0.68rem', marginTop: '2px' }}>
                          Signed: {log.approvalTimestamp}
                        </div>
                      </div>
                    )}

                    {isPending && (
                      <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: 'var(--orange-soft)', border: '1px solid var(--orange-soft-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#c2410c' }}>
                        ⏱ Awaiting site inspection & digital sign-off from {log.clientCompanyName || 'Client'} site engineer.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {myLogs.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <HardHat size={44} style={{ opacity: 0.3, margin: '0 auto 1rem', color: 'var(--orange-primary)' }} />
              <h3>No Work Logs Submitted Yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Click "Upload Daily Work Log" above to record today's completed shuttering and scaffolding tasks.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
