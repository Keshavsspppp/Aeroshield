import { NextResponse } from 'next/server';

const STATIONS = [
  { id: 1, name: "Raipur Industrial Area", lat: 21.25, lng: 81.65, base_aqi: 180 },
  { id: 2, name: "Bhilai Steel Plant Zone", lat: 21.19, lng: 81.38, base_aqi: 220 },
  { id: 3, name: "Kumhari Highway", lat: 21.23, lng: 81.52, base_aqi: 150 },
];

export async function GET() {
  const data = STATIONS.map(s => {
    const aqi = s.base_aqi + Math.random() * 40 - 20;
    return {
      id: s.id, name: s.name, lat: s.lat, lng: s.lng,
      aqi: Math.round(aqi),
      pm25: Math.round(aqi * 0.6),
      pm10: Math.round(aqi * 1.2),
      no2: Math.round(30 + Math.random() * 25),
      so2: Math.round(10 + Math.random() * 15),
      co: +(0.5 + Math.random() * 1.5).toFixed(1),
    };
  });
  return NextResponse.json(data);
}
