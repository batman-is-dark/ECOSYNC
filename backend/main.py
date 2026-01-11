from fastapi import FastAPI, BackgroundTasks, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime, timedelta
import time
from .reasoning_layer import get_real_gemini_insight
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EcoSync AI Pipeline API")

# ONLY allow your specific frontend domain here in production
# For now, we allow localhost/Render/Vercel origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure Access Key (Internal use between Frontend and Backend)
SITE_ACCESS_TOKEN = os.getenv("BACKEND_ACCESS_TOKEN", "ecosync_internal_2026_secure")

def verify_token(x_ecosync_key: str = Header(None)):
    if x_ecosync_key != SITE_ACCESS_TOKEN:
        raise HTTPException(status_code=403, detail="Unauthorized access to EcoSync Intelligence")

# Global state (simulating a real-time data store)
STATE = {
    "actual_occupancy": 0,
    "predicted_occupancy": [0, 0],
    "energy_savings_mode": False,
    "carbon_saved_kg": 0.0,
    "efficiency": 85,
    "history": [],
    "ai_override": False,
    "last_update": None,
    "gemini_insight": "Strategic advisor analyzing occupancy..."
}
# Track simulated devices and events
STATE["devices"] = {
    "hvac_north": True,
    "hvac_admin": True,
    "lights_admin": False,
    "lights_classrooms": True,
}
STATE["events"] = []

MODEL_PATH = "occupancy_model.pkl"

def update_pipeline():
    """Background task to simulate the ML pipeline processing."""
    gemini_insights = [
        "Predicted occupancy shift in North Wing based on library study patterns.",
        "Recommend optimization of HVAC setpoints in Admin wing for low-occupancy window.",
        "WiFi load balancing suggests high activity migrating to Main Hall classrooms.",
        "Schedule correlation: Energy efficiency can be improved by 12% in Zone B tonight.",
        "Predictive cooling active: Pre-cooling classrooms for 14:00 peak occupancy."
    ]
    
    while True:
        if not STATE["ai_override"]:
            # 1. Ingest 'Sensor' Data (Simulated)
            actual = np.random.randint(50, 250)
            
            # 2. Run Inference
            pred0 = int(actual + np.random.normal(0, 15))
            pred1 = int(pred0 + np.random.normal(0, 10))

            # 3. Logic Triggers
            eco_mode = pred0 < 100
            baseline_kw = actual * 0.6
            optimized_kw = pred0 * 0.45 if eco_mode else baseline_kw
            carbon = round((baseline_kw - optimized_kw) * 0.4, 2)
            
            # 4. Update State
            STATE["actual_occupancy"] = actual
            STATE["predicted_occupancy"] = [max(0, pred0), max(0, pred1)]
            STATE["energy_savings_mode"] = eco_mode
            STATE["carbon_saved_kg"] = carbon
            STATE["efficiency"] = 90 if eco_mode else 75
            STATE["last_update"] = datetime.now().isoformat()
            
            # Fetch real Gemini insight
            STATE["gemini_insight"] = get_real_gemini_insight(actual, pred0)
            
            new_entry = {
                "time": datetime.now().strftime("%H:%M"),
                "actual": actual,
                "predicted": pred0
            }
            STATE["history"] = (STATE["history"] + [new_entry])[-30:]
            
            # Record significant events
            if eco_mode and not STATE.get("last_eco_notified", False):
                ev = {
                    "time": datetime.now().strftime("%H:%M:%S"),
                    "event": "Eco-Mode transition: Energy strategy optimized for low occupancy."
                }
                STATE.setdefault("events", [])[:] = (STATE.get("events", []) + [ev])[-50:]
                STATE["last_eco_notified"] = True
            elif not eco_mode:
                STATE["last_eco_notified"] = False

        time.sleep(10) # Pipeline runs every 10 seconds

@app.on_event("startup")
async def startup_event():
    import threading
    thread = threading.Thread(target=update_pipeline, daemon=True)
    thread.start()

@app.get("/api/stats")
async def get_stats(x_ecosync_key: str = Header(None)):
    verify_token(x_ecosync_key)
    return STATE

@app.post("/api/override")
async def toggle_override(status: bool, x_ecosync_key: str = Header(None)):
    verify_token(x_ecosync_key)
    STATE["ai_override"] = status
    return {"status": "success", "ai_override": STATE["ai_override"]}

@app.post("/api/manual-predict")
async def manual_predict(p0: int, p1: int, x_ecosync_key: str = Header(None)):
    verify_token(x_ecosync_key)
    if STATE["ai_override"]:
        STATE["predicted_occupancy"] = [p0, p1]
        # Recalculate metrics based on manual input
        eco_mode = p0 < 100
        baseline_kw = STATE["actual_occupancy"] * 0.6
        optimized_kw = p0 * 0.45 if eco_mode else baseline_kw
        STATE["carbon_saved_kg"] = round((baseline_kw - optimized_kw) * 0.4, 2)
        STATE["energy_savings_mode"] = eco_mode
        
        new_entry = {
            "time": datetime.now().strftime("%H:%M"),
            "actual": STATE["actual_occupancy"],
            "predicted": p0
        }
        STATE["history"] = (STATE["history"] + [new_entry])[-30:]
        return {"status": "success"}
    return {"status": "error", "message": "Override not active"}


@app.post("/api/device-toggle")
async def device_toggle(device: str, status: bool, x_ecosync_key: str = Header(None)):
    """Toggle a simulated device (HVAC / Lights)."""
    verify_token(x_ecosync_key)
    if device not in STATE.get("devices", {}):
        return {"status": "error", "message": f"Unknown device: {device}"}

    STATE["devices"][device] = bool(status)
    ev = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "event": f"{device} set to {'ON' if status else 'OFF'}"
    }
    STATE.setdefault("events", [])[:] = (STATE.get("events", []) + [ev])[-50:]
    return {"status": "success", "device": device, "new_status": STATE["devices"][device]}

@app.post("/api/apply-strategy")
async def apply_strategy(x_ecosync_key: str = Header(None)):
    """Apply Gemini AI suggested strategy."""
    verify_token(x_ecosync_key)
    # Simulate applying strategy by logging and maybe tweaking some values
    ev = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "event": "AI Strategy applied: HVAC setpoints adjusted globally for peak efficiency."
    }
    STATE.setdefault("events", [])[:] = (STATE.get("events", []) + [ev])[-50:]
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
