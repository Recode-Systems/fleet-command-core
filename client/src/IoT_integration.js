// This would run on the IoT device inside the vehicle
const admin = require('firebase-admin');

// Initialization with your Service Account Key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const vehicleId = "KCT_355S"; // The unique ID of this vehicle

function sendTelemetry() {
  // Simulates reading from GPS and Fuel sensors
  const telemetryData = {
    lat: -1.286389 + (Math.random() - 0.5) * 0.01,
    lng: 36.817223 + (Math.random() - 0.5) * 0.01,
    speed: Math.floor(Math.random() * 80),
    fuel: Math.max(0, 85 - (Date.now() % 100)), // Simulating fuel drop
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    status: "Moving"
  };

  // Updates the document in the 'vehicles' collection
  db.collection('vehicles').doc(vehicleId).update(telemetryData)
    .then(() => console.log(`Telemetry synced for ${vehicleId}`))
    .catch(err => console.error("Sync failed:", err));
}

// Pushes data every 5 seconds
setInterval(sendTelemetry, 5000);