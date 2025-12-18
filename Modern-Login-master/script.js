
// ================= UI TOGGLE (YOUR CODE – KEEP AS IS) =================
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 PASTE YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyA__lCYS2zaqlwMVHSMBoRReSxxzhVt7v8",
  authDomain: "hello-12b65.firebaseapp.com",
  projectId: "hello-12b65",
  storageBucket: "hello-12b65.firebasestorage.app",
  messagingSenderId: "1012593603162",
  appId: "1:1012593603162:web:622d4d3d4ece5332715e63"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= SIGN UP =================
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signupEmail.value;
    const password = signupPassword.value;

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // 🔹 Create Firestore document
    await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        createdAt: new Date()
    });

    window.location.href = "user-data.html";
});

// ================= LOGIN =================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    await signInWithEmailAndPassword(
        auth,
        loginEmail.value,
        loginPassword.value
    );

    window.location.href = "user-data.html";
});
