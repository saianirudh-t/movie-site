const apiKey = "c4adbf461fa88d16eaa1a4795c66d730"
const baseUrl = "https://api.themoviedb.org/3"
const imgBase = "https://image.tmdb.org/t/p/w500"

const trending = document.getElementById("trending")
const popular = document.getElementById("popular")
const toprated = document.getElementById("topRated")
const moviesLink = document.getElementById("moviesLink")
const seriesLink = document.getElementById("seriesLink")
const upcomingLink = document.getElementById("upcomingLink")

document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector(".carousel");
    const leftBtn  = wrapper.querySelector(".left-arrow");
    const rightBtn = wrapper.querySelector(".right-arrow");
    const scrollAmount = 300;

    leftBtn.addEventListener("click", () => {
        carousel.scrollLeft -= scrollAmount;
    });
    rightBtn.addEventListener("click", () => {
        carousel.scrollLeft += scrollAmount;
    });
});

async function loadContent(endpoint, container) {
    container.innerHTML = "";
    const response = await fetch(`${baseUrl}/${endpoint}?api_key=${apiKey}`);
    const data = await response.json();
    data.results.forEach(item => {
        let title = item.title || item.name;
        let card = document.createElement('div');
        card.className = "movie-card";
        card.innerHTML = `
            <h2 class="movie-title">${title}</h2>
            <img class="movie-poster" src="${imgBase + item.poster_path}" alt="${title}">
            <p class="overview">${item.overview}</p>
            <button class="see-more">See More</button>
            <p class="rating">⭐ ${item.vote_average}</p>
        `;
        container.append(card);
    });
}

const moviesPage = [
  { endpoint: "trending/movie/week", container: trending },
  { endpoint: "movie/popular", container: popular },
  { endpoint: "movie/top_rated", container: toprated }
]

const seriesPage = [
  { endpoint: "trending/tv/week", container: trending },
  { endpoint: "tv/popular", container: popular },
  { endpoint: "tv/top_rated", container: toprated }
]

const upcomingPage=[
  {endpoint:"movie/upcoming", container:trending , heading:"upcoming movies"},
  {endpoint:"tv/on_the_air", container:popular , heading:"Latest on the air"},
  {endpoint:"movie/now_playing",container: toprated , heading:"In the theaters"}
]

function loadCategory(list) {
    list.forEach(section => {
        loadContent(section.endpoint, section.container);
    });
}

loadCategory(moviesPage)

moviesLink.addEventListener("click", () => {
    loadCategory(moviesPage)
})

seriesLink.addEventListener("click", () => {
    loadCategory(seriesPage)
})

upcomingLink.addEventListener('click',()=>{
    loadCategory(upcomingPage)
})

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("see-more")) {
        const overview = e.target.previousElementSibling;
        overview.classList.toggle("expanded");

        e.target.textContent = 
            overview.classList.contains("expanded")
            ? "See Less"
            : "See More";
    }
});
