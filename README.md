# Welcome

Welcome to my personal portfolio website repository. This site showcases projects, publications, experiences, and news updates about me.

## Intro

This repository contains a simple static website (HTML/CSS) used as my online portfolio. It's intentionally minimal so it's easy to update by editing the HTML files under `pages/` and the main `index.html`.

## Clone & run locally

1. Clone the repo:

```bash
git clone <your-repo-url>
cd quocviet1207.github.io
```

2. Open the site in a browser by double-clicking `index.html` or start a quick local server (recommended):

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

## Folder structure

- `index.html` — Homepage (hero + highlights)
- `css/` — Stylesheet(s) (main file: `css/style.css`)
- `assets/` — Images and raw assets (photos, resume PDF, etc.)
- `pages/` — Secondary pages: `publications.html`, `experiences.html`, `projects.html`, `news.html`
- `projects-list/` — Additional project pages and details
- `README.md` — This file

## Overall organization

- The primary layout and hero content is in `index.html`.
- Global styles are in `css/style.css`. Keep styles consistent by adding small, focused rules.
- Secondary content pages live in `pages/` and are linked from the top navigation.
- The `news` block is shown on the homepage and has a dedicated page at `pages/news.html` for full history.

## How to add News

1. Add a new item directly on the dedicated page: edit `pages/news.html` and insert a new `<article class="news-item">` block inside the `.news-list` container. Example entry:

```html
<article class="news-item">
	<div class="news-meta"><span class="news-date">YYYY-MM-DD</span> — <strong>Title of update</strong></div>
	<p>Short description of the news. Keep it concise and link to details if needed.</p>
</article>
```

2. To show a short selection on the homepage, edit `index.html` inside the `.news-list` in the `.news-wrapper` block. Keep homepage items brief and link to `pages/news.html` for the full list.

## How to add a Publication

1. Open `pages/publications.html` and add a new list item in the published list. Follow existing markup for date, title, authors, venue, and links.
2. If you have a PDF or asset, add it to `assets/` and link to it from the publication entry.

## How to add an Experience

1. Edit `pages/experiences.html` and add a new experience block or list item following the existing pattern.
2. Use consistent headings and dates to keep the timeline readable.

## How to add a Project

1. Edit `pages/projects.html` to add a new project card in the project list.
2. For a detailed project page, add an HTML file to `projects-list/` (e.g., `projects-list/my-project.html`) and link to it from the card.
3. Place project images in `assets/` and reference them from the card or detail page.

## Styling and responsive notes

- Make small, localized additions to `css/style.css` and test using a browser's responsive inspector.
- Keep class names semantic and avoid large global overrides.

## Preview & deploy

- For quick previews, use the Python HTTP server shown above.
- To publish, push to your GitHub repository and enable GitHub Pages (if desired) from repository settings.

---

If you'd like, I can add templates for `publications.html`, `experiences.html`, and `projects.html` to make content additions even easier.

