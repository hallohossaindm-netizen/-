import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAJtkPHjq-wT7sPyHBPbfBqn-FV0B_qLi0",
  authDomain: "talimulquranmohilamadras-41714.firebaseapp.com",
  projectId: "talimulquranmohilamadras-41714",
  storageBucket: "talimulquranmohilamadras-41714.firebasestorage.app",
  messagingSenderId: "471458363664",
  appId: "1:471458363664:web:c05cf013979adcbb094d95",
  measurementId: "G-T7T09T2G19"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
