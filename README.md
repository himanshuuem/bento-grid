# 🍱 Bento: At a Glance

> A personal dashboard in the "bento box" style, laid out with **CSS Grid template areas**. It shows live GitHub stats, recently pushed repos, a language breakdown and a local-time widget that tells visitors how far ahead or behind me they are.

**🔗 Live demo:** https://himanshuuem.github.io/bento-grid/

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3_Grid-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GitHub API](https://img.shields.io/badge/GitHub_REST_API-181717?logo=github&logoColor=white)

## ✨ Features

- **Named grid areas:** the whole layout is defined by `grid-template-areas` and rearranged at two breakpoints (4 → 2 → 1 columns) with no change to the markup.
- **Live GitHub data** from the public REST API: repo count, followers, join year and the four most recently pushed repos.
- **Language breakdown bar** computed from my public repos using flex-grow ratios.
- **Rate-limit aware:** responses are cached in `localStorage` for 10 minutes, and errors such as the 403 rate limit are shown in the UI.
- **Time-zone widget:** shows IST with `Intl.DateTimeFormat` and compares it with the visitor's own offset.
- **Polish:** skeleton loaders, staggered tile entrance and hover lift. Dark mode is automatic.
- XSS-safe rendering: API strings are only ever set through `textContent`.

## 🛠 Tech Stack

HTML5 · CSS Grid · CSS custom properties · Vanilla JS (ES modules, `fetch`, `Promise.all`, `Intl.RelativeTimeFormat`) · GitHub REST API

## 📁 Structure

```
bento-grid/
├── index.html   # Tile markup
├── styles.css   # Grid areas, breakpoints, theme
├── app.js       # Clock, GitHub fetch + cache, rendering
└── README.md
```

## 🚀 Run Locally

```bash
git clone https://github.com/himanshuuem/bento-grid.git
cd bento-grid
npx serve .
```

To make it yours, change `USERNAME` in `app.js` and the text in `index.html`.

## 📚 Origin

This builds on the *CSS Grid* section of [The Complete Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/). I used the layout exercise as the base for a live personal dashboard.

---

Made by [Himanshu](https://github.com/himanshuuem)
