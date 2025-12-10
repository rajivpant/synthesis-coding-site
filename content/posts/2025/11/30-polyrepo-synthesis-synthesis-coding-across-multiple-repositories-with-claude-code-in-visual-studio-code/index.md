---
title: 'Polyrepo Synthesis: Synthesis Coding Across Multiple Repositories with Claude Code in Visual Studio Code'
slug: polyrepo-synthesis-synthesis-coding-across-multiple-repositories-with-claude-code-in-visual-studio-code
date: '2025-11-30T23:57:42'
modified: '2025-12-08T22:20:38'
description: 'I wrote this blog post for Software Engineers, Architects, and Technical Leads. It is code-heavy and implementation-focused. This weekend I was working across three repositories simultaneously in Visual Studio Code. I worked on RagBot — a multi-LLM chatbot that lets you switch between OpenAI, Anthro'
canonical_url: 'https://rajiv.com/blog/2025/11/30/polyrepo-synthesis-synthesis-coding-across-multiple-repositories-with-claude-code-in-visual-studio-code/'
categories:
  - Technology
tags:
  - artificial intelligence
  - Claude Code
  - ctobook
  - programming
  - software engineering
  - synthesis coding
  - synthesis engineering
  - vibe coding
author: Rajiv Pant
category: Advanced patterns
featured_image: 'https://i0.wp.com/rajiv.com/wp-content/uploads/2025/11/Synthesis-Engineering-Logo-2-e1764033363626.webp?fit=800%2C400&ssl=1'
wordpress:
  post_id: 6730
  category_ids:
    - 6
  tag_ids:
    - 12374
    - 727048735
    - 485374580
    - 196
    - 11176
    - 727048734
    - 727048733
    - 727048736
  author_id: 918046
  synced_at: '2025-12-10T04:10:37.004Z'
---

I wrote this blog post for Software Engineers, Architects, and Technical Leads. It is code-heavy and implementation-focused.

