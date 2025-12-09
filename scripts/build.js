#!/usr/bin/env node

/**
 * Build script for Synthesis Coding site
 *
 * Features:
 * - Converts markdown articles to HTML with canonical links
 * - Generates RSS feed
 * - Builds search index
 * - Creates category and tag pages
 * - Calculates reading time
 * - Generates related articles
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'articles');
const OUTPUT_DIR = path.join(ROOT_DIR, 'articles');
const WORDPRESS_EXPORT_DIR = path.join(ROOT_DIR, 'wordpress-export');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');

const SITE_URL = 'https://synthesiscoding.com';
const SITE_NAME = 'Synthesis Coding';
const WORDS_PER_MINUTE = 225; // Average reading speed
const NEW_ARTICLE_DAYS = 30; // Days to show "New" badge

// Category definitions with colors and descriptions
const CATEGORIES = {
  'Foundation': {
    slug: 'foundation',
    color: '#2563eb',
    description: 'Core concepts and philosophy behind Synthesis Coding methodology.',
    order: 1
  },
  'Framework': {
    slug: 'framework',
    color: '#7c3aed',
    description: 'Organizational frameworks for implementing Synthesis Engineering.',
    order: 2
  },
  'Technical guide': {
    slug: 'technical-guide',
    color: '#059669',
    description: 'Technical implementation guides and workflows.',
    order: 3
  },
  'Case study': {
    slug: 'case-study',
    color: '#d97706',
    description: 'Real-world applications and project examples.',
    order: 4
  },
  'Advanced patterns': {
    slug: 'advanced-patterns',
    color: '#dc2626',
    description: 'Advanced techniques for complex scenarios.',
    order: 5
  },
  'Comparison and guidance': {
    slug: 'comparison',
    color: '#0891b2',
    description: 'Comparisons with other methodologies and decision guidance.',
    order: 6
  },
  'Philosophical foundation': {
    slug: 'philosophical',
    color: '#6b7280',
    description: 'Deeper philosophical underpinnings of the methodology.',
    order: 7
  }
};

// Custom renderer to put language class on <pre> for Prism.js
const renderer = new marked.Renderer();
renderer.code = function(codeBlock) {
  let code, language;
  if (typeof codeBlock === 'object') {
    code = codeBlock.text || '';
    language = codeBlock.lang || '';
  } else {
    code = codeBlock;
    language = arguments[1] || '';
  }
  const langClass = language ? ` class="language-${language}"` : '';
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  return `<pre${langClass}><code${langClass}>${escaped}</code></pre>\n`;
};

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
  renderer: renderer
});

/**
 * Calculate reading time from content
 */
function calculateReadingTime(markdown) {
  // Strip markdown syntax for more accurate word count
  const text = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[#*_~`>\-+|]/g, '') // Remove markdown characters
    .replace(/\n+/g, ' '); // Normalize whitespace

  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return { wordCount, minutes };
}

/**
 * Check if article is considered "new"
 */
function isNewArticle(dateStr) {
  const articleDate = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - articleDate) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_ARTICLE_DAYS;
}

/**
 * Generate URL-friendly slug
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Read and parse a markdown file with front matter
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content: markdown } = matter(content);
  const html = marked(markdown);
  const { wordCount, minutes } = calculateReadingTime(markdown);

  return {
    frontMatter,
    markdown,
    html,
    readingTime: minutes,
    wordCount
  };
}

/**
 * Read a template file
 */
