import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_vehicles_today: 1100 + Math.floor(Math.random() * 300),
    avg_speed_kmh: +(35 + Math.random() * 20).toFixed(1),
    active_sensors: 5,
    total_incidents: 2 + Math.floor(Math.random() * 6),
    road_health_score: 72 + Math.floor(Math.random() * 23),
    avg_aqi: 140 + Math.floor(Math.random() * 80),
    mitigation_actions_today: 3 + Math.floor(Math.random() * 9),
    corridor_length_km: 28,
  });
}
