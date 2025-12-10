---
title: "Building ownwords: A Synthesis Coding Case Study"
slug: "building-ownwords-a-synthesis-coding-case-study"
date: "2025-12-07T11:47:14"
description: "What separates synthesis coding from vibe coding isn't the tools — it's the decisions. This technical case study walks through the architectural choices, implementation patterns, and verification strategies behind a real open-source project."
canonical_url: "https://rajiv.com/blog/2025/12/07/building-ownwords-a-synthesis-coding-case-study/"
categories:
  - "Technology"
tags:
  - "artificial intelligence"
  - "Claude Code"
  - "ctobook"
  - "programming"
  - "software engineering"
  - "synthesis coding"
  - "synthesis engineering"
  - "vibe coding"
  - "ownwords"
  - "open source"
author: "Rajiv Pant"
category: "Case study"
featured_image: "https://i0.wp.com/rajiv.com/wp-content/uploads/2025/11/Synthesis-Engineering-Logo-2-e1764033363626.webp?fit=800%2C400&ssl=1"
---

*What separates synthesis coding from vibe coding isn't the tools — it's the decisions. This technical case study walks through the architectural choices, implementation patterns, and verification strategies behind a real open-source project.*

I wrote this article for software engineers, architects, and technical leads who want to see synthesis coding applied to a complete project — not just isolated code snippets. If you've read my previous articles on [synthesis coding methodology](https://synthesiscoding.com/) or the [philosophical argument for why code still matters](https://rajiv.com/blog/2025/12/04/why-synthesis-coding-still-writes-code-in-the-age-of-llms/), this is the concrete evidence.

