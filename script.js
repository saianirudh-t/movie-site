
/* ================== CONFIG ================== */
const apiKey = "c4adbf461fa88d16eaa1a4795c66d730";
const baseUrl = "https://api.themoviedb.org/3";
let imgBase = "https://image.tmdb.org/t/p/w500";

/* ================== DOM ================== */
const containerHeading = document.querySelectorAll(".containerHeading")
const trending = document.getElementById("trending");
const popular = document.getElementById("popular");
const toprated = document.getElementById("topRated");

const moviesLink = document.getElementById("moviesLink");
const seriesLink = document.getElementById("seriesLink");
const upcomingLink = document.getElementById("upcomingLink");
const searchInput = document.getElementById("searchInput");
const sortBy = document.getElementById("sortBy");

/* ================== AUTH HELPERS ================== */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

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

/* ================== CAROUSEL ================== */
document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector(".carousel");
    wrapper.querySelector(".left-arrow").onclick = () => carousel.scrollLeft -= 300;
    wrapper.querySelector(".right-arrow").onclick = () => carousel.scrollLeft += 300;
});

/* ================== CARD BUILDER ================== */
function cardBuilder(title, poster, overview, rating) {

    const user = getCurrentUser();
    const wishlist = user ? getWishlist() : [];
    const isWishlisted = wishlist.some(m => m.title === title);
    const card = document.createElement("div");
    card.className = "movie-card";
    if (poster===""){
        imgBase="placeholder.avif"
    }
    else{
        imgBase="https://image.tmdb.org/t/p/w500"
    }

    card.innerHTML = `
        <h2 class="movie-title">${title}</h2>
        <img class="movie-poster" src="${imgBase + poster}">
        <p class="overview">${overview}</p>
        <button class="see-more">See More</button>
        <p class="rating">⭐ ${rating}</p>

        <img 
            class="wishlist-btn"
            src="${isWishlisted ? "filled.svg" : "normal.svg"}"
            data-title="${title}"
            data-poster="${poster}"
            data-overview="${overview}"
            data-rating="${rating}"
            style="opacity:${user ? 1 : 0.4}"
            title="${user ? "Add to wishlist" : "Login required"}"
        >
    `;
    return card;
}

/* ================== LOAD CONTENT ================== */
async function loadContent(endpoint, container) {
    container.innerHTML = "";
    const res = await fetch(`${baseUrl}/${endpoint}?api_key=${apiKey}`);
    const data = await res.json();

    data.results.forEach(item => {
        if (!item.poster_path) return;
        const title = item.title || item.name;
        container.append(
            cardBuilder(title, item.poster_path, item.overview, item.vote_average)
        );
    });
}

/* ================== SEARCH ================== */
async function searchContent(query) {
    trending.innerHTML = popular.innerHTML = toprated.innerHTML = "";
    if (!query.trim()) {
        loadCategory(mainPage.slice(0, 3));
        return;
    }
    sortBy.style.display="none"
    changeHeading([{ heading: "Movies" }, { heading: "Web series" }, { heading: "Others" }])
    const res = await fetch(`${baseUrl}/search/multi?api_key=${apiKey}&query=${query}`);
    const data = await res.json()
    data.results.forEach(item => {
        const title = item.title || item.name || "Untitled";

        const image =item.poster_path || item.backdrop_path || item.backdrop_path || item.profile_path || ""
        console.log(image)

        const getData = cardBuilder(
            title,
            image,
            item.overview || "No description available",
            item.vote_average ?? "N/A"
        );

        if (item.media_type === "movie") {
            trending.append(getData);
        } else if (item.media_type === "tv") {
            popular.append(getData);
        } else if (item.media_type === "person") {
            toprated.append(getData);
        }
    });

}
searchInput.addEventListener("input", () => searchContent(searchInput.value));

const mainPage = [
    { endpoint: "trending/movie/week", container: trending, heading: "Trending right now" },
    { endpoint: "movie/popular", container: popular, heading: "Most popular among" },
    { endpoint: "movie/top_rated", container: toprated, heading: "Top rated in IMDB" },

    { endpoint: "trending/tv/week", container: trending, heading: "Trending right now" },
    { endpoint: "tv/popular", container: popular, heading: "Most popular among" },
    { endpoint: "tv/top_rated", container: toprated, heading: "Top rated in IMDB" },

    { endpoint: "movie/upcoming", container: trending, heading: "Upcoming movies" },
    { endpoint: "tv/on_the_air", container: popular, heading: "Latest on the air" },
    { endpoint: "movie/now_playing", container: toprated, heading: "In theaters" }
];

function changeHeading(list) {
    containerHeading.forEach((h, i) => h.textContent = list[i].heading);
}

function loadCategory(list) {
    changeHeading(list);
    list.forEach(s => loadContent(s.endpoint, s.container));
}

loadCategory(mainPage.slice(0, 3));

/* ================== NAV ================== */
let current = "movie";

moviesLink.onclick = () => {
    sortBy.style.display = "block";
    sortBy.value = "week";
    current = "movie";
    loadCategory(mainPage.slice(0, 3));
};

seriesLink.onclick = () => {
    sortBy.style.display = "block";
    sortBy.value = "week";
    current = "tv";
    loadCategory(mainPage.slice(3, 6));
};

upcomingLink.onclick = () => {
    sortBy.style.display = "none";
    loadCategory(mainPage.slice(6, 9));
};

sortBy.onchange = () => {
    loadContent(`trending/${current}/${sortBy.value}`, trending);
};

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("see-more")) {
        const p = e.target.previousElementSibling;
        p.classList.toggle("expanded");
        e.target.textContent = p.classList.contains("expanded") ? "See Less" : "See More";
    }
    if (e.target.classList.contains("wishlist-btn")) {

        const user = getCurrentUser();
        if (!user) {
            alert("Please login to use wishlist ❤️");
            window.location.href = "login.html";
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
