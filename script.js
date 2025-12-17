import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ================== CONFIG ================== */
const apiKey = "c4adbf461fa88d16eaa1a4795c66d730";
const baseUrl = "https://api.themoviedb.org/3";
const imgBase = "https://image.tmdb.org/t/p/w500";

/* ================== AUTH ================== */

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

/* ================== DOM ================== */
const trending = document.getElementById("trending");
const popular = document.getElementById("popular");
const toprated = document.getElementById("topRated");
const authBtn = document.getElementById("authToggleBtn");

/* ================== AUTH TOGGLE ================== */
function updateAuthButton() {
    authBtn.textContent = getCurrentUser() ? "Logout" : "Login";
}

authBtn.onclick = () => {
    if (getCurrentUser()) {
        signOut(auth).then(() => {
            localStorage.removeItem("user");
            resetWishlistUI();
            updateAuthButton();
            location.reload();
        });
    } else {
        location.href = "login.html";
    }
};

updateAuthButton();

/* ================== WISHLIST HELPERS ================== */
function getWishlistKey() {
    const user = getCurrentUser();
    return user ? `wishlist_${user.uid}` : null;
}

function getWishlist() {
    const key = getWishlistKey();
    return key ? JSON.parse(localStorage.getItem(key)) || [] : [];
}

function saveWishlist(list) {
    const key = getWishlistKey();
    if (key) localStorage.setItem(key, JSON.stringify(list));
}

function resetWishlistUI() {
    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        btn.src = "normal.svg";
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
    });
}

/* ================== CARD BUILDER ================== */
function cardBuilder(title, poster, overview, rating) {

    const user = getCurrentUser();
    const wishlist = user ? getWishlist() : [];
    const isWishlisted = wishlist.some(m => m.title === title);

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <h2>${title}</h2>
        <img src="${imgBase + poster}">
        <p class="overview">${overview}</p>
        <button class="see-more">See More</button>
        <p>⭐ ${rating}</p>

        <img class="wishlist-btn"
             src="${isWishlisted ? "filled.svg" : "normal.svg"}"
             data-title="${title}"
             data-poster="${poster}"
             data-overview="${overview}"
             data-rating="${rating}"
             style="opacity:${user ? 1 : 0.4}">
    `;
    return card;
}

/* ================== LOAD MOVIES ================== */
async function loadContent(endpoint, container) {
    container.innerHTML = "";
    const res = await fetch(`${baseUrl}/${endpoint}?api_key=${apiKey}`);
    const data = await res.json();

    data.results.forEach(item => {
        if (!item.poster_path) return;
        container.append(
            cardBuilder(item.title || item.name, item.poster_path, item.overview, item.vote_average)
        );
    });
}

loadContent("trending/movie/week", trending);
loadContent("movie/popular", popular);
loadContent("movie/top_rated", toprated);

/* ================== GLOBAL CLICK ================== */
document.addEventListener("click", e => {

    if (e.target.classList.contains("wishlist-btn")) {
        const user = getCurrentUser();

        if (!user) {
            alert("Login required ❤️");
            location.href = "login.html";
            return;
        }

        let wishlist = getWishlist();
        const movie = {
            title: e.target.dataset.title,
            poster: e.target.dataset.poster,
            overview: e.target.dataset.overview,
            rating: e.target.dataset.rating
        };

        const index = wishlist.findIndex(m => m.title === movie.title);

        if (index === -1) {
            wishlist.push(movie);
            e.target.src = "filled.svg";
        } else {
            wishlist.splice(index, 1);
            e.target.src = "normal.svg";
        }

        saveWishlist(wishlist);
    }
});
