from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship
from geoalchemy2 import Geometry
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # admin, planner, police

class TrafficSensor(Base):
    __tablename__ = "traffic_sensors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(Geometry(geometry_type='POINT', srid=4326))
    status = Column(String, default="active")
    
class VehicleTrace(Base):
    __tablename__ = "vehicle_traces"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(String, index=True)
    vehicle_type = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(Geometry(geometry_type='POINT', srid=4326))
    speed = Column(Float)
    heading = Column(Float)

class PollutionStation(Base):
    __tablename__ = "pollution_stations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(Geometry(geometry_type='POINT', srid=4326))
    current_aqi = Column(Float)
    pm25 = Column(Float)
    pm10 = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AccidentRecord(Base):
    __tablename__ = "accident_records"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)
    location = Column(Geometry(geometry_type='POINT', srid=4326))
    severity = Column(String)
    description = Column(String)
    vehicles_involved = Column(Integer)
