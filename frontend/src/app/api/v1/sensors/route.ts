import { NextResponse } from 'next/server';

const SENSORS = [
  { id: 1, name: "Raipur Entry Toll",   lat: 21.25, lng: 81.63, status: "active"      },
  { id: 2, name: "Tatibandh Junction",  lat: 21.24, lng: 81.60, status: "active"      },
  { id: 3, name: "Kumhari Flyover",     lat: 21.23, lng: 81.52, status: "maintenance" },
  { id: 4, name: "Bhilai Power House",  lat: 21.20, lng: 81.40, status: "active"      },
  { id: 5, name: "Durg Bypass",         lat: 21.18, lng: 81.33, status: "active"      },
];

const API_KEY = process.env.TOMTOM_API_KEY;

interface TomTomFlow {
  flowSegmentData?: {
    currentSpeed: number;
    freeFlowSpeed: number;
    confidence: number;
  };
}

async function fetchTrafficFlow(lat: number, lng: number): Promise<TomTomFlow | null> {
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
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export async function GET() {
  const data = await Promise.all(
    SENSORS.map(async (s) => {
      const flow = await fetchTrafficFlow(s.lat, s.lng);
      if (flow?.flowSegmentData) {
        const fd = flow.flowSegmentData;
        const estimatedVehicles = Math.round((1 - fd.currentSpeed / fd.freeFlowSpeed) * 400 + 50);
        return {
          ...s,
          avg_speed: Math.round(fd.currentSpeed),
          free_flow_speed: Math.round(fd.freeFlowSpeed),
          vehicle_count: Math.max(40, estimatedVehicles),
          confidence: fd.confidence,
          source: 'tomtom' as const,
        };
      }
      return {
        ...s,
        avg_speed: 35 + Math.floor(Math.random() * 30),
        vehicle_count: 80 + Math.floor(Math.random() * 200),
        source: 'mock' as const,
      };
    })
  );
  return NextResponse.json(data);
}
