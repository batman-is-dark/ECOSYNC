import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { 
    ArrowLeft, Leaf, Power, Zap, Activity, 
    ShieldCheck, CloudLightning, Database, 
    Bell, Settings, RefreshCcw, Info, CheckCircle
} from 'lucide-react';
import './app.css';

const API_BASE = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/"/g, '')) || 'http://localhost:8000/api';
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN || 'ecosync_internal_2026_secure';
const AUTH_HEADER = { 'X-EcoSync-Key': AUTH_TOKEN };

const Dashboard = () => {
    const [stats, setStats] = useState({
        actual_occupancy: 0,
        predicted_occupancy: [0, 0],
        energy_savings_mode: false,
        carbon_saved_kg: 0,
        history: [],
        ai_override: false,
        gemini_insight: "Analyzing campus patterns...",
        last_sync: new Date().toLocaleTimeString()
    });

    const [logs, setLogs] = useState([
        { id: 1, time: '14:20:00', msg: 'Core AI Engine: ONLINE' },
        { id: 3, time: '14:20:05', msg: 'Campus Network telemetry stream sync successful.' }
    ]);

    const [toggles, setToggles] = useState({
        hvac_north: true,
        hvac_admin: true,
        lights_admin: false,
        lights_classrooms: true
    });

    const [aiOverride, setAiOverride] = useState(false);
    const [applyingStrategy, setApplyingStrategy] = useState(false);

    const toggleAiOverride = async () => {
        const newStatus = !aiOverride;
        setAiOverride(newStatus);
        try {
            await fetch(`${API_BASE}/override?status=${newStatus}`, { 
                method: 'POST',
                headers: AUTH_HEADER
            });
            setLogs(prev => [{
                id: Date.now(),
                time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                msg: `SYSTEM: AI Autonomous mode ${newStatus ? 'ENABLED' : 'DISABLED'}`
            }, ...prev]);
        } catch (e) {
            setAiOverride(!newStatus);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE}/stats`, {
                    headers: AUTH_HEADER
                });
                const data = await res.json();
                setStats({ ...data, last_sync: new Date().toLocaleTimeString() });
                if (data.devices) setToggles(data.devices);
                setAiOverride(data.ai_override);

                if (Math.random() > 0.8) {
                    const newLog = {
                        id: Date.now(),
                        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                        msg: `ML Engine: ${data.actual_occupancy > 150 ? 'Optimal load balancing applied.' : 'Predictive throttling enabled.'}`
                    };
                    setLogs(prev => [newLog, ...prev].slice(0, 15));
                }
            } catch (e) {
                console.warn('Stat fetch failed', e);
            }
        };

        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleDevice = async (device) => {
        const newStatus = !toggles[device];
        setToggles(prev => ({ ...prev, [device]: newStatus }));
        try {
            await fetch(`${API_BASE}/device-toggle?device=${device}&status=${newStatus}`, { 
                method: 'POST',
                headers: AUTH_HEADER
            });
            setLogs(prev => [{
                id: Date.now(),
                time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                msg: `${device.toUpperCase()} state changed to ${newStatus ? 'ACTIVE' : 'INACTIVE'}`
            }, ...prev].slice(0, 15));
        } catch (e) {
            setToggles(prev => ({ ...prev, [device]: !newStatus }));
        }
    };

    const handleApplyStrategy = async () => {
        setApplyingStrategy(true);
        try {
            await fetch(`${API_BASE}/apply-strategy`, {
                method: 'POST',
                headers: AUTH_HEADER
            });
            setTimeout(() => {
                setApplyingStrategy(false);
                setLogs(prev => [{
                    id: Date.now(),
                    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                    msg: 'INTELLIGENT_STRATEGY: Gemini recommendations applied to HVAC setpoints.'
                }, ...prev]);
            }, 1200);
        } catch (e) {
            setApplyingStrategy(false);
        }
    };

    return (
        <div className="app-container" style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
                        <ArrowLeft size={18} /> BACK TO LANDING
                    </Link>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="mono" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--neon-mint)' }}>●</span> SYSTEM STATUS: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>OPERATIONAL</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LAST SYNC: {stats.last_sync}</div>
                    <button className="icon-btn"><Bell size={18} /></button>
                    <button className="icon-btn"><Settings size={18} /></button>
                </div>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {[
                    { label: 'Active Devices', value: '4 / 4', icon: <Zap size={20} />, color: 'var(--neon-blue)' },
                    { label: 'Carbon Saved (Est)', value: `${Math.floor(stats.carbon_saved_kg)} kg`, icon: <Leaf size={20} />, color: 'var(--neon-mint)' },
                    { label: 'Grid Confidence', value: '98.2%', icon: <ShieldCheck size={20} />, color: 'var(--neon-purple)' },
                    { label: 'Live Occupancy', value: stats.actual_occupancy, icon: <Activity size={20} />, color: '#fff' }
                ].map((kpi, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>{kpi.label}</span>
                            <div style={{ color: kpi.color }}>{kpi.icon}</div>
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 800 }}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ 
                marginBottom: '32px', 
                padding: '32px', 
                borderRadius: '24px',
                border: '1px solid rgba(189,0,255,0.25)', 
                background: 'linear-gradient(135deg, rgba(189,0,255,0.12) 0%, rgba(20,25,25,0.9) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="advisor-glow"></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ background: 'var(--neon-purple)', padding: '16px', borderRadius: '18px', color: 'white', boxShadow: '0 0 20px rgba(189,0,255,0.3)' }}>
                        <CloudLightning size={32} />
                    </div>
                    <div>
                        <div className="mono" style={{ fontSize: '11px', color: 'var(--neon-purple)', marginBottom: '8px', fontWeight: 800, letterSpacing: '1.5px' }}>
                            STRATEGIC ADVISOR (GEMINI 1.5 FLASH)
                        </div>
                        <div style={{ fontSize: '18px', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500, fontStyle: 'italic', maxWidth: '700px' }}>
                             "{stats.gemini_insight}"
                        </div>
                    </div>
                </div>
                <button 
                  className={`btn-cyber ${applyingStrategy ? 'loading' : ''}`} 
                  onClick={handleApplyStrategy}
                  disabled={applyingStrategy}
                  style={{ minWidth: '180px', height: '48px' }}
                >
                    {applyingStrategy ? 'OPTIMIZING...' : 'APPLY STRATEGY'}
                    <CheckCircle size={18} style={{ marginLeft: '10px' }} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Occupancy Real-time Analysis</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>Data ingested via WiFi telemetry and LSTM forecasting models</p>
                        </div>
                        <div className="mono" style={{ fontSize: '13px', display: 'flex', gap: '20px' }}>
                           <span style={{ opacity: 0.5 }}>● PREDICTED</span>
                           <span style={{ color: 'var(--neon-mint)' }}>● ACTUAL FEED</span>
                        </div>
                    </div>
                    <div style={{ height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.history.length > 0 ? stats.history : [{time: '-', actual: 0, predicted: 0}]}>
                                <defs>
                                    <linearGradient id="mainGraph" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--neon-mint)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--neon-mint)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip 
                                    contentStyle={{ background: '#0f1717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="actual" 
                                    stroke="var(--neon-mint)" 
                                    strokeWidth={3} 
                                    fill="url(#mainGraph)" 
                                    animationDuration={1000}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="predicted" 
                                    stroke="rgba(255,255,255,0.15)" 
                                    strokeWidth={2} 
                                    fill="transparent" 
                                    strokeDasharray="6 4" 
                                />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Database size={20} /> Data Intelligence
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { label: 'Campus Data Warehouse', status: 'SYNCED', val: '2.4 GB' },
                            { label: 'Edge Inference Latency', status: 'LOW', val: '12ms' },
                            { label: 'Model Accuracy', status: '94%', val: 'LSTM-v4' },
                            { label: 'Core processing Ticks', status: 'IDLE', val: 'OK' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</div>
                                    <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>STATUS: {item.status}</div>
                                </div>
                                <div className="mono" style={{ fontSize: '12px', color: 'var(--neon-blue)' }}>{item.val}</div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-cyber" style={{ width: '100%', marginTop: '24px', padding: '12px' }}>
                        Generate Export <RefreshCcw size={14} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Intelligent Controls</h3>
                        <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            onClick={toggleAiOverride}
                        >
                            <span className="mono" style={{ fontSize: '11px', color: aiOverride ? 'var(--neon-purple)' : 'var(--text-muted)' }}>
                                {aiOverride ? 'AI_AUTONOMOUS_MODE' : 'MANUAL_INTERVENTION'}
                            </span>
                            <div className={`status-dot ${aiOverride ? 'glow' : ''}`} style={{ background: aiOverride ? 'var(--neon-purple)' : 'var(--text-muted)' }}></div>
                        </div>
                    </div>
                    <div className="controls-grid">
                        <div className="control-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--neon-blue)' }}>
                                    <Power size={16} />
                                </div>
                                <span>HVAC Wing A</span>
                            </div>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.hvac_north} onChange={() => toggleDevice('hvac_north')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="control-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 255, 163, 0.1)', color: 'var(--neon-mint)' }}>
                                    <Leaf size={16} />
                                </div>
                                <span>Energy Sav. Mode</span>
                            </div>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.hvac_admin} onChange={() => toggleDevice('hvac_admin')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="control-item">
                            <span>Main Lights</span>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.lights_admin} onChange={() => toggleDevice('lights_admin')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="control-item">
                            <span>Studio Arrays</span>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.lights_classrooms} onChange={() => toggleDevice('lights_classrooms')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>System Operations Log</h3>
                        <span className="mono" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(0,255,163,0.1)', color: 'var(--neon-mint)' }}>
                            REAL-TIME
                        </span>
                    </div>
                    <div className="log-console" style={{ height: '240px' }}>
                        {[...logs, ...(stats.events || []).map((e, i) => ({ id: `be-${i}`, time: e.time, msg: e.event }))]
                            .sort((a,b) => b.time.localeCompare(a.time))
                            .slice(0, 20)
                            .map(log => (
                            <div key={log.id} className="log-entry" style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <span style={{ color: 'var(--text-muted)', marginRight: '10px' }}>[{log.time}]</span>
                                <span style={{ color: log.msg.includes('FAILED') ? '#ff5f5f' : 'inherit' }}>{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
