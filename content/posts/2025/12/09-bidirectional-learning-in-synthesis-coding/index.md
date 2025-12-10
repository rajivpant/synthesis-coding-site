---
title: "Bidirectional Learning in Synthesis Coding: When Human and AI Teach Each Other"
slug: "bidirectional-learning-in-synthesis-coding"
date: "2025-12-09"
description: "The most powerful insight about synthesis coding isn't in any technical pattern — it's that the best human-AI collaboration is bidirectional. Both parties ask questions, both parties learn."
canonical_url: "https://rajiv.com/blog/2025/12/09/bidirectional-learning-in-synthesis-coding/"
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
  - "bidirectional learning"
  - "testing"
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
This article explores the "bidirectional learning" concept — the insight that the best
synthesis coding involves BOTH parties teaching and learning. The human teaches the AI
through CLAUDE.md and prompts, but the AI also teaches the human by surfacing unknowns,
questioning assumptions, and revealing blind spots.

RELATIONSHIP TO OTHER ARTICLES:
- Article 1 (Foundation): WHY synthesis coding exists, how it differs from vibe coding
- Article 2 (Framework): Four Pillars, organizational implementation
- Article 3 (Technical Guide): Claude Code workflows, concrete examples
- Article 4 (Case Study): Blogroll Links modernization
- Article 5 (Best Practices): CLAUDE.md configuration, defensive patterns, workflow safeguards
- THIS ARTICLE (Bidirectional Learning): Human-AI mutual teaching and testing patterns

This article was originally Part 6 and Part 7 of the Best Practices article, but was
split into its own article to give the concept proper attention and depth.

See also: [Synthesis Coding Best Practices](/blog/2025/12/08/synthesis-coding-best-practices-lessons-from-production-workflows/)

CRITICAL INSTRUCTION:
NEVER condense or simplify content. The author needs comprehensive, deep, technical
substance. Add depth, don't remove it.

=============================================================================
-->

*Most synthesis coding discussions focus on human → AI: how to configure AI behavior, how to review AI output, how to constrain AI mistakes. This is essential but incomplete. The expert synthesis coder also knows how to learn from the AI.*

## Introduction

The most powerful insight about synthesis coding isn't in any technical pattern. It's this: **the best human-AI collaboration is bidirectional**. The human teaches the AI through CLAUDE.md, prompts, and review. But the AI also teaches the human — surfacing unknowns, questioning assumptions, and revealing blind spots.

This article explores that bidirectional relationship and the testing discipline that supports it. It's the complement to [Synthesis Coding Best Practices](/blog/2025/12/08/synthesis-coding-best-practices-lessons-from-production-workflows/), which covers CLAUDE.md configuration, defensive patterns, and workflow safeguards. Where that article focuses on how humans guide AI, this one explores how AI can guide humans — and how both parties can teach each other.

---

## Part One: The Socratic Synthesis Model

Traditional coding assistance is transactional:
- Human asks → AI answers
- Human requests → AI implements
- Human reviews → AI revises

Socratic synthesis is conversational:
- Human asks → AI answers → **AI asks back**
- Human requests → AI implements → **AI questions assumptions**
- Human reviews → AI revises → **AI surfaces what human missed**

The key shift: **both parties ask questions**.

**Questions AI Should Ask the Human:**

```
"I've implemented this feature. Before we proceed:
- Should I write comprehensive tests?
- What edge cases should we cover?
- Are there existing patterns in the codebase I should follow?"

"I notice this function has no tests. Should I add them?"

"This implementation works, but I noticed the codebase uses a different
pattern elsewhere. Should I match the existing pattern?"

"I'm about to modify this file. I see it was last changed recently.
Should I check if there are related changes I should be aware of?"
```

**Questions Human Should Ask the AI:**

```
"What am I missing?"

"What could go wrong with this approach?"

"What don't I know that I should know?"

"Are there edge cases I haven't considered?"

"What would a senior engineer criticize about this implementation?"

"What assumptions am I making that might be wrong?"
```

