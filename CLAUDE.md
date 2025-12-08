# Claude Code Context: synthesis-coding-site

## Repository: synthesis-coding-site (PUBLIC)

Website for synthesiscoding.com - a methodology site with articles about Synthesis Coding.

## Repository Ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **synthesis-coding-site** | Public | Website for synthesiscoding.com | `~/projects/my-projects/synthesis-coding-site/` |
| **rajiv-site** | Public | Static files and blog management for rajiv.com | `~/projects/my-projects/rajiv-site/` |
| **ownwords** | Public | WordPress to Markdown toolkit | `~/projects/my-projects/ownwords/` |
| **ragbot-site** | Public | Website for ragbot.ai | `~/projects/my-projects/ragbot-site/` |
| **ragenie-site** | Public | Website for ragenie.ai | `~/projects/my-projects/ragenie-site/` |

Note: Home directory varies by machine, so use `~` for paths.

## Site Structure

```text
synthesis-coding-site/
├── index.html              # Main landing page
├── content/articles/       # Markdown source files (future)
├── articles/               # Generated HTML (future)
├── scripts/
│   └── build.js            # Site build script (uses marked + gray-matter)
├── templates/              # HTML templates for build
├── assets/                 # Images and static assets
├── _headers                # Cloudflare headers
├── robots.txt              # Search engine directives
├── llms.txt                # AI bot access info
└── CLAUDE.md               # This file
```

## Build Process

```bash
npm run build               # Builds markdown articles to HTML
```

The build script (`scripts/build.js`) converts markdown files in `content/articles/` to HTML pages with:

- Canonical links pointing to rajiv.com
- WordPress-ready export in `wordpress-export/` (for copy/paste publishing)

## Using ownwords with This Site

The ownwords CLI can fetch and convert articles from rajiv.com for this site:

```bash
# From this repo directory
ownwords fetch https://rajiv.com/blog/2025/11/09/article-slug/
ownwords convert ./raw/article-slug.html ./content/articles/article-slug.md
ownwords verify ./raw/article-slug.html ./content/articles/article-slug.md
```

## Git Operations

**IMPORTANT**: Before any git commands, ensure you are in the correct directory:

```bash
cd ~/projects/my-projects/synthesis-coding-site
```

This repo is separate from ownwords. Do NOT mix commits between repos.

## Deployment

- Hosted on Cloudflare Pages
- Auto-deploys from GitHub on push to main
- Domain: synthesiscoding.com
