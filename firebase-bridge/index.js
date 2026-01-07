const admin = require('firebase-admin');

// In a real scenario, you would download this from the Firebase Console
// const serviceAccount = require("./serviceAccountKey.json");

// For simulation purposes, we'll assume the environment is already set up or use a mock
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

console.log("Firebase Admin SDK initialized (Simulated)");

const db = {
    collection: (path) => ({
        doc: (id) => ({
            set: (data) => {
                console.log(`Pushing to Firestore path: ${path}/${id}`);
                console.log("Data:", JSON.stringify(data, null, 2));
                return Promise.resolve();
            }
        })
    })
};

async function pushOccupancyData(predictedOccupancy, energySavingsMode) {
    const path = 'artifacts/ecosync-ai/public/data';
    const docId = 'occupancy_stats';
    
    const data = {
        predicted_occupancy: predictedOccupancy,
        energy_savings_mode: energySavingsMode,
        timestamp: new Date().toISOString(),
        carbon_saved_kg: calculateCarbonSaved(100, 60) // Example values
    };

    try {
        await db.collection(path).doc(docId).set(data);
        console.log("Successfully pushed data to Firestore.");
    } catch (error) {
        console.error("Error pushing to Firestore:", error);
    }
}

function calculateCarbonSaved(baselineKW, optimizedKW) {
    return (baselineKW - optimizedKW) * 0.4;
}

// Example execution
pushOccupancyData([155, 165], true);