---

## Part Two: The Verification Question Pattern

After implementing any feature, the AI should proactively ask verification questions. This isn't about the AI being uncertain — it's about catching human blind spots.

### Real-World Example: The Missing Tests

A feature was implemented and working. The human was ready to commit. Then:

```
Human: "Looks good, let's commit this."

AI: "Before we commit, I want to verify: did you want me to write
comprehensive tests for this feature? I implemented the functionality
but didn't add tests unless you wanted them."
```

This simple question caught a significant gap. The human had assumed tests were included. They weren't. Without the verification question, incomplete code would have been committed.

### The Pattern in Practice

Encode verification questions into your workflow. After implementation:

1. **Tests**: "Should I write comprehensive tests? What edge cases should I cover?"
2. **Documentation**: "Should I update the README or CHANGELOG?"
3. **Patterns**: "Does this match the patterns used elsewhere in the codebase?"
4. **Edge cases**: "What happens when [X] is null/empty/malformed?"
5. **Dependencies**: "Are there other files that depend on this that need updating?"

### CLAUDE.md Guidance for Verification Questions

```markdown
### Post-Implementation Verification

After implementing any feature, proactively ask:

1. "Should I write comprehensive tests for this?"
2. "Should I update documentation (README, CHANGELOG)?"
3. "Does this implementation match existing patterns in the codebase?"
4. "What edge cases should we verify?"

Don't assume the human remembered everything. Your job is to catch blind spots.
```

---

## Part Three: The Human Learning from AI — Discovering Unknowns

The flip side of verification questions is equally important: the human should actively ask the AI to reveal what they don't know.

### The "What Am I Missing?" Pattern

After designing a solution but before implementing:

```
Human: "I'm planning to implement X by doing Y. What am I missing?
What could go wrong? What don't I know that I should know?"
```

This leverages the AI's broad knowledge to surface:
- Edge cases the human didn't consider
- Existing patterns the human wasn't aware of
- Potential failure modes
- Security implications
- Performance considerations

### Real-World Example: The Featured Image Gap

While implementing image downloading for a content sync tool, the AI implemented downloading of images in the article body. It worked. Tests passed. But:

```
Human: "What am I missing about making local files self-sufficient?"

AI: "The featured_image in YAML front matter also contains a remote URL.
Currently we download body images but not the featured image. This creates
an inconsistency — the article body works offline but the featured image
still points to a remote URL."
```

This question revealed a gap the human hadn't considered. The fix was straightforward once identified, but without asking, the inconsistency would have shipped.

### The Expert Mindset Paradox

Here's a subtle but important point: **experts should ask more "naive" questions, not fewer**.

A novice doesn't know what they don't know, so they can't ask. An expert knows enough to know there's more to know, so they deliberately ask questions like:

- "What assumptions am I making?"
- "What would break this?"
- "What would a critic say about this approach?"
- "What's the simplest thing that could go wrong?"

The AI becomes a tool for systematic exploration of the unknown, not just implementation of the known.

---

## Part Four: Mutual Teaching — The Learning Loop

The most sophisticated synthesis coding creates a learning loop where both parties improve:

```
Round 1: Human provides context → AI implements
Round 2: AI asks verification questions → Human realizes gaps
Round 3: Human asks "what am I missing?" → AI reveals unknowns
Round 4: Human teaches AI (via CLAUDE.md updates) → Better future implementations
Round 5: AI surfaces patterns from across the codebase → Human learns their own code better
```

**What the Human Teaches the AI:**
- Domain knowledge (business rules, user needs)
- Quality standards (what "good" looks like)
- Constraints (security, performance, compliance)
- Patterns (how this codebase does things)
- Context (why decisions were made)

