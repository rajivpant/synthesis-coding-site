#!/usr/bin/env node

/**
 * Build script for Synthesis Coding site
 *
 * Converts markdown articles to HTML with:
 * - Canonical links pointing to rajiv.com
 * - Matching site styling
 * - WordPress-ready export for copy/paste publishing
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

// Configure marked for clean HTML output
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false
});

/**
 * Read and parse a markdown file with front matter
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content: markdown } = matter(content);
  const html = marked(markdown);
  return { frontMatter, markdown, html };
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
 * Generate HTML for tags display
 */
function generateTagsHtml(tags) {
  if (!tags || tags.length === 0) {
    return '';
  }
  const tagLinks = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  return tagLinks;
}

/**
 * Generate HTML for a single article
 */
function generateArticleHtml(article, template) {
  let html = template;

  // Replace template variables
  html = html.replace(/\{\{title\}\}/g, article.frontMatter.title);
  html = html.replace(/\{\{slug\}\}/g, article.frontMatter.slug);
  html = html.replace(/\{\{date\}\}/g, article.frontMatter.date);
  html = html.replace(/\{\{formatted_date\}\}/g, formatDate(article.frontMatter.date));
  html = html.replace(/\{\{description\}\}/g, article.frontMatter.description || '');
  html = html.replace(/\{\{canonical_url\}\}/g, article.frontMatter.canonical_url);
  html = html.replace(/\{\{category\}\}/g, article.frontMatter.category || '');
  html = html.replace(/\{\{tags\}\}/g, generateTagsHtml(article.frontMatter.tags));
  html = html.replace(/\{\{content\}\}/g, article.html);

  return html;
}

/**
 * Generate WordPress-ready HTML (just the article body)
 */
function generateWordPressHtml(article) {
  // Rewrite image URLs to absolute paths for WordPress
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
 * Generate the article listing page
 */
function generateListingHtml(articles, template) {
  // Sort articles by date (newest first) then by series_order within categories
  const sortedArticles = [...articles].sort((a, b) => {
    // First sort by category
    const catA = a.frontMatter.category || 'Other';
    const catB = b.frontMatter.category || 'Other';
    if (catA !== catB) {
      // Define category order
      const categoryOrder = ['Core Series', 'Case Study', 'Advanced Patterns', 'Comparison', 'Philosophical Foundation', 'Other'];
      return categoryOrder.indexOf(catA) - categoryOrder.indexOf(catB);
    }
    // Then by series_order if available
    const orderA = a.frontMatter.series_order || 999;
    const orderB = b.frontMatter.series_order || 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    // Finally by date (newest first)
    return new Date(b.frontMatter.date) - new Date(a.frontMatter.date);
  });

  // Generate article list HTML
  let articlesHtml = '';
  for (const article of sortedArticles) {
    articlesHtml += `
                <li>
                    <a href="/articles/${article.frontMatter.slug}/" class="article-title">${article.frontMatter.title}</a>
                    <p class="article-description">${article.frontMatter.description || ''}</p>
                    <div class="article-meta">${article.frontMatter.category || ''}</div>
                </li>`;
  }

  let html = template;
  html = html.replace(/\{\{articles_list\}\}/g, articlesHtml);

  return html;
}

/**
 * Check for sync warnings
 */
function checkSyncStatus(articles) {
  const warnings = [];

  for (const article of articles) {
    const { frontMatter } = article;
    if (frontMatter.updated && frontMatter.wordpress_synced) {
      const updated = new Date(frontMatter.updated);
      const synced = new Date(frontMatter.wordpress_synced);
      if (updated > synced) {
        warnings.push(
          `⚠️  ${frontMatter.slug}.md: updated ${frontMatter.updated}, WordPress synced ${frontMatter.wordpress_synced}`
        );
      }
    }
  }

  return warnings;
}

/**
 * Validate article front matter
 * Returns { errors: [], warnings: [] }
 */
function validateArticle(article, filePath) {
  const errors = [];
  const warnings = [];
  const { frontMatter } = article;

  if (!frontMatter.title) {
    errors.push(`Missing required field: title`);
  }
  if (!frontMatter.slug) {
    errors.push(`Missing required field: slug`);
  }
  if (!frontMatter.date) {
    errors.push(`Missing required field: date`);
  }
  if (!frontMatter.canonical_url) {
    errors.push(`Missing required field: canonical_url`);
  }

  // Validate slug matches filename
  const filename = path.basename(filePath, '.md');
  if (frontMatter.slug && frontMatter.slug !== filename) {
    errors.push(`Slug "${frontMatter.slug}" does not match filename "${filename}"`);
  }

  // Note: We intentionally allow different slugs between synthesiscoding.com and rajiv.com
  // The synthesiscoding.com slugs are shorter and cleaner, while WordPress uses longer descriptive slugs

  return { errors, warnings };
}

/**
 * Ensure output directories exist
 */
function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(WORDPRESS_EXPORT_DIR)) {
    fs.mkdirSync(WORDPRESS_EXPORT_DIR, { recursive: true });
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
 * Main build function
 */
function build() {
  console.log('🔨 Building Synthesis Coding site...\n');

  // Check if content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('📁 No content directory found. Creating empty structure...');
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log('✅ Created content/articles/ directory');
    console.log('   Add markdown files to start building.\n');
    return;
  }

  // Get all markdown files
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('📝 No markdown files found in content/articles/');
    console.log('   Add .md files to generate articles.\n');
    return;
  }

  console.log(`📄 Found ${files.length} article(s)\n`);

  // Ensure output directories exist
  ensureDirectories();

  // Read templates
  const articleTemplate = readTemplate('article.html');
  const listTemplate = readTemplate('article-list.html');

  // Process each article
  const articles = [];
  let hasErrors = false;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    console.log(`  Processing: ${file}`);

    try {
      const article = parseMarkdownFile(filePath);

      // Validate
      const { errors, warnings } = validateArticle(article, filePath);
      if (errors.length > 0) {
        console.log(`    ❌ Validation errors:`);
        errors.forEach(e => console.log(`       - ${e}`));
        hasErrors = true;
        continue;
      }
      if (warnings.length > 0) {
        warnings.forEach(w => console.log(`    ⚠️  ${w}`));
      }

      articles.push(article);

      // Generate article HTML
      const articleHtml = generateArticleHtml(article, articleTemplate);
      const articleDir = path.join(OUTPUT_DIR, article.frontMatter.slug);
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }
      fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);

      // Generate WordPress export
      const wordpressHtml = generateWordPressHtml(article);
      fs.writeFileSync(
        path.join(WORDPRESS_EXPORT_DIR, `${article.frontMatter.slug}.html`),
        wordpressHtml
      );

      console.log(`    ✅ Generated: /articles/${article.frontMatter.slug}/`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      hasErrors = true;
    }
  }

  if (articles.length > 0) {
    // Generate listing page
    const listingHtml = generateListingHtml(articles, listTemplate);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), listingHtml);
    console.log(`\n  ✅ Generated: /articles/index.html`);

    // Copy images
    copyImages();

    // Check sync status
    const warnings = checkSyncStatus(articles);
    if (warnings.length > 0) {
      console.log('\n📋 Sync warnings:');
      warnings.forEach(w => console.log(`   ${w}`));
    }
  }

  console.log('\n' + (hasErrors ? '⚠️  Build completed with errors' : '✅ Build complete!'));
  console.log(`   Articles: ${articles.length}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   WordPress export: ${WORDPRESS_EXPORT_DIR}\n`);
}

// Run build
build();
