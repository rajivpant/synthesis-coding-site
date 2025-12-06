# Synthesis Coding

A professional practice for AI-assisted software development.

**Live site:** [synthesiscoding.com](https://synthesiscoding.com)

## What is this?

This repository contains the source for synthesiscoding.com—a reference site documenting Synthesis Coding (also called Synthesis Engineering), an emerging methodology for building production-grade software with AI assistance.

## License

The terminology "Synthesis Coding" and "Synthesis Engineering," along with the logo and visual identity, are released under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) (public domain).

The website content and code are also released under CC0. No permission required. No attribution needed. Use freely.

## Repository Structure

```
├── index.html                # Main landing page
├── content/
│   └── articles/             # Markdown source files (source of truth)
│       ├── *.md              # Article markdown files
│       └── images/           # Article images
├── articles/                 # Generated HTML (build output)
│   ├── index.html            # Article listing page
│   └── [slug]/index.html     # Individual article pages
├── templates/
│   ├── article.html          # Single article template
│   └── article-list.html     # Article listing template
├── scripts/
│   ├── build.js              # Build script
│   └── convert-wordpress-to-markdown.js  # WordPress HTML → Markdown converter
├── wordpress-export/         # Generated WordPress-ready HTML (gitignored)
└── assets/                   # Static assets (logo, etc.)
```

## Dual Publishing

Articles are published to both:
- **synthesiscoding.com** (this site) - with canonical links pointing to rajiv.com
- **rajiv.com** (WordPress) - the canonical source for SEO

This prevents duplicate content penalties while making the site self-sufficient.

## Development

### Prerequisites

- Node.js 18+

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

This generates:
- `articles/` - HTML pages for the static site
- `wordpress-export/` - Clean HTML for copy/paste to WordPress

### Local Preview

```bash
# Any static file server works
python3 -m http.server 8000
# or
npx serve
```

Open http://localhost:8000

## Adding New Articles

1. **Create the markdown file:**
   ```bash
   # Choose a slug (used on both sites)
   touch content/articles/my-new-article.md
   ```

2. **Add front matter:**
   ```yaml
   ---
   title: "My New Article Title"
   slug: "my-new-article"
   date: "2025-12-05"
   canonical_url: "https://rajiv.com/blog/2025/12/05/my-new-article/"
   description: "Brief description for SEO and article listings."
   category: "Core Series"  # or: Case Study, Advanced Patterns, Comparison, Philosophical Foundation
   series_order: 1
   wordpress_synced: "2025-12-05"
   ---

   Article content in markdown...
   ```

3. **Build and preview:**
   ```bash
   npm run build
   npx serve
   ```

4. **Publish to WordPress:**
   - Copy content from `wordpress-export/my-new-article.html`
   - Create new post in WordPress, paste HTML
   - Set permalink slug to match: `my-new-article`
   - Publish and verify URL matches `canonical_url`

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Add: my-new-article"
   git push
   ```

## Editing Existing Articles

1. Edit the markdown file in `content/articles/`
2. Run `npm run build`
3. Update WordPress by pasting from `wordpress-export/`
4. Update `wordpress_synced` date in front matter
5. Commit and push

## Images

Store images in `content/articles/images/`. Reference them in markdown:

```markdown
![Description](/articles/images/my-image.webp)
```

The build script rewrites image URLs to absolute paths in WordPress exports.

## Deployment

This site is deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

**Build settings:**
- Build command: `npm run build`
- Build output directory: `/` (root)

## Reference Articles

- [Synthesis Coding: The Professional Practice Emerging in AI-Assisted Development](/articles/synthesis-coding-professional-practice/)
- [The Synthesis Coding Framework: How Organizations Build Production Software with AI](/articles/synthesis-coding-framework/)
- [Synthesis Coding with Claude Code: Technical Implementation and Workflows](/articles/synthesis-coding-with-claude-code/)
- [Modernizing a 17-Year-Old WordPress Plugin Using Synthesis Coding](/articles/modernizing-wordpress-plugin/)
- [Polyrepo Synthesis: Synthesis Coding Across Multiple Repositories](/articles/polyrepo-synthesis/)
- [Vibe Coding and Synthesis Coding: Two Complementary Approaches](/articles/vibe-coding-and-synthesis-coding/)
- [Why Synthesis Coding Still Writes Code in the Age of LLMs](/articles/why-synthesis-coding-still-writes-code/)
