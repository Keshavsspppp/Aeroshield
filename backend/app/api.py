from fastapi import APIRouter
import random
from datetime import datetime, timedelta

router = APIRouter()

# ---------------------------------------------------------------------------
# Mock Data for Raipur-Bhilai Corridor
# ---------------------------------------------------------------------------

SENSORS = [
    {"id": 1, "name": "Raipur Entry Toll",   "lat": 21.25, "lng": 81.63, "status": "active"},
    {"id": 2, "name": "Tatibandh Junction",  "lat": 21.24, "lng": 81.60, "status": "active"},
    {"id": 3, "name": "Kumhari Flyover",     "lat": 21.23, "lng": 81.52, "status": "maintenance"},
    {"id": 4, "name": "Bhilai Power House",  "lat": 21.20, "lng": 81.40, "status": "active"},
    {"id": 5, "name": "Durg Bypass",         "lat": 21.18, "lng": 81.33, "status": "active"},
]

POLLUTION_STATIONS = [
    {"id": 1, "name": "Raipur Industrial Area",  "lat": 21.25, "lng": 81.65, "aqi": 182, "pm25": 110},
    {"id": 2, "name": "Bhilai Steel Plant Zone",  "lat": 21.19, "lng": 81.38, "aqi": 215, "pm25": 140},
    {"id": 3, "name": "Kumhari Highway",          "lat": 21.23, "lng": 81.52, "aqi": 145, "pm25": 90},
]

CORRIDOR_SEGMENTS = [
    {"name": "Raipur Toll → Tatibandh",     "base_congestion": 0.65},
    {"name": "Tatibandh → Kumhari",          "base_congestion": 0.50},
    {"name": "Kumhari → Bhilai Power House", "base_congestion": 0.72},
    {"name": "Bhilai Power House → Durg",    "base_congestion": 0.58},
    {"name": "Durg Bypass Stretch",          "base_congestion": 0.40},
]

INCIDENT_TYPES = [
    {
        "id": "INC-001", "type": "Accident", "location": "Kumhari Flyover, NH-53 KM 12",
        "severity": "high", "status": "Active",
        "description": "Multi-vehicle collision involving a truck and two cars. One lane blocked.",
    },
    {
        "id": "INC-002", "type": "Breakdown", "location": "Tatibandh Junction",
        "severity": "medium", "status": "Resolved",
        "description": "Overloaded trailer broke down on the shoulder. Cleared by tow.",
    },
    {
        "id": "INC-003", "type": "Congestion", "location": "Raipur Entry Toll Plaza",
        "severity": "low", "status": "Active",
        "description": "Heavy queue at toll booths due to FASTag reader malfunction.",
    },
    {
        "id": "INC-004", "type": "Violation", "location": "Bhilai Steel Plant Gate 3",
        "severity": "medium", "status": "Investigating",
        "description": "Overweight vehicle detected (36 tonnes on 25-tonne limit road).",
    },
    {
        "id": "INC-005", "type": "Accident", "location": "Durg Bypass KM 24",
        "severity": "critical", "status": "Active",
        "description": "Tanker rollover with minor chemical spill. Emergency services on site.",
    },
    {
        "id": "INC-006", "type": "Congestion", "location": "NH-53 near Kumhari",
        "severity": "low", "status": "Resolved",
        "description": "Slow-moving construction convoy cleared after 45-min delay.",
    },
]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/sensors")
def get_sensors():
    """Return all sensors with live vehicle count and average speed."""
    enriched = []
    for s in SENSORS:
        enriched.append({
            **s,
            "vehicle_count": random.randint(40, 300),
            "avg_speed": round(random.uniform(30, 70), 1),
        })
    return enriched


@router.get("/pollution")
def get_pollution():
    """Return pollution stations with extended gas readings."""
    enriched = []
    for st in POLLUTION_STATIONS:
        enriched.append({
            **st,
            "pm10": random.randint(120, 280),
            "no2": round(random.uniform(18, 65), 1),
            "so2": round(random.uniform(8, 40), 1),
            "co": round(random.uniform(0.5, 3.5), 2),
        })
    return enriched


