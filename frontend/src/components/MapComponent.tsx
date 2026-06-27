'use client';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Custom sensor marker using divIcon for a cleaner look
const sensorIcon = (status: string) => L.divIcon({
  className: '',
  html: `<div style="
    width: 14px; height: 14px;
    background: ${status === 'active' ? '#3b82f6' : '#f59e0b'};
    border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.9);
    box-shadow: 0 0 12px ${status === 'active' ? 'rgba(59,130,246,0.6)' : 'rgba(245,158,11,0.6)'};
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Raipur-Bhilai corridor path
const corridorPath: [number, number][] = [
  [21.25, 81.63],
  [21.245, 81.61],
  [21.24, 81.60],
  [21.235, 81.57],
  [21.23, 81.52],
  [21.225, 81.48],
  [21.22, 81.45],
  [21.21, 81.42],
  [21.20, 81.40],
  [21.19, 81.37],
  [21.18, 81.33],
];

export default function MapComponent({ sensors, pollution }: { sensors: any[], pollution: any[] }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div style={{ height: '100%', width: '100%', background: '#0a0a0a', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>
      Initializing Map...
    </div>
  );

  return (
    <MapContainer center={[21.215, 81.48]} zoom={12} className="h-full w-full" style={{ borderRadius: '16px' }} zoomControl={true}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      
      {/* Corridor route line */}
      <Polyline 
        positions={corridorPath} 
        pathOptions={{ 
          color: '#3b82f6', 
          weight: 3, 
          opacity: 0.5,
          dashArray: '8, 6'
        }} 
      />
      
      {/* Sensors */}
      {sensors.map((s) => (
        <Marker key={`sensor-${s.id}`} position={[s.lat, s.lng]} icon={sensorIcon(s.status)}>
          <Popup>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
            <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
              Status: <span style={{ color: s.status === 'active' ? '#10b981' : '#f59e0b' }}>{s.status}</span>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Pollution heatmap zones */}
      {pollution.map((p) => (
        <CircleMarker 
          key={`poll-${p.id}`} 
          center={[p.lat, p.lng]} 
          radius={Math.max(20, p.aqi / 5)}
          pathOptions={{ 
            color: 'transparent',
            fillColor: p.aqi > 200 ? '#f43f5e' : p.aqi > 150 ? '#f59e0b' : '#10b981', 
            fillOpacity: 0.2 
          }}
        >
          <Popup>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
            <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
              AQI: <span style={{ color: p.aqi > 200 ? '#f43f5e' : '#f59e0b', fontWeight: 600 }}>{Math.round(p.aqi)}</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
