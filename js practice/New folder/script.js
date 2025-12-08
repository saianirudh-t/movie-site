const apiKey="c4adbf461fa88d16eaa1a4795c66d730"
const baseUrl="https://api.themoviedb.org/3"
const imgBase = "https://image.tmdb.org/t/p/w500";

const trending = document.getElementById("trending")
const popular= document.getElementById("popular")
const toprated=document.getElementById("topRated")
const leftArrow = document.getElementById("left-arrow")
const rightArrow = document.getElementById("right-arrow")

const scrollAmount = 300;

document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector(".carousel");
    const leftBtn  = wrapper.querySelector(".left-arrow");
    const rightBtn = wrapper.querySelector(".right-arrow");
    const scrollAmount = 300
    leftBtn.addEventListener("click", () => {
        carousel.scrollLeft -= scrollAmount;
    });
    rightBtn.addEventListener("click", () => {
        carousel.scrollLeft += scrollAmount;
    });
});


async function loadMovies(endpoint, container) {
  const response = await fetch(`${baseUrl}/${endpoint}?api_key=${apiKey}`)
  const data = await response.json()
  console.log(data)
  data.results.forEach(movie => {
    let card = document.createElement('div');
    card.className = "movie-card";
    card.innerHTML = `
      <h2 class="movie-title">${movie.title}</h2>
      <img class="movie-poster" src="${imgBase + movie.poster_path}" alt="${movie.title}">
      <p class="overview">${movie.overview}</p>
      <button class="see-more">See More</button>
      <p class="rating">⭐ ${movie.vote_average}</p>
    `
    container.append(card)
  })
}

loadMovies("trending/movie/week", trending)
loadMovies("movie/popular", popular)
loadMovies("movie/top_rated",toprated)

let seeMore=document.querySelector(".see-more")
document.addEventListener("click",(e)=>{
  if (e.target.classList.contains("see-more")) {
    const overview = e.target.previousElementSibling;
    overview.classList.toggle("expanded");
    if (overview.classList.contains("expanded")) {
      e.target.textContent = "See Less";
    } else {
      e.target.textContent = "See More";
    }
  }
})