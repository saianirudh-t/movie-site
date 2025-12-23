import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA__lCYS2zaqlwMVHSMBoRReSxxzhVt7v8",
  authDomain: "hello-12b65.firebaseapp.com",
  projectId: "hello-12b65",
    appId: "1:1012593603162:web:622d4d3d4ece5332715e63"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;

const userForm = document.getElementById("userForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const logoutBtn = document.getElementById("logoutBtn");


// 🔐 Protect page
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        window.location.href = "index.html";
    }
});

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("User not logged in");
    return;
  }

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        firstName: firstName.value,
        lastName: lastName.value,
        email: currentUser.email,
        updatedAt: new Date()
      },
      { merge: true }
    );

    alert("User data saved successfully!");
    userForm.reset();
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data");
  }
});

// 🚪 Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});
