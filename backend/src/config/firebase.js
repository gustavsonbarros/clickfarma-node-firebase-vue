// backend/src/config/firebase.js
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
require('dotenv').config();

// Carrega as credenciais do serviceAccountKey.json
const serviceAccount = require('./serviceAccountKey.json');

// Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Firebase Client SDK
const firebaseConfig = {
  apiKey: process.env.FIREBASE_WEB_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

const app = initializeApp(firebaseConfig);
const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

// Teste a conexão com Firestore
db.collection('test').doc('test').get()
  .then(() => console.log('✅ Conexão com Firestore OK'))
  .catch(error => console.error('❌ Erro na conexão Firestore:', error));

// Exporte tudo
module.exports = { admin, db, storage, auth, app };