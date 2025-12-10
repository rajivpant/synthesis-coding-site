---
title: "Synthesis Coding Best Practices: Lessons from Production Workflows"
slug: "synthesis-coding-best-practices-lessons-from-production-workflows"
date: "2025-12-08"
description: "A practical guide to CLAUDE.md configuration, defensive coding patterns, and workflow safeguards developed through real-world synthesis coding projects."
canonical_url: "https://rajiv.com/blog/2025/12/08/synthesis-coding-best-practices-lessons-from-production-workflows/"
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
  - "best practices"
author: "Rajiv Pant"
category: "Best practices"
featured_image: "https://i0.wp.com/rajiv.com/wp-content/uploads/2025/11/Synthesis-Engineering-Logo-2-e1764033363626.webp?fit=800%2C400&ssl=1"
status: draft
---

<!--
DRAFT STATUS: This is an outline and draft. Do not publish.
Last updated: 2025-12-09

=============================================================================
ARTICLE GOALS AND GUIDANCE (DO NOT DELETE - CONTEXT FOR AI ASSISTANTS)
=============================================================================

PURPOSE OF THIS ARTICLE:
This is a REFERENCE GUIDE for practitioners who already understand what synthesis
coding is (from the earlier articles in the series). It teaches them HOW to build
enterprise-grade software using synthesis coding.

The goal is to produce software that is: reliable, secure, robust, maintainable,
and production-ready. Every pattern in this article exists because its absence
caused a failure that made software NOT enterprise-grade.

