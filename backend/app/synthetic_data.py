import random
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models import TrafficSensor, VehicleTrace, PollutionStation, AccidentRecord

# Raipur - Bhilai corridor bounding box approx
# Lat: 21.15 to 21.25, Lng: 81.35 to 81.65

def generate_sensors(db):
    sensors = [
        {"name": "Raipur Entry Toll", "lat": 21.25, "lng": 81.63},
        {"name": "Tatibandh Junction", "lat": 21.24, "lng": 81.60},
        {"name": "Kumhari Flyover", "lat": 21.23, "lng": 81.52},
        {"name": "Bhilai Power House", "lat": 21.20, "lng": 81.40},
        {"name": "Durg Bypass", "lat": 21.18, "lng": 81.33}
    ]
    for s in sensors:
        sensor = TrafficSensor(
            name=s["name"],
            location=f"SRID=4326;POINT({s['lng']} {s['lat']})",
            status="active"
        )
        db.add(sensor)
    db.commit()

def generate_pollution_stations(db):
    stations = [
        {"name": "Raipur Industrial Area", "lat": 21.25, "lng": 81.65, "base_aqi": 180},
        {"name": "Bhilai Steel Plant Zone", "lat": 21.19, "lng": 81.38, "base_aqi": 220},
        {"name": "Kumhari Highway", "lat": 21.23, "lng": 81.52, "base_aqi": 150}
    ]
    for s in stations:
        station = PollutionStation(
            name=s["name"],
            location=f"SRID=4326;POINT({s['lng']} {s['lat']})",
            current_aqi=s["base_aqi"] + random.uniform(-20, 20),
            pm25=s["base_aqi"] * 0.6,
            pm10=s["base_aqi"] * 1.2
        )
        db.add(station)
    db.commit()

def generate_vehicle_traces(db):
    vehicle_types = ["Truck", "Tanker", "Multi-Axle Trailer"]
    now = datetime.utcnow()
    for _ in range(500):
        # random point along the corridor
        lat = random.uniform(21.18, 21.25)
        lng = random.uniform(81.33, 81.63)
        trace = VehicleTrace(
            vehicle_id=f"VH-{random.randint(1000, 9999)}",
            vehicle_type=random.choice(vehicle_types),
            timestamp=now - timedelta(minutes=random.randint(0, 1440)),
            location=f"SRID=4326;POINT({lng} {lat})",
            speed=random.uniform(20, 80),
            heading=random.uniform(0, 360)
        )
        db.add(trace)
    db.commit()

def run_seeder():
    db = SessionLocal()
    try:
        generate_sensors(db)
        generate_pollution_stations(db)
        generate_vehicle_traces(db)
        print("Successfully seeded synthetic data.")
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run_seeder()