function readTemplate(templateName) {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Format a date for display
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date for RSS (RFC 822)
 */
function formatRssDate(dateStr) {
  const date = new Date(dateStr);
  return date.toUTCString();
}

/**
 * Format date for ISO 8601
 */
function formatIsoDate(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString();
}

/**
 * Generate HTML for tags display (clickable links)
 */
function generateTagsHtml(tags, linkable = true) {
  if (!tags || tags.length === 0) {
    return '';
  }
  if (linkable) {
    return tags.map(tag =>
      `<a href="/articles/tag/${slugify(tag)}/" class="tag">${tag}</a>`
    ).join('');
  }
  return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

/**
 * Generate category badge HTML
 */
function generateCategoryBadge(category) {
  const catInfo = CATEGORIES[category] || { slug: slugify(category), color: '#6b7280' };
  return `<a href="/articles/category/${catInfo.slug}/" class="category-badge" style="--cat-color: ${catInfo.color}">${category}</a>`;
}

/**
 * Find related articles based on shared tags and category
 */
function findRelatedArticles(article, allArticles, maxCount = 3) {
  const articleTags = new Set(article.frontMatter.tags || []);
  const articleCategory = article.frontMatter.category;

  const scored = allArticles
    .filter(a => a.frontMatter.slug !== article.frontMatter.slug)
    .map(a => {
      let score = 0;
      const aTags = a.frontMatter.tags || [];

      // Score for shared tags
      for (const tag of aTags) {
        if (articleTags.has(tag)) {
          score += 2;
        }
      }

      // Score for same category
      if (a.frontMatter.category === articleCategory) {
        score += 3;
      }

      return { article: a, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);

  return scored.map(item => item.article);
}

/**
 * Generate related articles HTML
 */
function generateRelatedArticlesHtml(relatedArticles) {
  if (relatedArticles.length === 0) {
    return '';
  }

  let html = `<section class="related-articles">
    <h2>Related Articles</h2>
    <div class="related-grid">`;

  for (const article of relatedArticles) {
    html += `
      <a href="/articles/${article.frontMatter.slug}/" class="related-card">
        <span class="related-title">${article.frontMatter.title}</span>
        <span class="related-meta">${article.readingTime} min read</span>
      </a>`;
  }

  html += `
    </div>
  </section>`;

  return html;
}

/**
 * Build a map of canonical URLs to local slugs for internal link conversion.
 *
 * This enables the site to convert rajiv.com article links to local /articles/
 * paths when the linked article exists in this repository.
 */
function buildCanonicalToSlugMap(articles) {
  const map = {};
  for (const article of articles) {
    if (article.frontMatter.canonical_url) {
      // Store both with and without trailing slash for flexible matching
      const url = article.frontMatter.canonical_url;
      map[url] = article.frontMatter.slug;
      map[url.replace(/\/$/, '')] = article.frontMatter.slug;
      if (!url.endsWith('/')) {
        map[url + '/'] = article.frontMatter.slug;
      }
    }
  }
  return map;
}

/**
 * Convert internal rajiv.com article links to local /articles/slug/ links.
 *
 * LINK HANDLING RULES:
 *
 * 1. CONVERTED (rajiv.com → /articles/):
 *    - Links to rajiv.com/blog/YYYY/MM/DD/slug/ where the slug exists in this repo
 *    - Example: rajiv.com/blog/2025/11/09/synthesis-engineering... → /articles/synthesis-engineering.../
 *
 * 2. NOT CONVERTED (kept as rajiv.com):
 *    - Links to rajiv.com articles that DON'T exist in this repo (e.g., non-synthesis-coding articles)
 *    - Canonical URL meta tags (these should always point to rajiv.com for SEO)
 *    - "Originally published on" footer links (attribution to source)
 *    - Links to older rajiv.com posts (e.g., 2008 blogroll-links post)
 *
 * 3. NEVER CONVERTED:
 *    - External links (non-rajiv.com)
 *    - Links to rajiv.com pages that aren't blog posts (e.g., /about/, /contact/)
 *
 * This ensures synthesiscoding.com visitors stay on the site for synthesis-coding
 * content while correctly linking out for non-synthesis-coding content.
 */
function convertInternalLinks(html, canonicalToSlugMap) {
  // Match rajiv.com/blog/ URLs with date pattern
  // Pattern: https://rajiv.com/blog/YYYY/MM/DD/slug/ (with or without trailing slash)
  const rajivBlogPattern = /https:\/\/rajiv\.com\/blog\/\d{4}\/\d{2}\/\d{2}\/[^\/\s"')]+\/?/g;

  return html.replace(rajivBlogPattern, (match) => {
    // Normalize URL for lookup (ensure trailing slash)
    const normalizedUrl = match.endsWith('/') ? match : match + '/';
    const slug = canonicalToSlugMap[normalizedUrl] || canonicalToSlugMap[match];

    if (slug) {
      // Article exists in this repo - convert to local path
      return `/articles/${slug}/`;
    }
    // Article not in this repo - keep original rajiv.com link
    return match;
  });
}

/**
 * Generate HTML for a single article
 */
function generateArticleHtml(article, template, allArticles, canonicalToSlugMap) {
  let html = template;

  const relatedArticles = findRelatedArticles(article, allArticles);
  const relatedHtml = generateRelatedArticlesHtml(relatedArticles);

  // Convert internal rajiv.com links to local /articles/ links for synthesiscoding.com
  const convertedContent = convertInternalLinks(article.html, canonicalToSlugMap);

  html = html.replace(/\{\{title\}\}/g, article.frontMatter.title);
  html = html.replace(/\{\{slug\}\}/g, article.frontMatter.slug);
  html = html.replace(/\{\{date\}\}/g, article.frontMatter.date);
  html = html.replace(/\{\{formatted_date\}\}/g, formatDate(article.frontMatter.date));
  html = html.replace(/\{\{description\}\}/g, article.frontMatter.description || '');
  html = html.replace(/\{\{canonical_url\}\}/g, article.frontMatter.canonical_url);
  html = html.replace(/\{\{category\}\}/g, article.frontMatter.category || '');
  html = html.replace(/\{\{category_badge\}\}/g, generateCategoryBadge(article.frontMatter.category || 'Other'));
  html = html.replace(/\{\{tags\}\}/g, generateTagsHtml(article.frontMatter.tags));
  html = html.replace(/\{\{reading_time\}\}/g, `${article.readingTime} min read`);
  html = html.replace(/\{\{content\}\}/g, convertedContent);
  html = html.replace(/\{\{related_articles\}\}/g, relatedHtml);

  return html;
}

/**
 * Generate WordPress-ready HTML (just the article body)
 */
function generateWordPressHtml(article) {
  let html = article.html;
  html = html.replace(
    /src="\/articles\/images\//g,
    'src="https://synthesiscoding.com/articles/images/'
  );
  html = html.replace(
    /src="\.\/images\//g,
    `src="https://synthesiscoding.com/articles/${article.frontMatter.slug}/images/`
  );
  return html;
}

/**
 * Generate an article card HTML
 */
function generateArticleCard(article) {
  const isNew = isNewArticle(article.frontMatter.date);
  const catInfo = CATEGORIES[article.frontMatter.category] || { color: '#6b7280', slug: 'other' };

  return `
    <article class="article-card" data-date="${article.frontMatter.date}" data-category="${article.frontMatter.category || 'Other'}">
      <div class="card-header">
        <a href="/articles/category/${catInfo.slug}/" class="category-badge" style="--cat-color: ${catInfo.color}">${article.frontMatter.category || 'Other'}</a>
        ${isNew ? '<span class="new-badge">New</span>' : ''}
      </div>
      <h3 class="card-title">
        <a href="/articles/${article.frontMatter.slug}/">${article.frontMatter.title}</a>
      </h3>
      <p class="card-description">${article.frontMatter.description || ''}</p>
      <div class="card-meta">
        <span class="card-date">${formatDate(article.frontMatter.date)}</span>
        <span class="card-separator">·</span>
        <span class="card-reading-time">${article.readingTime} min read</span>
      </div>
      <div class="card-tags">
        ${generateTagsHtml(article.frontMatter.tags)}
      </div>
    </article>`;
}

/**
 * Generate the article listing page with rich cards
 */
function generateListingHtml(articles, template, stats) {
  // Generate article cards (will be sorted by JS on client)
  let cardsHtml = '';
  for (const article of articles) {
    cardsHtml += generateArticleCard(article);
  }

  // Generate articles data for client-side sorting
  const articlesData = articles.map(a => ({
    slug: a.frontMatter.slug,
    date: a.frontMatter.date,
    category: a.frontMatter.category || 'Other',
    categoryOrder: CATEGORIES[a.frontMatter.category]?.order || 99,
    seriesOrder: a.frontMatter.series_order || 999
  }));

  let html = template;
  html = html.replace(/\{\{articles_list\}\}/g, cardsHtml);
  html = html.replace(/\{\{article_count\}\}/g, `${articles.length} article${articles.length !== 1 ? 's' : ''}`);
  html = html.replace(/\{\{articles_data\}\}/g, JSON.stringify(articlesData));
  html = html.replace(/\{\{category_stats\}\}/g, generateCategoryStats(stats.categories));

  return html;
}

/**
 * Generate category stats HTML
 */
function generateCategoryStats(categoryStats) {
  const sorted = Object.entries(categoryStats)
    .sort((a, b) => (CATEGORIES[a[0]]?.order || 99) - (CATEGORIES[b[0]]?.order || 99));

  return sorted.map(([cat, count]) => {
    const info = CATEGORIES[cat] || { slug: slugify(cat), color: '#6b7280' };
    return `<a href="/articles/category/${info.slug}/" class="category-stat" style="--cat-color: ${info.color}">
      <span class="stat-name">${cat}</span>
      <span class="stat-count">${count}</span>
    </a>`;
  }).join('');
}

/**
 * Generate RSS feed
 */
function generateRssFeed(articles) {
  const sortedArticles = [...articles].sort((a, b) =>
    new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
  );

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Articles on Synthesis Coding methodology for AI-assisted professional software development.</description>
    <language>en-us</language>
    <lastBuildDate>${formatRssDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  for (const article of sortedArticles) {
    const description = (article.frontMatter.description || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    rss += `
    <item>
      <title><![CDATA[${article.frontMatter.title}]]></title>
      <link>${SITE_URL}/articles/${article.frontMatter.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.frontMatter.slug}/</guid>
      <pubDate>${formatRssDate(article.frontMatter.date)}</pubDate>
      <description>${description}</description>
      <category>${article.frontMatter.category || 'Other'}</category>
    </item>`;
  }

  rss += `
  </channel>
</rss>`;

  return rss;
}

/**
 * Generate search index JSON
 */
function generateSearchIndex(articles) {
  return articles.map(article => ({
    title: article.frontMatter.title,
    slug: article.frontMatter.slug,
    description: article.frontMatter.description || '',
    category: article.frontMatter.category || 'Other',
    tags: article.frontMatter.tags || [],
    date: article.frontMatter.date,
    readingTime: article.readingTime,
    // Include first 500 chars of content for search (strip HTML)
    excerpt: article.html
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500)
  }));
}

/**
 * Generate a category page
 */
function generateCategoryPage(category, articles, template) {
  const catInfo = CATEGORIES[category] || {
    slug: slugify(category),
    color: '#6b7280',
    description: `Articles in the ${category} category.`
  };

  let cardsHtml = '';
  for (const article of articles) {
    cardsHtml += generateArticleCard(article);
  }

  let html = template;
  html = html.replace(/\{\{category_name\}\}/g, category);
  html = html.replace(/\{\{category_slug\}\}/g, catInfo.slug);
  html = html.replace(/\{\{category_color\}\}/g, catInfo.color);
  html = html.replace(/\{\{category_description\}\}/g, catInfo.description);
  html = html.replace(/\{\{article_count\}\}/g, `${articles.length} article${articles.length !== 1 ? 's' : ''}`);
  html = html.replace(/\{\{articles_list\}\}/g, cardsHtml);

  return html;
}

/**
 * Generate homepage article list HTML (algorithmically selected for first-time visitors)
 *
 * Algorithm:
 * 1. Select one article per "core" category (Foundation, Framework, Technical guide, Case study, Comparison)
 * 2. Skip deep-dive categories (Advanced patterns, Philosophical foundation)
 * 3. Within each category, select the oldest article (the canonical/foundational piece)
 * 4. Order by category importance
 * 5. Cap at 5 articles
 */
function generateHomepageArticlesList(articles) {
  // Category orders to include on homepage (core learning path)
  const HOMEPAGE_CATEGORY_ORDERS = [1, 2, 3, 4, 6]; // Foundation, Framework, Technical guide, Case study, Comparison
  const MAX_HOMEPAGE_ARTICLES = 5;

  // Group articles by category
  const byCategory = {};
  for (const article of articles) {
    const category = article.frontMatter.category || 'Other';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(article);
  }

  // For each category, sort by date ascending (oldest first) to get canonical article
  for (const category of Object.keys(byCategory)) {
    byCategory[category].sort((a, b) =>
      new Date(a.frontMatter.date) - new Date(b.frontMatter.date)
    );
  }

  // Select one article per core category, ordered by category importance
  const selected = [];
  for (const order of HOMEPAGE_CATEGORY_ORDERS) {
    // Find category with this order
    const categoryName = Object.keys(CATEGORIES).find(
      cat => CATEGORIES[cat].order === order
    );
    if (categoryName && byCategory[categoryName] && byCategory[categoryName].length > 0) {
      selected.push(byCategory[categoryName][0]); // oldest article in category
    }
  }

  // Cap at max articles
  const final = selected.slice(0, MAX_HOMEPAGE_ARTICLES);

  let html = '';
  for (const article of final) {
    html += `
                <li>
                    <a href="/articles/${article.frontMatter.slug}/" class="article-title">${article.frontMatter.title}</a>
                    <p class="article-description">${article.frontMatter.description || ''}</p>
                    <div class="article-meta">${formatDate(article.frontMatter.date)} · ${article.readingTime} min read</div>
                </li>`;
  }
  return html;
}

/**
 * Generate a tag page
 */
function generateTagPage(tag, articles, template) {
  let cardsHtml = '';
  for (const article of articles) {
    cardsHtml += generateArticleCard(article);
  }

  let html = template;
  html = html.replace(/\{\{tag_name\}\}/g, tag);
  html = html.replace(/\{\{tag_slug\}\}/g, slugify(tag));
  html = html.replace(/\{\{article_count\}\}/g, `${articles.length} article${articles.length !== 1 ? 's' : ''}`);
  html = html.replace(/\{\{articles_list\}\}/g, cardsHtml);

  return html;
}

/**
 * Validate article front matter
 * Supports both flat (slug.md) and hierarchical (index.md) structures
 */
function validateArticle(article, filePath) {
  const errors = [];
  const warnings = [];
  const { frontMatter } = article;

  if (!frontMatter.title) errors.push(`Missing required field: title`);
  if (!frontMatter.slug) errors.push(`Missing required field: slug`);
  if (!frontMatter.date) errors.push(`Missing required field: date`);
  if (!frontMatter.canonical_url) errors.push(`Missing required field: canonical_url`);

  // Check filename matches slug for flat structure (slug.md)
  // Skip check for hierarchical structure (index.md)
  const filename = path.basename(filePath, '.md');
  if (filename !== 'index' && frontMatter.slug && frontMatter.slug !== filename) {
    errors.push(`Slug "${frontMatter.slug}" does not match filename "${filename}"`);
  }

  return { errors, warnings };
}

/**
 * Ensure output directories exist
 */
function ensureDirectories() {
  const dirs = [
    OUTPUT_DIR,
    WORDPRESS_EXPORT_DIR,
    path.join(OUTPUT_DIR, 'category'),
    path.join(OUTPUT_DIR, 'tag')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Copy images directory if it exists
 */
function copyImages() {
  const sourceImagesDir = path.join(CONTENT_DIR, 'images');
  const destImagesDir = path.join(OUTPUT_DIR, 'images');

  if (fs.existsSync(sourceImagesDir)) {
    if (!fs.existsSync(destImagesDir)) {
      fs.mkdirSync(destImagesDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceImagesDir);
    for (const file of files) {
      const sourcePath = path.join(sourceImagesDir, file);
      const destPath = path.join(destImagesDir, file);
      fs.copyFileSync(sourcePath, destPath);
    }
    console.log(`📷 Copied ${files.length} images`);
  }
}


/**
 * Find all markdown files in both flat and hierarchical structures
 * 
 * Supports two content structures:
 * - Flat: content/articles/slug.md
 * - Hierarchical: content/posts/YYYY/MM/DD-slug/index.md
 *                 content/pages/slug/index.md
 * 
 * Returns array of { filePath, slug, type } objects
 */
function findContentFiles(contentDir) {
  const results = [];
  
  // Check for flat articles structure
  const flatArticlesDir = path.join(contentDir, 'articles');
  if (fs.existsSync(flatArticlesDir)) {
    const files = fs.readdirSync(flatArticlesDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      results.push({
        filePath: path.join(flatArticlesDir, file),
        slug: path.basename(file, '.md'),
        type: 'posts',
        contentDir: flatArticlesDir
      });
    }
  }
  
  // Check for hierarchical posts structure: content/posts/YYYY/MM/DD-slug/index.md
  const postsDir = path.join(contentDir, 'posts');
  if (fs.existsSync(postsDir)) {
    walkHierarchicalPosts(postsDir, results);
  }
  
  // Check for hierarchical pages structure: content/pages/slug/index.md
  const pagesDir = path.join(contentDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    walkHierarchicalPages(pagesDir, results);
  }
  
  return results;
}

/**
 * Walk hierarchical posts directory: posts/YYYY/MM/DD-slug/index.md
 */
function walkHierarchicalPosts(postsDir, results) {
  const years = fs.readdirSync(postsDir).filter(f => /^\d{4}$/.test(f));
  
  for (const year of years) {
    const yearDir = path.join(postsDir, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;
    
    const months = fs.readdirSync(yearDir).filter(f => /^\d{2}$/.test(f));
    
    for (const month of months) {
      const monthDir = path.join(yearDir, month);
      if (!fs.statSync(monthDir).isDirectory()) continue;
      
      const daySlugDirs = fs.readdirSync(monthDir).filter(f => /^\d{2}-/.test(f));
      
      for (const daySlugDir of daySlugDirs) {
        const articleDir = path.join(monthDir, daySlugDir);
        if (!fs.statSync(articleDir).isDirectory()) continue;
        
        const indexMd = path.join(articleDir, 'index.md');
        if (fs.existsSync(indexMd)) {
          // Extract slug from DD-slug format
          const slug = daySlugDir.substring(3); // Remove "DD-" prefix
          results.push({
            filePath: indexMd,
            slug: slug,
            type: 'posts',
            contentDir: articleDir
          });
        }
      }
    }
  }
}

/**
 * Walk hierarchical pages directory: pages/slug/index.md
 */
function walkHierarchicalPages(pagesDir, results, parentSlug = '') {
  const entries = fs.readdirSync(pagesDir);
  
  for (const entry of entries) {
    const entryPath = path.join(pagesDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    
    const indexMd = path.join(entryPath, 'index.md');
    const slug = parentSlug ? `${parentSlug}/${entry}` : entry;
    
    if (fs.existsSync(indexMd)) {
      results.push({
        filePath: indexMd,
        slug: slug,
        type: 'pages',
        contentDir: entryPath
      });
    }
    
    // Recursively check for nested pages
    walkHierarchicalPages(entryPath, results, slug);
  }
}

/**
 * Main build function
 */
function build() {
  console.log('🔨 Building Synthesis Coding site...\n');

  // Find content in both flat (articles/) and hierarchical (posts/, pages/) structures
  const contentFiles = findContentFiles(ROOT_DIR + '/content');

  if (contentFiles.length === 0) {
    console.log('📝 No markdown files found in content/articles/ or content/posts/');
    console.log('   Supported structures:');
    console.log('   - Flat: content/articles/slug.md');
    console.log('   - Hierarchical: content/posts/YYYY/MM/DD-slug/index.md');
    return;
  }

  console.log(`📄 Found ${contentFiles.length} article(s)\n`);

  ensureDirectories();

  // Read templates
  const articleTemplate = readTemplate('article.html');
  const listTemplate = readTemplate('article-list.html');

  // Check for category and tag templates, create defaults if missing
  let categoryTemplate, tagTemplate;
  try {
    categoryTemplate = readTemplate('category.html');
  } catch {
    console.log('  ⚠️  No category.html template, skipping category pages');
    categoryTemplate = null;
  }
  try {
    tagTemplate = readTemplate('tag.html');
  } catch {
    console.log('  ⚠️  No tag.html template, skipping tag pages');
    tagTemplate = null;
  }

  // Process each article
  const articles = [];
  let hasErrors = false;
  const stats = {
    categories: {},
    tags: {}
  };

  for (const contentFile of contentFiles) {
    const { filePath, slug: fileSlug, contentDir: articleContentDir } = contentFile;
    console.log(`  Processing: ${path.relative(ROOT_DIR, filePath)}`);

    try {
      const article = parseMarkdownFile(filePath);
      // Store the content directory for image copying
      article.contentDir = articleContentDir;
      const { errors, warnings } = validateArticle(article, filePath);

      if (errors.length > 0) {
        console.log(`    ❌ Validation errors:`);
        errors.forEach(e => console.log(`       - ${e}`));
        hasErrors = true;
        continue;
      }

      warnings.forEach(w => console.log(`    ⚠️  ${w}`));
      articles.push(article);

      // Collect stats
      const category = article.frontMatter.category || 'Other';
      stats.categories[category] = (stats.categories[category] || 0) + 1;

      for (const tag of (article.frontMatter.tags || [])) {
        stats.tags[tag] = (stats.tags[tag] || 0) + 1;
      }

      console.log(`    ✅ Generated: /articles/${article.frontMatter.slug}/ (${article.readingTime} min read)`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      hasErrors = true;
    }
  }

  if (articles.length > 0) {
    // Build canonical URL to slug map for internal link conversion
    const canonicalToSlugMap = buildCanonicalToSlugMap(articles);
    const internalLinkCount = Object.keys(canonicalToSlugMap).length / 3; // Divided by 3 since we store 3 variants per URL
    console.log(`\n  📎 Built internal link map: ${Math.round(internalLinkCount)} articles available for link conversion`);

    // Generate individual article pages
    for (const article of articles) {
      const articleHtml = generateArticleHtml(article, articleTemplate, articles, canonicalToSlugMap);
      const articleDir = path.join(OUTPUT_DIR, article.frontMatter.slug);
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }
      fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);

      // WordPress export
      const wordpressHtml = generateWordPressHtml(article);
      fs.writeFileSync(
        path.join(WORDPRESS_EXPORT_DIR, `${article.frontMatter.slug}.html`),
        wordpressHtml
      );
    }

    // Generate listing page
    const listingHtml = generateListingHtml(articles, listTemplate, stats);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), listingHtml);
    console.log(`\n  ✅ Generated: /articles/index.html`);

    // Generate RSS feed
    const rssFeed = generateRssFeed(articles);
    fs.writeFileSync(path.join(ROOT_DIR, 'feed.xml'), rssFeed);
    console.log(`  ✅ Generated: /feed.xml`);

    // Generate search index
    const searchIndex = generateSearchIndex(articles);
    fs.writeFileSync(path.join(ROOT_DIR, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
    console.log(`  ✅ Generated: /search-index.json`);

    // Generate category pages
    if (categoryTemplate) {
      for (const [category, count] of Object.entries(stats.categories)) {
        const categoryArticles = articles.filter(a => (a.frontMatter.category || 'Other') === category);
        const catInfo = CATEGORIES[category] || { slug: slugify(category) };
        const categoryDir = path.join(OUTPUT_DIR, 'category', catInfo.slug);

        if (!fs.existsSync(categoryDir)) {
          fs.mkdirSync(categoryDir, { recursive: true });
        }

        const categoryHtml = generateCategoryPage(category, categoryArticles, categoryTemplate);
        fs.writeFileSync(path.join(categoryDir, 'index.html'), categoryHtml);
      }
      console.log(`  ✅ Generated: ${Object.keys(stats.categories).length} category pages`);
    }

    // Generate tag pages
    if (tagTemplate) {
      for (const [tag, count] of Object.entries(stats.tags)) {
        const tagArticles = articles.filter(a => (a.frontMatter.tags || []).includes(tag));
        const tagDir = path.join(OUTPUT_DIR, 'tag', slugify(tag));

        if (!fs.existsSync(tagDir)) {
          fs.mkdirSync(tagDir, { recursive: true });
        }

        const tagHtml = generateTagPage(tag, tagArticles, tagTemplate);
        fs.writeFileSync(path.join(tagDir, 'index.html'), tagHtml);
      }
      console.log(`  ✅ Generated: ${Object.keys(stats.tags).length} tag pages`);
    }

    // Copy images
    copyImages();

    // Generate homepage from template
    const indexTemplatePath = path.join(TEMPLATES_DIR, 'index.html');
    const indexOutputPath = path.join(ROOT_DIR, 'index.html');
    if (fs.existsSync(indexTemplatePath)) {
      let indexHtml = fs.readFileSync(indexTemplatePath, 'utf-8');
      const homepageArticlesHtml = generateHomepageArticlesList(articles);
      indexHtml = indexHtml.replace(/\{\{homepage_articles_list\}\}/g, homepageArticlesHtml);
      fs.writeFileSync(indexOutputPath, indexHtml);
      console.log(`  ✅ Generated: /index.html (from template)`);
    }

    // Generate colophon page
    const colophonTemplatePath = path.join(TEMPLATES_DIR, 'colophon.html');
    const colophonDir = path.join(ROOT_DIR, 'colophon');
    if (fs.existsSync(colophonTemplatePath)) {
      if (!fs.existsSync(colophonDir)) {
        fs.mkdirSync(colophonDir, { recursive: true });
      }
      const colophonHtml = fs.readFileSync(colophonTemplatePath, 'utf-8');
      fs.writeFileSync(path.join(colophonDir, 'index.html'), colophonHtml);
      console.log(`  ✅ Generated: /colophon/`);
    }
  }

  console.log('\n' + (hasErrors ? '⚠️  Build completed with errors' : '✅ Build complete!'));
  console.log(`   Articles: ${articles.length}`);
  console.log(`   Categories: ${Object.keys(stats.categories).length}`);
  console.log(`   Tags: ${Object.keys(stats.tags).length}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   WordPress export: ${WORDPRESS_EXPORT_DIR}\n`);
}

// Run build
build();
