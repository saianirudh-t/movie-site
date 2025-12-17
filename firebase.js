import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA__lCYS2zaqlwMVHSMBoRReSxxzhVt7v8",
  authDomain: "hello-12b65.firebaseapp.com",
  projectId: "hello-12b65",
  storageBucket: "hello-12b65.firebasestorage.app",
  messagingSenderId: "1012593603162",
  appId: "1:1012593603162:web:622d4d3d4ece5332715e63"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
