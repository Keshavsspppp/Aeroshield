import { NextResponse } from 'next/server';

const SENSORS = [
  { id: 1, name: "Raipur Entry Toll", lat: 21.25, lng: 81.63, status: "active", vehicle_count: 187, avg_speed: 42 },
  { id: 2, name: "Tatibandh Junction", lat: 21.24, lng: 81.60, status: "active", vehicle_count: 234, avg_speed: 35 },
  { id: 3, name: "Kumhari Flyover", lat: 21.23, lng: 81.52, status: "maintenance", vehicle_count: 156, avg_speed: 55 },
  { id: 4, name: "Bhilai Power House", lat: 21.20, lng: 81.40, status: "active", vehicle_count: 289, avg_speed: 38 },
  { id: 5, name: "Durg Bypass", lat: 21.18, lng: 81.33, status: "active", vehicle_count: 112, avg_speed: 62 },
];

export async function GET() {
  const data = SENSORS.map(s => ({
    ...s,
    vehicle_count: s.vehicle_count + Math.floor(Math.random() * 40 - 20),
    avg_speed: s.avg_speed + Math.floor(Math.random() * 10 - 5),
  }));
  return NextResponse.json(data);
}
