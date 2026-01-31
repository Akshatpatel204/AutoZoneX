import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBZ4-jXts6YfWs6wV3VIjF-B9i75Dw-wqc",
    authDomain: "autozonex-f83e4.firebaseapp.com",
    projectId: "autozonex-f83e4",
    storageBucket: "autozonex-f83e4.firebasestorage.app",
    messagingSenderId: "580974630284",
    appId: "1:580974630284:web:d6d56b27aff3ce4f7db2a9",
    measurementId: "G-VM6H0LX8M8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); 