@router.get("/predictions/congestion")
def predict_congestion():
    """Detailed congestion prediction with per-segment breakdown."""

    def _status(level: float) -> str:
        if level < 0.3:
            return "Free Flow"
        if level < 0.55:
            return "Moderate"
        if level < 0.75:
            return "Heavy"
        return "Gridlock"

    segments = []
    for seg in CORRIDOR_SEGMENTS:
        level = round(min(max(seg["base_congestion"] + random.uniform(-0.15, 0.15), 0), 1), 2)
        segments.append({
            "name": seg["name"],
            "congestion_level": level,
            "predicted_delay_mins": round(level * random.uniform(8, 20), 1),
            "status": _status(level),
        })

    overall = round(sum(s["congestion_level"] for s in segments) / len(segments), 2)

    return {
        "status": "success",
        "predicted_congestion_index": overall,
        "recommended_action": (
            "Divert heavy vehicles to Durg Bypass"
            if overall > 0.55
            else "No action required"
        ),
        "model_used": "XGBoost (Simulated)",
        "segments": segments,
    }


@router.get("/analytics/vehicles")
def get_vehicle_analytics():
    """Generate mock 24-hour vehicle count timeline."""
    now = datetime.now()
    data = []
    for i in range(24):
        t = now - timedelta(hours=23 - i)
        hour = int(t.strftime("%H"))
        # Simulate peak hours (8-10 & 17-20) with higher counts
        peak_boost = 1.5 if hour in range(8, 11) or hour in range(17, 21) else 1.0
        data.append({
            "hour": hour,
            "time": t.strftime("%H:00"),
            "trucks": int(random.randint(50, 300) * peak_boost),
            "tankers": int(random.randint(10, 100) * peak_boost),
            "multi_axle": int(random.randint(20, 150) * peak_boost),
        })
    return data


# ----- NEW ENDPOINTS -------------------------------------------------------

@router.get("/analytics/summary")
def get_analytics_summary():
    """High-level dashboard summary statistics."""
    return {
        "total_vehicles_today": random.randint(1100, 1400),
        "avg_speed_kmh": round(random.uniform(35, 55), 1),
        "active_sensors": 5,
        "total_incidents": random.randint(2, 8),
        "road_health_score": random.randint(72, 95),
        "avg_aqi": random.randint(140, 220),
        "mitigation_actions_today": random.randint(3, 12),
        "corridor_length_km": 28,
    }


@router.get("/analytics/incidents")
def get_incidents():
    """Return recent incidents along the corridor."""
    now = datetime.now()
    results = []
    for idx, inc in enumerate(INCIDENT_TYPES):
        # Stagger timestamps so they look recent
        ts = now - timedelta(minutes=random.randint(10, 600))
        results.append({
            **inc,
            "timestamp": ts.isoformat(),
        })
    return results


@router.get("/analytics/vehicle-types")
def get_vehicle_types():
    """Vehicle type distribution for pie / donut chart."""
    return [
        {"name": "Trucks",       "value": random.randint(400, 600)},
        {"name": "Tankers",      "value": random.randint(100, 200)},
        {"name": "Trailers",     "value": random.randint(150, 300)},
        {"name": "Construction", "value": random.randint(50, 100)},
    ]


@router.get("/analytics/hourly-pollution")
def get_hourly_pollution():
    """24-hour pollution timeline with realistic peak-hour spikes."""
    data = []
    for hour in range(24):
        # Base values
        base_pm25 = 60
        base_pm10 = 110
        base_aqi = 130

        # Peak-hour multiplier (morning rush 8-10, evening rush 17-20)
        if hour in range(8, 11):
            mult = random.uniform(1.4, 1.8)
        elif hour in range(17, 21):
            mult = random.uniform(1.5, 1.9)
        elif hour in range(0, 5):
            mult = random.uniform(0.6, 0.8)  # Low night-time pollution
        else:
            mult = random.uniform(0.9, 1.2)

        data.append({
            "hour": hour,
            "pm25": round(base_pm25 * mult + random.uniform(-5, 5), 1),
            "pm10": round(base_pm10 * mult + random.uniform(-10, 10), 1),
            "aqi": int(base_aqi * mult + random.uniform(-8, 8)),
        })
    return data
