import { NextResponse } from 'next/server';

const STATIONS = [
  { id: 1, name: "Raipur Industrial Area", lat: 21.25, lng: 81.65 },
  { id: 2, name: "Bhilai Steel Plant Zone", lat: 21.19, lng: 81.38 },
  { id: 3, name: "Kumhari Highway", lat: 21.23, lng: 81.52 },
];

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

interface OWMComponents {
  co: number;
  no2: number;
  so2: number;
  pm2_5: number;
  pm10: number;
}

interface OWMResponse {
  list: Array<{
    main: { aqi: number };
    components: OWMComponents;
  }>;
}

async function fetchRealPollution(lat: number, lon: number): Promise<OWMResponse | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const AQI_LABEL_MAP: Record<number, number> = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 300 };

export async function GET() {
  const results = await Promise.all(
    STATIONS.map(async (s) => {
      const real = await fetchRealPollution(s.lat, s.lng);
      if (real?.list?.[0]) {
        const entry = real.list[0];
        const c = entry.components;
        return {
          id: s.id,
          name: s.name,
          lat: s.lat,
          lng: s.lng,
          aqi: AQI_LABEL_MAP[entry.main.aqi] ?? entry.main.aqi,
          pm25: Math.round(c.pm2_5),
          pm10: Math.round(c.pm10),
          no2: Math.round(c.no2),
          so2: Math.round(c.so2),
          co: +c.co.toFixed(1),
          source: 'openweathermap' as const,
        };
      }
      const aqi = 150 + Math.random() * 80;
      return {
        id: s.id, name: s.name, lat: s.lat, lng: s.lng,
        aqi: Math.round(aqi),
        pm25: Math.round(aqi * 0.6),
        pm10: Math.round(aqi * 1.2),
        no2: Math.round(30 + Math.random() * 25),
        so2: Math.round(10 + Math.random() * 15),
        co: +(0.5 + Math.random() * 1.5).toFixed(1),
        source: 'mock' as const,
      };
    })
  );
  return NextResponse.json(results);
}
