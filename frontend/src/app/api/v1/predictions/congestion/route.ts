import { NextResponse } from 'next/server';

const SEGMENTS = [
  { name: "Raipur Toll → Tatibandh" },
  { name: "Tatibandh → Kumhari" },
  { name: "Kumhari → Bhilai Power House" },
  { name: "Bhilai Power House → Durg" },
  { name: "Durg → Durg Bypass" },
];

const ACTIONS = [
  "Divert heavy vehicles to Durg Bypass via NH-53 alternate",
  "Restrict multi-axle trailers on Kumhari Flyover until 22:00",
  "Deploy speed enforcement at Tatibandh Junction",
  "Open auxiliary lane on Bhilai Power House stretch",
  "No action required",
];

export async function GET() {
  const segments = SEGMENTS.map(s => {
    const level = +(Math.random() * 0.9 + 0.1).toFixed(2);
    return {
      name: s.name,
      congestion_level: level,
      predicted_delay_mins: +(level * 15).toFixed(1),
      status: level > 0.7 ? "Gridlock" : level > 0.4 ? "Heavy" : "Moderate",
    };
  });

  return NextResponse.json({
    status: "success",
    predicted_congestion_index: +(Math.random() * 0.5 + 0.4).toFixed(2),
    recommended_action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
    model_used: "XGBoost (Simulated)",
    segments,
  });
}