This weekend I was working across three repositories simultaneously in Visual Studio Code. I worked on [RagBot](https://ragbot.ai) — a multi-LLM chatbot that lets you switch between OpenAI, Anthropic, Google, and other providers while maintaining conversation history and custom personas — alongside its successor [RaGenie](https://ragenie.ai), an agentic AI assistant designed to augment human capabilities through retrieval-augmented generation. Both products consume shared data from a third repository called ragbot-data: workspace configurations, custom instructions, knowledge bases.

Claude Code understood something that would have been invisible in a single-repo context: a schema change in ragbot-data would affect both products differently. RagBot reads workspace configurations directly from the filesystem. RaGenie mounts the same data read-only via Docker and re-indexes it into a vector database. Same source, different consumption patterns, different implications for each product.

This is fundamentally different from single-repo development. And it demands its own patterns.

## The multi-repository reality

Most production software lives across multiple repositories. Look around your organization:

**Frontend + Backend + Shared Types** — The classic web application split. TypeScript interfaces defined once, consumed in two places, with deployment pipelines that need coordination.

**Application code + Shared data/config** — Products that read from a central source of configurations, knowledge bases, or datasets. My RagBot/RaGenie/ragbot-data setup follows this pattern: two applications consuming one authoritative data source.

**Multiple related products** — Platform teams maintaining products that share infrastructure, authentication, or data models. Changes ripple across boundaries.

**Microservices architectures** — Each service in its own repository, with shared contracts, API definitions, and deployment orchestration spanning the boundaries.

**Notebooks + Production code + Data** — Data science workflows where Jupyter exploration eventually becomes production pipelines, with model artifacts and evaluation datasets living separately.

**Infrastructure-as-code + Application repos** — DevOps patterns where Terraform or Pulumi lives separately from the applications they deploy.

**Monorepo-to-polyrepo migrations** — Organizations scaling beyond a single repository, splitting by team or domain while maintaining cross-repo dependencies.

The common thread: context fragmentation and the need for consistency across systems that don’t share a git history.

## Introducing Polyrepo Synthesis

**Polyrepo Synthesis** is the practice of applying [synthesis engineering principles](https://rajiv.com/blog/2025/11/09/the-synthesis-engineering-framework-how-organizations-build-production-software-with-ai/) across multiple interconnected repositories within a unified development environment.

It’s not a separate methodology — it’s [**synthesis coding**](https://synthesiscoding.com/) scaled to the architectural reality of modern software systems.

The key principle remains the same: human architectural authority guides everything; AI assists within that unified vision. But “everything” now spans repository boundaries. Your mental model encompasses the entire system, and your AI assistant needs to share that understanding.

## Architectural patterns

Through my work on multi-repository systems, I’ve identified patterns that recur across organizations:

### Hub-and-spoke (source of truth)

One repository serves as the authoritative source of data or configuration, with multiple consumer repositories reading from it.

```text
┌─────────────────────────────────────────┐
│        ragbot-data/ (private)           │
│    Source of truth for workspaces'      │
│   instructions, runbooks, and datasets  │
└─────────────┬───────────────┬───────────┘
              │               │
              ▼               ▼
      ┌───────────────┐ ┌────────────────────┐
      │    ragbot/    │ │     ragenie/       │
      │  (Chat Bot)   │ │ (Agentic platform) │
      └───────────────┘ └────────────────────┘
```

The hub is authoritative; spokes consume but don’t modify. This pattern works well when you have shared knowledge, configurations, or datasets that multiple applications need. In my case, ragbot-data contains workspace definitions organized by a WHO/HOW/WHAT framework — identity instructions, procedural runbooks, and reference datasets — that both products consume.

### Product family

Related products evolving together, sharing patterns but diverging in implementation. RagBot and RaGenie are siblings: RagBot is a Python CLI with Streamlit UI; RaGenie is a FastAPI/React microservices platform. They solve related problems differently, but solutions discovered in one often inform the other.

Cross-pollination happens naturally when Claude Code understands both codebases. A caching pattern that works in RagBot might apply to RaGenie’s API layer. A UI approach in RaGenie’s React frontend might inspire changes to RagBot’s Streamlit interface.

### Stack slice

Frontend, backend, infrastructure, and data science repositories representing horizontal layers. Feature development cuts vertically across all of them.

The challenge here is coordinated releases. A new API endpoint requires frontend changes, backend implementation, infrastructure updates, and possibly model retraining. Polyrepo synthesis means Claude Code understands these dependencies and can trace the impact of changes across layers.

### Microservices mesh

Multiple services, each in its own repository, communicating via APIs or message queues. Shared contracts (OpenAPI specs, protobuf definitions, JSON schemas) live somewhere — either in a dedicated contracts repo or duplicated across services.

Claude Code with access to multiple service repositories can help maintain consistency: “Update the user schema in the auth service and show me everywhere else that needs to change.”

### Monorepo extraction

Organizations that started with a monorepo and are splitting into multiple repositories. The dependencies are already implicit in the code; the challenge is making them explicit as boundaries form.

This is where CLAUDE.md files become essential documentation — capturing the relationships that were previously just “everything in one place.”

### ML pipeline architecture

Training code, inference code, model artifacts, and evaluation datasets in separate repositories. Different teams own different pieces. The data scientist’s notebook experiments eventually need to integrate with the ML engineer’s production serving code.

## The CLAUDE.md context mesh

VS Code’s multi-root workspaces let you open multiple repositories in a single window. Claude Code reads CLAUDE.md files from each repository root. Together, these create what I call a **context mesh** — interconnected documentation that gives Claude Code ecosystem awareness.

Here’s how I structure the CLAUDE.md files in my three-repository setup:

### The repository ecosystem table

Every CLAUDE.md starts with the same table, giving Claude Code a consistent view of the repository ecosystem:

```markdown
## Repository Ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **ragbot** | Public | AI assistant CLI and Streamlit UI | `~/projects/my-projects/ragbot/` |
| **ragenie** | Public | Next-gen RAG platform | `~/projects/my-projects/ragenie/` |
| **ragbot-data** | Private | Shared data for both products | `~/ragbot-data/` |
```

This table appears identically in all three CLAUDE.md files. When Claude Code opens any repository, it immediately understands the ecosystem.

### Cross-repository references

Each CLAUDE.md explicitly describes relationships to siblings:

```markdown
## Product relationship

- **RagBot**: Actively maintained CLI and Streamlit UI. Production-ready.
- **RaGenie**: Successor product with advanced RAG capabilities. Under development.
- Both products share ragbot-data as their data layer.
- Both products will continue to be actively developed.
```

### Directory safety warnings

Multi-repo development’s most common error — running git commands in the wrong directory:

~~~markdown
## Git operations

**IMPORTANT**: Before any git commands for this repo, ensure you are in the correct directory:

```bash
cd ~/projects/my-projects/ragbot
```

Each repo in the ecosystem has its own git history. Don't run git commands from the wrong directory.
~~~

This warning appears in every CLAUDE.md, customized with the correct path. It sounds redundant, but it’s saved me from wrong-repo commits multiple times.

### Architecture context

Each repository’s CLAUDE.md describes its internal structure so Claude Code can navigate effectively:

```markdown
## Data location

RagBot reads data from `~/ragbot-data/workspaces/`:

- **instructions/** — WHO: Identity/persona files
- **runbooks/** — HOW: Procedure guides
- **datasets/** — WHAT: Reference knowledge
```

This WHO/HOW/WHAT framework organizes ragbot-data’s content. Both products understand this structure because their CLAUDE.md files reference it.

## A real example: the three-repository workspace

Here’s how my VS Code workspace ties these repositories together. The `.code-workspace` file:

```json
{
  "folders": [
    { "path": "projects/my-projects/ragbot", "name": "RagBot (public)" },
    { "path": "projects/my-projects/ragenie", "name": "RaGenie (public)" },
    { "path": "ragbot-data", "name": "ragbot-data (private)" }
  ],
  "settings": {
    "files.exclude": {
      "**/.git": true,
      "**/node_modules": true,
      "**/__pycache__": true
    }
  }
}
```

The folder names appearing in VS Code’s sidebar — “RagBot (public)”, “RaGenie (public)”, “ragbot-data (private)” — serve as constant reminders of each repository’s nature.

When I ask Claude Code to help with a cross-cutting change, it can trace dependencies:

> “I want to add a new workspace type to ragbot-data. What changes are needed in RagBot and RaGenie to support it?”

Claude Code, having read all three CLAUDE.md files, understands:

-   ragbot-data defines workspace structure in `workspaces/config.yaml`
-   RagBot loads workspaces via direct file reading in `src/helpers.py`
-   RaGenie watches for file changes and re-indexes into Qdrant

It can provide a coherent plan spanning all three repositories.

## Practical workflows

### Cross-repo feature development

When implementing a feature that spans repositories:

1.  Start in the data/config repository — define the schema or configuration change
2.  Move to the primary consumer — implement the feature using the new data structure
3.  Check secondary consumers — ensure the change doesn’t break other dependents
4.  Coordinate commits — meaningful commit messages that reference the cross-repo change

Claude Code, having read all CLAUDE.md files, understands this sequence. Ask it “What else needs to change when I modify this schema?” and it can trace the dependencies.

### The “follow the data” pattern

For debugging or understanding, trace data flow across repositories:

> “Show me how workspace configurations flow from ragbot-data through RagBot’s loading mechanism to the Streamlit UI”

Claude Code with ecosystem awareness can navigate this path without you manually opening each file. It understands that ragbot-data contains the source files, RagBot’s `helpers.py` loads them, and `ragbot_streamlit.py` renders them in the interface.

### Coordinated releases

When both products need updates:

1.  Update ragbot-data with the new content or schema
2.  Update RagBot to consume the changes (bump version in `VERSION` file)
3.  Update RaGenie to handle the changes (bump version, potentially update Docker compose)
4.  Tag releases across repositories with related version numbers

Claude Code can help maintain this coordination: “Generate release notes for this change across all three repositories.”

## The many-to-many dependency model

Not all multi-repository relationships are simple. Consider shared libraries consumed by multiple services, where the same code might need to live in different repositories depending on its consumers and deployment model.

**The problem**: AI assistants assume a simple mapping — one function equals one obvious location. They see a utility function and assume it goes in whatever repo you're currently working in.

But real architectures are more complex. I maintain a media analytics platform across several repositories:

- `media-graph-core/` — shared types and utilities used by ALL services
- `media-graph-api/` — REST API for external consumers
- `media-graph-ingest/` — data ingestion pipeline, also exposes internal API

When I ask Claude Code to "add a date parsing utility," where should it go?

**Example: Shared library architecture**

```text
media-graph-core/               # Shared across ALL services:
├── src/
│   ├── types/                  #   - Type definitions
│   ├── utils/                  #   - Common utilities
│   └── validators/             #   - Shared validation logic

media-graph-api/                # External API service:
├── src/
│   ├── routes/                 #   - API endpoints
│   └── services/               #   - API-specific business logic
│       └── date-formatter.ts   #   - API-specific date formatting

media-graph-ingest/             # Ingestion pipeline:
├── src/
│   ├── parsers/                #   - Data parsers
│   └── transforms/             #   - Pipeline-specific transforms
│       └── date-normalizer.ts  #   - Ingestion-specific date handling
```

Three repositories, all dealing with dates. But:

- `media-graph-core/` has general date utilities used everywhere
- `media-graph-api/` has API-specific formatters for external responses
- `media-graph-ingest/` has pipeline-specific normalizers for ingested data

**The catastrophic mistake**

When asked to "add a date parsing function," an AI assistant will:

1. See you're working in `media-graph-api/`
2. Put the function there
3. Duplicate logic that should be shared

Now you have three date parsers, each slightly different. Bugs get fixed in one but not others. The shared library exists precisely to prevent this — but the AI doesn't know your architectural intent.

**CLAUDE.md solution: Document the dependency model**

Each repository's CLAUDE.md must explicitly document what belongs where:

```markdown
## What Belongs Here vs. Shared Libraries

**This repository contains API-specific code only.**

Before adding utilities, check:
- Is this logic needed by other services? → Put it in `media-graph-core/`
- Is this specific to API response formatting? → Put it here
- Is this specific to data ingestion? → Put it in `media-graph-ingest/`

**The `media-graph-core/` repository is the source of truth for:**
- Type definitions shared across services
- Date/time utilities
- Validation logic
- Error types and handling

**You CANNOT determine the right location from the code alone.** When in doubt, ASK.
```

**The corresponding rule in the shared library's CLAUDE.md**

The shared library documents what it provides and how services should consume it:

```markdown
## Adding New Utilities

**When asked to add shared functionality, verify:**

1. **Is this truly shared?** — Will multiple services use it?
2. **Check existing utilities** — We may already have something similar
3. **Follow the type-first pattern** — Define types before implementation
4. **Update the barrel exports** — New utilities must be exported from index.ts

**Why This Matters:**
- Duplicate utilities across services cause maintenance nightmares
- Type definitions here are the contract between services
- Changes here affect all consumers — be careful with breaking changes
```

## Open source tools in multi-repo workflows

When a tool repository is open source, its CLAUDE.md must work for ALL users, not just you. This seems obvious but is consistently violated.

**What goes wrong**

A developer adds project-specific information to an open source tool's CLAUDE.md:

```markdown
## Known Projects

| Project | Path |
|---------|------|
| media-graph-core | `/Users/rajiv/projects/media-graph-core/` |
| media-graph-api | `/Users/rajiv/projects/media-graph-api/` |
```

This is useless (or actively harmful) for:

- Other users who don't have these projects
- Contributors trying to understand the tool
- The same developer on a different machine with a different username

**The solution: Separation of concerns**

```text
Tool repo (public, open source):
└── CLAUDE.md           # Generic: how to use the tool,
                        # general patterns, no user paths

User's project repos (may be public or private):
└── CLAUDE.md           # Specific: this project's structure,
                        # dependency model, conventions

User's global config (private):
└── ~/.claude/CLAUDE.md # Personal: cross-project standards,
                        # quality attributes, prohibited behaviors
```

**Open source CLAUDE.md should contain:**

- How to use the tool
- Development/contribution guidelines
- General best practices (check structure first, ask user, etc.)
- Project architecture
- No hardcoded paths
- No user-specific projects or configurations
- No assumptions about the user's setup

**The "read target project's CLAUDE.md" pattern**

Instead of encoding user-specific information, the tool's CLAUDE.md says:

```markdown
**Before operating on a target project:**
1. Read the target project's CLAUDE.md if it exists
2. Check the project's existing structure
3. Ask the user if anything is unclear
```

This delegates project-specific knowledge to where it belongs while keeping the tool generic. The AI reads all relevant CLAUDE.md files and combines the guidance — tool conventions from the tool repo, project-specific rules from the project repo, and personal standards from the global config.

## Anti-patterns to avoid

**Context overload**: CLAUDE.md files that try to document everything overwhelm Claude Code. Focus on what’s essential for cross-repo coordination — the ecosystem table, key relationships, and directory structure.

**Conflicting instructions**: Different repos with contradictory coding standards or conventions. My RagBot uses Python with type hints; RaGenie uses Python with Pydantic models plus TypeScript for the frontend. The CLAUDE.md files clarify these differences rather than pretending they don’t exist.

**Wrong directory syndrome**: Running `git commit` in the wrong repository. The directory warnings help, but vigilance remains necessary. I’ve adopted the habit of always running `pwd` before any git operation.

**Stale context**: CLAUDE.md files that drift from reality. When architecture changes, update the documentation. I treat CLAUDE.md as a living document — when I add a new service or change a data flow, the CLAUDE.md files get updated in the same commit.

## Getting started: your first polyrepo synthesis setup

If you’re new to multi-repository development with Claude Code, start with these steps:

### 1. Create a VS Code multi-root workspace

File → Add Folder to Workspace for each repository you want to include. Save the workspace file (`.code-workspace`) somewhere accessible.

### 2. Add minimal CLAUDE.md to each repository

Start with just the ecosystem table:

~~~markdown
# Claude Code Context: [repo-name]

## Repository ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **[this-repo]** | [Public/Private] | [Brief purpose] | `~/path/to/[this-repo]/` |
| **[related-repo]** | [Public/Private] | [Brief purpose] | `~/path/to/[related-repo]/` |

## Related repositories

This repo works alongside:
- **[related-repo]**: [Brief description of relationship]

## Git operations

Verify directory before git commands:

```bash
cd ~/path/to/[this-repo]
```
~~~

### 3. Cross-reference the repositories

Ensure each CLAUDE.md mentions its siblings. The ecosystem table should be identical across all repositories — copy-paste it to maintain consistency.

### 4. Test with a cross-repo question

Ask Claude Code something that requires understanding multiple repositories:

> “What files would need to change if I renamed the ‘workspace’ concept to ‘context’ across all repositories?”

If Claude Code can trace the impact across repository boundaries, your context mesh is working.

## CLAUDE.md templates

### Template 1: Hub repository (shared data/config)

~~~markdown
# Claude Code Context: [data-repo-name]

## Repository ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **[data-repo-name]** | Private | Shared data source of truth | `~/[data-repo-name]/` |
| **[consumer-a]** | Public | Primary consumer application | `~/projects/[consumer-a]/` |
| **[consumer-b]** | Public | Secondary consumer application | `~/projects/[consumer-b]/` |

## VS Code workspace

All repositories are configured in the same VS Code workspace for unified development.

## Data organization

[Describe your data structure here — folders, file types, naming conventions]

## How consumers use this data

- **[consumer-a]**: [How it reads/uses the data]
- **[consumer-b]**: [How it reads/uses the data]

Changes here affect both consumers. Test compatibility before committing.

## Git operations

**IMPORTANT**: Before any git commands, verify your directory:

```bash
cd ~/[data-repo-name]
pwd  # Confirm location
```

Each repo has its own git history.
~~~

### Template 2: Consumer repository (application)

~~~markdown
# Claude Code Context: [app-name]

## Repository ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **[app-name]** | Public | [Brief description] | `~/projects/[app-name]/` |
| **[sibling-app]** | Public | [Brief description] | `~/projects/[sibling-app]/` |
| **[data-repo]** | Private | Shared data source | `~/[data-repo]/` |

## VS Code workspace

All repositories are configured in the same VS Code workspace for unified development.

## Relationship to [data-repo]

This repository consumes data from [data-repo]:
- [Describe what data is consumed]
- [Describe how it's loaded/accessed]

Changes to [data-repo] may require updates here.

## Architecture

[Brief description of key components, entry points, etc.]

## Git operations

**IMPORTANT**: Before any git commands, verify your directory:

```bash
cd ~/projects/[app-name]
pwd  # Confirm location
```

## Development notes

- When modifying shared interfaces, check [sibling-app] for compatibility
- [Other relevant development notes]
~~~

### Template 3: Minimal starter

~~~markdown
# Claude Code Context: [repo-name]

## Repository ecosystem

| Repository | Type | Purpose | Location |
|------------|------|---------|----------|
| **[repo-name]** | [Public/Private] | [Brief purpose] | `~/path/to/[repo-name]/` |
| **[related-repo]** | [Public/Private] | [Brief purpose] | `~/path/to/[related-repo]/` |

## Related repositories

This repo works alongside:
- **[related-repo]**: [Brief description of relationship]

## Git operations

Verify directory before git commands:

```bash
cd ~/path/to/[repo-name]
```
~~~

## The architectural advantage

I now think at the level of systems rather than files. Claude Code doesn’t just help me write code — it helps me navigate architectural relationships that would otherwise require holding too much context in my head.

As I wrote in my earlier piece on [synthesis coding workflows](https://rajiv.com/blog/2025/11/09/synthesis-engineering-with-claude-code-technical-implementation-and-workflows/), the compounding context advantage is real. Each session builds on previous understanding. CLAUDE.md files encode institutional knowledge. The investment in setting up proper context pays dividends across every future interaction.

Modern software lives across multiple repositories. The engineers who master polyrepo synthesis — who can coordinate AI assistance across distributed systems while maintaining human architectural authority — will build the next generation of production software.

If you’ve used [Vibe Coding](https://en.wikipedia.org/wiki/Vibe_coding) for rapid prototyping — and I do, for weekend projects and quick experiments — you know how liberating it feels to describe what you want and let the AI handle it. Polyrepo synthesis brings that same collaborative power to production systems, with the discipline required when changes span multiple repositories, teams, and deployment pipelines.

The CLAUDE.md context mesh is the key. Set it up once, maintain it as your architecture evolves, and watch your productivity multiply across your entire codebase.

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Conde Nast’s brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "[synthesis coding](https://synthesiscoding.com/)" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
