import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAO4VDDZwRkpyp1pIgaHMRlEONuBGNCETQ",
  authDomain: "predictive-analytics-85582.firebaseapp.com",
  projectId: "predictive-analytics-85582",
  storageBucket: "predictive-analytics-85582.firebasestorage.app",
  messagingSenderId: "2841254081",
  appId: "1:2841254081:web:829fb912bdb2399ba5dc40",
  measurementId: "G-D1G9ZHWEG7"
};

let app: FirebaseApp;
let analytics: Analytics | undefined;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} else {
  app = getApp();
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db, analytics };
