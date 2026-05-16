import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Compass, Cpu, Layers } from 'lucide-react';

function Landing() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo" style={{ fontSize: '32px' }}>FieldOps.</div>
        <div className="nav-links" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" className="login-btn" style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', textDecoration: 'none' }}>Log In</Link>
          <Link to="/signup" style={{ 
            background: 'var(--text-primary)', 
            color: 'var(--bg-color)', 
            padding: '10px 24px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            fontSize: '13px',
            textDecoration: 'none',
            border: '2px solid var(--text-primary)',
            boxShadow: '4px 4px 0px var(--primary-color)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px var(--primary-color)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--primary-color)'; }}
          >
            Commence
          </Link>
        </div>
      </nav>
      
      <header className="hero-section" style={{ padding: '80px 0 120px 0', display: 'flex', flexDirection: 'column', gap: '64px', alignItems: 'flex-start' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', width: '100%', alignItems: 'center' }}>
          <div className="hero-content" style={{ flex: 'none', width: '100%' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '40px', height: '2px', background: 'var(--primary-color)' }}></span>
              Industrial Grade Logistics
            </div>
            <h1 style={{ fontSize: 'clamp(64px, 8vw, 120px)', margin: '0 0 32px 0', color: 'var(--text-primary)' }}>
              Orchestrate<br />The Field.
            </h1>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '500px', lineHeight: '1.5', fontFamily: 'var(--font-body)', fontWeight: '500' }}>
              A command center for modern field operations. Real-time telemetry, structural task management, and autonomous reporting.
            </p>
            <div className="hero-btns" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link to="/signup" style={{ 
                background: 'var(--primary-color)', 
                color: '#fff', 
                padding: '16px 32px', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                textDecoration: 'none',
                border: '2px solid var(--border-color)',
                boxShadow: '6px 6px 0px var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '8px 8px 0px var(--border-color)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '6px 6px 0px var(--border-color)'; }}
              >
                Initialize Deployment <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
            <div style={{ 
              position: 'absolute', top: '40px', right: '40px', bottom: '-40px', left: '-40px', 
              background: 'var(--primary-color)', zIndex: 0 
            }} />
            <div style={{ 
              position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, 
              background: 'var(--surface-color)', border: '4px solid var(--border-color)', zIndex: 1,
              display: 'flex', flexDirection: 'column', padding: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '32px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>Live Telemetry</span>
                <span style={{ width: '12px', height: '12px', background: 'var(--primary-color)', borderRadius: '50%' }}></span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ padding: '16px', border: '2px solid var(--border-color)', background: 'var(--surface-hover)', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '40%', height: '8px', background: 'var(--border-color)' }}></div>
                    <div style={{ width: '20%', height: '8px', background: 'var(--primary-color)' }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </header>

      <section style={{ padding: '80px 0', borderTop: '4px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', border: '4px solid var(--border-color)' }}>
          
          <div style={{ padding: '48px 32px', borderRight: '4px solid var(--border-color)', background: 'var(--surface-color)', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-color)'}>
            <Layers size={40} style={{ color: 'var(--primary-color)', marginBottom: '32px' }} />
            <h3 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>Architectural Hierarchy</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.5' }}>Granular permissions structure. Regional commanders, team operatives, and ground agents in perfect synchronization.</p>
          </div>

          <div style={{ padding: '48px 32px', borderRight: '4px solid var(--border-color)', background: 'var(--surface-color)', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-color)'}>
            <Compass size={40} style={{ color: 'var(--primary-color)', marginBottom: '32px' }} />
            <h3 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>Tactical Oversight</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.5' }}>Unfiltered visibility into global operations. Track deployment efficiency and mission critical parameters instantly.</p>
          </div>

          <div style={{ padding: '48px 32px', background: 'var(--surface-color)', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-color)'}>
            <Cpu size={40} style={{ color: 'var(--primary-color)', marginBottom: '32px' }} />
            <h3 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>Autonomous Insights</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.5' }}>Synthetic intelligence digests field reports. Automatic risk flagging and operational summary generation.</p>
          </div>

        </div>
      </section>

      <footer style={{ padding: '64px 0', borderTop: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'var(--text-primary)' }}>FieldOps.</div>
        <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
          System Specification v1.0 &mdash; 2026
        </div>
      </footer>
    </div>
  );
}

export default Landing;
