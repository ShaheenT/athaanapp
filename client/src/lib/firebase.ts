import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'demo-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app'
};

export const isFirebaseConfigured = () => {
  return (
    import.meta.env.VITE_FIREBASE_API_KEY &&
    !import.meta.env.VITE_FIREBASE_API_KEY.includes('your_')
  );
};

let app: any;
let auth: Auth | null = null;

try {
  app = initializeApp(firebaseConfig);
  if (isFirebaseConfigured()) {
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed. Running in demo mode.', error);
}

export { app };
export { auth };
