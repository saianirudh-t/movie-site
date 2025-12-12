import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA__lCYS2zaqlwMVHSMBoRReSxxzhVt7v8",
    authDomain: "hello-12b65.firebaseapp.com",
    projectId: "hello-12b65",
    storageBucket: "hello-12b65.firebasestorage.app",
    messagingSenderId: "1012593603162",
    appId: "1:1012593603162:web:622d4d3d4ece5332715e63"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// ----------------------
// SWITCH TO SIGNUP
// ----------------------
export function showSignup() {
  document.getElementById("signupForm").classList.add("active");
  document.getElementById("loginForm").classList.remove("active");
}

// ----------------------
// SWITCH TO LOGIN
// ----------------------
export function showLogin() {
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("signupForm").classList.remove("active");
}

// expose to global
window.showSignup = showSignup;
window.showLogin = showLogin;

// ----------------------
// SIGNUP
// ----------------------
document.getElementById("signupBtn").addEventListener("click", () => {
  const email = signupEmail.value;
  const password = signupPassword.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created!");
      showLogin();
    })
    .catch(err => signupError.textContent = err.message);
});

// ----------------------
// LOGIN
// ----------------------
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login success!");
      window.location.href = "index.html";
    })
    .catch(err => loginError.textContent = err.message);
});
