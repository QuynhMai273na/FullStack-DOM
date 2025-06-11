const global = {
  currentPage: window.location.pathname,
  spinner: document.querySelector('.spinner'),
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

const API = {
  apiKey: '683940b4e8acc2732223abeaf08fa155',
  baseUlr: 'https://api.themoviedb.org/3/',
  popularMovies: `movie/popular`,
  popularTvShows: `tv/popular`,
  playingMovies: 'movie/now_playing',
  movieDetails: (id) => `movie/${id}`,
  showDetails: (id) => `tv/${id}`,
};

function highlightMenu() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

function showSpinner() {
  global.spinner.classList.add('show');
}

function hideSpinner() {
  global.spinner.classList.remove('show');
}

async function getData(endpoint) {
  try {
    const API_key = API.apiKey;
    const URL_base = API.baseUlr;
    if (!API_key) {
      throw new Error('API Key not found');
    }
    showSpinner();

    const response = await axios.get(`${URL_base}${endpoint}`, {
      params: { api_key: API_key },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}
async function getPlayingMovie() {
  const { results } = await getData(API.playingMovies);
  return results;
}

async function getPopularMovies() {
  const { results } = await getData(API.popularMovies);
  return results;
}
async function getPopularTvShows() {
  const { results } = await getData(API.popularTvShows);
  return results;
}
async function getMovieDetails() {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');
  // console.log(movieId);

  if (!movieId) {
    console.error('Không có ID phim trên URL');
    return null;
  }

  const movieDetails = await getData(API.movieDetails(movieId));
  console.log(movieDetails);
  return movieDetails;
}
async function getShowDetails() {
  const params = new URLSearchParams(window.location.search);
  const showId = params.get('id');
  // console.log(showId);

  if (!showId) {
    console.error('Không có ID show trên URL');
    return null;
  }

  const showDetails = await getData(API.movieDetails(showId));
  // console.log(showDetails);
  return showDetails;
}

async function getSearchResults(endpoint) {
  try {
    const API_key = API.apiKey;
    const URL_base = API.baseUlr;
    if (!API_key) {
      throw new Error('API Key not found');
    }
    showSpinner();

    const results = await axios.get(`${URL_base}search/${global.search.type}`, {
      params: {
        api_key: API_key,
        query: global.search.term,
        page: global.search.page,
      },
    });
    return results.data;
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}
function renderPagination() {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `        
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  paginationElement.appendChild(div);

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (global.search.page === 1) {
    prevBtn.disabled = true;
  }

  if (global.search.page === global.search.totalPages) {
    nextBtn.disabled = true;
  }

  nextBtn.addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await getSearchResults();
    renderSearchResults(results);
  });

  prevBtn.addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await getSearchResults();
    renderSearchResults(results);
  });
}
function renderSearchResults(results) {
  document.getElementById('search-results-heading').innerHTML = '';
  document.getElementById('search-results').innerHTML = '';
  results.forEach((result) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const src = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
    card.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
              <img
                src="${src}"
                class="card-img-top"
                alt="${
                  global.search.type === 'movie' ? result.title : result.name
                }"
              />
            </a>
            <div class="card-body">
              <h5 class="card-title">${
                global.search.type === 'movie' ? result.title : result.name
              }</h5>
              <p class="card-text">
                <small class="text-muted">Release: ${
                  global.search.type === 'movie'
                    ? result.release_date
                    : result.first_air_date
                }</small>
              </p>
            </div>
    `;
    document.getElementById('search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>`;
    document.getElementById('search-results').appendChild(card);
  });
  renderPagination();
}
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    // @todo - send request and show results
    const { results, total_pages, page, total_results } =
      await getSearchResults();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No result found!', 'error');
      return;
    }
    renderSearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter search term !', 'error');
  }
}
function showAlert(mess, className) {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', className);
  alertElement.appendChild(document.createTextNode(mess));
  document.querySelector('#alert').appendChild(alertElement);
  setTimeout(() => alertElement.remove(), 3000);
}
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: { slidesPerView: 2 },
      700: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
}
async function renderSwiper() {
  const playingMovies = await getPlayingMovie();
  console.log(playingMovies);

  const swiperElement = document.querySelector('.swiper-wrapper');

  playingMovies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('swiper-slide');
    const src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    card.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="${src}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average}/ 10
      </h4>
    `;

    swiperElement.appendChild(card);
  });

  initSwiper();
}
async function renderPulularMovies() {
  const popularMovies = await getPopularMovies();
  const popularMoviesContainer = document.getElementById('popular-movies');
  console.log(popularMovies);

  popularMoviesContainer.innerHTML = '';
  popularMovies.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    card.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
              <img
                src="${src}"
                class="card-img-top"
                alt="${movie.title}"
              />
            </a>
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
              </p>
            </div>
    `;
    popularMoviesContainer.appendChild(card);
  });
}

