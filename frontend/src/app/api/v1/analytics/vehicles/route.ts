import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const data = Array.from({ length: 24 }, (_, i) => {
    const hour = (now.getHours() - 23 + i + 24) % 24;
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    const base = isPeak ? 200 : 80;
    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      hour,
      trucks: base + Math.floor(Math.random() * 100),
      tankers: Math.floor(base * 0.3) + Math.floor(Math.random() * 50),
      multi_axle: Math.floor(base * 0.5) + Math.floor(Math.random() * 70),
    };
  });
  return NextResponse.json(data);
}
