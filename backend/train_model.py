import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import joblib
import os

def train_model():
    if not os.path.exists('campus_data.csv'):
        print("Data file not found. Run generate_data.py first.")
        return

    df = pd.read_csv('campus_data.csv')
    
    # Feature selection
    features = ['wifi_connection_count', 'class_scheduled_size', 'ambient_temperature']
    target = 'actual_occupancy'
    
    # Simple feature engineering for time-series (use last few hours)
    lookback = 3
    X, y = [], []
    for i in range(lookback, len(df)):
        X.append(df[features].iloc[i-lookback:i].values.flatten())
        y.append(df[target].iloc[i])
    
    X, y = np.array(X), np.array(y)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    print("Training Random Forest model...")
    model.fit(X_train, y_train)
    
    joblib.dump(model, 'occupancy_model.pkl')
    print("Model saved as 'occupancy_model.pkl'.")

if __name__ == "__main__":
    train_model()
