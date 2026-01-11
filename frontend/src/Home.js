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
      {/* inline SVG floorplan (blueprint) */}
      <svg className="floorplan-svg" viewBox="0 0 320 640" preserveAspectRatio="xMidYMid slice">
        {/* rooms: x, y, width, height */}
        <rect className="room room-quiet fill-quiet" x="18" y="68" width="120" height="90" rx="6" />
        <text className="room-label" x="28" y="98">Study Room A</text>

        <rect className="room room-active fill-active" x="160" y="52" width="140" height="120" rx="6" />
        <text className="room-label" x="170" y="82">Lecture Hall</text>

        <rect className="room room-busy fill-busy" x="40" y="220" width="240" height="140" rx="6" />
        <text className="room-label" x="50" y="250">Student Center / Cafe</text>

        <rect className="room room-quiet" x="18" y="380" width="90" height="110" rx="6" />
        <text className="room-label" x="24" y="410">Library Nook</text>
      </svg>

      {/* heatmap zones aligned to rooms */}
      <div className="heatmap-zone heatmap-quiet" style={{ top: '26%', left: '14%' }}></div>
      <div className="heatmap-zone heatmap-active" style={{ top: '10%', left: '52%' }}></div>
      <div className="heatmap-zone heatmap-busy" style={{ top: '36%', left: '28%' }}></div>

      {/* markers anchored to rooms */}
      <div className="map-marker" style={{ top: '34%', left: '22%' }}>
        <div className="marker-dot" style={{ background: 'linear-gradient(90deg,#00ffa3,#00d2ff)' }}></div>
        <div className="marker-label">Study Room A — 3 ppl</div>
      </div>
      <div className="map-marker" style={{ top: '22%', left: '62%' }}>
        <div className="marker-dot" style={{ background: 'linear-gradient(90deg,#00d2ff,#00aaff)' }}></div>
        <div className="marker-label">Lecture Hall — 12 ppl</div>
      </div>
      <div className="map-marker" style={{ top: '46%', left: '36%' }}>
        <div className="marker-dot" style={{ background: 'linear-gradient(90deg,#bd00ff,#ff4da6)' }}></div>
        <div className="marker-label">Cafe — 28 ppl</div>
      </div>

      {/* legend */}
      <div className="map-legend">
        <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>Zones</div>
        <div className="legend-row"><div className="legend-swatch legend-quiet" /> Quiet</div>
        <div className="legend-row"><div className="legend-swatch legend-active" /> Active</div>
        <div className="legend-row"><div className="legend-swatch legend-busy" /> High Activity</div>
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
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--neon-mint)' }}>Vertex AI Driven</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>94% predictive accuracy using custom Vertex AI models.</p>
             </div>
             <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--neon-blue)' }}>Gemini Intelligence</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Real-time reasoning over unstructured campus data.</p>
             </div>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Powered by:</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span className="mono" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>BigQuery</span>
              <span className="mono" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Flutter</span>
              <span className="mono" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Google Cloud</span>
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
