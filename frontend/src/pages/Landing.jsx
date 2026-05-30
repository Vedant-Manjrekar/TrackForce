import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, BarChart3, Cpu, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

function Landing() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">TrackForce</div>
        <div className="nav-links" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            className="btn-outline" 
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="login-btn nav-btn">Sign In</Link>
          <Link to="/signup" className="signup-btn nav-btn">Get Started</Link>
        </div>
      </nav>
      
      <header className="hero-section">
        <div className="hero-content">
          <div className="enterprise-badge" style={{ marginBottom: '24px' }}>
            <ShieldCheck size={14} /> Enterprise Field Operations Platform
          </div>
          <h1>
            Intelligent logistics for modern field forces.
          </h1>
          <p>
            Unify your ground staff, regional managers, and executive leadership with real-time telemetry, automated compliance, and AI-powered visit intelligence.
          </p>
          <div className="hero-btns">
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '14px 28px', fontSize: '15px' }}>
                Request Enterprise Trial <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ padding: '14px 28px', fontSize: '15px' }}>
                Explore Sandbox
              </button>
            </Link>
          </div>
          
          <div style={{ marginTop: '48px', display: 'flex', gap: '32px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> SOC2 Type II Certified
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> 99.99% Uptime SLA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> End-to-End Encryption
            </div>
          </div>
        </div>

        <div className="hero-visual" style={{ width: '100%', maxWidth: '540px' }}>
          <div style={{ 
            width: '100%', 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>System Telemetry</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Live operational throughput</div>
              </div>
              <span className="status-badge status-completed">Operational</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Ground Unit Synchronization</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>98.4%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '98.4%', height: '100%', background: 'var(--primary-color)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>AI Summary Digestion Queue</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>12ms latency</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '15%', height: '100%', background: 'var(--success-color)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Regional Compliance Audit</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>100% Passed</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--primary-color)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Active Broadcast</span>: All regional directors online.
              </div>
            </div>

          </div>
        </div>
      </header>

      <section style={{ padding: '96px 0', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Architected for scale and compliance.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>
            Built specifically for complex organizational hierarchies requiring stringent audit trails and uncompromising reliability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          
          <div className="card" style={{ padding: '36px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Strict RBAC Governance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Deploy fine-grained permissions across 5 distinct operational tiers. Regional managers and field auditors operate within cryptographically scoped geographic boundaries.
            </p>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Executive Telemetry</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Real-time operational dashboards provide instant visibility into visit completion velocity, high-risk incident occurrences, and regional task distribution.
            </p>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Autonomous AI Digestion</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Field notes and visit transcripts are instantly processed by our Mock AI subsystem to extract actionable risk flags, synthesize executive summaries, and trigger automated alerts.
            </p>
          </div>

        </div>
      </section>

      <footer style={{ padding: '48px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--text-primary)' }}>
          <div style={{ width: '16px', height: '16px', background: 'var(--primary-gradient)', borderRadius: '4px' }}></div>
          TrackForce Enterprise
        </div>
        <div>
          &copy; 2026 TrackForce Systems Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;
