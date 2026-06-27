'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck, Truck, Activity, Wind, Zap, Bell,
  TrendingDown, TrendingUp, MapPin, AlertTriangle, Clock,
  ChevronRight, Radio, Shield, BarChart3, Eye, Gauge,
  Thermometer, Droplets, Factory
} from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import VehicleChart from '@/components/AnalyticsChart';

type View = 'dashboard' | 'monitor' | 'sensors' | 'safety';

// ─── Stat Card ────────────────────────────────────────
function StatCard({ label, value, change, changeType, icon: Icon, color, delay }: {
  label: string; value: string | number; change: string; changeType: 'up' | 'down' | 'neutral';
  icon: any; color: string; delay: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    blue:    { bg: 'rgba(59,130,246,0.08)', text: '#60a5fa', glow: 'rgba(59,130,246,0.12)' },
    emerald: { bg: 'rgba(16,185,129,0.08)', text: '#34d399', glow: 'rgba(16,185,129,0.12)' },
    amber:   { bg: 'rgba(245,158,11,0.08)', text: '#fbbf24', glow: 'rgba(245,158,11,0.12)' },
    rose:    { bg: 'rgba(244,63,94,0.08)',   text: '#fb7185', glow: 'rgba(244,63,94,0.12)' },
    violet:  { bg: 'rgba(139,92,246,0.08)', text: '#a78bfa', glow: 'rgba(139,92,246,0.12)' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`glass-card p-5 animate-fade-up ${delay}`} style={{ '--glow': c.glow } as any}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a' }}>{label}</span>
        <div style={{ padding: '8px', borderRadius: '12px', background: c.bg }}>
          <Icon size={16} color={c.text} />
        </div>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}>
        {changeType === 'down' ? <TrendingDown size={14} color="#34d399" /> : changeType === 'up' ? <TrendingUp size={14} color="#fb7185" /> : null}
        <span style={{ color: changeType === 'down' ? '#34d399' : changeType === 'up' ? '#fb7185' : '#71717a' }}>{change}</span>
      </div>
    </div>
  );
}

