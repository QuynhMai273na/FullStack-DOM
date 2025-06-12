const url = 'https://api.github.com/users/';
const formElement = document.getElementById('form');
const mainContainer = document.getElementById('main');
const searchInput = document.getElementById('search');

function createErrorCrad(msg) {
  mainContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `  
    <div>
      <h1>${msg}</h1>
    </div>
  `;
  mainContainer.appendChild(card);
}
function addRepos(repos) {
  const reposElement = document.getElementById('repos');
  repos.forEach((repo) => {
    const repoLink = document.createElement('a');
    repoLink.classList.add('repo');
    repoLink.href = repo.html_url;
    repoLink.target = '_blank';
    repoLink.innerText = repo.name;
    reposElement.appendChild(repoLink);
  });
}
async function getRepos(userName) {
  try {
    const { data } = await axios.get(`${url}${userName}/repos?sort=created`);
    console.log(data);
    addRepos(data);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCrad('Problem fetching repos!');
    }
  }
}

async function getUser(userName) {
  try {
    const { data } = await axios.get(`${url}${userName}`);
    createUserCard(data);
    getRepos(userName);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCrad('No profiles found!');
    }
  }
}
function createUserCard(user) {
  mainContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div>
      <img 
        src="${user.avatar_url}"
        alt=""
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${user.login}</h2>
      <p>${user.bio}</p>
      <ul>
        <li>${user.followers} <strong> Followers</strong></li>
        <li>${user.following} <strong> Following</strong></li>
        <li>${user.public_repos} <strong> Repos</strong></li>
      </ul>
      <div id="repos"></div>
    </div>`;
  mainContainer.appendChild(card);
}
formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = searchInput.value;
  if (userName) {
    getUser(userName);
    searchInput.value = '';
  }
});