**What the AI Teaches the Human:**
- Blind spots (edge cases, missing tests)
- Existing patterns (code elsewhere that's relevant)
- Best practices (industry standards the human forgot)
- Alternatives (approaches the human didn't consider)
- Connections (how changes affect other parts of the system)

### CLAUDE.md for Bidirectional Learning

Document the expectation of bidirectional learning:

```markdown
### Learning in Both Directions

**AI responsibilities:**
- Proactively ask verification questions after implementing features
- Surface potential issues, edge cases, and blind spots
- Point out when implementation differs from existing patterns
- Suggest tests, documentation updates, and improvements

**Human responsibilities:**
- Ask "what am I missing?" before finalizing designs
- Ask "what could go wrong?" before deploying changes
- Listen when AI raises concerns, don't dismiss them
- Update CLAUDE.md with lessons learned to help future sessions

The goal is not AI autonomy or human control, but mutual improvement.
```

---

## Part Five: Teaching AI to Teach You

The ultimate synthesis coding skill is teaching the AI how to teach you. This means:

1. **Reward good questions**: When the AI asks a useful verification question, acknowledge it. This reinforces the behavior pattern.

2. **Probe for more**: When the AI implements something, ask "what else should I know?" Don't accept "looks complete" at face value.

3. **Document discoveries**: When the AI reveals something you didn't know, add it to CLAUDE.md or documentation. This makes the learning permanent.

4. **Create feedback loops**: After a bug is found, ask "what question could have caught this earlier?" Add that question to your verification checklist.

The human remains the expert. The AI is a tool. But the expert who uses the tool to discover their own blind spots will consistently outperform the expert who only uses it for implementation.

---

## Part Six: Testing Patterns for AI-Generated Code

Testing is where synthesis coding either succeeds or fails. AI can write code that looks correct, passes a quick review, and then fails in production. Comprehensive testing is the safeguard.

### The "Tests Required" Principle

Every significant feature needs tests. This seems obvious but is consistently violated because:
- The AI doesn't write tests unless asked
- The human is eager to see the feature "working"
- "We'll add tests later" becomes "we never added tests"

**The Pattern**

Make testing non-negotiable in CLAUDE.md:

```markdown
### Testing Requirements

After implementing ANY feature that:
- Modifies data
- Has edge cases
- Could fail silently
- Will be used by other code

You MUST either:
1. Write tests immediately, OR
2. Explicitly ask "Should I write tests for this?"

Never assume tests aren't needed. Never assume the human will remember to ask.
```

### The Test-First Discovery Pattern

Writing tests before implementation reveals requirements you didn't know you had.

**Real-World Example: The Wrong Expectation**

When writing tests for `getImageBaseKey()`, the test expected:

```javascript
// Expected (wrong assumption)
assert.strictEqual(baseKey, '/wp-content/uploads/2024/01/image.jpg');
```

The test failed. The actual implementation returns:

```javascript
// Actual (correct)
assert.strictEqual(baseKey, 'https://example.com/wp-content/uploads/2024/01/image.jpg');
```

The function returns the full URL with origin, not just the path. Writing the test revealed this misunderstanding *before* any code depended on the wrong assumption.

**The Lesson**

Before writing tests, ask the AI:
- "What does this function actually return?"
- "Show me the function signature and any documentation"
- "What are the edge cases this function handles?"

Then write tests that match reality, not assumptions.

### Exporting Internal Functions for Testing

A common tension in testing: internal helper functions often need to be exported just for testing.

**The Problem**

You have a helper function like `getImageBaseKey()` that's used internally by `rewriteImageUrls()`. Good encapsulation says: don't export internal helpers. But comprehensive testing says: you need to test `getImageBaseKey()` directly.

**The Solution: Export for Testing**

```javascript
// At the bottom of the module
module.exports = {
  // Public API
  fetchArticle,
  rewriteImageUrls,

  // Internal functions exported for testing
  getImageBaseKey,
  normalizeWordPressImageUrl,
  urlToFilename
};
```

**CLAUDE.md Guidance**

```markdown
### Testing Internal Functions

When implementing internal helper functions:

1. If the function has complex logic or edge cases, export it for testing
2. Document that it's "exported for testing" if it's not part of the public API
3. Write direct unit tests for the helper, not just indirect tests through the public API

The encapsulation vs testability tradeoff: choose testability. A tested internal function is better than an untested "properly encapsulated" one.
```

### Comprehensive Test Coverage for Image Handling

Here's an example of what "comprehensive" means for a feature like image URL rewriting:

**Function: `rewriteImageUrls(content, urlMap)`**

Tests needed:
1. Basic markdown image: `![alt](url)` → `![alt](./local.jpg)`
2. Multiple images in same content
3. HTML `<img src="">` attributes
4. **Featured image in YAML front matter** (the often-missed case)
5. Featured image with size variant URLs
6. Linked images: `[![alt](thumb)](full)`
7. Non-image URLs in regular links (should NOT be rewritten)
8. Empty urlMap (should return content unchanged)
9. URLs with query parameters
10. URLs with WordPress size suffixes (-1024x768)
11. Jetpack CDN URLs (i0.wp.com)

**Function: `getImageBaseKey(url)`**

Tests needed:
1. Simple URL → returns URL with origin
2. URL with query parameters → strips them
3. URL with WordPress size suffix → strips it
4. URL with `-scaled` suffix → strips it
5. Jetpack CDN URL → handles correctly
6. URL with multiple patterns → handles all

This level of coverage is what "comprehensive" means. Each test case exists because that scenario can occur in production.

### The "What Could Fail Silently?" Test

For every function, ask: "What could fail silently?"

**Example: Image Download**

What could fail silently?
- Network request succeeds but returns wrong content (e.g., 404 page as HTML)
- Image file exists locally but is corrupted
- URL rewriting misses some images
- Featured image not included in the download list
- Sidecar file written in wrong format

For each silent failure mode, write a test that would catch it.

### Testing AI-Generated Code: The Trust Hierarchy

How much do you trust AI-generated tests?

```
High trust (AI can write these):
├── Unit tests for pure functions
├── Tests for documented behavior
└── Tests for obvious edge cases

Medium trust (AI writes, human reviews carefully):
├── Integration tests
├── Tests for business logic
└── Tests for security-relevant code

Low trust (human must verify deeply):
├── Tests for failure modes
├── Tests for race conditions
└── Tests that verify the test itself is correct
```

**The Meta-Testing Pattern**

For critical tests, verify that the test actually tests what you think it does:

```javascript
it('rewrites featured_image in YAML front matter', () => {
  const frontMatter = `---
featured_image: "https://example.com/image.jpg"
---`;

  // First, verify the test input is what we expect
  assert.ok(frontMatter.includes('featured_image:'));
  assert.ok(frontMatter.includes('https://'));

  const result = rewriteImageUrls(frontMatter, urlMap);

  // Then verify the output
  assert.ok(result.includes('featured_image: "./image.jpg"'));
  // Also verify we didn't accidentally match featured_image_alt
  assert.ok(!result.includes('featured_image_alt: ".'));
});
```

The additional assertions verify the test's assumptions are correct.

---

## Conclusion

Bidirectional learning transforms synthesis coding from a one-way command structure into a collaborative exploration. The human teaches the AI through CLAUDE.md, prompts, and domain expertise. The AI teaches the human through verification questions, pattern recognition, and systematic discovery of blind spots.

The testing patterns in this article support that bidirectional relationship. When the AI asks "should I write tests?", it's not uncertainty — it's catching a gap the human might have missed. When the human asks "what am I missing?", they're leveraging the AI's broader view to improve their own work.

This is the synthesis in synthesis coding: not human control over AI, not AI autonomy, but a genuine collaboration where both parties contribute their strengths and compensate for each other's weaknesses.

The expert synthesis coder knows that their expertise isn't diminished by asking the AI "what don't I know?" — it's enhanced. And the well-configured AI knows that asking verification questions isn't a sign of limitations — it's part of the job.

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Conde Nast's brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "[synthesis coding](https://synthesiscoding.com/)" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
