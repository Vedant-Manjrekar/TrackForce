import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">FieldOps Pro</div>
        <div className="nav-links">
          <Link to="/login" className="nav-btn login-btn">Login</Link>
          <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
        </div>
      </nav>
      
      <header className="hero-section">
        <div className="hero-content">
          <h1>Modern Field Operations Management</h1>
          <p>Streamline your field force with real-time task tracking, scope-based access, and AI-powered visit insights.</p>
          <div className="hero-btns">
            <Link to="/signup" className="hero-btn-primary">Get Started for Free</Link>
            <Link to="/login" className="hero-btn-secondary">View Demo</Link>
          </div>
        </div>
        <div className="hero-visual">
          {/* Placeholder for a hero image or animation */}
          <div className="abstract-shape"></div>
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Role-Based Control</h3>
          <p>Precisely manage permissions for Admins, Managers, and Agents with regional scoping.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Real-time Analytics</h3>
          <p>Track team performance and task completion with interactive dashboards.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Visit Insights</h3>
          <p>Automatically generate summaries and risk flags from visit notes using our Mock AI service.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 FieldOps Pro. Built for modern field teams.</p>
      </footer>
    </div>
  );
}

export default Landing;
