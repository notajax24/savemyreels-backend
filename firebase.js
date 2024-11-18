const admin = require("firebase-admin");
const serviceAccount = require("./servicekey.json"); // path to the downloaded JSON key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "1:811625128051:web:c1657f45d460e398134a06.appspot.com", // Use your Firebase storage bucket URL here
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