WHAT THIS ARTICLE IS NOT:
- NOT an introduction to synthesis coding (that's Article 1)
- NOT a Claude Code tutorial (that's Article 3)
- NOT an organizational rollout guide (that's Article 2)
- NOT simplistic or high-level — the author was criticized for prior work being
  "too simplistic" and "not technical enough"

WHAT THIS ARTICLE MUST BE:
- COMPREHENSIVE — deep, technical, exhaustive coverage
- PRACTICAL — real code examples from ownwords (open source)
- HUMAN-CENTERED — the human's expertise, judgment, and discipline are central;
  tools like CLAUDE.md are just mechanisms the human uses
- REFERENCE-WORTHY — something practitioners bookmark and return to

THE COMPLETE PICTURE OF WHAT BUILDS ENTERPRISE-GRADE SOFTWARE:
1. Human judgment and expertise — knowing what enterprise-grade means, recognizing
   when something is wrong, making architectural decisions AI can't make
2. Prompting discipline — how you frame requests, set context, specify requirements,
   iterate on results
3. Review rigor — actually reading AI output, understanding it, catching errors
   before they propagate
4. Workflow design — dry-runs, verification steps, checklists, structure that
   catches mistakes
5. Defensive patterns in code — safeguards built into tools that prevent failure modes
6. CLAUDE.md configuration — persistent guidance that scales across sessions

CLAUDE.md is just ONE tool, not the center. The HUMAN is the center.

AUDIENCE:
Software engineers and engineering leaders building production systems who already
buy the synthesis coding concept and want the detailed "how" — the battle-tested
practices that turn principles into executable reality.

RELATIONSHIP TO OTHER ARTICLES:
- Article 1 (Foundation): WHY synthesis coding exists, how it differs from vibe coding
- Article 2 (Framework): Four Pillars, organizational implementation
- Article 3 (Technical Guide): Claude Code workflows, concrete examples
- Article 4 (Case Study): Blogroll Links modernization
- THIS ARTICLE (Best Practices): The reference guide — specific configurations,
  patterns, safeguards that make the difference

CRITICAL INSTRUCTION:
NEVER condense or simplify content. The author needs comprehensive, deep, technical
substance. Add depth, don't remove it. Every TODO section needs EXPANSION, not reduction.

=============================================================================

Recent additions (2025-12-09):
- "The Safe Defaults Principle" section - lessons from draft default disaster
- "Self-Sufficient Local Files" section - image downloading pattern with smart caching, deduplication, and sidecar tracking
- "The Draft Filtering Pattern" section - lessons from published draft disaster (this very article!)
- "The Data Contract Pattern" section - ensuring consistency across bidirectional operations
- "The Precedent Pattern" section - teaching AI to learn from existing code
- Reframed sections to focus on CLAUDE.md guidance over implementation details

Recent additions (2025-12-09, later):
- Originally included "Bidirectional Learning" and "Testing Patterns" sections (Parts 6-7)
- These were split into a separate article: "Bidirectional Learning in Synthesis Coding"
- This article now focuses on CLAUDE.md, defensive patterns, and workflow safeguards
-->

*The difference between AI-assisted coding that works once and AI-assisted coding that works reliably comes down to documented practices, defensive patterns, and systematic safeguards. This article presents the best practices I've developed through months of production synthesis coding work.*

## Introduction

Synthesis coding is not about maximizing AI autonomy. It's about building a reliable collaboration between human expertise and AI capabilities. The human's job is to architect this collaboration — to configure the AI's behavior through CLAUDE.md files, establish workflows that catch errors, and maintain the judgment to know when something looks wrong.

These practices emerged from building real production tools, not from theory. They've been refined through iteration: each pattern here exists because its absence caused a problem that cost time, created bugs, or required cleanup. The goal is predictability — knowing that when you ask the AI to do something, it will do it correctly, consistently, every time.

The core insight: AI coding assistants are excellent at implementing what you describe, but they optimize locally. They complete the immediate task without naturally considering how it interacts with other parts of your system, whether it matches existing patterns, or what happens in edge cases. Your job is to encode that broader context into CLAUDE.md files that persist across sessions and scale across projects.

This article covers three categories of best practices:
1. **CLAUDE.md architecture** — How to structure configuration files that guide AI behavior
2. **Defensive patterns** — Technical safeguards that prevent common failure modes
3. **Workflow safeguards** — Human-in-the-loop processes that catch mistakes before they propagate

For the companion topic of bidirectional learning — where both human and AI teach each other — see [Bidirectional Learning in Synthesis Coding](/blog/2025/12/09/bidirectional-learning-in-synthesis-coding/).

---

## Part One: The CLAUDE.md Architecture

The CLAUDE.md file is the foundational artifact of synthesis coding. It's how you transfer your architectural decisions, coding standards, and domain knowledge into a format that persists across sessions and scales across projects.

### The Two-Tier System: Global and Project-Level

**Global CLAUDE.md (`~/.claude/CLAUDE.md`)**

This file contains standards that apply to ALL your projects. It embeds your engineering philosophy into every AI session.

Key sections to include:

1. **Core Principle Statement**
   - Example: "Maximize value delivered to the user, not convenience for the AI."
   - This becomes the decision-making tiebreaker

2. **Quality Attributes (Non-Negotiable)**
   - Performant
   - Flexible
   - Feature-complete
   - Human-effort-saving
   - Secure
   - Convention-compliant (Jekyll, Hugo, npm patterns)
   - Extensible
   - Well-tested
   - Documented

3. **Prohibited Behaviors**
   - Never implement "Option B" when "Option A" was identified as superior
   - Never add flags as substitutes for proper implementation
   - Never implement collision detection when collision prevention is possible
   - Never defer important functionality to "future work" without explicit agreement
   - Never implement partial solutions when complete solutions are feasible

4. **Decision Framework**
   - Identify all options explicitly
   - Recommend the best option with rationale
   - Implement what you recommend (never recommend A, implement B)
   - If uncertain, ask rather than defaulting to simpler option

**Project-Level CLAUDE.md**

Each repository gets its own CLAUDE.md with project-specific context:

- Repository purpose and scope
- Repository ecosystem (related repos, their purposes, locations)
- Directory structure with explanations
- Build and deployment processes
- Integration points with other systems
- Project-specific conventions and patterns

### The "Recommend A, Implement A" Principle

[TODO: Expand this section]

One of the most important lessons: AI assistants will sometimes recommend the superior approach during discussion, then implement an inferior approach when it comes time to code. This happens because:

- The simpler implementation requires less context management
- The AI optimizes for completing the immediate task
- Edge cases seem distant during implementation

**Solution:** Explicit instructions in CLAUDE.md that state:

```markdown
### Decision Framework

When multiple approaches exist:

1. **Identify all options** — List them explicitly
2. **Recommend the best option** — Based on the quality attributes above
3. **Implement what you recommend** — Never recommend A and implement B
4. **If uncertain, ask** — Don't default to the simpler option
```

### The Additive Thinking Principle

[TODO: Expand this section]

Features are usually additive, not replacements. When implementing a "better" solution, the existing approach often serves a different valid use case.

**Bad pattern:**
- "I'll implement date-prefixes and remove the `--force` flag"

**Good pattern:**
- "Date-prefixes prevent accidental collisions; `--force` allows intentional overwrites. Both serve users."

This prevents the AI from subtracting functionality in the name of "simplification."

---

## Part Two: Defensive Coding Patterns

### Safe File Operations

[TODO: Expand with examples]

Shell commands like `sed`, `awk`, and heredocs are error-prone when AI generates them:

**Problems with shell-based file operations:**
- Patterns can match unintended locations (inside URLs, paths, code blocks)
- No context awareness (sed doesn't know YAML vs markdown)
- Escaping issues with special characters (backticks, dollar signs, quotes)
- Heredocs fail with JavaScript template literals and shell variables
- Silent failures that corrupt data

**Solution: Use Python for file manipulation**

```python
# For writing new files with complex content
content = 'const x = `value`;'
with open('file.js', 'w') as f:
    f.write(content)

# For find/replace with context awareness
import re
content = open('file.md').read()
# Only replace in specific context
content = re.sub(r'(specific-pattern)', r'replacement', content)
open('file.md', 'w').write(content)
```

**Rules to encode in CLAUDE.md:**
1. Use Python for ALL file writes involving complex content
2. Use Python for find/replace operations (allows precise targeting)
3. Never use heredocs (they fail with `${}`, backticks, etc.)
4. Always quote paths in shell commands
5. Verify before and after modifications
6. Prefer atomic operations (read, modify in memory, write back)

### Destructive Command Safeguards

This is perhaps the most critical defensive pattern. AI assistants can and do generate destructive commands that cause catastrophic data loss. This isn't theoretical — it happens in production.

**The Pattern That Destroys Systems**

Consider this sequence that appeared in a real incident:

```bash
rm -rf packages/
rm -f lerna.json
rm -f tsconfig.json eslint.config.js test-exports.mjs
rm -rf tests/ patches/ plan/ ~/
```

Notice the last command: `rm -rf ~/`. The AI was cleaning up project directories and included the home directory (`~/`) in the list. One misplaced path, and the entire home directory — documents, configurations, SSH keys, years of work — is gone.

**Why This Happens**

AI assistants pattern-match on the task at hand. When asked to "clean up unused files," they generate a list of things to delete. Without explicit constraints, that list can include:

- Paths outside the project directory
- Parent directories (`.`, `..`, `/`)
- Home directory shortcuts (`~`, `$HOME`)
- System directories (`/usr`, `/etc`, `/var`)
- Other users' directories

The AI isn't malicious — it's completing the pattern without understanding the catastrophic consequences of certain path expansions.

**CLAUDE.md Rules for Destructive Commands**

Add these explicit prohibitions to your global CLAUDE.md:

```markdown
### Destructive Command Safeguards

**NEVER run commands that could delete, modify, or overwrite files outside the current project directory without explicit user confirmation.**

Specifically, NEVER include these in `rm`, `mv`, or destructive commands:
- Home directory: `~`, `$HOME`, `/Users/*`, `/home/*`
- Root or parent paths: `/`, `.`, `..`
- System directories: `/usr`, `/etc`, `/var`, `/bin`, `/sbin`
- Glob patterns that could expand dangerously: `*`, `**`, `.*`

**Before any `rm -rf` command:**
1. List the exact paths that will be deleted
2. Verify each path is within the project directory
3. Use absolute paths, not relative paths with `..`
4. Prefer `rm -rf ./specific-directory/` over `rm -rf specific-directory/`

**Prefer safe alternatives:**
- Use `trash` or `trash-cli` instead of `rm` when available
- Move to a `.trash` directory instead of permanent deletion
- Use `git clean -fdx` for cleaning git repositories (respects .gitignore)
```

**Implementation Pattern: Path Validation**

When building tools that delete files, validate paths before execution:

```javascript
const path = require('path');

function isPathSafeToDelete(targetPath, projectRoot) {
  // Resolve to absolute path
  const absolute = path.resolve(targetPath);
  const root = path.resolve(projectRoot);

  // Must be within project root
  if (!absolute.startsWith(root + path.sep)) {
    return { safe: false, reason: `Path ${absolute} is outside project root ${root}` };
  }

  // Must not be the project root itself
  if (absolute === root) {
    return { safe: false, reason: 'Cannot delete project root' };
  }

  // Must not contain suspicious patterns
  const dangerous = ['node_modules', '.git', '.env', 'credentials'];
  for (const pattern of dangerous) {
    if (absolute.includes(pattern)) {
      return { safe: false, reason: `Path contains protected pattern: ${pattern}` };
    }
  }

  return { safe: true };
}

// Usage
function safeDelete(targetPath, projectRoot) {
  const check = isPathSafeToDelete(targetPath, projectRoot);
  if (!check.safe) {
    console.error(`BLOCKED: ${check.reason}`);
    return false;
  }
  // Proceed with deletion
}
```

**The "Blast Radius" Principle**

Every destructive command has a blast radius — the maximum damage it could cause if something goes wrong. Synthesis coding minimizes blast radius:

| Command | Blast Radius | Safer Alternative |
|---------|--------------|-------------------|
| `rm -rf ~/` | Entire home directory | Never allow |
| `rm -rf .` | Current directory tree | `rm -rf ./specific-dir/` |
| `rm -rf *` | Everything in current directory | `rm -rf ./specific-files` |
| `git clean -fdx` | All untracked files | `git clean -fdx --dry-run` first |
| `DROP DATABASE` | Entire database | Require explicit database name |

**The Confirmation Pattern**

For any operation that could cause data loss, require explicit confirmation with a preview:

```javascript
async function deleteWithConfirmation(paths, options = {}) {
  console.log('\n⚠️  The following paths will be PERMANENTLY DELETED:\n');
  for (const p of paths) {
    const stats = fs.statSync(p);
    const type = stats.isDirectory() ? 'directory' : 'file';
    console.log(`  ${type}: ${p}`);
  }

  if (!options.yes) {
    const answer = await prompt('\nType "DELETE" to confirm: ');
    if (answer !== 'DELETE') {
      console.log('Aborted.');
      return false;
    }
  }

  // Proceed with deletion
  for (const p of paths) {
    fs.rmSync(p, { recursive: true });
    console.log(`  Deleted: ${p}`);
  }
  return true;
}
```

**Recovery: When Prevention Fails**

Despite safeguards, mistakes happen. Maintain recovery capability:

1. **Time Machine / Backups**: Ensure automated backups are running
2. **Git**: Commit frequently — `git reflog` can recover "lost" commits
3. **Trash over Delete**: Configure `rm` alias to use trash when possible
4. **Cloud Sync**: Dropbox, iCloud, etc. often have version history

The goal is defense in depth: multiple layers so that no single failure causes permanent damage.

### Path Handling: The Silent Disaster

Hardcoded paths are one of the most insidious problems in AI-assisted development. They appear to work, pass testing, and then fail catastrophically in production or on different machines.

**The Problem**

AI assistants naturally use whatever path format they see in context. If you're working on `/Users/rajiv/projects/`, the AI will generate paths like:

```bash
--output-dir=/Users/rajiv/projects/my-projects/site-name/content
```

This breaks when:
- You work on a different machine (username `rajivpant` instead of `rajiv`)
- Another developer uses the tool
- The code is open source and used by strangers
- The project moves to a different directory

**The Tilde Trap**

You might think `~` solves this, but it introduces a different problem:

```bash
# This creates a LITERAL directory called "~" in the current directory!
node tool.js --output-dir=~/projects/site/content
```

The shell expands `~` in direct commands, but NOT when it's passed as an argument to a program. The program receives the literal string `~/projects/...` and creates a directory named `~`.

**CLAUDE.md Rules for Paths**

```markdown
### Path Handling Rules

1. **Never hardcode absolute paths** — they vary by user, machine, and OS
2. **Never use `~` in command arguments** — shells don't expand it in all contexts
3. **Use `$HOME` for shell commands** that need the home directory
4. **Use relative paths** where possible (relative to project root)
5. **For documentation**, use `~` as a placeholder but note it varies by machine

Example of WRONG path in documentation:
```
/Users/rajiv/projects/my-projects/site-name/content
```

Example of CORRECT path in documentation:
```
~/projects/my-projects/site-name/content
Note: Home directory varies by machine
```

Example of CORRECT path in shell commands:
```bash
--output-dir="$HOME/projects/my-projects/site-name/content"
# Or better: use relative path
--output-dir=./content
```
```

**Real-World Impact**

In a real incident, hardcoded paths in a CLAUDE.md file meant:
- The documented commands only worked on one machine
- Other users couldn't use the instructions at all
- The same developer couldn't use them on their second computer
- The open source project's documentation was useless to contributors

The fix required going through multiple CLAUDE.md files across multiple repositories to remove all hardcoded paths — time that could have been spent on actual development.

### Convention Compliance Over Custom Solutions

AI assistants often invent custom solutions when established conventions exist. The CLAUDE.md should explicitly list conventions to follow:

**Examples:**
- File naming: Jekyll's `YYYY-MM-DD-slug.md` pattern
- Configuration files: `.ownwordsrc` following npm/eslint conventions
- Directory structure: Hierarchical `YYYY/MM/DD-slug/` for content with assets
- Sidecar files: `index.images.json` alongside `index.md` for metadata

**Why this matters:**
- Conventions encode accumulated wisdom from mature ecosystems
- Other tools expect these patterns
- Future developers (human or AI) will understand conventional structures
- Debugging is easier when patterns are familiar

### The "Safe Defaults" Principle

Default behaviors should match user expectations for the common case. Getting defaults wrong can cause widespread damage before anyone notices.

**Real-World Example: The Draft Default Disaster**

A content publishing tool defaulted to `status: draft` when publishing to WordPress. This seemed "safe" — better to create a draft than accidentally publish something, right?

Wrong. Here's what happened:

1. User fetches existing published article to make edits locally
2. User makes edits and publishes back to WordPress
3. Tool creates draft (because that's the default)
4. WordPress automatically unpublishes the live article
5. User doesn't notice until readers report broken links
6. Multiple articles unpublished before the pattern was recognized

**The Lesson**

The "safe" default wasn't safe at all. The common workflow is:
- Fetch published article → edit → publish back

In this workflow, the user expects the article to remain published. Defaulting to `draft` breaks this expectation silently.

**The Fix**

```javascript
// Default to 'publish' - matches user intent for the common case
const status = options.status || 'publish';
```

**CLAUDE.md Guidance for Defaults**

```markdown
### Default Behavior Principle

Defaults should match user expectations for the COMMON case, not the edge case.

Ask: "What does a user doing the normal workflow expect to happen?"

- If users normally want published content to stay published: default to 'publish'
- If users normally want to update existing resources: auto-detect and update
- If users normally want local files to be self-sufficient: download assets by default

The "safer" choice isn't always safer. A default that causes silent failures in the common case is more dangerous than one that causes obvious failures in edge cases.
```

### Self-Sufficient Local Files: The Asset Download Pattern

When fetching content from remote systems, local files should be self-sufficient — they should work without network access and without depending on the remote system. This is a principle that must be documented in CLAUDE.md, because AI assistants naturally take shortcuts.

**The Problem**

Without explicit guidance, AI-generated fetch tools often take the easy path:

```markdown
![Photo](https://cdn.example.com/uploads/photo.jpg?resize=800x600)
```

This creates problems:
- Local preview requires network access
- If the CDN changes URLs, local files break
- You don't truly "own" your content — you depend on the remote host
- Testing is unreliable (works online, fails offline)

**The CLAUDE.md Solution**

Document the self-sufficiency requirement explicitly:

```markdown
### Local File Self-Sufficiency

When building tools that fetch remote content:

1. **Download ALL assets locally** — images, PDFs, any referenced files
2. **Rewrite URLs to local paths** — `./image.png` not `https://cdn.example.com/...`
3. **Include front matter assets** — `featured_image` must also be rewritten
4. **Track mappings in sidecar files** — enables bidirectional sync

The goal: A fetched article should render correctly with NO network access.
```

**Implementation: Smart Caching**

Don't re-download unchanged files. Compare local file size with remote Content-Length:

```javascript
async function downloadIfNeeded(url, localPath) {
  if (fs.existsSync(localPath)) {
    // Compare local file size with remote Content-Length
    const localSize = fs.statSync(localPath).size;
    const remoteHeaders = await getRemoteHeaders(url);

    if (remoteHeaders.contentLength === localSize) {
      console.log(`Unchanged: ${localPath}`);
      return { skipped: true };
    }
  }

  // Download the file
  return downloadFile(url, localPath);
}
```

**Implementation: Size Deduplication**

WordPress and Jetpack CDN serve the same image at multiple sizes via query parameters:

```
image.jpg?resize=1024x1024
image.jpg?resize=300x300
image.jpg?w=800
image.jpg?fit=600x400
```

These are all the same image at different sizes. Download only the highest quality version:

```javascript
function deduplicateImageUrls(urls) {
  // Group URLs by base path (without query params)
  const groups = {};
  for (const url of urls) {
    const baseKey = getBaseUrl(url); // Strip query params
    if (!groups[baseKey]) groups[baseKey] = [];
    groups[baseKey].push(url);
  }

  // For each group, pick highest quality version
  return Object.values(groups).map(variants => {
    return variants.reduce((best, url) => {
      return getQualityScore(url) > getQualityScore(best) ? url : best;
    });
  });
}

function getQualityScore(url) {
  // Parse size from query params
  const match = url.match(/[?&](resize|fit)=(\d+)[x%2C](\d+)/i);
  if (match) return parseInt(match[2]) * parseInt(match[3]);

  // No size info = probably original (highest quality)
  return Number.MAX_SAFE_INTEGER;
}
```

**Implementation: URL Rewriting**

When rewriting URLs in content, match by base path so ALL size variants get replaced:

```javascript
function rewriteImageUrls(markdown, urlToLocalMap) {
  // Build map of base paths to local files
  const baseToLocal = {};
  for (const [originalUrl, localFile] of Object.entries(urlToLocalMap)) {
    baseToLocal[getBaseUrl(originalUrl)] = localFile;
  }

  // Replace URLs by matching base path
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const baseUrl = getBaseUrl(url);
    if (baseToLocal[baseUrl]) {
      return `![${alt}](./${baseToLocal[baseUrl]})`;
    }
    return match;
  });
}
```

**Don't Forget Front Matter**

The `featured_image` in front matter also needs rewriting:

```yaml
# Before
featured_image: "https://cdn.example.com/uploads/hero.jpg?fit=1200x630"

# After
featured_image: "./hero.jpg"
```

**The Complete Pattern**

Here's how these pieces fit together:

```javascript
async function fetchWithImages(articleUrl, outputDir) {
  // 1. Fetch article content
  const { content, metadata } = await fetchArticle(articleUrl);

  // 2. Extract image URLs from content
  const imageUrls = extractImageUrls(content);

  // 3. Deduplicate (pick highest quality versions)
  const uniqueUrls = deduplicateImageUrls(imageUrls);

  // 4. Download images (with smart caching)
  const urlToLocal = {};
  for (const url of uniqueUrls) {
    const filename = urlToFilename(url);
    const result = await downloadIfNeeded(url, path.join(outputDir, filename));
    urlToLocal[url] = filename;
  }

  // 5. Rewrite URLs in content
  const rewrittenContent = rewriteImageUrls(content, urlToLocal);

  // 6. Rewrite URLs in front matter (featured_image, etc.)
  const rewrittenMetadata = rewriteImageUrls(metadata, urlToLocal);

  // 7. Save sidecar tracking file
  saveSidecar(outputDir, urlToLocal);

  // 8. Save article with local image paths
  saveArticle(outputDir, rewrittenContent, rewrittenMetadata);
}
```

**CLAUDE.md Guidance for This Pattern**

Document these requirements so AI implementations handle the edge cases:

```markdown
### Asset Download Implementation Notes

**CDN Size Variants**: WordPress/Jetpack serve the same image at multiple sizes:
- `image.jpg?resize=1024x1024`
- `image.jpg?resize=300x300`
- `image.jpg?w=800`

These are the SAME image. Download only the highest quality version.
Match ALL variants when rewriting URLs in content.

**Smart Caching**: Don't re-download unchanged files.
Compare local file size with remote Content-Length header.

**Front Matter**: The `featured_image` field also needs URL rewriting.
Don't forget it just because it's in YAML, not markdown body.
```

**Why This Matters for Synthesis Coding**

This pattern illustrates a key synthesis coding principle: **document the non-obvious requirements**. An AI will build a working fetch command without these instructions — it will fetch the article text correctly. But "working" isn't the same as "correct." The self-sufficiency requirement must be explicit because it's not obvious from a simple "fetch this article" request.

With this pattern:
- Local files are completely self-sufficient
- Local preview works offline
- You truly own your content (images and all)
- Publishing back uses the sidecar to avoid re-uploading
- Future migrations are possible because you have all assets locally

**Implementation Reference**

The [ownwords](https://github.com/rajivpant/ownwords) toolkit implements this complete pattern. See `lib/fetch-api.js` for the production implementation.

### The Data Contract Pattern for Bidirectional Operations

When building tools with multiple commands that share state (like `fetch` and `publish`), the data format must be consistent across all operations. AI assistants often implement each command in isolation, creating incompatible formats that cause subtle bugs.

**The Problem**

Consider a content sync tool with two commands:
- `fetch` - downloads content and assets from a remote system
- `publish` - uploads local content and assets back to the remote system

Each command needs to track which assets have been synced. Without explicit guidance, the AI might implement:

**Fetch creates:**
```json
{
  "images": [
    { "originalUrl": "https://...", "localFile": "image.png" }
  ]
}
```

**Publish expects:**
```json
{
  "uploaded": {
    "./image.png": { "url": "https://...", "hash": "abc123" }
  }
}
```

These formats are incompatible. Fetch tracks by URL, publish looks up by local path. The result: publish doesn't recognize that images were already fetched, and re-uploads them as duplicates.

**The CLAUDE.md Solution: Document the Contract**

Add explicit data contract documentation to your project's CLAUDE.md:

```markdown
### Sidecar Format Contract

The `index.images.json` sidecar file is used by BOTH fetch and publish.
It MUST use this exact format:

```json
{
  "site": "https://example.com",
  "lastUpdated": "ISO-8601 timestamp",
  "uploaded": {
    "./local-filename.png": {
      "url": "https://example.com/wp-content/uploads/.../filename.png",
      "hash": "md5-hash-of-local-file",
      "uploadedAt": "ISO-8601 timestamp"
    }
  }
}
```

**Required fields:**
- `site` - Used to verify the sidecar matches the target site
- `uploaded` - Keyed by LOCAL path (e.g., `./image.png`)
- `url` - The remote URL to reuse (prevents re-upload)
- `hash` - MD5 hash for change detection

**Contract rules:**
1. Fetch MUST write this format (not a different "download" format)
2. Publish MUST read this format to check for existing uploads
3. Both commands MUST use the same key format (`./filename.png`)
```

**Why This Pattern Matters for Synthesis Coding**

AI assistants optimize locally — they implement each function to work correctly in isolation. They don't naturally consider how different parts of a system interact. The data contract pattern forces consistency by:

1. **Making the contract explicit** — It's in CLAUDE.md, not implicit in code
2. **Showing the exact format** — No ambiguity about field names or structure
3. **Explaining the "why"** — The AI understands the consequence of deviation
4. **Covering both directions** — Fetch and publish are documented together

**Implementation Example**

Here's how the [ownwords](https://github.com/rajivpant/ownwords) toolkit implements this pattern. The `saveImagesSidecar` function creates the format that `publish` will later read:

```javascript
function saveImagesSidecar(mdPath, urlToLocal, results, siteUrl, contentDir) {
  // Build the "uploaded" object in the format that publish expects
  const uploaded = {};

  for (const [originalUrl, filename] of Object.entries(urlToLocal)) {
    const localPath = `./${filename}`;
    const absolutePath = path.join(contentDir, filename);

    // Compute hash for change detection
    let hash = null;
    if (fs.existsSync(absolutePath)) {
      const content = fs.readFileSync(absolutePath);
      hash = crypto.createHash('md5').update(content).digest('hex');
    }

    uploaded[localPath] = {
      url: normalizeWordPressImageUrl(originalUrl, siteUrl),
      hash: hash,
      uploadedAt: new Date().toISOString()
    };
  }

  const sidecar = {
    site: siteUrl,
    lastUpdated: new Date().toISOString(),
    uploaded: uploaded
  };

  fs.writeFileSync(sidecarPath, JSON.stringify(sidecar, null, 2));
}
```

The key insight: fetch writes in the exact format publish reads. No translation layer, no format conversion, no opportunity for mismatch.

### The Precedent Pattern: Teaching AI to Learn from Existing Code

One of the most powerful synthesis coding techniques is teaching AI to find and follow precedents in your existing codebase before implementing new features.

**The Problem**

When asked to implement something new, AI assistants often start from first principles. They generate reasonable-looking code that doesn't match your existing patterns, conventions, or style. This creates inconsistency across your codebase.

**The Solution: Explicit Precedent Instructions**

Add this to your CLAUDE.md:

```markdown
### Before Implementing New Features

1. **Search for similar patterns** in the existing codebase
2. **Read how existing code handles** the same or similar cases
3. **Match the existing style** — don't introduce new patterns unnecessarily
4. **If no precedent exists**, ask before choosing an approach

Example: Before implementing a new image format in markdown, check how existing
images are formatted in other articles in this repository.
```

**Real-World Application**

Consider adding images to a markdown article. Without precedent guidance, the AI might generate:

```markdown
[![](./image.png)](./image.png)*Caption text*
```

But if existing articles in the same repository use:

```markdown
![Alt text describing the image](./image.png "Caption text")
```

The AI should match the existing pattern. The precedent instruction ensures it checks first.

**CLAUDE.md Implementation**

```markdown
### Content Formatting Precedents

Before writing or modifying content:

1. **Check existing files** in the same directory for formatting patterns
2. **Match image syntax** — This repository uses:
   ```markdown
   ![Descriptive alt text](./image.png "Caption or title")
   ```
   NOT the linked-image pattern: `[![](url)](url)*caption*`

3. **Match heading styles** — Check whether existing files use ATX (`#`) or
   Setext (underline) headings

4. **Match front matter fields** — Copy the structure from a similar existing file
```

**Why This Works**

The precedent pattern leverages the AI's strength (reading and pattern matching) while compensating for its weakness (not automatically checking existing code). By making "check first" an explicit instruction, you get consistency without having to specify every detail.

---

## Part Three: Workflow Safeguards

### The "Check Before Acting" Pattern

One of the most damaging AI behaviors is taking action based on assumptions instead of verification. This single pattern, consistently applied, would prevent the majority of AI-assisted development mistakes.

**The Pattern**

Before any operation that creates, modifies, or deletes files:

1. **Check existing state** — What's already there?
2. **Verify assumptions** — Does reality match expectations?
3. **Confirm with user** — Is this the intended action?
4. **Then act** — Only after verification

**Example: Fetching to a Target Directory**

```bash
# WRONG: Assume and act
node tool.js fetch https://example.com/article/ --output-dir=./content

# RIGHT: Check, then act
# Step 1: Check existing structure
find ./content -name "*.md" | head -5
# content/posts/2025/12/07-existing-article/index.md

# Step 2: Verify assumption
# The site uses hierarchical structure: YYYY/MM/DD-slug/index.md

# Step 3: Confirm with user
# "This site uses hierarchical structure. Should I use --hierarchical flag?"

# Step 4: Act with correct flags
node tool.js fetch https://example.com/article/ --output-dir=./content --hierarchical
```

**CLAUDE.md Implementation**

```markdown
### Before Any File Operation

1. **Check existing structure:**
   ```bash
   find <target>/content -name "*.md" | head -5
   ```

2. **Read target's CLAUDE.md** if it exists

3. **If structure is unclear, ASK** before proceeding

4. **Never assume** — verification takes seconds, mistakes take hours to fix
```

**Why This Matters**

In a real incident, an AI:
1. Was asked to fetch an article to a site
2. Assumed the target structure (flat files)
3. Created files in the wrong format (should have been hierarchical)
4. Created a literal `~` directory (tilde wasn't expanded)
5. Required manual cleanup across multiple files

Every one of these mistakes would have been prevented by checking first:
- Check existing files → reveals hierarchical structure
- Check if `~` directory exists → reveals the path problem immediately
- Ask user to confirm → catches wrong assumptions

**The 10-Second Rule**

If checking would take less than 10 seconds, always check. The cost of verification is trivial. The cost of mistakes is substantial.

### The Dry-Run Pattern

Every destructive or publishing operation should support preview mode:

```bash
# Preview what would happen
ownwords publish ./content/article.md --dryrun

# Verify the dry-run output shows expected behavior:
# - "UPDATE existing post" (not "CREATE new post")
# - "Would upload: 0" for images (if already uploaded)
# - Correct identifiers match front matter

# Then execute
ownwords publish ./content/article.md
```

**Key insight:** AI assistants make mistakes. The dry-run pattern catches those mistakes before they propagate to production.

**The Human's Critical Role: Actually Reading the Output**

Here's an uncomfortable truth: dry-run only works if someone reads the output carefully. Consider this dry-run output:

```
🖼️  Image Plan:
   Total images in post: 2
   Already uploaded (in sidecar): 0
   Would upload: 2
```

The dry-run is warning you: "I'm about to upload 2 images." If those images already exist on the server, this will create duplicates. The safeguard worked — it showed you exactly what would happen. But if you glance at the output and proceed anyway, the safeguard is worthless.

**CLAUDE.md Guidance for Dry-Run Discipline**

Document what to look for in dry-run output:

```markdown
### Pre-Publish Dry-Run Checklist

Before proceeding from dry-run to actual execution, verify:

1. **Action type is correct**
   - "UPDATE existing" for edits to published content
   - "CREATE new" only for genuinely new content
   - If you see CREATE for existing content, STOP — something is wrong

2. **Asset upload count is expected**
   - "Would upload: 0" for content with no new images
   - If images exist on server but dry-run shows uploads, the sidecar is missing data
   - Uploading existing images creates duplicates in the media library

3. **Identifiers match**
   - Post ID matches front matter
   - Category/tag IDs are present and correct

**If anything looks wrong, investigate before proceeding.**
The dry-run exists to give you a chance to stop. Use it.
```

**Why This Matters**

The synthesis coding workflow is: AI proposes → Human reviews → AI executes. The dry-run is the human review step for destructive operations. If you skip the review, you've collapsed back to "AI executes autonomously" — and that's when things break.

### The Pre-Publish Checklist Pattern

[TODO: Expand this section]

Document explicit checklists in CLAUDE.md for critical operations:

```markdown
### Pre-Publish Checklist

Before publishing any changes:

1. **Verify you're updating, not creating**
   - Check front matter has required identifiers
   - Dry-run should show "UPDATE", not "CREATE"

2. **Verify assets won't be duplicated**
   - Check sidecar files exist with asset URLs
   - Dry-run should show "Would upload: 0" (unless new assets added)

3. **Preview locally first**
   - Run build
   - Check output looks correct
   - Verify assets render properly

4. **Don't rush**
   - Review dry-run output carefully
   - If anything looks wrong, investigate before publishing
```

### The Safeguard Implementation Pattern

[TODO: Expand this section]

When building tools, implement safeguards that prevent common failure modes:

**Example: Preventing duplicate resource creation**

```javascript
// Auto-detect existing resources from metadata
if (metadata.resource_id) {
  console.log(`SAFEGUARD: Found existing resource_id: ${metadata.resource_id}`);
  console.log(`Automatically enabling update mode to prevent duplicate creation.`);
  options.update = true;
}

// Require explicit confirmation for destructive operations
if (!options.update && !options.yes) {
  const answer = await prompt('This will CREATE a new resource. Continue? (y/N) ');
  if (answer.toLowerCase() !== 'y') {
    console.log('Aborted.');
    process.exit(0);
  }
}
```

**Key safeguards to implement:**
1. Auto-detect existing resources and switch to update mode
2. Require confirmation for resource creation
3. Track uploaded assets in sidecar files to prevent re-upload
4. Enhanced dry-run output that shows exactly what would change
5. Clear messaging about what mode the tool is operating in

### The Draft Filtering Pattern

Build systems must explicitly filter draft content. Having `status: draft` in front matter is meaningless if the build system ignores it.

**Real-World Example: The Published Draft Disaster**

A build system generated HTML for all markdown files in a content directory. One file had `status: draft` in its front matter — it was an incomplete article with TODO placeholders and work-in-progress sections.

Here's what happened:

1. Author runs `npm run build` to update other articles
2. Build system generates HTML for ALL articles, including the draft
3. Author commits changes (didn't notice the draft was included)
4. Cloudflare Pages auto-deploys from git push
5. Draft article goes live with incomplete content and TODO placeholders
6. Users discover it before the author notices

**The Root Cause**

The build system didn't check for draft status:

```javascript
// WRONG: Process all articles
for (const article of allArticles) {
  generateHtml(article);
}
```

**The Fix**

Explicitly filter drafts before processing:

```javascript
// RIGHT: Skip draft articles
for (const article of allArticles) {
  if (article.frontMatter.status === 'draft') {
    console.log(`  ⏸️  Skipping draft: ${article.slug}`);
    continue;
  }
  generateHtml(article);
}
```

**Why This Matters**

The `status: draft` field only works if every part of the pipeline respects it:

1. **Build system** — Must skip drafts when generating output
2. **RSS generator** — Must exclude drafts from feeds
3. **Search index** — Must not index draft content
4. **Sitemap** — Must not include draft URLs

If any one of these ignores the draft status, the content can leak to production.

**CLAUDE.md Guidance**

```markdown
### Draft Content Handling

Before adding a `status` field to any content system:

1. **Verify the build system respects it** — Test with a draft file
2. **Check all output generators** — RSS, sitemap, search index, etc.
3. **Test the full deploy pipeline** — Local build → commit → deploy

A status field that isn't enforced is worse than no status field at all — it creates false confidence.
```

**The Defense-in-Depth Approach**

For critical systems, use multiple layers:

1. **Front matter field**: `status: draft`
2. **Build-time filtering**: Skip files with draft status
3. **Commit hook**: Warn if draft files are being committed
4. **CI check**: Block deploy if draft content is detected

Any single layer might fail. Multiple layers catch mistakes.

---

## Part Four: Multi-Repository Coordination

### The Many-to-Many Publishing Model

Modern content workflows often involve publishing the same content to multiple destinations, or managing multiple content sources in different local repositories. This creates a many-to-many relationship that AI assistants consistently get wrong.

**The Problem**

AI assistants assume a simple mapping: one URL = one local folder. They see an article at `https://example.com/article/` and assume it goes in the `example-site/` folder.

But real workflows are more complex:
- An article on `rajiv.com` might ALSO be published to `synthesiscoding.com`
- The local folder isn't determined by where the article lives, but by WHERE ELSE it will be published
- The same WordPress site might have articles managed in different local repositories based on topic

**Example: Dual-Publishing Workflow**

```
synthesis-coding-site/          # Articles dual-published to:
├── content/posts/              #   - rajiv.com (WordPress)
│   └── 2025/12/07-article/     #   - synthesiscoding.com (Cloudflare)
│       └── index.md

rajiv-site/                     # Articles published ONLY to:
├── content/posts/              #   - rajiv.com (WordPress)
│   └── 2025/12/07-other/       #   NOT dual-published elsewhere
│       └── index.md
```

Both repositories contain articles that appear on `rajiv.com`. But:
- `synthesis-coding-site/` manages articles about Synthesis Coding → dual-published
- `rajiv-site/` manages other rajiv.com articles → single destination

**The Catastrophic Mistake**

When asked to "fetch this article from rajiv.com," an AI assistant will:
1. See the URL is `rajiv.com`
2. Assume it goes in `rajiv-site/`
3. Fetch it to the wrong location

If the article is about Synthesis Coding, it now exists in the wrong repo. Publishing workflows break. Git history is polluted. The user has to manually fix the mess.

**CLAUDE.md Solution: Document the Publishing Model**

Each repository's CLAUDE.md must explicitly document what it manages:

```markdown
## What Belongs Here (Many-to-Many Publishing)

**This repository manages articles dual-published to BOTH rajiv.com AND synthesiscoding.com.**

Articles here are:
- Published to WordPress (rajiv.com) via ownwords
- Published to Cloudflare Pages (synthesiscoding.com) via git push
- Canonical URL points to rajiv.com

**Non-synthesis-coding articles that only appear on rajiv.com belong in `rajiv-site/`, not here.**

**You CANNOT determine this from the URL alone.** When in doubt, ASK the user.
```

**The Corresponding Rule in the Tool's CLAUDE.md**

The tool (like ownwords) should have generic instructions that defer to the target site:

```markdown
## Fetching Articles

**When asked to fetch an article, you MUST:**

1. **ASK the user which local directory** the article should go to — never assume
2. **Check the target site's existing structure** before fetching
3. **Read the target site's CLAUDE.md** if it exists — it documents the publishing model
4. **Use the appropriate flags** based on what you learned

**Why ASK First?**
- Users may have multiple local repos for different purposes
- The source URL does NOT determine the target folder — the user's intent does
- Articles can be published to multiple sites (many-to-many publishing)
- Only the user knows their content organization
```

**Key Insight: Separation of Concerns**

- **Tool CLAUDE.md** (e.g., ownwords): Generic instructions, no user-specific paths or sites
- **Site CLAUDE.md** (e.g., rajiv-site): Specific publishing model, what belongs here vs. elsewhere
- **Global CLAUDE.md** (`~/.claude/`): User's personal conventions that apply everywhere

This separation means:
- The tool remains usable by anyone (open source friendly)
- Site-specific knowledge is documented where it belongs
- The AI reads all relevant CLAUDE.md files and combines the guidance

### The Repository Ecosystem Map

When working across multiple repositories, CLAUDE.md should include an ecosystem map:

```markdown
## Repository Ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **main-site** | Public | Production website | `~/projects/main-site/` |
| **content-tools** | Public | Content management CLI | `~/projects/content-tools/` |
| **shared-lib** | Public | Shared utilities | `~/projects/shared-lib/` |

Note: Home directory varies by machine, so use `~` for paths.
```

**Why this matters:**
- Prevents commits to wrong repositories
- Clarifies which repo owns which functionality
- Documents integration points
- Helps AI understand the broader context

### Open Source CLAUDE.md: Keep It Generic

When a project is open source, its CLAUDE.md must work for ALL users, not just you. This seems obvious but is consistently violated.

**What Goes Wrong**

A developer adds site-specific information to an open source tool's CLAUDE.md:

```markdown
## Known Sites

| Site | Path |
|------|------|
| rajiv-site | `/Users/rajiv/projects/rajiv-site/` |
| synthesis-coding-site | `/Users/rajiv/projects/synthesis-coding-site/` |
```

This is useless (or actively harmful) for:
- Other users who don't have these sites
- Contributors trying to understand the project
- The same developer on a different machine

**The Solution: Separation of Concerns**

```
Tool repo (public, open source):
└── CLAUDE.md           # Generic: how to use the tool,
                        # general patterns, no user paths

User's site repos (may be public or private):
└── CLAUDE.md           # Specific: this site's structure,
                        # publishing model, conventions

User's global config (private):
└── ~/.claude/CLAUDE.md # Personal: cross-project standards,
                        # quality attributes, prohibited behaviors
```

**Open Source CLAUDE.md Should Contain:**
- How to use the tool
- Development/contribution guidelines
- General best practices (check structure first, ask user, etc.)
- Project architecture
- No hardcoded paths
- No user-specific sites or configurations
- No assumptions about the user's setup

**The "Read Target Site's CLAUDE.md" Pattern**

Instead of encoding user-specific information, the tool's CLAUDE.md says:

```markdown
**Before operating on a target site:**
1. Read the target site's CLAUDE.md if it exists
2. Check the site's existing structure
3. Ask the user if anything is unclear
```

This delegates site-specific knowledge to where it belongs while keeping the tool generic.

### Preventing Cross-Repository Contamination

Explicit warnings in each project's CLAUDE.md:

```markdown
## Git Operations

**IMPORTANT**: Before any git commands, ensure you are in the correct directory:

```bash
cd ~/projects/this-specific-repo
```

This repo is separate from [other-repo]. Do NOT mix commits between repos.
```

---

## Part Five: Debugging and Recovery

### The Orthogonal Verification Principle

[TODO: Expand this section]

When something isn't working, verify using a different method than the one that produced the result:

**Example: YAML parsing bug**

The export module wasn't parsing nested arrays correctly. Rather than debugging within the export module:

1. Use a different YAML parser (gray-matter) to verify the source data is correct
2. Add debug output showing intermediate values
3. Compare expected vs actual at each transformation step

This identified that the custom YAML parser handled inline arrays but not multi-line arrays within nested objects.

### The Incremental Verification Pattern

[TODO: Expand this section]

For complex operations, verify at each step:

1. **Before:** Check current state matches expectations
2. **Dry-run:** Preview what would change
3. **Execute:** Run the operation
4. **After:** Verify the result matches expectations
5. **API check:** Query the target system to confirm

```bash
# Step 1: Verify current state
curl -s "https://api.example.com/resource/123" | jq '.field'

# Step 2: Dry-run
tool update ./resource.md --dryrun

# Step 3: Execute
tool update ./resource.md

# Step 4: Verify result
tool verify ./resource.md

# Step 5: API check
curl -s "https://api.example.com/resource/123" | jq '.field'
```

---

## Part Six: The Synthesis Coding Mindset

> **Note**: The topics of bidirectional learning and testing patterns have their own dedicated article: [Bidirectional Learning in Synthesis Coding](/blog/2025/12/09/bidirectional-learning-in-synthesis-coding/). That article covers the Socratic Synthesis Model, verification questions, the "What Am I Missing?" pattern, and comprehensive testing discipline for AI-generated code.

### Prevention Over Detection

The best safeguards prevent problems rather than detecting them after the fact:

**Detection approach (inferior):**
- Add a `--force` flag for when collisions occur
- Check if resource exists and warn user

**Prevention approach (superior):**
- Use naming conventions that make collisions impossible (date-prefixed filenames)
- Auto-detect existing resources and switch modes automatically
- Track state in sidecar files to maintain continuity

### Explicit Over Implicit

Make decisions and their rationale visible:

- Document the decision framework in CLAUDE.md
- Require AI to state which approach it's taking and why
- Log what mode tools are operating in
- Show what would happen before doing it

### Compound Reliability

Individual safeguards combine multiplicatively:

1. CLAUDE.md encodes standards → fewer incorrect implementations
2. Dry-run pattern catches remaining issues → fewer production mistakes
3. Sidecar files maintain state → fewer duplicate operations
4. Checklists ensure nothing is skipped → fewer oversights
5. Orthogonal verification catches bugs → fewer silent failures
6. **[Bidirectional learning](/blog/2025/12/09/bidirectional-learning-in-synthesis-coding/) catches blind spots → fewer unknown unknowns**

Each layer catches what previous layers missed. The combination produces reliability that no single safeguard could achieve.

### Persisting Critical Context: The Anti-Amnesia Pattern

AI coding assistants have a fundamental limitation: they lose context. Conversations end. Sessions time out. Context windows fill up and get summarized. You switch computers. Chats disappear. And suddenly, all the goals, guidance, and hard-won understanding from previous sessions is gone.

This isn't a minor inconvenience. It's a structural problem that causes the AI to:
- Take your work in the wrong direction
- Repeat mistakes you already corrected
- Forget constraints you established
- Lose the reasoning behind decisions

**The Problem in Practice**

Here's a real scenario that happened while writing this very article:

1. In earlier sessions, I established detailed goals and guidance for this article
2. The conversation context was summarized (compacted) due to length
3. The AI lost the detailed goals and retained only a fragment
4. When I asked the AI to continue working, it went in the wrong direction
5. Hours of discussion were needed to reconstruct what was lost
6. Even then, the reconstruction was incomplete

The AI didn't fail at its job — it was never given the information. The context was lost.

**The Solution: A Three-Level Context Hierarchy**

Context should be persisted at the appropriate level — as close to the work as possible, but shareable where needed.

```
Level 1: File-Level Context (closest to the work)
├── Public: HTML comments in the file itself
├── Public: Sidecar file (e.g., component.context.md)
└── Private: Gitignored sidecar (e.g., component.private.md)

Level 2: Project-Level Context
├── Public: CLAUDE.md in the repository root
├── Public: ADR files in docs/adr/
└── Private: .claude/private.md (gitignored)

Level 3: Global Context (applies everywhere)
└── Private: ~/.claude/CLAUDE.md (never committed anywhere)
```

**The key principle: Context lives where the work is.** Don't put file-specific context in CLAUDE.md. Don't put project-specific context in your global config. Each level has its purpose.

#### Level 1: File-Level Context

This is the most important level and the most often overlooked. Context about a specific file should live with that file.

**Public file-level context (HTML comments):**

For documents, articles, or any file that supports comments:

```markdown
<!--
=============================================================================
CONTEXT FOR THIS FILE (DO NOT DELETE)
=============================================================================

PURPOSE:
[What this specific file is trying to achieve]

WHAT THIS IS NOT:
[Common misunderstandings to prevent]

CRITICAL CONSTRAINTS:
[Non-negotiable requirements for this file]

RELATIONSHIP TO OTHER FILES:
[How this fits with related files]

INSTRUCTIONS FOR AI:
[Specific guidance on how to work on this file]

=============================================================================
-->
```

**Public file-level context (sidecar file):**

For source code files where comments would be intrusive:

```
src/
├── auth/
│   ├── service.ts
│   ├── service.context.md      # Context about service.ts
│   └── service.test.ts
```

The sidecar `service.context.md` might contain:

```markdown
# Context for auth/service.ts

## Purpose
Handles user authentication with JWT tokens and bcrypt password hashing.

## Security Requirements
- Passwords MUST use bcrypt with cost factor 12
- Tokens MUST expire after 1 hour
- Failed login attempts MUST be rate-limited (5 per minute per IP)

## Integration Points
- Called by: routes/auth.ts
- Depends on: repositories/user.ts, services/redis.ts

## Known Issues
- TODO: Add refresh token support
- The rate limiter doesn't handle Redis connection failures gracefully
```

**Private file-level context (gitignored sidecar):**

For context you need AI to know but don't want to share:

```
content/posts/2025/12/08-my-article/
├── index.md                    # The article
├── index.context.md            # Public context (committed)
└── index.private.md            # Private context (gitignored)
```

Add to `.gitignore`:
```
*.private.md
```

The private sidecar might contain:

```markdown
# Private Context (DO NOT COMMIT)

## My Goals for This Work
- I'm trying to establish credibility in this area
- This responds to criticism that my prior work lacked depth
- I need this to be comprehensive and technical, not simplified

## My Sensitivities
- DO NOT condense or simplify — I was criticized for being too simplistic
- DO NOT make me look incompetent in examples
- Add depth, never remove it

## Frustrations with AI Behavior
- The AI kept focusing only on CLAUDE.md and ignoring other factors
- The AI condensed a section when I explicitly wanted depth
- Context was lost when the conversation was summarized
```

This private context guides the AI without being visible to others.

#### Level 2: Project-Level Context

Context that applies across multiple files in a project.

**Project CLAUDE.md (public):**

```markdown
# Project Context

## Repository Purpose
[What this project does and why it exists]

## Architecture
[Key architectural decisions and patterns]

## Data Contracts
[Formats that multiple components must agree on]

## Conventions
[Naming, structure, style patterns specific to this project]
```

**Architecture Decision Records (public):**

For significant architectural decisions that AI should know about:

```markdown
# ADR-001: Image Sidecar Format

## Status
Accepted

## Context
Both fetch and publish commands need to track which images have been uploaded.
Without a consistent format, fetch creates one structure and publish expects another,
causing duplicate uploads.

## Decision
Use a single sidecar format for both operations:
- Key by local path (`./image.png`)
- Include WordPress URL, file hash, and timestamp
- Store in `index.images.json` alongside markdown

## Consequences
- Fetch must write in publish-compatible format
- Both commands share a data contract
- Breaking changes require updating both commands
```

**Private project context (gitignored):**

Create `.claude/private.md` and add `.claude/private.md` to `.gitignore`:

```markdown
# Private Project Context

## Business Goals
[Why we're building this, strategic context]

## Team Dynamics
[Who's working on what, sensitivities to be aware of]

## Known Problems We're Not Fixing Yet
[Technical debt we're intentionally ignoring]
```

#### Level 3: Global Context

Context that applies to all your work, across all projects.

**~/.claude/CLAUDE.md:**

This is your personal engineering philosophy, quality standards, and behavioral guidance that applies everywhere:

```markdown
# Global Claude Code Instructions

## Core Principle
Maximize value delivered to the user, not convenience for the AI.

## Quality Attributes (Non-Negotiable)
All implementations must be:
- Performant
- Flexible
- Feature-complete
- Secure
- Convention-compliant
- Well-tested

## Prohibited Behaviors
NEVER:
- Choose an easier implementation when a better one was discussed
- Implement partial solutions when complete solutions are feasible
- Condense or simplify unless explicitly requested
- Add backward-compatibility hacks instead of proper solutions
```

This file is never committed to any repository — it's your private global configuration.

#### Choosing the Right Level

| Context Type | Level | Location |
|--------------|-------|----------|
| Goals for a specific file | 1 (File) | HTML comments or sidecar |
| Private goals/sensitivities for a file | 1 (File) | `*.private.md` (gitignored) |
| How a specific component works | 1 (File) | Sidecar `.context.md` |
| Data contracts between components | 2 (Project) | Project CLAUDE.md |
| Architectural decisions | 2 (Project) | ADR files |
| Business strategy for the project | 2 (Project) | `.claude/private.md` (gitignored) |
| Your engineering philosophy | 3 (Global) | `~/.claude/CLAUDE.md` |
| Your personal sensitivities | 3 (Global) | `~/.claude/CLAUDE.md` |

**The Anti-Pattern: Everything in CLAUDE.md**

A common mistake is putting all context in project-level CLAUDE.md:
- File-specific context gets lost in a large CLAUDE.md
- CLAUDE.md becomes unwieldy and hard to maintain
- AI has to read irrelevant context for every file
- Private context ends up in a committed file

Instead, keep context close to where the work happens. CLAUDE.md is for project-wide patterns, not file-specific guidance.

#### For Software Projects: Practical Examples

**A React component with context:**

```
src/components/Dashboard/
├── Dashboard.tsx
├── Dashboard.context.md       # How this component works, dependencies
├── Dashboard.private.md       # Why we built it this way, known issues we're ignoring
├── Dashboard.test.tsx
└── Dashboard.module.css
```

**An API endpoint with context:**

```
src/routes/
├── users.ts
├── users.context.md           # Security requirements, rate limits, expected behavior
└── users.private.md           # Performance issues we know about but haven't fixed
```

**A configuration module:**

```
src/config/
├── database.ts
├── database.context.md        # Connection pooling settings, why we chose these values
└── database.private.md        # Production vs dev differences, credentials handling
```

#### For Articles and Documents

**An article with full context hierarchy:**

```
content/posts/2025/12/08-synthesis-coding-best-practices/
├── index.md                   # The article itself, with HTML comment context
├── index.images.json          # State: which images have been synced
└── index.private.md           # Private: author's goals, sensitivities, frustrations
```

The HTML comments in `index.md` contain public context about the article's purpose and structure.

The `index.private.md` contains:
- Why you're writing this article (career goals, positioning)
- Criticisms you're responding to
- Your sensitivities (don't simplify, don't condense)
- Frustrations with AI behavior on this specific article

#### The Meta-Lesson

This pattern is meta: the solution to context loss is itself a synthesis coding best practice that needs to be documented so it isn't forgotten.

Every important discussion, decision, or piece of guidance should end with: "Where should we persist this so it survives?"

The answer follows the hierarchy:
1. Is it about a specific file? → File-level context
2. Is it about the whole project? → Project CLAUDE.md or ADR
3. Is it about how I work everywhere? → Global `~/.claude/CLAUDE.md`
4. Should it be private? → Use gitignored variants at each level

#### Implementation Checklist

Before ending a session or switching tasks:

**File-level:**
- [ ] Have we established goals for a specific file? → HTML comments or sidecar
- [ ] Are there private goals/sensitivities for this file? → `*.private.md`
- [ ] Is there context about how this file works? → `.context.md` sidecar

**Project-level:**
- [ ] Have we made architectural decisions? → ADR files
- [ ] Have we established data contracts? → Project CLAUDE.md
- [ ] Is there private business context? → `.claude/private.md`

**Global:**
- [ ] Have we established patterns that apply everywhere? → `~/.claude/CLAUDE.md`

**Gitignore setup:**
```
# Add to .gitignore
*.private.md
.claude/private.md
```

The few minutes spent persisting context at the right level saves hours of reconstruction later — and keeps private context from leaking into commits.

---

## Conclusion

Synthesis coding is a discipline, not a tool. The practices in this article — CLAUDE.md configuration, defensive patterns, workflow safeguards — are techniques for building reliable human-AI collaboration. They exist because AI coding assistants are powerful but imperfect, and the human's job is to structure that collaboration for consistent results.

The key insight is that your job has shifted. You're no longer just writing code or reviewing code. You're architecting AI behavior. The CLAUDE.md file is your primary artifact — it encodes your standards, constraints, and domain knowledge in a format that persists and scales. When something goes wrong, the fix is usually not "write different code" but "add better guidance to CLAUDE.md so this doesn't happen again."

Start with a global CLAUDE.md that encodes your engineering philosophy. Add project-specific CLAUDE.md files that document data contracts, conventions, and integration points. Build workflows that include dry-runs and verification steps. And critically, actually review the output at each step. The safeguards only work if you use them.

These patterns will evolve as AI capabilities evolve. What remains constant is the principle: synthesis coding succeeds when humans and AI each do what they're best at. AI excels at implementation speed and pattern matching. Humans excel at judgment, architectural decisions, and knowing when something looks wrong. The practices in this article are about structuring that collaboration for reliability

---

## Appendix: Sample CLAUDE.md Templates

### Global CLAUDE.md Template

[TODO: Include sanitized version of global CLAUDE.md]

### Project CLAUDE.md Template

[TODO: Include sanitized project template]

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Conde Nast's brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "[synthesis coding](https://synthesiscoding.com/)" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
