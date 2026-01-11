import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, Calendar, User, Layout, Leaf, Clock, TrendingUp, Award } from 'lucide-react';
import './app.css';

const MobileMockup = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Dragging state
  const [mapPos, setMapPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const rooms = [
    { id: 'study_a', name: 'Study Room A', ppl: 3, zone: 'quiet', x: 18, y: 68, w: 120, h: 90 },
    { id: 'lecture', name: 'Lecture Hall', ppl: 12, zone: 'active', x: 160, y: 52, w: 140, h: 120 },
    { id: 'cafe', name: 'Student Center', ppl: 28, zone: 'busy', x: 40, y: 220, w: 240, h: 140 },
  ];

  const handleDragDown = (e) => {
    setIsDragging(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - mapPos.x, y: clientY - mapPos.y });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    setMapPos({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleDragUp = () => setIsDragging(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <div className="map-container" 
            onMouseDown={handleDragDown}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragUp}
            onMouseLeave={handleDragUp}
            onTouchStart={handleDragDown}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div style={{ 
              transform: `translate(${mapPos.x}px, ${mapPos.y}px)`, 
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              width: '100%', height: '100%'
            }}>
                <svg className="floorplan-svg" viewBox="0 0 320 640" preserveAspectRatio="xMidYMid slice">
                {rooms.map(room => (
                    <rect 
                    key={room.id}
                    className={`room room-${room.zone} fill-${room.zone} room-interactive`} 
                    x={room.x} y={room.y} width={room.w} height={room.h} rx="6" 
                    onClick={() => setSelectedRoom(room)}
                    />
                ))}
                {rooms.map(room => (
                    <text key={`lbl-${room.id}`} className="room-label" x={room.x + 10} y={room.y + 30}>{room.name}</text>
                ))}
                </svg>

                <div className="heatmap-zone heatmap-quiet" style={{ top: '26%', left: '14%' }}></div>
                <div className="heatmap-zone heatmap-active" style={{ top: '10%', left: '52%' }}></div>
                <div className="heatmap-zone heatmap-busy" style={{ top: '36%', left: '28%' }}></div>

                {/* GUI Markers */}
                <div className="map-marker" style={{ top: '34%', left: '22%' }}>
                    <div className="marker-dot" style={{ background: 'linear-gradient(90deg,#00ffa3,#00d2ff)' }}></div>
                    <div className="marker-label">3 Open Seats</div>
                </div>
                <div className="map-marker" style={{ top: '22%', left: '62%' }}>
                    <div className="marker-dot" style={{ background: 'linear-gradient(90deg,#00d2ff,#00aaff)' }}></div>
                    <div className="marker-label">Active Hub</div>
                </div>
            </div>

            {selectedRoom && (
              <div className="map-overlay-pop">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0 }}>{selectedRoom.name}</h4>
                  <button onClick={() => setSelectedRoom(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                </div>
                <div className="mono" style={{ fontSize: '12px', color: 'var(--neon-mint)' }}>
                  {selectedRoom.ppl} Students Present
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Energy optimization active. HVAC at 22°C.
                </div>
              </div>
            )}
          </div>
        );
      case 'schedule':
        return (
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>My Schedule</h3>
            <div className="schedule-item">
              <div>
                <div style={{ fontWeight: 600 }}>Advanced Calculus</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>10:00 - 11:30 | Room 204</div>
              </div>
              <div style={{ color: 'var(--neon-mint)', fontSize: '10px' }} className="mono">ECO-SYNCED</div>
            </div>
            <div className="schedule-item" style={{ borderLeft: '3px solid var(--neon-mint)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Study Session</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>14:00 - 16:00 | Library Nook</div>
              </div>
              <div style={{ color: 'var(--neon-mint)', fontSize: '10px' }} className="mono">LOW OCCUPANCY</div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div style={{ padding: '20px' }}>
            <div className="profile-stat-card">
              <div style={{ background: 'rgba(0,255,163,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 15px' }}>
                <Award size={32} color="var(--neon-mint)" />
              </div>
              <h2 style={{ margin: '0 0 5px 0' }}>Eco-Warrior</h2>
              <div className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Level 12 Sustainability Lead</div>
            </div>
            
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <TrendingUp size={20} color="var(--neon-blue)" />
                <div style={{ fontSize: '18px', fontWeight: 700, margin: '5px 0' }}>42kg</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Carbon Offset</div>
              </div>
              <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <Clock size={20} color="var(--neon-mint)" />
                <div style={{ fontSize: '18px', fontWeight: 700, margin: '5px 0' }}>128h</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Smart Study</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mobile-view">
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
        <Leaf size={20} color="var(--neon-mint)" />
        <span style={{ fontWeight: 800, fontSize: '18px' }}>EcoSync</span>
      </div>
      
      <div className="mobile-content">
        {renderContent()}
      </div>

      <div className="tab-nav">
        <div className={`tab-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          <MapIcon size={20} />
          <span style={{ fontSize: '10px', marginTop: '4px' }}>Map</span>
        </div>
        <div className={`tab-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
          <Calendar size={20} />
          <span style={{ fontSize: '10px', marginTop: '4px' }}>Schedule</span>
        </div>
        <div className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={20} />
          <span style={{ fontSize: '10px', marginTop: '4px' }}>Profile</span>
        </div>
      </div>
    </div>
  );
};

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
          <h2 style={{ fontSize: '56px', lineHeight: 1, marginBottom: '24px', fontWeight: 800 }}>
            Unified <br />
            <span className="text-gradient">Campus Energy</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '19px', lineHeight: 1.5, marginBottom: '40px', maxWidth: '540px' }}>
            EcoSync AI orchestrates university infrastructure by synchronizing 
            occupancy intelligence with building automation to drive radical sustainability.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
             <button className="btn-cyber primary" onClick={() => window.location.href='/dashboard'}>
               Admin Console <Layout size={18} style={{ marginLeft: '8px' }} />
             </button>
             <button className="btn-cyber">
               Download Flutter App <TrendingUp size={18} style={{ marginLeft: '8px' }} />
             </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '320px' }}>
          <div style={{ textAlign: 'center' }}>
            <MobileMockup />
            <div className="mono" style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Built with Flutter Cross-Platform Engine
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
