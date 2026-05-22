# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Shiling's personal website — a pure static HTML/CSS/JS site with dual-role access (Visitor / HR). No frameworks, no build step, no database. Deployed via GitHub Pages.

## Run locally

```
python -m http.server 8080
# Open http://localhost:8080
```

Any Python 3.x works. `fetch()` calls require HTTP serving (not `file://`). The project uses python-docx and Pillow for PRD-related scripting; install them only if you need to modify the PRD.

## Architecture

**Multi-page application (MPA)** — 6 independent `.html` files sharing a single CSS file and 5 JS files. No router; navigation uses plain `<a href>` links. Detail pages use URL params (`?id=1`).

**CSS** (`css/style.css`): Single file with CSS custom properties in `:root`, then reset → typography → nav → layout → cards → timeline → blog-detail → portfolio → footer → responsive breakpoints → animations. No preprocessor.

**JS** loads in dependency order. `js/role.js` must load first (defines global `getRole/setRole/clearRole`). `js/main.js` injects nav + footer and handles role-based About link visibility. Page-specific scripts (`blog.js`, `blog-detail.js`, `portfolio.js`) render data fetched from `/data/`.

## Color system (CSS variables)

| Variable | Value | Usage |
|---|---|---|
| `--color-primary` | `#345b80` | Nav, headings, links, buttons |
| `--color-accent` | `#faaf92` | Emphasis buttons, hover, tags |
| `--color-text` | `#27465b` | Body text |
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#f5f7fa` | Card backgrounds |
| `--color-border` | `#e0e6ed` | Borders, dividers |

Brand font stack: Playfair Display (headings), Crimson Text (body), JetBrains Mono (code).

## Role system

`localStorage` key: `userRole` — values: `"visitor"` or `"hr"`. Set on `index.html` via the two hero buttons. Read by `js/main.js` to conditionally show the About nav link (removes `nav-about-hidden` class on `<li>` for HR). `about.html` checks `getRole() !== 'hr'` and renders an access-denied view instead of the resume content. No server-side enforcement — this is a UX convenience, not security.

## Blog system

1. **List** (`blog.html`): `js/blog.js` fetches `data/posts.json`, sorts by date desc, renders card grid. Each card links to `blog-detail.html?id=N`.
2. **Detail** (`blog-detail.html`): `js/blog-detail.js` looks up the post in `data/posts.json`, fetches the `.md` file from `/posts/`, strips YAML frontmatter, renders via **marked.js** (CDN), then:
   - Walks rendered `h2/h3/h4` in the DOM, assigns sequential IDs (`section-0`, `section-1`, …)
   - Builds a **left sidebar TOC** (`toc-sidebar`) with indented links (`toc-h2`/`toc-h3`/`toc-h4`)
   - Uses `IntersectionObserver` to highlight the current section
   - Smooth-scrolls on TOC click
3. **Add a post**: Write a `.md` file in `/posts/` with YAML frontmatter (`id, title, date, summary, tags`), add an entry to `data/posts.json`. No other changes needed.

## Portfolio system

`data/projects.json` stores project metadata including HTML `detail` strings. `js/portfolio.js` handles both list and detail rendering by checking which container (`#projects-grid` or `#project-detail`) exists on the page.

## Data files

- `data/posts.json` — array of `{id, title, date, summary, tags[], file}`
- `data/projects.json` — array of `{id, name, description, image, techStack[], detail, liveLink, githubLink}`
- `posts/*.md` — YAML frontmatter + Markdown body

## Deployment

GitHub Pages from the repository root. Push to `main` → Settings → Pages → deploy from branch. Custom domain configurable via CNAME in DNS + Settings → Pages → Custom domain.
