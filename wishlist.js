
const imgBase = "https://image.tmdb.org/t/p/w500";
const container = document.getElementById("wishlistContainer");

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

const user = getCurrentUser();

if (!user) {
    alert("Login required");
    location.href = "login.html";
}

const key = `wishlist_${user.uid}`;
let wishlist = JSON.parse(localStorage.getItem(key)) || [];

if (wishlist.length === 0) {
    container.innerHTML = "<h3>No wishlist items ❤️</h3>";
}

wishlist.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <h3>${movie.title}</h3>
        <img src="${imgBase + movie.poster}">
        <p>${movie.overview}</p>
        <p>⭐ ${movie.rating}</p>
        <button class="remove">Remove</button>
    `;

    card.querySelector(".remove").onclick = () => {
        wishlist = wishlist.filter(m => m.title !== movie.title);
        localStorage.setItem(key, JSON.stringify(wishlist));

        wishlist.length === 0
            ? container.innerHTML = "<h3>No wishlist items ❤️</h3>"
            : location.reload();
    };

    container.appendChild(card);
});
