import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDzKR87R4cNSoL6xBTPpDq6s4d-2MjvvS0",
    authDomain: "memory-mix-up.firebaseapp.com",
    projectId: "memory-mix-up",
    storageBucket: "memory-mix-up.appspot.com",
    messagingSenderId: "99153954821",
    appId: "1:99153954821:web:44b58deb7dca1a6665346c",
    measurementId: "G-69SLCVT8HS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
