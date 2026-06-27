'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
    }}>
      <div style={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
          <span style={{ color: '#fafafa', fontSize: '13px', fontWeight: 500 }}>{entry.name}: {entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function VehicleChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="colorTrucks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorTankers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorTrailers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="#3f3f46" 
          tick={{ fill: '#52525b', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis 
          stroke="#3f3f46" 
          tick={{ fill: '#52525b', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="trucks" name="Trucks" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTrucks)" dot={false} />
        <Area type="monotone" dataKey="tankers" name="Tankers" stroke="#10b981" strokeWidth={2} fill="url(#colorTankers)" dot={false} />
        <Area type="monotone" dataKey="multi_axle" name="Trailers" stroke="#f59e0b" strokeWidth={2} fill="url(#colorTrailers)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
