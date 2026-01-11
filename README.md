# EcoSync AI: Smart Campus Sustainability Solution

EcoSync AI is a predictive system designed to optimize campus energy consumption by forecasting room occupancy and adjusting HVAC/Lighting systems in real-time.

## Project Structure

- `/backend`: FastAPI server implementing the Gemini Reasoning Layer, LSTM occupancy forecasting, and real-time telemetry.
- `/frontend`: React dashboard featuring a professional dark glassmorphism UI, Gemini insights, and an interactive student mobile mockup.
- `/mobile`: **Flutter Cross-Platform Application** for students and staff, providing navigation maps, facility updates, and profile management.
- `/firebase-bridge`: Legacy Node.js bridge for Firestore synchronization.

## Tech Stack

### AI & Data Science
- **Google Gemini**: Strategic reasoning agent for energy optimization advice.
- **Scikit-Learn/Pandas**: Data preprocessing and simulation.
- **LSTM (PyTorch/TF Concept)**: Predictive occupancy modeling.

### Implementation
- **Cloud Hosting**: Render/Vercel.
- **Frontend**: React 18, Recharts, Lucide-React.
- **Backend**: Python 3.10+, FastAPI, Uvicorn.
- **Mobile**: Flutter (Dart) with Material 3.
- **Input**: 24-hour window of WiFi counts, class sizes, and temperature.
- **Output**: Predicted occupancy for the next 2 hours.
- **Architecture**: Two LSTM layers with Dropout for regularization, followed by a Dense output layer.

### 3. Gemini 1.5 Pro Reasoning Layer
A simulation of a Large Language Model (LLM) reasoning step. It takes the numerical prediction from the LSTM and adjusts it based on unstructured text data (e.g., "unplanned student protest"). This allows the system to handle "black swan" events that historical data cannot predict.

## SMART Implementation Logic

- **Specific (S)**: HVAC systems are automatically set to 'Eco Mode' when predicted occupancy falls below 10% of building capacity.
- **Measurable (M)**: Carbon savings are calculated using the formula: `(Baseline_KW - Optimized_KW) * 0.4 kg CO2`.
- **Achievable (A)**: Uses existing WiFi infrastructure and scheduling data.
- **Relevant (R)**: Directly addresses campus sustainability goals.
- **Time-bound (T)**: Real-time adjustments every 5-15 minutes.

## UI/UX Design
- **Theme**: Dark mode with Emerald (#10b981) and Slate (#1e293b) accents.
- **Real-time**: Uses Firestore `onSnapshot` (simulated in demo) for zero-refresh updates.
- **Visuals**: Recharts for occupancy trends and custom CSS for efficiency gauges.

## Run Locally (quick)

Backend (python 3.11+):

- Create venv and activate:

	python -m venv .venv
	.venv\Scripts\activate

- Install and run:

	pip install -r backend/requirements.txt
	python -m uvicorn main:app --app-dir backend --reload --port 8000

Frontend (Node.js + npm):

	cd frontend
	npm install
	npm start

## Notes

- Large `node_modules` and `frontend/build` paths were purged from history to reduce repository size. A backup tag `pre-purge-backup` was created and pushed.

