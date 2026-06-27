import { NextResponse } from 'next/server';

const INCIDENTS = [
  { id: "INC-001", type: "Accident", location: "Kumhari Flyover, NH-53 KM 12", severity: "high", status: "Active", description: "Multi-vehicle collision involving a truck and two cars." },
  { id: "INC-002", type: "Breakdown", location: "Tatibandh Junction", severity: "medium", status: "Resolved", description: "Overloaded trailer broke down on the shoulder." },
  { id: "INC-003", type: "Congestion", location: "Bhilai Power House Stretch", severity: "critical", status: "Active", description: "Severe gridlock due to construction zone bottleneck." },
  { id: "INC-004", type: "Violation", location: "Raipur Entry Toll", severity: "low", status: "Investigating", description: "Overweight truck detected by weigh-in-motion sensors." },
  { id: "INC-005", type: "Accident", location: "Durg Bypass Intersection", severity: "high", status: "Investigating", description: "Tanker skidded and partially blocked both lanes." },
  { id: "INC-006", type: "Congestion", location: "Kumhari to Bhilai Sector", severity: "medium", status: "Resolved", description: "Peak hour congestion cleared after diversion protocol." },
];

export async function GET() {
  const now = new Date();
  const data = INCIDENTS.map((inc, i) => ({
    ...inc,
    timestamp: new Date(now.getTime() - i * 45 * 60000).toISOString(),
  }));
  return NextResponse.json(data);
}
