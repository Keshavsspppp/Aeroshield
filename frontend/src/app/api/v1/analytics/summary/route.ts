import { NextResponse } from 'next/server';

const OWM_KEY = process.env.OPENWEATHERMAP_API_KEY;

async function fetchAvgAqi(): Promise<number | null> {
  if (!OWM_KEY) return null;
  const points = [
    { lat: 21.25, lng: 81.65 },
    { lat: 21.19, lng: 81.38 },
    { lat: 21.23, lng: 81.52 },
  ];
  const AQI_MAP: Record<number, number> = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 300 };
  try {
    const results = await Promise.all(
      points.map(async (p) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${p.lat}&lon=${p.lng}&appid=${OWM_KEY}`,
          { cache: 'no-store' }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return AQI_MAP[data?.list?.[0]?.main?.aqi] ?? null;
      })
    );
    const valid = results.filter((v): v is number => v !== null);
    if (valid.length === 0) return null;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  } catch {
    return null;
  }
}

export async function GET() {
  const realAqi = await fetchAvgAqi();

  return NextResponse.json({
    total_vehicles_today: 1100 + Math.floor(Math.random() * 300),
    avg_speed_kmh: +(35 + Math.random() * 20).toFixed(1),
    active_sensors: 5,
    total_incidents: 2 + Math.floor(Math.random() * 6),
    road_health_score: 72 + Math.floor(Math.random() * 23),
    avg_aqi: realAqi ?? (140 + Math.floor(Math.random() * 80)),
    mitigation_actions_today: 3 + Math.floor(Math.random() * 9),
    corridor_length_km: 28,
    data_source: realAqi ? 'live' : 'mock',
  });
}
