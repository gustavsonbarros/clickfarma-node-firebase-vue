// backend/src/config/firebase.js
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Carrega as credenciais do serviceAccountKey.json
const serviceAccount = require('./serviceAccountKey.json');

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Exporta as instâncias para usar em outros arquivos
const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

module.exports = { admin, db, storage, auth };