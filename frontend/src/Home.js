import React from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, Calendar, User, Layout, Leaf } from 'lucide-react';
import './app.css';

const MobileMockup = () => (
  <div className="mobile-view">
    <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Leaf size={20} color="var(--neon-mint)" />
      <span style={{ fontWeight: 800, fontSize: '18px' }}>EcoSync AI</span>
    </div>
    
    <div style={{ padding: '0 20px', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '24px', margin: 0 }}>Student Study Map</h2>
    </div>

    <div className="map-container">
      <div className="heatmap-overlay" style={{ top: '30%', left: '20%' }}></div>
      <div className="heatmap-overlay" style={{ top: '50%', left: '50%', width: '100px', height: '100px' }}></div>
      
      <div style={{ position: 'absolute', top: '35%', left: '30%', color: 'white', fontSize: '12px', fontWeight: 'bold', textShadow: '0 0 10px black' }}>
        Quiet Zone
      </div>
       <div style={{ position: 'absolute', top: '55%', left: '55%', color: 'white', fontSize: '12px', fontWeight: 'bold', textShadow: '0 0 10px black' }}>
        Active Zone
      </div>
    </div>

    <div style={{ 
      position: 'absolute', bottom: 0, width: '100%', 
      display: 'flex', justifyContent: 'space-around', 
      padding: '20px 0', background: 'rgba(15,23,23,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--neon-mint)' }}>
        <MapIcon size={20} />
        <span style={{ fontSize: '10px', marginTop: '4px' }}>Map</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
        <Calendar size={20} />
        <span style={{ fontSize: '10px', marginTop: '4px' }}>Schedule</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
        <User size={20} />
        <span style={{ fontSize: '10px', marginTop: '4px' }}>Profile</span>
      </div>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="app-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Leaf size={32} color="var(--neon-mint)" />
          <h1 style={{ fontSize: '28px', margin: 0 }}>EcoSync AI</h1>
        </div>
        <Link to="/dashboard" className="btn-cyber primary">
          Admin Dashboard <Layout size={18} style={{ marginLeft: '8px' }} />
        </Link>
      </header>

      <main style={{ display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="mono" style={{ color: 'var(--neon-mint)', marginBottom: '16px' }}>
            // SMART CAMPUS SOLUTION
          </div>
          <h2 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '24px' }}>
            The Pulse of <br />
            <span className="text-gradient">Green Energy</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px' }}>
            EcoSync AI bridges the gap between campus life and sustainability. 
            Real-time occupancy mapping helps students find quiet spaces while 
            automatically optimizing energy consumption across the entire university.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
             <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--neon-mint)' }}>94% Accuracy</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>In occupancy prediction using AI-driven WiFi logs.</p>
             </div>
             <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--neon-blue)' }}>30% Savings</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Reduction in HVAC energy waste after hours.</p>
             </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '320px' }}>
          <MobileMockup />
        </div>
      </main>
    </div>
  );
};

export default Home;
