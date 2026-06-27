# AeroShield

### Smart City Decision Support System — Raipur-Bhilai Corridor

AeroShield is a real-time Decision Support System (DSS) for monitoring traffic flow, air quality, safety incidents, and congestion along the **Raipur-Bhilai Corridor (NH-53)**. It pulls live data from **TomTom Traffic** and **OpenWeatherMap Air Pollution** APIs and visualizes it on an interactive dark-themed dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TailwindCSS v4, Leaflet (maps), Recharts (charts) |
| **Real-time Data** | TomTom Traffic Flow API, OpenWeatherMap Air Pollution API |
| **Backend (optional)** | FastAPI, SQLAlchemy, GeoAlchemy2, PostgreSQL + PostGIS |

The frontend serves its own API routes (`/api/v1/*`) that fetch live data from external APIs — no backend server is required for the dashboard to function.

---

## Features

- **Dashboard** — KPI cards, live corridor map, 24h vehicle flow chart, AI-powered recommendations, corridor segment congestion bars
- **Air Quality Monitor** — Real-time AQI, PM2.5, PM10, NO2, SO2 readings per station (via OpenWeatherMap)
- **Traffic Sensors** — Live vehicle counts and average speed at 5 sensor points along the corridor (via TomTom)
- **Safety & Incidents** — Severity-coded incident tracker with active/resolved split view
- **Live/Mock indicator** — Header badge shows whether data is live (green) or simulated (yellow)
- **Auto-refresh** — All data refreshes every 15 seconds

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure API keys

Create a `.env.local` file in the `frontend/` directory:

```env
# Free key from https://home.openweathermap.org/api_keys
OPENWEATHERMAP_API_KEY=your_key_here

# Free key from https://developer.tomtom.com/
TOMTOM_API_KEY=your_key_here
```

Both services offer free tiers. The app works without keys (falls back to simulated data).

> **Note:** New OpenWeatherMap keys can take up to 2 hours to activate.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Routes

All routes are served by Next.js API handlers in `frontend/src/app/api/v1/`.

| Method | Endpoint | Source | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/sensors` | TomTom | Traffic sensors with live speed & vehicle estimates |
| GET | `/api/v1/pollution` | OpenWeatherMap | Air quality stations with AQI, PM2.5, PM10, NO2, SO2, CO |
| GET | `/api/v1/predictions/congestion` | TomTom | Per-segment congestion levels and recommended actions |
| GET | `/api/v1/analytics/summary` | OpenWeatherMap | Dashboard KPIs (vehicles, AQI, road health, incidents) |
| GET | `/api/v1/analytics/vehicles` | Simulated | 24-hour vehicle count timeline by type |
| GET | `/api/v1/analytics/incidents` | Simulated | Recent corridor incidents with severity and status |

---

## Project Structure

```
aeroshields/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Main dashboard (4 views)
│   │   │   ├── layout.tsx                  # Root layout
│   │   │   ├── globals.css                 # Dark theme, glass effects, animations
│   │   │   └── api/v1/                     # API route handlers
│   │   │       ├── sensors/route.ts        # TomTom traffic flow
│   │   │       ├── pollution/route.ts      # OpenWeatherMap air quality
│   │   │       ├── predictions/congestion/route.ts
│   │   │       └── analytics/
│   │   │           ├── summary/route.ts
│   │   │           ├── vehicles/route.ts
│   │   │           └── incidents/route.ts
│   │   └── components/
│   │       ├── MapComponent.tsx            # Leaflet map with sensors & pollution zones
│   │       ├── MapWrapper.tsx              # Dynamic import wrapper (no SSR)
│   │       └── AnalyticsChart.tsx          # Recharts area chart
│   ├── package.json
│   └── .env.local.example
├── backend/                                # Optional FastAPI backend
│   ├── app/
│   │   ├── api.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   └── synthetic_data.py
│   └── requirements.txt
├── docker-compose.yml                      # PostgreSQL + PostGIS + pgAdmin
└── README.md
```

---

## Optional: Backend & Database

If you want to run the full-stack version with PostGIS:

```bash
# Start PostgreSQL + pgAdmin
docker-compose up -d

# Set up backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python -m app.synthetic_data # Seed data
uvicorn app.main:app --reload
```

- PostgreSQL: `localhost:5432` (user: `postgres`, password: `password`, db: `aeroshield`)
- pgAdmin: [http://localhost:5050](http://localhost:5050) (email: `admin@aeroshield.com`, password: `admin`)
- FastAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## License

This project is for educational and research purposes.
