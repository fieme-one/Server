

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_7lOwgl_KtNOXw4piz6jdDzZLW-qjFAs",
  authDomain: "dust-pro-35a1f.firebaseapp.com",
  projectId: "dust-pro-35a1f",
  storageBucket: "dust-pro-35a1f.firebasestorage.app",
  messagingSenderId: "507321411617",
  appId: "1:507321411617:web:d7871c87c1f7ae9429db60",
  measurementId: "G-4FD4ENY64Q"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);