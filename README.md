# EcoSync AI: Smart Campus Sustainability Solution

EcoSync AI is a predictive system designed to optimize campus energy consumption by forecasting room occupancy and adjusting HVAC/Lighting systems in real-time.

## Project Structure

- `/backend`: Python scripts for data generation, LSTM model training, and Gemini Reasoning Layer simulation.
- `/firebase-bridge`: Node.js script using Firebase Admin SDK to push predictions to Firestore.
- `/frontend`: React-based dashboard for facility managers with real-time updates.

## Data Science Methodology

### 1. Data Ingestion & Synthetic Generation
We generate a synthetic dataset (`campus_data.csv`) that simulates real-world campus dynamics:
- **WiFi Density**: High correlation with actual occupancy.
- **Class Schedules**: Provides a baseline for expected occupancy.
- **Ambient Temperature**: Influences HVAC energy consumption.

### 2. Predictive Modeling (LSTM)
We use a **Long Short-Term Memory (LSTM)** network, a type of Recurrent Neural Network (RNN) capable of learning long-term dependencies in time-series data.
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