The project is [ownwords](https://github.com/rajivpant/ownwords), an open-source toolkit I built for authors who want to own their content. It handles bi-directional WordPress sync, local Markdown editing, batch AI-assisted editorial operations, and dual publishing to both WordPress and static sites.

What I'll show you isn't "look how much code AI can generate." It's the opposite: the decisions I made *before* and *during* AI-assisted implementation that produced a maintainable, secure, production-quality tool. These are the decisions that distinguish systematic engineering from prompt-and-hope.

## The Problem: Authors Don't Own Their Words

The motivation was personal. I write extensively — articles, documentation, technical content. That content lives in WordPress, but WordPress isn't designed for the workflows I actually use: local editing in Markdown, version control with Git, AI-assisted batch operations for terminology updates and link fixes, publishing to both WordPress and static sites.

I wanted a toolkit that would let me:

1. Fetch my existing WordPress articles as clean Markdown files
2. Edit locally using any tools I want
3. Make batch changes across all articles (terminology updates, link migrations, front matter modifications)
4. Publish back to WordPress and to static sites simultaneously
5. Verify that conversions preserved my content accurately

This isn't a weekend prototype. It's a tool I depend on for my own publishing workflow. That dependency shaped every architectural decision.

## What This Enables

Without tooling like ownwords, batch content operations on WordPress sites require days, weeks, or months of manual labor — and the process is stressful and error-prone. Here's what becomes practical:

**Content updates at scale.** When an author's bio changes, update hundreds of articles where that bio appears in the body content. When your organization rebrands a product name or updates style guide conventions, fix the terminology across your entire archive. When regulations change, update disclosures and disclaimers across all relevant content.

**SEO and link management.** Add cross-references between related articles for improved link authority. When content moves between domains or URL structures change, update canonical URLs and internal links. Find and repair broken links across your content library.

**Multi-platform publishing.** Maintain content on both WordPress and a static site simultaneously. Keep version-controlled Markdown files as the source of truth, with WordPress as one publishing target among several. Export content from WordPress to other CMS platforms or static site generators.

**AI-assisted editorial operations.** Use Claude, Cursor, or other AI assistants to make intelligent edits across your content library — with `dryRun` support to preview changes before applying them. Have AI enforce writing style, tone, or formatting conventions. Batch-add summaries, metadata, or structured data to existing articles.

These aren't hypothetical scenarios. They're the actual problems that motivated building ownwords — and the problems it now solves.

## Architectural Decisions Made Before Any Code

The first principle of synthesis coding is **Human Architectural Authority**. I don't ask AI what architecture to use. I decide, then direct AI to implement within those constraints.

Here are the decisions I made before writing a single line of code:

### Decision 1: Minimal Dependencies

Most Node.js projects accumulate dependencies casually. Need argument parsing? `npm install yargs`. Need HTTP? `npm install axios`. Need YAML? `npm install js-yaml`.

I decided ownwords would use only Node.js built-in modules for everything except HTML-to-Markdown conversion, where a specialized library (Turndown) genuinely adds value.

The result: **two npm dependencies**. Everything else — HTTP requests, YAML parsing, argument parsing, file operations — uses `fs`, `path`, `https`, `http`, `url`, `readline`, `child_process`, and `os`.

Why this decision matters:

- **Smaller attack surface.** Each dependency is a potential vulnerability vector. Fewer dependencies means fewer security advisories to track.
- **No version conflicts.** Complex dependency trees create upgrade friction. Flat dependencies don't.
- **Explicit control.** When I hand-write the YAML parser, I know exactly what it does. When I hand-write the argument parser, I control the behavior completely.
- **Demonstration of craft.** Anyone can `npm install` their way to a solution. Choosing *not* to shows intentionality.

This wasn't a constraint I discovered — it was a constraint I imposed. AI implemented within it.

### Decision 2: Independent Verification

Here's a decision that wouldn't occur to someone vibe coding: the verification module should use **different algorithms** than the conversion module.

The converter uses Turndown (a library) to transform HTML to Markdown. The verifier uses regex-based text extraction to check the result. If both used Turndown, bugs in Turndown would pass verification. By using orthogonal approaches, I catch converter bugs that the converter itself can't see.

This is how serious systems handle quality assurance. You don't verify a process using the same process. You verify it independently.

```
HTML Input → Turndown Library → Markdown Output
                                      ↓
                              Independent Regex-Based
                              Text Extraction & Comparison
                                      ↓
                              QA Report (pass/fail/warnings)
```

### Decision 3: Agent API for AI Assistants

I built ownwords to support my AI-assisted editorial workflow. That meant building an API specifically designed for AI assistants to perform batch operations safely.

The key insight: AI assistants need to preview changes before applying them. So every batch operation supports `dryRun: true`:

```javascript
// Preview what would change
const preview = agent.findAndReplace({
  pattern: /Claude AI/g,
  replacement: 'Claude',
  dryRun: true
});
console.log(`Would update ${preview.length} files`);

// Actually apply changes
agent.findAndReplace({
  pattern: /Claude AI/g,
  replacement: 'Claude'
});
```

This pattern — preview then apply — isn't something an AI would invent unprompted. It comes from understanding how AI assistants actually work: they make mistakes, and you need to catch those mistakes before they propagate across your entire content library.

### Decision 4: Dual-Mode Architecture

Not everyone has REST API access to their WordPress site. Some people scrape. Some people have admin credentials. I needed to support both.

The architecture handles this with two fetching modes:

- **HTML Scraping Mode**: Works for any public WordPress site. Extracts content from HTML, generates basic front matter.
- **REST API Mode**: For configured sites. Provides enriched metadata — categories with IDs, tags, author info, featured images, modification dates.

Plus JSON sidecar files that store the complete API response for future bi-directional sync capabilities.

This isn't over-engineering. It's anticipating how the tool will actually be used by different people with different access levels.

## Implementation: Directing AI Within Constraints

With architecture decided, implementation becomes a series of directed conversations. Here's how several key modules evolved.

### Robust HTML Content Extraction

WordPress themes vary wildly. Content might be in a `<div class="entry-content">`, an `<article>` tag, a `<main>` tag, or somewhere else entirely. Sharing widgets, related posts, and comment sections need to be stripped.

I directed the implementation with explicit requirements:

```
Implement HTML content extraction with these requirements:
1. Try entry-content div first (most WordPress themes)
2. Fall back to article tag
3. Fall back to main tag
4. Detect and strip sharing widgets (sharedaddy, Jetpack related posts)
5. Strip navigation, footer, comments
6. Preserve code blocks, images, and formatting
```

The result handles multiple theme patterns robustly:

```javascript
function extractArticleContent(html) {
  // Strategy 1: entry-content div (most common)
  let match = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (match) content = match[1];

  // Strategy 2: article tag
  if (!content) {
    match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (match) content = match[1];
  }

  // Strategy 3: main tag
  if (!content) {
    match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (match) content = match[1];
  }

  // Strip end markers (sharing widgets, related posts)
  const endMarkers = [
    /<div[^>]*class="[^"]*sharedaddy[^"]*"/i,
    /<div[^>]*class="[^"]*jp-relatedposts[^"]*"/i,
    /<footer[^>]*class="[^"]*entry-footer[^"]*"/i,
  ];

  for (const marker of endMarkers) {
    const markerMatch = content.match(marker);
    if (markerMatch) {
      content = content.substring(0, markerMatch.index);
    }
  }

  return content;
}
```

This isn't one prompt generating perfect code. It's iterative refinement: initial generation, testing against real WordPress sites, identifying edge cases, directing fixes, re-testing.

### Independent Verification System

The verification module demonstrates the independent-algorithms principle. Here's the text extraction that's deliberately different from the converter:

```javascript
function extractTextFromHtml(html) {
  let text = html;

  // Remove non-content sections
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

  // Extract from content containers
  const entryMatch = text.match(
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  if (entryMatch) text = entryMatch[1];

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
```

The verifier then runs multiple orthogonal checks:

```javascript
function verifyConversion(htmlPath, mdPath) {
  const issues = [];

  // Check 1: Word count within tolerance
  const htmlWords = countWords(extractTextFromHtml(html));
  const mdWords = countWords(extractTextFromMarkdown(md));
  const ratio = mdWords / htmlWords;
  if (ratio < 0.85) {
    issues.push({ type: 'error', message: `Word count dropped ${((1-ratio)*100).toFixed(1)}%` });
  }

  // Check 2: Heading preservation
  const htmlHeadings = (html.match(/<h[1-6][^>]*>/gi) || []).length;
  const mdHeadings = (md.match(/^#{1,6}\s/gm) || []).length;
  if (mdHeadings < htmlHeadings * 0.8) {
    issues.push({ type: 'warning', message: 'Headings may be missing' });
  }

  // Check 3: Link preservation
  const htmlLinks = extractUrls(html);
  const mdLinks = extractUrls(md);
  const missingLinks = htmlLinks.filter(url => !mdLinks.includes(url));
  if (missingLinks.length > 0) {
    issues.push({ type: 'warning', message: `Missing links: ${missingLinks.join(', ')}` });
  }

  // Check 4: Image preservation
  // Check 5: Code block preservation
  // Check 6: Front matter validation
  // ... additional checks

  return { passed: issues.filter(i => i.type === 'error').length === 0, issues };
}
```

Exit codes follow Unix conventions: 0 for success, 1 for errors, 2 for warnings only. This lets verification integrate into CI/CD pipelines.

### Secure Configuration Management

WordPress publishing requires credentials. Security can't be an afterthought.

Requirements I specified:

1. Config file stored in `~/.ownwords/` with restricted permissions
2. Config file readable only by owner (mode 600)
3. Config directory accessible only by owner (mode 700)
4. Environment variables override config file for CI/CD
5. Runtime permission checking with warnings

```javascript
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
}

function writeConfig(config) {
  const content = JSON.stringify(config, null, 2);
  fs.writeFileSync(CONFIG_FILE, content, { mode: 0o600 });
}

function checkConfigPermissions() {
  const stats = fs.statSync(CONFIG_FILE);
  const mode = stats.mode & 0o777;
  if (mode !== 0o600) {
    return {
      secure: false,
      message: `Config file has insecure permissions. Run: chmod 600 ${CONFIG_FILE}`
    };
  }
  return { secure: true };
}

function getWordPressSite(siteName) {
  // Environment variables take precedence (for CI/CD)
  const envSite = process.env.OWNWORDS_WP_SITE;
  const envUsername = process.env.OWNWORDS_WP_USERNAME;
  const envPassword = process.env.OWNWORDS_WP_PASSWORD;

  if (envSite && envUsername && envPassword) {
    return { url: envSite, username: envUsername, appPassword: envPassword };
  }

  // Fall back to config file
  const config = loadConfig();
  return config.sites?.[siteName];
}
```

This uses WordPress Application Passwords (not user passwords) following WordPress security best practices.

### Placeholder-Protected Markdown Export

When converting Markdown back to WordPress-ready HTML, code blocks need protection from formatting transformations. If a code block contains `**bold**`, that shouldn't become `<strong>bold</strong>`.

The solution: extract code blocks first, replace with placeholders, do formatting, restore code blocks.

~~~javascript
function markdownToHtml(markdown) {
  let html = markdown;
  const codeBlocks = [];

  // 1. Extract and protect code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({ lang, code: escapeHtml(code) });
    return placeholder;
  });

  // 2. Apply formatting transformations (safe - code is protected)
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 3. Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    const { lang, code } = codeBlocks[i];
    const replacement = `<pre><code class="language-${lang}">${code}</code></pre>`;
    html = html.replace(`__CODE_BLOCK_${i}__`, replacement);
  }

  return html;
}
~~~

