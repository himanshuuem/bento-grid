const USERNAME = "himanshuuem";
const API = "https://api.github.com";
const CACHE_KEY = "bento-github-cache";
const CACHE_TTL_MS = 10 * 60 * 1000; // GitHub allows 60 unauthenticated requests/hour — cache to stay well under.
const LANG_COLORS = {
  JavaScript: "#f1e05a", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c", "C++": "#f34b7d",
  Java: "#b07219", EJS: "#a91e50", TypeScript: "#3178c6", "Jupyter Notebook": "#DA5B0B", Other: "#9a9a9a",
};

const $ = (selector) => document.querySelector(selector);

function startClock() {
  const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const dayFmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  const tick = () => {
    const now = new Date();
    $("[data-clock]").textContent = timeFmt.format(now);
    $("[data-day]").textContent = dayFmt.format(now);
    const istOffset = 330;
    const visitorOffset = -now.getTimezoneOffset();
    const diffHours = (istOffset - visitorOffset) / 60;
    $("[data-overlap]").textContent = diffHours === 0
      ? "Same time zone as you 👋"
      : `${Math.abs(diffHours)}h ${diffHours > 0 ? "ahead of" : "behind"} you`;
  };
  tick();
  setInterval(tick, 10_000);
}

async function fetchJson(path) {
  const response = await fetch(`${API}${path}`, { headers: { Accept: "application/vnd.github+json" } });
  if (response.status === 403) throw new Error("GitHub rate limit reached — try again in a bit.");
  if (!response.ok) throw new Error(`GitHub API error (${response.status})`);
  return response.json();
}

async function loadGithubData() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached.data;
  } catch {
    // Ignore unreadable cache.
  }
  const [user, repos] = await Promise.all([
    fetchJson(`/users/${USERNAME}`),
    fetchJson(`/users/${USERNAME}/repos?sort=pushed&per_page=100`),
  ]);
  const data = { user, repos: repos.filter((repo) => !repo.fork) };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage unavailable; we'll just refetch next time.
  }
  return data;
}

function renderStats(user) {
  $('[data-stat="public_repos"]').textContent = user.public_repos;
  $('[data-stat="followers"]').textContent = user.followers;
  $('[data-stat="created_at"]').textContent = new Date(user.created_at).getFullYear();
}

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function timeAgo(dateString) {
  const days = Math.round((new Date(dateString) - Date.now()) / 86_400_000);
  if (Math.abs(days) < 1) return "today";
  if (Math.abs(days) < 30) return relativeTime.format(days, "day");
  return relativeTime.format(Math.round(days / 30), "month");
}

function renderRepos(repos) {
  const items = repos.slice(0, 4).map((repo) => {
    const li = document.createElement("li");
    const link = Object.assign(document.createElement("a"), { href: repo.html_url });
    const name = Object.assign(document.createElement("span"), { className: "repo-name", textContent: repo.name });
    const desc = Object.assign(document.createElement("span"), { className: "repo-desc", textContent: repo.description ?? "No description yet" });
    const meta = Object.assign(document.createElement("span"), {
      className: "repo-meta",
      textContent: `${repo.language ?? "—"} · pushed ${timeAgo(repo.pushed_at)}`,
    });
    link.append(name, desc, meta);
    li.append(link);
    return li;
  });
  $("[data-repos]").replaceChildren(...items);
}

function renderLanguages(repos) {
  const counts = new Map();
  for (const repo of repos) {
    const lang = repo.language ?? "Other";
    counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  const total = repos.length || 1;
  const sorted = [...counts].sort((a, b) => b[1] - a[1]);
  const bar = sorted.map(([lang, count]) => {
    const span = document.createElement("span");
    span.style.flexGrow = count;
    span.style.background = LANG_COLORS[lang] ?? LANG_COLORS.Other;
    span.title = `${lang}: ${count}`;
    return span;
  });
  const legend = sorted.map(([lang, count]) => {
    const li = document.createElement("li");
    const dot = document.createElement("i");
    dot.style.background = LANG_COLORS[lang] ?? LANG_COLORS.Other;
    li.append(dot, `${lang} ${Math.round((count / total) * 100)}%`);
    return li;
  });
  $("[data-lang-bar]").replaceChildren(...bar);
  $("[data-lang-legend]").replaceChildren(...legend);
}

async function init() {
  startClock();
  try {
    const { user, repos } = await loadGithubData();
    renderStats(user);
    renderRepos(repos);
    renderLanguages(repos);
  } catch (error) {
    $("[data-repos]").replaceChildren();
    const errorBox = $("[data-error]");
    errorBox.textContent = error.message;
    errorBox.hidden = false;
  }
}

init();
