import React, { useState } from 'react';
import { 
  HardHat, 
  ShieldCheck, 
  FileCheck2, 
  Truck, 
  Calculator, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  QrCode, 
  Sparkles, 
  ChevronRight, 
  Star, 
  Lock, 
  Zap, 
  HelpCircle,
  FileText,
  Layers,
  BarChart3,
  Smartphone,
  ExternalLink
} from 'lucide-react';

export default function LandingPage({ 
  onOpenAuth, 
  onQuickAdminLogin 
}) {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Does ScaffBuild support both GST and Non-GST rental transactions?",
      a: "Yes! ScaffBuild features dual billing modes. You can generate 100% legal GST Tax Invoices (with CGST/SGST 18%, HSN 997312, and NIC IRN QR codes) or Commercial Hire Challans / Estimates (Without GST) with automatic security deposit deductions."
    },
    {
      q: "Can my site clients and builders track their active material orders?",
      a: "Yes! Clients like Shapoorji Pallonji, L&T, or Godrej get their own dedicated Client Portal to request material quotations, view active site shipments, and verify delivery challans in real time."
    },
    {
      q: "How does the Government E-Invoice & E-Way Bill integration work?",
      a: "ScaffBuild instantly calculates the 64-character SHA-256 Invoice Reference Number (IRN) under NIC Schema INV-01, formats the official GSTN signed QR code, and generates standard E-Way Bill numbers (Form GST EWB-01) for equipment transport."
    },
    {
      q: "Is there an Android mobile app available for site engineers?",
      a: "Yes! ScaffBuild is optimized for mobile phones with native bottom app navigation tabs. You can also download and install the native Android APK directly to your phone."
    },
    {
      q: "How are damaged or lost scaffolding materials handled upon yard return?",
      a: "Our Return Audit system allows yard supervisors to inspect returned items, log bent pipes, cut jacks, or missing pins, and automatically generate a damage assessment bill adjusted against client deposits."
    }
  ];

  return (
    <div className="landing-page" style={{ background: '#f8fafc', color: '#0f172a', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '4rem 1.5rem 5rem',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,107,0,0.18) 0%, rgba(255,107,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '920px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Government Compliance Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '0.45rem 1.15rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
            <span style={{ color: '#fed7aa' }}>India's Construction Formwork ERP</span>
            <span style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></span>
            <span style={{ color: '#4ade80' }}>NIC Schema INV-01 & GST Rule 46 Ready</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 5.5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            margin: '0 auto 1.25rem',
            maxWidth: '850px'
          }}>
            Precision <span style={{
              background: 'linear-gradient(135deg, #ff8a00, #ff6b00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Shuttering & Scaffolding</span> Yard ERP
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.18rem)',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Complete on-hire fleet tracking, instant Tally/ClearTax standard GST Tax Invoices with verified QR codes, multi-site builder orders, and native mobile logs for Indian contractors.
          </p>

          {/* CTA Group */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px -5px rgba(255, 107, 0, 0.5)'
              }}
              onClick={onOpenAuth}
            >
              <HardHat size={20} />
              <span>Sign In to Access Portal</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{
                padding: '0.9rem 1.65rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-lg)'
              }}
              onClick={onQuickAdminLogin}
            >
              <Zap size={18} style={{ color: '#fbbf24' }} />
              <span>Quick Owner Demo (santosh)</span>
            </button>

            <a
              href="/shuttering-erp-debug.apk"
              download="shuttering-erp-debug.apk"
              className="btn btn-outline"
              style={{
                padding: '0.9rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none'
              }}
            >
              <Smartphone size={18} />
              <span>Download Android APK</span>
            </a>
          </div>

          {/* Metrics Pill Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fb923c' }}>50,000+ MT</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Cuplock & Prop Fleet Tracked</div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>100% Legal</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>CGST Rule 46 & NIC INV-01</div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8' }}>3 Dedicated Roles</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Owner ERP • Client • Worker</div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f472b6' }}>Instant PDF & QR</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Signed GSTN QR & E-Way Bill</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE INTERACTIVE HERO CARD PREVIEW */}
      <section style={{ marginTop: '-2.5rem', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.18)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          {/* Mock Browser Header */}
          <div style={{
            background: '#0f172a',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
                app.scaffbuild.com/billing/official-tax-invoice
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#38bdf8' }}>
              <ShieldCheck size={14} />
              <span>GSTN Validated</span>
            </div>
          </div>

          {/* Interactive Preview Body */}
          <div style={{ padding: '1.5rem', background: '#fafafa' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              
              {/* Card 1: Official GST Invoice Sample */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #000000',
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #000', paddingBottom: '0.5rem', marginBottom: '0.6rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>TAX INVOICE</strong>
                    <div style={{ fontSize: '0.68rem', color: '#475569' }}>Rule 46 of CGST Rules, 2017</div>
                  </div>
                  <span style={{ fontSize: '0.65rem', border: '1px solid #000', padding: '1px 6px', fontWeight: 800 }}>
                    ORIGINAL FOR RECIPIENT
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>IRN (64-Char Hash):</div>
                    <code style={{ fontSize: '0.65rem', wordBreak: 'break-all', fontWeight: 700 }}>
                      e3b0c44298fc1c149afbf4c8...
                    </code>
                    <div style={{ fontSize: '0.68rem', marginTop: '2px' }}>
                      Ack No: <strong>1126102409812</strong> | Code: <strong>27</strong>
                    </div>
                  </div>
                  <div style={{ border: '1px solid #000', padding: '2px', background: '#fff', textAlign: 'center' }}>
                    <QrCode size={44} style={{ color: '#000' }} />
                    <div style={{ fontSize: '0.55rem', fontWeight: 800 }}>GSTN QR</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                  <div>Billed To: <strong>M/s Shapoorji Pallonji Co.</strong></div>
                  <div>GSTIN: <strong className="mono">27AABCS1429B1Z1</strong></div>
                  <div>Site: <strong>SP Cybercity Tower C & D Site</strong></div>
                </div>

                <div style={{ marginTop: '0.75rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>Total Amount Payable:</span>
                  <span style={{ color: '#059669', fontSize: '0.95rem' }}>₹1,32,574.00</span>
                </div>
              </div>

              {/* Card 2: Yard Inventory Utilization */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Yard Fleet Utilization
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Live Stock</span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span>Cuplock Verticals (3.0m):</span>
                      <strong>3,850 / 4,500 On-Hire (85%)</strong>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: '#ff6b00' }}></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span>Formwork Steel Plates (900x600):</span>
                      <strong>2,140 / 2,400 On-Hire (89%)</strong>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '89%', height: '100%', background: '#10b981' }}></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span>Heavy Duty Props (2m-3.5m):</span>
                      <strong>920 / 1,200 On-Hire (76%)</strong>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '76%', height: '100%', background: '#3b82f6' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '0.65rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={16} style={{ color: '#0284c7' }} />
                  <span>Next Dispatch: MH-04-GP-8842 (24 Metric Tonnes)</span>
                </div>
              </div>

              {/* Card 3: 3 Mobile-First Portals */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Dedicated Portals for Every Stakeholder
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem', background: '#fff7ed', borderRadius: 'var(--radius-sm)', border: '1px solid #fed7aa' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        👑
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong>Yard Owner / Admin (Santosh)</strong>
                        <div style={{ fontSize: '0.7rem', color: '#9a3412' }}>Full ERP, Billing & Financials</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem', background: '#eff6ff', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🏢
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong>Client Builders (Shapoorji, L&T)</strong>
                        <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>Submit Quotations & Site Tracking</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem', background: '#f0fdf4', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        👷
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong>Yard & Site Workers</strong>
                        <div style={{ fontSize: '0.7rem', color: '#166534' }}>Daily Progress & Hamali Logs</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
                  onClick={onOpenAuth}
                >
                  <span>Open Sign In Dialog →</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. SIX CORE MODULES (FEATURES) */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-info" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>
            Built for Heavy Construction
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0.5rem 0' }}>
            Everything You Need to Run a Scaffolding Yard
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
            Stop managing multimillion-rupee shuttering fleets on crumpled notebooks and WhatsApp chats.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          
          {/* Feature 1 */}
          <div className="card" style={{ padding: '1.75rem', transition: 'all 0.2s ease' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <FileCheck2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Dual Billing Engine (GST & Non-GST)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Generate Rule 46 GST Tax Invoices with 18% tax breakdown or Non-GST Commercial Estimates for cash rentals with automatic security deposit deductions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card" style={{ padding: '1.75rem', transition: 'all 0.2s ease' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <QrCode size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Govt E-Compliance (IRN & QR)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Automatic 64-character SHA-256 IRN generation under NIC Schema INV-01 with official verified GSTN Signed QR code and Form GST EWB-01 E-Way Bill numbers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card" style={{ padding: '1.75rem', transition: 'all 0.2s ease' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Digital Delivery Challans & Audits
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Track vehicle consignments, driver contacts, total tonnage (Metric Tonnes), and execute return inspection audits to bill for bent or damaged pipes instantly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card" style={{ padding: '1.75rem', transition: 'all 0.2s ease' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fdf4ff', color: '#c026d3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Calculator size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Area & Volume Formwork Calculators
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Calculate slab staging, beam bottoms, column formwork in cubic meters ($m^3$) and square feet. Convert estimates directly into rental bills with one tap.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card" style={{ padding: '1.75rem', transition: 'all 0.2s ease' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Cuplock, Props & Plate Yard Stock
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Monitor available vs on-hire inventory counts in real time. Never double-book staging materials or lose track of components across distant project sites.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card" style={{ padding: '1.75rem', transition: 'all 0.2s ease' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Smartphone size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Mobile-First Native App Experience
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Clean 3-tab bottom navigation designed specifically for mobile screens on dusty job sites. Installable Android APK with offline support and zero clutter.
            </p>
          </div>

        </div>
      </section>

      {/* 4. THE 3 PORTALS SHOWCASE */}
      <section style={{ background: '#0f172a', color: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#fb923c', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Role-Based Architecture
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, margin: '0.5rem 0' }}>
              Engineered for Owners, Clients & Site Crews
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '620px', margin: '0 auto' }}>
              Each user sees only what they need with enterprise Row-Level Security powered by Supabase.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Owner Box */}
            <div style={{
              background: '#1e293b',
              border: '1.5px solid #ff6b00',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👑</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ff8a00', marginBottom: '0.5rem' }}>
                  Yard Owner ERP
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Master command center for Santosh & yard directors to supervise full fleet inventory, issue legal GST bills, manage payments, and approve client orders.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.84rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#ff8a00' }} />
                    <span>Real-time yard inventory analytics</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#ff8a00' }} />
                    <span>One-click GST Tax Invoices & E-Way Bills</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#ff8a00' }} />
                    <span>Damage penalty & security deposit audit</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #334155', fontSize: '0.78rem', color: '#94a3b8' }}>
                Fixed Master Access: <code style={{ color: '#fed7aa', fontWeight: 700 }}>santosh / xrgt</code>
              </div>
            </div>

            {/* Client Box */}
            <div style={{
              background: '#1e293b',
              border: '1px solid #334155',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏢</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                  Client / Builder Portal
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Dedicated self-service hub for Shapoorji, L&T, and contracting firms to request shuttering quotes, track active project dispatches, and download bills.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.84rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8' }} />
                    <span>Instant material quotation request</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8' }} />
                    <span>Multi-site active order dashboard</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8' }} />
                    <span>Delivery Challan inspection</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #334155', fontSize: '0.78rem', color: '#94a3b8' }}>
                Secure Login: <span style={{ color: '#bae6fd' }}>Supabase Auth (client@shapoorji.com)</span>
              </div>
            </div>

            {/* Worker Box */}
            <div style={{
              background: '#1e293b',
              border: '1px solid #334155',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👷</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80', marginBottom: '0.5rem' }}>
                  Worker & Site Crew Portal
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Simplified, large-button mobile interface for yard loaders, truck drivers, and site supervisors to record material loading and safety counts.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.84rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                    <span>Daily staging & dismantling logs</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                    <span>Material loading / hamali notes</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                    <span>Simple one-tap status submission</span>
                  </li>
                </ul>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #334155', fontSize: '0.78rem', color: '#94a3b8' }}>
                Secure Login: <span style={{ color: '#bbf7d0' }}>Supabase Auth (worker@shapoorji.com)</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. STATUTORY TAX INVOICE COMPARISON */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-gst" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>
            Statutory Transparency
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 900 }}>
            Standard Indian GST Tax Invoice vs. Random Bills
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            ScaffBuild invoices are built strictly to standard accounting software norms (Tally Prime / ClearTax).
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Authentic ScaffBuild Format */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #000000',
            padding: '1.5rem',
            borderRadius: '4px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, marginBottom: '1rem' }}>
              <CheckCircle2 size={20} />
              <span style={{ fontSize: '1rem' }}>ScaffBuild Official Format</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                <span><strong>Outer 2px Solid Black Border</strong> matching Tally & ClearTax norms</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                <span><strong>64-Char Hex IRN</strong> with Ack No, Ack Date & E-Way Bill Number</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                <span><strong>High-Resolution GSTN Signed QR Code</strong> verified by GST officers</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                <span><strong>Rule 46 HSN/SAC Summary Grid</strong> with Tax Amount in Indian words</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                <span><strong>Official Circular Rubber Stamp & Signature</strong> for company acceptance</span>
              </li>
            </ul>
          </div>

          {/* Random App Bills */}
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            padding: '1.5rem',
            borderRadius: '4px',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, marginBottom: '1rem' }}>
              <span>✕</span>
              <span style={{ fontSize: '1rem' }}>Random / Generic Bills</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>Loose, floating CSS cards without formal accounting borders</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>Missing 64-char IRN hash and GSTN validation stamps</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>No statutory HSN/SAC summary table (rejected during GST audits)</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>No legal terms for equipment rental continuity & damage liabilities</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>Clips or breaks unpredictably during browser printing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section style={{ padding: '4rem 1.5rem', background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-neutral" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>
              Questions & Answers
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900 }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    background: isOpen ? '#f8fafc' : '#ffffff',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronRight 
                      size={18} 
                      style={{ 
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        color: 'var(--orange-primary)'
                      }} 
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.25rem 1.25rem',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      color: 'var(--text-muted)',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. HIGH-CONVERTING BOTTOM CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Streamline Your Scaffolding Fleet?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Log in to manage your inventory, dispatch challans, and generate legal Indian E-Invoices today.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <button
              type="button"
              className="btn"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '1rem 2.25rem',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
              }}
              onClick={onOpenAuth}
            >
              <HardHat size={20} />
              <span>Sign In to Access Portal</span>
            </button>

            <button
              type="button"
              className="btn"
              style={{
                background: '#ffffff',
                color: '#ea580c',
                border: 'none',
                padding: '1rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-lg)'
              }}
              onClick={onQuickAdminLogin}
            >
              <Zap size={18} />
              <span>Owner Demo (santosh)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer style={{
        background: '#0b1120',
        color: '#94a3b8',
        padding: '3rem 1.5rem',
        borderTop: '1px solid #1e293b',
        fontSize: '0.82rem'
      }}>
        <div style={{
          maxWidth: '1050px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
              <div style={{ width: '26px', height: '26px', background: 'var(--orange-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <HardHat size={16} />
              </div>
              <span>ScaffBuild <span style={{ color: 'var(--orange-primary)' }}>ERP</span></span>
            </div>
            <p style={{ margin: 0 }}>
              ScaffBuild Shuttering & Scaffolding Co. • Plot No. 42, Sector 19, Vashi MIDC, Navi Mumbai, MH - 400705
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div>GSTIN: <strong style={{ color: '#cbd5e1' }}>27AAACS1234M1Z8</strong> &nbsp;|&nbsp; PAN: <strong style={{ color: '#cbd5e1' }}>AAACS1234M</strong></div>
            <div style={{ marginTop: '4px' }}>Support: accounts@scaffbuild.com | +91 98201 98201</div>
          </div>
        </div>

        <div style={{
          maxWidth: '1050px',
          margin: '2rem auto 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid #1e293b',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.75rem'
        }}>
          © {new Date().getFullYear()} ScaffBuild ERP. Compliant with Rule 46 of CGST Rules & NIC Schema INV-01. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