async function renderPopularTvShows() {
  const popularTvShows = await getPopularTvShows();
  console.log(popularTvShows);
  const popularTvShowsContainer = document.getElementById('popular-shows');
  popularTvShowsContainer.innerHTML = '';

  popularTvShows.forEach((show) => {
    const card = document.createElement('div');
    const src = `https://image.tmdb.org/t/p/w500/${show.poster_path}`;
    card.classList.add('card');

    card.innerHTML = `
     <a href="tv-details.html?id=${show.id}">
              <img
                src="${src}"
                class="card-img-top"
                alt="${show.name}"
              />
            </a>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">
                <small class="text-muted">Aired: ${show.first_air_date}</small>
              </p>
            </div>
    `;

    popularTvShowsContainer.appendChild(card);
  });
}

async function renderMovieDetails() {
  const movieDetails = await getMovieDetails();
  const movieDetailsContainer = document.getElementById('movie-details');

  const genres = movieDetails.genres;
  const src = `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`;

  movieDetailsContainer.innerHTML = '';
  const detailsTop = document.createElement('div');
  detailsTop.classList.add('details-top');
  detailsTop.innerHTML = `
    <div>
      <img
        src="${src}"
        class="card-img-top"
        alt="${movieDetails.title}"
    />
    </div>
    <div>
      <h2>${movieDetails.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movieDetails.vote_average} / 10
      </p>
      <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
      <p>
        ${movieDetails.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      </ul>
      <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  `;
  const genresElement = detailsTop.querySelector('.list-group');
  // console.log(genresElement);

  if (!genres || genres.length === 0) {
    genresElement.innerHTML =
      '<li class="list-group-item">No genres available.</li>';
  }

  // Thêm genres
  genres.forEach((g) => {
    const li = document.createElement('li');
    li.textContent = g.name;
    genresElement.appendChild(li);
  });
  movieDetailsContainer.appendChild(detailsTop);

  const companyList = movieDetails.production_companies
    .map((company) => company.name)
    .join(', ');
  const detailsBottom = document.createElement('div');
  detailsBottom.classList.add('details-bottom');
  detailsBottom.innerHTML = `
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${movieDetails.budget}</li>
      <li><span class="text-secondary">Revenue:</span> $${movieDetails.revenue}</li>
      <li><span class="text-secondary">Runtime:</span> ${movieDetails.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movieDetails.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${companyList}</div>
  `;

  movieDetailsContainer.appendChild(detailsBottom);
}

async function renderShowDetails() {
  const showDetailsContainer = document.getElementById('show-details');
  const showDetails = await getShowDetails();
  const genres = showDetails.genres;
  const src = `https://image.tmdb.org/t/p/w500/${showDetails.poster_path}`;
  console.log(showDetails);
  showDetailsContainer.innerHTML = '';

  const detailsTop = document.createElement('div');
  detailsTop.classList.add('details-top');
  detailsTop.innerHTML = `<div>
            <img
              src="${src}"
              class="card-img-top"
              alt="${showDetails.title}"
            />
          </div>
          <div>
            <h2>${showDetails.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${showDetails.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${showDetails.release_date}</p>
            <p>
              ${showDetails.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            </ul>
            <a href="#" target="_blank" class="btn">Visit Show Homepage</a>
          </div>`;
  const genresElement = detailsTop.querySelector('.list-group');
  if (!genres || genres.length === 0) {
    genresElement.innerHTML =
      '<li class="list-group-item">No genres available.</li>';
  }
  genres.forEach((g) => {
    const li = document.createElement('li');
    li.textContent = g.name;
    genresElement.appendChild(li);
  });
  showDetailsContainer.appendChild(detailsTop);

  const companyList = showDetails.production_companies
    .map((company) => company.name)
    .join(', ');
  const detailsBottom = document.createElement('div');
  detailsBottom.classList.add('details-bottom');
  detailsBottom.innerHTML = `<h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> 50</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> Last
              Aired Show Episode
            </li>
            <li><span class="text-secondary">Status:</span> ${showDetails.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${companyList}</div>`;

  showDetailsContainer.appendChild(detailsBottom);
}
// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      renderSwiper();
      renderPulularMovies();
      break;
    case '/shows.html':
      renderSwiper();
      renderPopularTvShows();
      break;
    case '/movie-details.html':
      renderMovieDetails();
      break;
    case '/tv-details.html':
      renderShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }

  highlightMenu();
}
init();
