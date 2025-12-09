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
Last updated: 2025-12-08
-->

*The difference between AI-assisted coding that works once and AI-assisted coding that works reliably comes down to documented practices, defensive patterns, and systematic safeguards. This article presents the best practices I've developed through months of production synthesis coding work.*

## Introduction

[TODO: Write introduction - 2-3 paragraphs]

Key points to hit:
- Best practices emerge from real production work, not theory
- These practices have been refined through iteration on multiple projects
- The goal is reliability and predictability, not maximum AI autonomy
- These patterns work across different project types and scales

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

### Prevention Over Detection

[TODO: Expand this section]

The best safeguards prevent problems rather than detecting them after the fact:

**Detection approach (inferior):**
- Add a `--force` flag for when collisions occur
- Check if resource exists and warn user

**Prevention approach (superior):**
- Use naming conventions that make collisions impossible (date-prefixed filenames)
- Auto-detect existing resources and switch modes automatically
- Track state in sidecar files to maintain continuity

### Explicit Over Implicit

[TODO: Expand this section]

Make decisions and their rationale visible:

- Document the decision framework in CLAUDE.md
- Require AI to state which approach it's taking and why
- Log what mode tools are operating in
- Show what would happen before doing it

### Compound Reliability

[TODO: Expand this section]

Individual safeguards combine multiplicatively:

1. CLAUDE.md encodes standards → fewer incorrect implementations
2. Dry-run pattern catches remaining issues → fewer production mistakes
3. Sidecar files maintain state → fewer duplicate operations
4. Checklists ensure nothing is skipped → fewer oversights
5. Orthogonal verification catches bugs → fewer silent failures

Each layer catches what previous layers missed. The combination produces reliability that no single safeguard could achieve.

---

## Conclusion

[TODO: Write conclusion - 2-3 paragraphs]

Key points to hit:
- These practices emerged from real production work
- They're encoded in CLAUDE.md files that persist and scale
- The goal is reliable, predictable AI-assisted development
- Start with the global CLAUDE.md, then add project-specific context
- These patterns will evolve as AI capabilities evolve

---

## Appendix: Sample CLAUDE.md Templates

### Global CLAUDE.md Template

[TODO: Include sanitized version of global CLAUDE.md]

### Project CLAUDE.md Template

[TODO: Include sanitized project template]

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Conde Nast's brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "[synthesis coding](https://synthesiscoding.com/)" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
