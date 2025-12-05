const apiKey="c4adbf461fa88d16eaa1a4795c66d730"
const baseUrl="https://api.themoviedb.org/3"
const imgBase = "https://image.tmdb.org/t/p/w500";

const trending = document.getElementById("trending");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

const scrollAmount = 300;

leftArrow.addEventListener("click", () => {
  trending.scrollBy({
    left: -scrollAmount,
    behavior: "smooth"
  });
});

rightArrow.addEventListener("click", () => {
  trending.scrollBy({
    left: scrollAmount,
    behavior: "smooth"
  });
});


let moviesarr=[]
async function trendingMovies() {
  const response = await fetch(`${baseUrl}/trending/movie/week?api_key=${apiKey}`);
  const data = await response.json();
  data.results.forEach(movie => {
    let newDiv = document.createElement('div');
    newDiv.className = "movie-card";
    newDiv.innerHTML = `
      <h2 class="movie-title">${movie.title}</h2>
      <img class="movie-poster" src="${imgBase + movie.poster_path}" alt="${movie.title}">
      <p class="overview">${movie.overview}</p>
      <button class="see-more">See More</button>
      <p class="rating">⭐ ${movie.vote_average}</p>
    `
    trending.append(newDiv);
    moviesarr.push({
      title:movie.title,
      image:movie.poster_path,
      overview:movie.overview,
      rating:movie.vote_average
    })
  });
}
console.log(moviesarr)
trendingMovies();

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