// ─── Incident Row ─────────────────────────────────────
function IncidentRow({ type, location, severity, time, status, description }: {
  type: string; location: string; severity: string; time: string; status: string; description?: string;
}) {
  const sevColor: Record<string, string> = {
    critical: '#f43f5e', high: '#f59e0b', medium: '#3b82f6', low: '#10b981',
  };
  const sevBg: Record<string, string> = {
    critical: 'rgba(244,63,94,0.12)', high: 'rgba(245,158,11,0.12)',
    medium: 'rgba(59,130,246,0.12)', low: 'rgba(16,185,129,0.12)',
  };
  const statusColor: Record<string, string> = {
    Active: '#f43f5e', Investigating: '#f59e0b', Resolved: '#10b981',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{
        marginTop: '2px', flexShrink: 0, fontSize: '9px', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        padding: '3px 7px', borderRadius: '6px',
        color: sevColor[severity] || '#71717a',
        background: sevBg[severity] || 'rgba(113,113,122,0.1)',
      }}>{severity}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{type}</div>
        <div style={{ fontSize: '11px', color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <MapPin size={10} /> {location}
        </div>
        {description && (
          <div style={{ fontSize: '11px', color: '#3f3f46', marginTop: '4px', lineHeight: '1.4' }}>{description}</div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: statusColor[status] || '#71717a', marginBottom: '2px' }}>{status}</div>
        <div style={{ fontSize: '10px', color: '#3f3f46' }}>{time}</div>
      </div>
    </div>
  );
}

// ─── Segment Bar ──────────────────────────────────────
function SegmentBar({ name, level, delay_mins, status }: { name: string; level: number; delay_mins: number; status?: string }) {
  const barColor = level > 0.7 ? '#f43f5e' : level > 0.55 ? '#f59e0b' : level > 0.3 ? '#fbbf24' : '#10b981';
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#a1a1aa', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: barColor, marginLeft: '8px', flexShrink: 0 }}>
          {status ?? `+${delay_mins}min`}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${level * 100}%`, background: barColor }} />
      </div>
    </div>
  );
}

// ─── Pollution Station Card ───────────────────────────
function PollutionCard({ station }: { station: any }) {
  const aqiColor = station.aqi > 200 ? '#f43f5e' : station.aqi > 150 ? '#f59e0b' : station.aqi > 100 ? '#fbbf24' : '#10b981';
  const aqiLabel = station.aqi > 200 ? 'Very Poor' : station.aqi > 150 ? 'Poor' : station.aqi > 100 ? 'Moderate' : 'Satisfactory';
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{station.name}</h4>
          <div style={{ fontSize: '11px', color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={10} /> {station.lat.toFixed(2)}, {station.lng.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: aqiColor, lineHeight: 1 }}>{station.aqi}</div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: aqiColor, marginTop: '4px' }}>{aqiLabel}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {[
          { label: 'PM2.5', value: `${station.pm25} µg/m³`, icon: Droplets, color: '#3b82f6' },
          { label: 'PM10', value: `${station.pm10} µg/m³`, icon: Wind, color: '#f59e0b' },
          { label: 'NO₂', value: `${station.no2 ?? '—'} µg/m³`, icon: Factory, color: '#8b5cf6' },
          { label: 'SO₂', value: `${station.so2 ?? '—'} µg/m³`, icon: Thermometer, color: '#10b981' },
        ].map(({ label, value, icon: I, color }) => (
          <div key={label} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <I size={12} color={color} />
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#52525b', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>
      {station.source && (
        <div style={{ marginTop: '12px', fontSize: '10px', color: '#3f3f46', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: station.source === 'openweathermap' ? '#10b981' : '#f59e0b' }} />
          {station.source === 'openweathermap' ? 'Live — OpenWeatherMap' : 'Simulated Data'}
        </div>
      )}
    </div>
  );
}

// ─── Sensor Card ──────────────────────────────────────
function SensorCard({ sensor }: { sensor: any }) {
  const isActive = sensor.status === 'active';
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{sensor.name}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '3px 8px', borderRadius: '6px',
              color: isActive ? '#10b981' : '#f59e0b',
              background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
            }}>{sensor.status}</span>
          </div>
        </div>
        <div style={{
          padding: '10px', borderRadius: '14px',
          background: isActive ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
        }}>
          <Radio size={20} color={isActive ? '#60a5fa' : '#fbbf24'} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#52525b', letterSpacing: '0.05em', marginBottom: '6px' }}>Vehicles</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#60a5fa' }}>{sensor.vehicle_count ?? '—'}</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#52525b', letterSpacing: '0.05em', marginBottom: '6px' }}>Avg Speed</div>
          <div style={{ fontSize: '22px', fontWeight: 800 }}>{sensor.avg_speed ?? '—'} <span style={{ fontSize: '12px', fontWeight: 500, color: '#71717a' }}>km/h</span></div>
        </div>
      </div>
      {sensor.source && (
        <div style={{ marginTop: '12px', fontSize: '10px', color: '#3f3f46', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sensor.source === 'tomtom' ? '#10b981' : '#f59e0b' }} />
          {sensor.source === 'tomtom' ? 'Live — TomTom Traffic' : 'Simulated Data'}
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────
export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sensors, setSensors] = useState<any[]>([]);
  const [pollution, setPollution] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
      } catch { return null; }
    };

    const [sData, pData, vData, predData, sumData, incData] = await Promise.all([
      safeFetch('/api/v1/sensors'),
      safeFetch('/api/v1/pollution'),
      safeFetch('/api/v1/analytics/vehicles'),
      safeFetch('/api/v1/predictions/congestion'),
      safeFetch('/api/v1/analytics/summary'),
      safeFetch('/api/v1/analytics/incidents'),
    ]);

    if (sData) setSensors(sData);
    if (pData) setPollution(pData);
    if (vData) setVehicles(vData);
    if (predData) setPrediction(predData);
    if (sumData) setSummary(sumData);
    if (incData) setIncidents(incData);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const totalVehicles = summary?.total_vehicles_today ?? 1248;
  const avgAqi = summary?.avg_aqi ?? (pollution.length > 1 ? Math.round(pollution[1]?.aqi) : 215);
  const congestionIdx = prediction?.predicted_congestion_index ?? 0.72;
  const isLive = summary?.data_source === 'live' || sensors.some((s: any) => s.source === 'tomtom') || pollution.some((p: any) => p.source === 'openweathermap');

  const NAV_ITEMS: { icon: any; view: View; label: string }[] = [
    { icon: BarChart3, view: 'dashboard', label: 'Dashboard' },
    { icon: Eye,       view: 'monitor',   label: 'Monitor'   },
    { icon: Radio,     view: 'sensors',    label: 'Sensors'   },
    { icon: Shield,    view: 'safety',     label: 'Safety'    },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ─── TOP BAR ─── */}
      <header style={{
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(12px)', flexShrink: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '7px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            boxShadow: '0 0 16px rgba(59,130,246,0.35)',
          }}>
            <ShieldCheck size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.01em' }} className="text-gradient-brand">AeroShield</span>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 8px' }} />
          <span style={{ fontSize: '12px', color: '#52525b', fontWeight: 500 }}>Raipur–Bhilai Corridor</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastUpdated && (
            <span style={{ fontSize: '10px', color: '#3f3f46', fontWeight: 500 }}>
              Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#52525b', fontWeight: 500 }}>
            <Clock size={13} /> {currentTime} IST
          </div>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
            borderRadius: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: isLive ? '#34d399' : '#fbbf24',
            background: isLive ? 'rgba(16,185,129,0.08)' : 'rgba(251,191,36,0.08)',
            border: `1px solid ${isLive ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.15)'}`,
          }}>
            <span className="live-dot" style={{ background: isLive ? '#10b981' : '#f59e0b' }} /> {isLive ? 'Live' : 'Mock'}
          </div>
          <button style={{ padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717a', cursor: 'pointer', display: 'flex' }} aria-label="Notifications">
            <Bell size={16} />
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ─── LEFT SIDEBAR: Thin icon nav ─── */}
        <nav style={{
          width: '56px', borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: '16px', gap: '4px', flexShrink: 0, background: 'rgba(5,5,5,0.5)',
        }}>
          {NAV_ITEMS.map(({ icon: I, view, label }) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                title={label}
                onClick={() => setActiveView(view)}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  color: active ? '#60a5fa' : '#52525b', cursor: 'pointer', transition: 'all 0.2s',
                }}
                aria-label={label}
              >
                <I size={18} />
              </button>
            );
          })}
        </nav>

        {/* ─── MAIN ─── */}
        <main className="custom-scroll" style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ═══════════════ DASHBOARD VIEW ═══════════════ */}
          {activeView === 'dashboard' && (
            <>
              {/* KPI STRIP */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                <StatCard label="Active Vehicles" value={totalVehicles.toLocaleString()} change="12% vs yesterday" changeType="down" icon={Truck} color="blue" delay="delay-100" />
                <StatCard label="Congestion Index" value={congestionIdx} change="Peak detected" changeType="up" icon={Activity} color="rose" delay="delay-200" />
                <StatCard label="Avg AQI" value={avgAqi} change="PM2.5 elevated" changeType="up" icon={Wind} color="amber" delay="delay-300" />
                <StatCard label="Road Health" value={`${summary?.road_health_score ?? 87}%`} change="Stable" changeType="neutral" icon={Shield} color="emerald" delay="delay-400" />
                <StatCard label="Incidents Today" value={summary?.total_incidents ?? 5} change={`${summary?.mitigation_actions_today ?? 7} mitigations`} changeType="neutral" icon={AlertTriangle} color="violet" delay="delay-500" />
              </div>

              {/* MAIN CONTENT GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', flex: 1, minHeight: 0 }}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
                  {/* Map */}
                  <div className="glass-card animate-fade-up delay-500" style={{ flex: 1, minHeight: '380px', padding: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', gap: '8px', pointerEvents: 'none' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', fontWeight: 600 }}>
                        <MapPin size={14} color="#3b82f6" /> Live Corridor
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '10px', background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: '#52525b', fontWeight: 500 }}>
                        {sensors.length} sensors
                      </span>
                    </div>
                    <div style={{ height: '100%', borderRadius: '17px', overflow: 'hidden' }}>
                      <MapWrapper sensors={sensors} pollution={pollution} />
                    </div>
                  </div>

                  {/* Vehicle Flow Chart */}
                  <div className="glass-card animate-fade-up delay-600" style={{ height: '240px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Vehicle Flow — 24h</h3>
                        <p style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>Trucks · Tankers · Trailers</p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {[{ c: '#3b82f6', l: 'Trucks' }, { c: '#10b981', l: 'Tankers' }, { c: '#f59e0b', l: 'Trailers' }].map(({ c, l }) => (
                          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#71717a' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} /> {l}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ height: 'calc(100% - 52px)' }}>
                      {vehicles.length > 0 ? <VehicleChart data={vehicles} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#3f3f46', fontSize: '13px' }}>Syncing...</div>}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
                  {/* AI Recommendation */}
                  <div className="glass-card animate-fade-up delay-300" style={{
                    padding: '20px', position: 'relative', overflow: 'hidden',
                    borderColor: 'rgba(139,92,246,0.15)',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(10,10,10,1) 60%)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Zap size={14} color="#a78bfa" />
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa' }}>AI Recommendation</span>
                      {prediction?.model_used && (
                        <span style={{ fontSize: '9px', color: '#3f3f46', marginLeft: 'auto' }}>{prediction.model_used}</span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: '#e4e4e7' }}>
                      {prediction?.recommended_action || 'Analyzing corridor dynamics...'}
                    </p>
                    <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                      <button style={{
                        fontSize: '11px', fontWeight: 700, padding: '7px 16px', borderRadius: '8px',
                        background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
                        color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        Execute <ChevronRight size={13} />
                      </button>
                      <button style={{
                        fontSize: '11px', fontWeight: 600, padding: '7px 12px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                        color: '#52525b', cursor: 'pointer',
                      }}>
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {/* Corridor Segments */}
                  {prediction?.segments && (
                    <div className="glass-card animate-fade-up delay-400" style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a', marginBottom: '16px' }}>Corridor Segments</h3>
                      {prediction.segments.map((seg: any, i: number) => (
                        <SegmentBar key={i} name={seg.name} level={seg.congestion_level} delay_mins={seg.predicted_delay_mins} status={seg.status} />
                      ))}
                    </div>
                  )}

                  {/* Incidents */}
                  <div className="glass-card animate-fade-up delay-500 custom-scroll" style={{ padding: '20px', flex: 1, minHeight: 0, overflow: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717a' }}>Recent Incidents</h3>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{incidents.length} total</span>
                    </div>
                    {incidents.length > 0 ? incidents.map((inc, i) => (
                      <IncidentRow key={i} type={inc.type} location={inc.location} severity={inc.severity} time={new Date(inc.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} status={inc.status} />
                    )) : (
                      <div style={{ padding: '20px 0', textAlign: 'center', color: '#3f3f46', fontSize: '12px' }}>No recent incidents</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ MONITOR VIEW ═══════════════ */}
          {activeView === 'monitor' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>Air Quality Monitor</h2>
                  <p style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>Real-time pollution data across the Raipur–Bhilai corridor</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gauge size={16} color="#f59e0b" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa' }}>Avg AQI: </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: avgAqi > 200 ? '#f43f5e' : avgAqi > 150 ? '#f59e0b' : '#10b981' }}>{avgAqi}</span>
                </div>
              </div>

              {/* Map + Pollution grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass-card" style={{ minHeight: '400px', padding: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '17px', overflow: 'hidden' }}>
                    <MapWrapper sensors={[]} pollution={pollution} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pollution.map((station) => (
                    <PollutionCard key={station.id} station={station} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ SENSORS VIEW ═══════════════ */}
          {activeView === 'sensors' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>Traffic Sensors</h2>
                  <p style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>Live vehicle counts and speed data from corridor sensors</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '12px', color: '#71717a' }}>{sensors.filter((s: any) => s.status === 'active').length} Active</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ fontSize: '12px', color: '#71717a' }}>{sensors.filter((s: any) => s.status !== 'active').length} Maintenance</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Map with only sensors */}
                <div className="glass-card" style={{ minHeight: '500px', padding: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '17px', overflow: 'hidden' }}>
                    <MapWrapper sensors={sensors} pollution={[]} />
                  </div>
                </div>

                {/* Sensor cards */}
                <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '75vh', overflow: 'auto' }}>
                  {sensors.map((sensor) => (
                    <SensorCard key={sensor.id} sensor={sensor} />
                  ))}

                  {/* Corridor overview */}
                  {prediction?.segments && (
                    <div className="glass-card" style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Corridor Congestion</h3>
                      {prediction.segments.map((seg: any, i: number) => (
                        <SegmentBar key={i} name={seg.name} level={seg.congestion_level} delay_mins={seg.predicted_delay_mins} status={seg.status} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ SAFETY VIEW ═══════════════ */}
          {activeView === 'safety' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>Safety & Incidents</h2>
                  <p style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>Active incidents and safety metrics along the corridor</p>
                </div>
              </div>

              {/* Severity summary strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Critical', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', count: incidents.filter(i => i.severity === 'critical').length },
                  { label: 'High',     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', count: incidents.filter(i => i.severity === 'high').length },
                  { label: 'Medium',   color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', count: incidents.filter(i => i.severity === 'medium').length },
                  { label: 'Low',      color: '#10b981', bg: 'rgba(16,185,129,0.08)', count: incidents.filter(i => i.severity === 'low').length },
                ].map(({ label, color, bg, count }) => (
                  <div key={label} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={18} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 800 }}>{count}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: color, letterSpacing: '0.05em' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, minHeight: 0 }}>
                {/* Active incidents */}
                <div className="glass-card custom-scroll" style={{ padding: '20px', overflow: 'auto' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
                    Active & Investigating
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#52525b', marginLeft: '8px' }}>
                      ({incidents.filter(i => i.status !== 'Resolved').length})
                    </span>
                  </h3>
                  {incidents.filter(i => i.status !== 'Resolved').map((inc, i) => (
                    <IncidentRow
                      key={i} type={inc.type} location={inc.location} severity={inc.severity}
                      time={new Date(inc.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      status={inc.status} description={inc.description}
                    />
                  ))}
                  {incidents.filter(i => i.status !== 'Resolved').length === 0 && (
                    <div style={{ padding: '30px 0', textAlign: 'center', color: '#3f3f46', fontSize: '13px' }}>No active incidents</div>
                  )}
                </div>

                {/* Resolved incidents */}
                <div className="glass-card custom-scroll" style={{ padding: '20px', overflow: 'auto' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
                    Resolved
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#52525b', marginLeft: '8px' }}>
                      ({incidents.filter(i => i.status === 'Resolved').length})
                    </span>
                  </h3>
                  {incidents.filter(i => i.status === 'Resolved').map((inc, i) => (
                    <IncidentRow
                      key={i} type={inc.type} location={inc.location} severity={inc.severity}
                      time={new Date(inc.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      status={inc.status} description={inc.description}
                    />
                  ))}
                  {incidents.filter(i => i.status === 'Resolved').length === 0 && (
                    <div style={{ padding: '30px 0', textAlign: 'center', color: '#3f3f46', fontSize: '13px' }}>No resolved incidents</div>
                  )}
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
