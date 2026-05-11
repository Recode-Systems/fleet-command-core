// iot-simulator.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// Target a specific vehicle you registered in your app
const vehicleId = "zgnF2bh5TupeiCeq4CAU";

setInterval(async () => {
    const lat = -1.286 + (Math.random() - 0.5) * 0.05;
    const lng = 36.817 + (Math.random() - 0.5) * 0.05;
    const fuel = Math.floor(Math.random() * 100);

    await db.collection('vehicles').doc(vehicleId).update({
        lat, lng, fuel,
        status: "Moving",
        speed: Math.floor(Math.random() * 100)
    });
    console.log("Telemetry packet sent...");
}, 3000);