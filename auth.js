import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

setPersistence(auth, browserLocalPersistence);

/* ================== TOGGLE FORMS ================== */
export function showSignup() {
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
}

export function showLogin() {
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
}

window.showSignup = showSignup;
window.showLogin = showLogin;

/* ================== SIGNUP ================== */
signupBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then(() => {
      alert("Account created!");
      showLogin();
    })
    .catch(err => signupError.textContent = err.message);
});

/* ================== LOGIN ================== */
loginBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .catch(err => loginError.textContent = err.message);
});

/* ================== AUTH STATE ================== */
onAuthStateChanged(auth, user => {
  if (user) {
    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      email: user.email
    }));
    window.location.href = "index.html";
  }
});
