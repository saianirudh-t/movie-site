import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem("user");
            alert("Logged out successfully!");
            window.location.href = "login.html"; 
        })
        .catch(err => {
            console.error("Logout error:", err);
            alert("Error logging out. Try again.");
        });
});

