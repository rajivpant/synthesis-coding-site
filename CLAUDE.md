# Claude Code Context: synthesis-coding-site

## Repository: synthesis-coding-site (PUBLIC)

Website for synthesiscoding.com - a methodology site with articles about Synthesis Coding.

## IMPORTANT: What Belongs Here (Many-to-Many Publishing)

**This repository manages articles that are dual-published to BOTH rajiv.com AND synthesiscoding.com.**

Articles here are:
- Published to WordPress (rajiv.com) via ownwords
- Published to Cloudflare Pages (synthesiscoding.com) via git push
- Canonical URL points to rajiv.com

**Non-synthesis-coding articles that only appear on rajiv.com belong in `rajiv-site/`, not here.**

When fetching a rajiv.com article, the URL alone doesn't tell you which repo it belongs to — the **topic** determines that. When in doubt, ASK the user.

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
├── content/
│   ├── posts/              # Blog posts: YYYY/MM/DD-slug/index.md
│   └── pages/              # Static pages: slug/index.md (future)
├── articles/               # Generated HTML (output)
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

The build script (`scripts/build.js`) uses hierarchical content structure:

```text
content/posts/2025/12/07-my-article/index.md
content/posts/2025/12/07-my-article/image.jpg
```

Output URL: `/articles/my-article/`

Features:
- Canonical links pointing to rajiv.com
- WordPress-ready export in `wordpress-export/` (for copy/paste publishing)
- Images co-located with articles in hierarchical structure
- Internal link conversion (see below)

### Internal Link Conversion

The build script automatically converts links between articles:

**CONVERTED** (rajiv.com → /articles/):
- Links to `rajiv.com/blog/YYYY/MM/DD/slug/` where the article exists in this repo
- Example: `rajiv.com/blog/2025/11/09/synthesis-engineering...` → `/articles/synthesis-engineering.../`

**NOT CONVERTED** (kept as rajiv.com):
- Links to rajiv.com articles NOT in this repo (e.g., non-synthesis-coding posts)
- Canonical URL meta tags (must point to rajiv.com for SEO)
- "Originally published on" footer links (attribution)
- Links to older rajiv.com posts (e.g., 2008 blogroll-links)

**NEVER CONVERTED**:
- External links (non-rajiv.com)
- Links to rajiv.com non-blog pages (e.g., /about/, /contact/)

This ensures synthesiscoding.com visitors stay on-site for synthesis-coding content while correctly linking out for other content.

## Local Testing

**IMPORTANT: This site requires HTTPS for local testing.**

Unlike simple static sites that can be tested with `file://` URLs, this site:
- Uses absolute paths (`/articles/...`, `/assets/...`)
- Has internal link conversion that produces root-relative URLs
- Should be tested in an environment that matches Cloudflare Pages

**Start local HTTPS server:**

```bash
# Using http-server with self-signed cert (install once: npm install -g http-server)
http-server -S -C cert.pem -K key.pem -p 8443

# Or using Python (simpler, no cert needed for localhost)
python3 -m http.server 8000

# Then open: http://localhost:8000 or https://localhost:8443
```

**Why HTTPS matters:**
- Tests that root-relative paths work correctly
- Catches issues with mixed content
- Matches production environment on Cloudflare Pages
- Reveals problems that `file://` URLs would hide

**DO NOT test with `file://` URLs** — they won't reveal path issues.

## Using ownwords with This Site

The ownwords CLI can fetch and convert articles from rajiv.com for this site:

```bash
# Fetch with hierarchical structure
ownwords fetch https://rajiv.com/blog/2025/12/07/article-slug/ --api --hierarchical --output-dir=./content

# This creates: content/posts/2025/12/07-article-slug/index.md
```

## Dual Publishing Workflow

This site publishes to both:
1. **Cloudflare Pages** (synthesiscoding.com) - auto-deploys on git push
2. **WordPress** (rajiv.com) - via ownwords publish

### Publishing to WordPress

**Recommended: Use ownwords publish (with safeguards)**

```bash
# Always preview first
node ~/projects/my-projects/ownwords/bin/ownwords.js publish ./content/posts/2025/12/07-your-slug/index.md --dryrun

# Verify the dry-run output shows:
# - "UPDATE existing post" (not "CREATE new post")
# - "Would upload: 0" for images (if images already uploaded)
# - Correct post_id matches what's in front matter

# Then publish
node ~/projects/my-projects/ownwords/bin/ownwords.js publish ./content/posts/2025/12/07-your-slug/index.md
```

**Manual workflow (alternative):**

1. Run `npm run build`
2. Open the corresponding file in `wordpress-export/`
3. Copy the HTML content
4. Paste into WordPress post editor (HTML/Code view)
5. Update the post in WordPress

### Pre-Publish Checklist

Before publishing any changes to WordPress:

1. **Verify you're updating, not creating**
   - Check front matter has `wordpress.post_id`
   - Dry-run should show "UPDATE existing post", not "CREATE new post"

2. **Verify images won't be re-uploaded**
   - Check `index.images.json` sidecar exists with image URLs
   - Dry-run should show "Would upload: 0" (unless you added new images)

3. **Preview locally first**
   - Run `npm run build`
   - Check `articles/your-slug/index.html` looks correct
   - Verify images render with captions

4. **Test on mobile**
   - Images should not overflow viewport
   - Figures/captions should display correctly

5. **Don't rush**
   - Review dry-run output carefully
   - If anything looks wrong, investigate before publishing

### Publishing to Cloudflare Pages

Simply push to GitHub - Cloudflare Pages auto-deploys from main branch.

```bash
git add .
git commit -m "Update article"
git push
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