This pattern prevents a class of nested-formatting bugs that would be hard to debug later.

## What AI Couldn't Have Done Alone

Let me be specific about the decisions that required human judgment — decisions that define synthesis coding.

**The independent verification architecture.** Why would an AI, unprompted, decide to verify conversions using deliberately different algorithms? It wouldn't. This comes from understanding how QA actually works: you verify using independent methods, not the same method twice.

**The Agent API `dryRun` pattern.** An AI could generate batch operations. It wouldn't anticipate that AI assistants performing those operations need preview capabilities to catch their own mistakes before propagating them.

**The minimal-dependency philosophy.** AI assistants default to suggesting npm packages for everything. Deciding *not* to use dependencies — and implementing alternatives using built-ins — required explicit human direction against AI's natural tendency.

**The dual-mode fetching architecture.** This anticipates different users with different access levels. Prompt-and-generate produces code that works for the prompter's situation. Synthesis coding produces code that works for multiple situations because humans think about deployment contexts.

**Security as constraint, not afterthought.** File permissions, Application Passwords, environment variable precedence for CI/CD — these aren't features an AI adds unprompted. They come from understanding how production systems actually get deployed and maintained.

**The JSON sidecar files for future sync.** ownwords doesn't yet do bi-directional sync. But the architecture anticipates it. The JSON sidecars store complete API responses so future versions can implement sync without re-fetching. This is designing for evolution, not just immediate function.

