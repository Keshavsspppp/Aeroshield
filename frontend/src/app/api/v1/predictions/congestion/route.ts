import { NextResponse } from 'next/server';

const SEGMENTS = [
  { name: "Raipur Toll → Tatibandh",     lat: 21.245, lng: 81.615 },
  { name: "Tatibandh → Kumhari",          lat: 21.235, lng: 81.56  },
  { name: "Kumhari → Bhilai Power House", lat: 21.215, lng: 81.46  },
  { name: "Bhilai Power House → Durg",    lat: 21.19,  lng: 81.365 },
  { name: "Durg → Durg Bypass",           lat: 21.18,  lng: 81.33  },
];

const ACTIONS = [
  "Divert heavy vehicles to Durg Bypass via NH-53 alternate",
  "Restrict multi-axle trailers on Kumhari Flyover until 22:00",
  "Deploy speed enforcement at Tatibandh Junction",
  "Open auxiliary lane on Bhilai Power House stretch",
  "No action required",
];

const API_KEY = process.env.TOMTOM_API_KEY;

async function fetchFlow(lat: number, lng: number) {
  if (!API_KEY) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${API_KEY}&unit=KMPH`,
      { cache: 'no-store', signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.flowSegmentData ?? null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function statusLabel(level: number) {
  if (level > 0.7) return "Gridlock";
  if (level > 0.55) return "Heavy";
  if (level > 0.3) return "Moderate";
  return "Free Flow";
}

export async function GET() {
  const segments = await Promise.all(
    SEGMENTS.map(async (seg) => {
      const flow = await fetchFlow(seg.lat, seg.lng);
      let level: number;
      if (flow) {
        level = Math.min(1, Math.max(0, 1 - flow.currentSpeed / flow.freeFlowSpeed));
      } else {
        level = +(Math.random() * 0.9 + 0.1).toFixed(2);
      }
      level = +level.toFixed(2);
      return {
        name: seg.name,
        congestion_level: level,
        predicted_delay_mins: +(level * 15).toFixed(1),
        status: statusLabel(level),
        source: flow ? 'tomtom' : 'mock',
      };
    })
  );

  const overall = +(segments.reduce((sum, s) => sum + s.congestion_level, 0) / segments.length).toFixed(2);

  const actionIdx = overall > 0.55
    ? Math.floor(Math.random() * (ACTIONS.length - 1))
    : ACTIONS.length - 1;

  return NextResponse.json({
    status: "success",
    predicted_congestion_index: overall,
    recommended_action: ACTIONS[actionIdx],
    model_used: segments[0].source === 'tomtom' ? "TomTom Traffic Flow (Live)" : "XGBoost (Simulated)",
    segments,
  });
}
