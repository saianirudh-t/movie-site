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
        let create=cardBuilder(title,item.poster_path,item.overview,item.vote_average)
        container.append(create);
    });
}

function cardBuilder(title,poster,overview,rating){
    let card = document.createElement('div')
    card.className = "movie-card"
    card.innerHTML = `
        <h2 class="movie-title">${title}</h2>
        <img class="movie-poster" src="${imgBase + poster}" alt="${title}">
        <p class="overview">${overview}</p>
        <button class="see-more">See More</button>
        <p class="rating">⭐ ${rating}</p>
    `
    return card
}

function changeHeading(list) {
    const headings = document.querySelectorAll(".containerHeading")
    list.forEach((section, index) => {
        headings[index].textContent = section.heading
    })
}

const searchInput = document.getElementById("searchInput")

async function searchContent(query) {
    trending.innerHTML = ""  
    popular.innerHTML = ""  
    toprated.innerHTML = ""  
    if (query.trim() === "") {
        loadCategory(moviesPage)
        return
    }
    const url = `${baseUrl}/search/multi?api_key=${apiKey}&query=${query}`
    const response = await fetch(url)
    const data = await response.json()
    data.results.forEach(item => {
        if (!item.poster_path) return
        let title = item.title || item.name
        let create=cardBuilder(title,item.poster_path,item.overview,item.vote_average)
        trending.appendChild(create)
    })
}

searchInput.addEventListener("input", () => {
    let query = searchInput.value
    searchContent(query)
})

const mainPage = [
  {endpoint: "trending/movie/week", container: trending, heading:"Trending right now"},
  {endpoint: "movie/popular", container: popular, heading:"Most popular among" },
  {endpoint: "movie/top_rated", container: toprated, heading:"Top rated in IMDB" },
  {endpoint: "trending/tv/week", container: trending,heading:"Trending right now"},
  {endpoint: "tv/popular", container: popular,heading:"Most popular among" },
  {endpoint: "tv/top_rated", container: toprated,heading:'Top rated in IMDB' },
  {endpoint:"movie/upcoming", container:trending , heading:"Upcoming movies"},
  {endpoint:"tv/on_the_air", container:popular , heading:"Latest on the air"},
  {endpoint:"movie/now_playing",container: toprated , heading:"In the theaters"}
]


function loadCategory(list) {
    changeHeading(list)
    list.forEach(section => {
        loadContent(section.endpoint, section.container);
    });
}

loadCategory(mainPage.slice(0,3))

let current="movie"
moviesLink.addEventListener("click", () => {
    sortBy[0].selected=true
    sortBy.style.display="block"
    current="movie"
    loadCategory(mainPage.slice(0,3))
})

seriesLink.addEventListener("click", () => {
    sortBy[0].selected=true
    sortBy.style.display="block"
    current="tv"
    loadCategory(mainPage.slice(3,6))
})

upcomingLink.addEventListener('click',()=>{
    loadCategory(mainPage.slice(6,9))
    sortBy.style.display="none"
})

let sortBy=document.getElementById("sortBy")
sortBy.addEventListener('click',(e)=>{
    let getVal=sortBy.value
    loadContent(`trending/${current}/${getVal}`,trending)
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