## The Compound Effect

After several months of using ownwords for my own publishing:

- **53 articles** managed as local Markdown files
- **Version-controlled** content with full Git history
- **Batch operations** for terminology updates across the entire library
- **Dual publishing** to both rajiv.com (WordPress) and synthesiscoding.com (static site)
- **Independent verification** catching conversion issues before they reach production

The time investment in architecture and verification has paid back many times over. When I update terminology across all articles, I'm confident the batch operation won't corrupt content. When I publish to WordPress, I'm confident the HTML is correct. When something does go wrong, I can debug it because I understand the system.

This is what synthesis coding produces: systems you can maintain, extend, and trust.

## The Distinction That Matters

I've described architectural decisions, implementation patterns, security considerations, and verification strategies. None of this is magic. All of it is craft.

The difference between synthesis coding and vibe coding isn't capability — both use the same AI tools. The difference is discipline:

- **Vibe coding** generates code until something works, then ships it.
- **Synthesis coding** establishes architecture, directs implementation within constraints, verifies independently, and maintains understanding throughout.

The output of vibe coding is code that runs. The output of synthesis coding is a system you can maintain.

ownwords is open source. You can read every line, trace every decision, use it for your own publishing workflow. The code is at [github.com/rajivpant/ownwords](https://github.com/rajivpant/ownwords).

What you'll find isn't AI-generated code. It's AI-assisted implementation of human-directed architecture — which is a very different thing.

---

*If you're interested in the philosophical argument for why code matters even as AI improves, see [Why Synthesis Coding Still Writes Code in the Age of LLMs](https://rajiv.com/blog/2025/12/04/why-synthesis-coding-still-writes-code-in-the-age-of-llms/). For organizational implementation of synthesis engineering, see [The Synthesis Engineering Framework](https://rajiv.com/blog/2025/11/09/the-synthesis-engineering-framework-how-organizations-build-production-software-with-ai/). For technical Claude Code workflows, see [Synthesis Coding with Claude Code](https://rajiv.com/blog/2025/11/09/synthesis-engineering-with-claude-code-technical-implementation-and-workflows/).*

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Condé Nast's brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "[synthesis coding](https://synthesiscoding.com/)" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
