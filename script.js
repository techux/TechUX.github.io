const themeToggle = document.getElementById('themeToggle');
const projectsContainer = document.getElementById('projectsContainer');

// === THEME TOGGLE + LOCAL STORAGE ===
function setTheme(mode) {
  document.body.classList.toggle('dark', mode === 'dark');
  themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', mode);
}

themeToggle.addEventListener('click', () => {
  const newMode = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(newMode);
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  fetchGitHubProjects();
});

// === GITHUB PROJECTS ===
async function fetchGitHubProjects() {
  const username = 'techux';
  const url = `https://api.github.com/users/${username}/repos?per_page=100`;

  try {
    const response = await fetch(url);
    const repos = await response.json();

    const topRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    projectsContainer.innerHTML = '';

    topRepos.forEach(repo => {
      const card = document.createElement('div');
      card.classList.add('project');
      card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description available.'}</p>
        <p>
          <strong>⭐ ${repo.stargazers_count}</strong>
          ${repo.language ? ` | <span>${repo.language}</span>` : ''}
        </p>
      `;
      projectsContainer.appendChild(card);
    });
  } catch (err) {
    projectsContainer.innerHTML = '❌ Failed to load GitHub projects.';
    console.error(err);
  }
}
