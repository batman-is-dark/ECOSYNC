import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowLeft, Leaf, Power, Target, Zap } from 'lucide-react';
import './app.css';

const API_BASE = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/"/g, '')) || 'http://localhost:8000/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        actual_occupancy: 0,
        predicted_occupancy: [0, 0],
        energy_savings_mode: false,
        carbon_saved_kg: 0,
        history: [],
        ai_override: false
    });

    const [logs, setLogs] = useState([
        { id: 1, time: '14:20:01', msg: 'System initialized. Loading AI weights...' },
        { id: 2, time: '14:20:05', msg: 'WiFi log stream connected. 242 nodes active.' },
        { id: 3, time: '14:20:10', msg: 'HVAC North Wing entering ECO-MODE via predictive trigger.' }
    ]);

    const [toggles, setToggles] = useState({
        hvac_north: true,
        hvac_admin: true,
        lights_admin: false,
        lights_classrooms: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE}/stats`);
                const data = await res.json();
                setStats(data);
                // initialize toggles from backend devices state when available
                if (data.devices) setToggles(data.devices);
                // Add a random log entry occasionally for the "Advanced" feel
                if (Math.random() > 0.7) {
                    const newLog = {
                        id: Date.now(),
                        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                        msg: `AI Inference: ${data.actual_occupancy > 150 ? 'High occupancy detected in Admin. Adjusting setpoints.' : 'Low occupancy predicted. Reducing baseline energy consumption.'}`
                    };
                    setLogs(prev => [newLog, ...prev].slice(0, 10));
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
        // optimistic update
        setToggles(prev => ({ ...prev, [device]: newStatus }));

        try {
            const res = await fetch(`${API_BASE}/device-toggle?device=${device}&status=${newStatus}`, {
                method: 'POST'
            });
            const json = await res.json();
            if (json.status !== 'success') throw new Error(json.message || 'failed');

            // log success
            const entry = {
                id: Date.now(),
                time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                msg: `${device} set to ${newStatus ? 'ON' : 'OFF'}`
            };
            setLogs(prev => [entry, ...prev].slice(0, 10));
        } catch (e) {
            // revert optimistic update
            setToggles(prev => ({ ...prev, [device]: !newStatus }));
            const entry = {
                id: Date.now(),
                time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                msg: `Failed to set ${device}: ${e.message}`
            };
            setLogs(prev => [entry, ...prev].slice(0, 10));
        }
    };

    return (
        <div className="app-container" style={{ padding: '20px' }}>
            <nav style={{ marginBottom: '20px' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={18} /> Back
                </Link>
            </nav>

            <div className="glass-panel admin-card">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Leaf size={24} color="var(--neon-mint)" />
                        <h2 style={{ margin: 0 }}>Advanced Energy Console</h2>
                    </div>
                    <div className="mono" style={{ color: 'var(--neon-mint)', fontSize: '12px', background: 'rgba(0, 255, 163, 0.1)', padding: '4px 12px', borderRadius: '4px' }}>
                       SYSTEM ID: ECO_AI_STATION_04
                    </div>
                </header>

                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {/* Left: Chart */}
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.4)', borderRadius: '2px' }}></div>
                                    <span style={{ color: 'var(--text-muted)' }}>Predicted</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'var(--neon-mint)', borderRadius: '2px' }}></div>
                                    <span style={{ color: 'var(--text-muted)' }}>Actual</span>
                                </div>
                            </div>
                            <div className="mono" style={{ fontSize: '14px' }}>
                                LIVE FEED: {stats.actual_occupancy} ROOM UNITS
                            </div>
                        </div>

                        <div className="chart-container-inner" style={{ height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.history.length > 0 ? stats.history : [{time: '0', actual: 0, predicted: 0}]}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--neon-mint)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--neon-mint)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip 
                                        contentStyle={{ background: 'rgba(15,23,23,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--neon-mint)' }}
                                    />
                                    <Area type="monotone" dataKey="actual" stroke="var(--neon-mint)" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                    <Area type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right: CO2 Card */}
                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px', background: 'rgba(255,255,255,0.02)' }}>
                            <span style={{ fontSize: '64px', fontWeight: 800, color: 'var(--neon-mint)', lineHeight: 1 }}>{Math.floor(stats.carbon_saved_kg + 139)}</span>
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <div style={{ fontSize: '18px', fontWeight: 600 }}>Tons CO2</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '20px' }}>Total Saved</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="advanced-bottom-grid">
                    {/* Controls */}
                    <div className="controls-grid" style={{ marginTop: 0 }}>
                        <div className="control-item">
                            <span>HVAC North Wing</span>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.hvac_north} onChange={() => toggleDevice('hvac_north')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="control-item">
                            <span>HVAC Admin</span>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.hvac_admin} onChange={() => toggleDevice('hvac_admin')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="control-item">
                            <span>Lights Admin</span>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.lights_admin} onChange={() => toggleDevice('lights_admin')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="control-item">
                            <span>Lights Classrooms</span>
                            <label className="switch">
                                <input type="checkbox" checked={toggles.lights_classrooms} onChange={() => toggleDevice('lights_classrooms')} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* AI Reasoning Console */}
                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '14px' }}>System reasoning log</h4>
                            <span className="mono" style={{ fontSize: '10px', color: 'var(--neon-mint)' }}>● ANALYTICS ACTIVE</span>
                        </div>
                        <div className="log-console">
                            {logs.map(log => (
                                <div key={log.id} className="log-entry">
                                    <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>[{log.time}]</span>
                                    {log.msg}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
