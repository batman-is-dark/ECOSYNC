import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(num_rows=1000):
    np.random.seed(42)
    start_date = datetime(2024, 1, 1)
    
    data = {
        'timestamp': [start_date + timedelta(hours=i) for i in range(num_rows)],
        'building_id': np.random.choice(['B1', 'B2', 'B3'], num_rows),
        'wifi_connection_count': np.random.randint(10, 500, num_rows),
        'class_scheduled_size': np.random.randint(0, 300, num_rows),
        'ambient_temperature': np.random.uniform(18, 30, num_rows),
    }
    
    # Actual occupancy is a function of wifi and class size with some noise
    data['actual_occupancy'] = (
        0.6 * data['wifi_connection_count'] + 
        0.4 * data['class_scheduled_size'] + 
        np.random.normal(0, 10, num_rows)
    ).clip(min=0).astype(int)
    
    df = pd.DataFrame(data)
    df.to_csv('campus_data.csv', index=False)
    print("Synthetic dataset 'campus_data.csv' generated.")

if __name__ == "__main__":
    generate_synthetic_data()
