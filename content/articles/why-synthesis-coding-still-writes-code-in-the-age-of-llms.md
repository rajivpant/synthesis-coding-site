---
title: "Why Synthesis Coding Still Writes Code in the Age of LLMs"
slug: "why-synthesis-coding-still-writes-code-in-the-age-of-llms"
date: "2025-12-04"
description: "The answer is not \"just let the model do it\" — and code matters more, not less, as AI gets dramatically better Last spring, my son Fitz and I had an afternoon math duel. He was twelve at the time. Sharp. Competitive. He took on the puzzle the traditional way — paper, pencil, and focused [...]"
canonical_url: "https://rajiv.com/blog/2025/12/04/why-synthesis-coding-still-writes-code-in-the-age-of-llms/"
categories:
  - "Technology"
tags:
  - "artificial intelligence"
  - "CTO"
  - "ctobook"
  - "programming"
  - "software engineering"
  - "synthesis coding"
  - "synthesis engineering"
  - "vibe coding"
author: "Rajiv Pant"
category: "Philosophical foundation"
featured_image: "https://i0.wp.com/rajiv.com/wp-content/uploads/2025/11/Synthesis-Engineering-Logo-2-e1764033363626.webp?fit=800%2C400&ssl=1"
wordpress:
  post_id: 6788
  category_ids: [6]
  tag_ids: [12374, 276453, 485374580, 8434, 196, 11176, 727048346]
  author_id: 918046
  synced_at: "2025-12-06T03:21:47.819Z"
---

*The answer is not “just let the model do it” — and code matters more, not less, as AI gets dramatically better*

Last spring, my son Fitz and I had an afternoon math duel.

He was twelve at the time. Sharp. Competitive. He took on the puzzle the traditional way — paper, pencil, and focused reasoning. I took a different path: I asked a generative AI system to design algorithms, write Python code, and run that code to search systematically for correct solutions.

The puzzle itself was one of those constraint problems that sounds simple until you try it — combine these numbers using these operations to reach this target — and Fitz solved it elegantly through raw mathematical intuition. Meanwhile, I was prompting ChatGPT through an iterative process: restate the constraints, propose algorithms, select one with justification, generate code, execute, and show results.

I [wrote about that experience](https://rajiv.com/blog/2024/05/25/prompt-engineering-to-generate-code-to-solve-a-math-problem/) at the time. But looking back now — Fitz is thirteen, the models have improved substantially, and I’ve spent the intervening months developing the synthesis coding framework — the interesting part wasn’t that an LLM could “do math.” The interesting part was *how* it did it: by generating real code that executed in a predictable environment, following explicit rules, producing a result I could inspect, rerun, and extend.

That pattern — using an LLM to synthesize code instead of treating the LLM itself as the final execution environment — sits at the heart of what I've been calling synthesis coding. And it's a pattern I keep returning to as models get more capable, because the temptation keeps growing to ask a different question entirely:

*Why write code at all? Can’t I just tell the AI what I want?*

That question sounds reasonable. It’s also, I believe, the wrong long-term strategy for serious systems. This article is about why.

## The Two Modes of Working with an LLM

When you bring a technical problem to an LLM, you’re usually doing one of two things, whether you realize it or not.

The first mode is asking for a direct answer. Here’s my data — what’s the median? Here’s the stack trace — what’s wrong? Here’s a word problem — what’s the answer? The LLM processes your input, does some internal reasoning, and hands you a result. Quick, convenient, often useful.

The second mode is asking it to build a tool. Write a Python script that loads this CSV and computes the median for each group. Generate a test harness that reproduces this error and logs all SQL queries. Create a program that searches systematically for valid equations using these numbers and rules.

In the math duel with Fitz, I deliberately chose the second mode. Instead of letting the model wing it in natural language, I asked it to restate the problem and constraints, propose multiple algorithms, compare them, select one with a clear rationale, generate Python code implementing that algorithm, and then run the code and show the result.

That’s not just a clever trick for winning friendly competitions with a seventh-grader. It’s a template for how serious teams should think about LLMs going forward — and it generalizes from family math games to enterprise platforms with surprisingly little adjustment.

## The Seductive Logic of “Just Talk to the Computer”

Model improvement has been so rapid that some people have extrapolated a straight line to an obvious endpoint: if LLMs can already generate working code and solve many problems directly, surely the destination is a world where we just talk to the computer and it does everything.

I don’t think that’s where we end up. Even if LLMs become orders of magnitude better — and they will — there are structural reasons why “do everything directly in the LLM” remains a poor operating model for most serious software and data systems.

These reasons don’t depend on any specific model’s limitations. They’re about how organizations actually need to operate under uncertainty, risk, and time.

**Natural language is optimized for humans, not systems.** The flexibility and ambiguity that make natural language so powerful for human communication are precisely what make it unsuitable for production systems. Those systems need stable interfaces that don’t subtly shift meaning between runs, unambiguous semantics that survive reorganizations and staff turnover, and deterministic behavior where identical inputs reliably produce identical outputs. Code remains the best format we’ve invented for expressing those constraints. Even if an LLM could perfectly understand every nuance of your instructions, the rest of your stack — databases, queues, APIs, regulatory reports, other teams — expects clear contracts, not remembered conversation history.

**You need artifacts that outlive the conversation.** Your most important systems must survive people changing roles, vendors changing pricing or policies, architectural evolution across platforms, and the introduction of new AI tools years from now. A direct LLM answer is an event. Code is an artifact. Artifacts can be versioned, reviewed, tested, deployed, archived, and audited. Events cannot. In the math puzzle with Fitz, the program the LLM generated was a reusable artifact. We could rerun it, change the target number, adjust the rules, or use it later as a teaching example. If I had just asked for “the answer,” there would have been nothing to build on.

**Debuggability isn’t optional.** Anyone who has operated a production system knows the 2 AM feeling: something broke, users are waiting, and you need to understand exactly what the system is doing. If your logic lives as “well, yesterday we had a conversation with the model and it agreed to do X,” you have no system you can interrogate. You have logs of prior interactions if you’re lucky, and a model that might or might not behave the same way again. If your LLM-generated logic lives as code, you can instrument it, add logging and metrics, write failing tests that prove a bug exists, bisect history to find which change introduced a regression. You can own the behavior instead of negotiating with it every time.

**Governance needs a traceable chain.** Long before regulators fully catch up with AI, enterprises already face basic questions: Why did the system make that decision for this customer on that date? What was the logic of our pricing model last quarter? Who changed the risk rules on the 15th, and what exactly changed? If core decision logic lives only in the dynamic behavior of an LLM, your answer becomes “the model said so, based on prompts we don’t fully reconstruct anymore.” That’s unacceptable in any domain with real stakes — finance, healthcare, safety, critical infrastructure, or even basic consumer trust. When you use LLMs to generate code, configuration, and explicit policies instead, you can snapshot the logic at each release, compare versions, attach human approvals to specific changes, and produce evidence of what the system would have done at any point in time.

**Teams need shared understanding.** In the [synthesis engineering framework](https://rajiv.com/blog/2025/11/09/the-synthesis-engineering-framework-how-organizations-build-production-software-with-ai/) article, I argued that the real value of this approach isn't individual productivity — it's institutional capability. A team's speed and reliability come from shared mental models: how this system is structured, where the boundaries are, what patterns are allowed or discouraged, how we handle errors and timeouts and retries and security and performance. If each engineer builds private conversational state with their favorite model, your "architecture" becomes a patchwork of personal prompt styles, undocumented assumptions, and one-off agreements with an opaque system. If instead the output of those conversations is code and documentation checked into shared repos, you get collective learning, code review as teaching mechanism, and architecture that remains coherent when people come and go. LLMs can accelerate how that collective understanding gets built. They cannot replace the need for it.

## The Synthesis Coding Pattern

The approach I've been developing across the [synthesis engineering series](https://synthesiscoding.com/) rests on four principles: Human Architectural Authority, Systematic Quality Standards, Active System Understanding, and Iterative Context Building. Apply those principles consistently, and you almost inevitably converge on a specific pattern: use LLMs as powerful collaborators that produce and evolve code, not as black-box oracles that silently execute arbitrary logic.

In practice, this means humans decide which languages, frameworks, and platforms to use; where state lives and how it’s modeled; what the trust boundaries are; which components are allowed to make which external calls. LLMs then operate inside that architecture. “Implement this repository pattern in our existing microservice.” “Generate a migration that moves us from schema v3 to v4 using our standard approach.” “Extend the existing logging middleware to include correlation IDs and user IDs, consistent with the current codebase.” The model isn’t inventing the system. It’s implementing parts of a system whose structure humans own. And the implementation lives as code.

The same logic applies to quality standards. In the [Claude Code implementation article](https://rajiv.com/blog/2025/11/09/synthesis-engineering-with-claude-code-technical-implementation-and-workflows/), I described workflows where every change — whether human-authored or AI-authored — flows through the same pipelines: tests, linters, security scanners. LLMs get used not only to write code, but also to review it, propose test cases, and highlight edge conditions. This entire approach assumes the existence of code as the shared substrate. You can't run static analysis on a conversation. You can't diff yesterday's vibes against today's. You can only do that on artifacts.

One underappreciated failure mode in naive AI-assisted development is that engineers gradually lose the ability to reason about their own systems. The AI "does the hard parts," and humans handle orchestration and glue. Synthesis coding pushes in the opposite direction. Use LLMs to explain existing code in multiple ways — by data flow, by call graph, by error handling paths. Ask models to generate diagrams, documentation, and tests that deepen human understanding. Insist that no critical subsystem exists that no human can explain at a whiteboard. When LLMs generate code, they do so in a way that remains legible — to you, your team, your future hires, and your future self.

In the [polyrepo synthesis](https://rajiv.com/blog/2025/11/30/polyrepo-synthesis-synthesis-coding-across-multiple-repositories-with-claude-code-in-visual-studio-code/) article, I explored how multi-repo work benefits from structured context: CLAUDE.md files, shared conventions, carefully curated prompts. The purpose of those context meshes is to make AI more effective at generating consistent code across repositories — auth, logging, error handling, feature flags — not at improvising behavior each time. Over time, the accumulated artifacts compound. The LLM becomes a way to navigate and extend that body of work, not a substitute for it.

## A Durable Heuristic

So how do you decide, moment to moment, whether to ask the model for a direct answer or ask it to design and generate code you’ll run and maintain?

Here’s a heuristic I expect to remain valid even as LLMs become dramatically more capable.

Direct LLM answers work fine when the stakes are low — you’re exploring ideas, learning a new library, sanity-checking your own reasoning. They’re appropriate when the result is ephemeral — you just need a one-off calculation, a quick draft, an explanation. They make sense when you’ll validate the result anyway through your own tests or comparisons. And they’re sufficient when the work won’t be reused by others — no one else depends on this interaction, it’s not a shared building block. This is what I’ve called the “vibe coding” end of the spectrum: high-speed, low-ceremony, perfect for exploration.

You should prefer LLM-generated code when the logic will be reused. Any time you think “I’ll probably need this again,” that’s a hint this should become a script, module, or service. Prefer code when multiple people or systems depend on it — if other engineers, teams, or user-facing features rely on this behavior, it deserves a stable home in your codebase. Prefer code when you need traceability — if you might ever be asked “why did it do that?” or “what changed between these two dates?”, you want explicit code and version history. Prefer code when the cost of being wrong is non-trivial — money, safety, reputation, or legal risk are on the line. And prefer code when you can imagine needing to debug it later, which is almost everything that matters.

The short version: if you’ll do it more than twice, or if anyone else will rely on it, you probably want code. LLMs dramatically lower the cost of producing that code. They don’t eliminate the need for it.

## From Math Puzzles to Platforms

The afternoon I spent solving puzzles with Fitz was, on the surface, simple: a list of numbers, a target result, a set of rules, a friendly competition between human reasoning and AI-assisted computation. But structurally, it’s very similar to problems that matter in real systems.

Pricing algorithms constrained by regulation and policy. Risk scoring models bounded by business rules. Scheduling systems that must obey precedence constraints. Recommender systems operating under fairness or diversity requirements. In each case you have inputs — data about customers, markets, portfolios, inventory — along with constraints from legal requirements, company policies, ethical boundaries, and performance targets. You have objectives: optimize some combination of revenue, risk, satisfaction, or efficiency.

You could ask an LLM directly: given this input, what should we do? Or you could use LLMs to design algorithms, generate code that implements those algorithms, run that code in controlled environments, observe behavior, write tests, and iterate.

The second approach requires more work upfront. It’s also the only one that scales to regulatory oversight, cross-team collaboration, multi-year evolution, and incident response. The math puzzle example was small. The pattern is big.

## Prompts That Create Code, Not Just Answers

To make this concrete, here are patterns you can embed into practice today.

The first pattern I call algorithm-then-code. You prompt the model: “First restate the problem and constraints. Then propose at least three algorithms. Compare them in terms of correctness, complexity, and implementation cost. Select one and justify your choice. Only then generate code implementing that algorithm.” This forces the model to make the problem explicit, separate reasoning from implementation, and give you human-readable rationale you can challenge. The output is code that a human can understand and trace back to an explicit design choice.

The second pattern is code-plus-tests-plus-invariants. “Generate the implementation, then generate a set of unit tests that would fail if the core invariants were violated. Finally, explain those invariants in plain language.” You’re asking for artifacts across three layers: implementation, tests, and human-level explanation. All three help you maintain active system understanding over time.

The third pattern is diff-aware refactoring. “Given this existing function and this target behavior, propose a minimal diff. Explain line by line why each change is necessary. Do not introduce new dependencies unless explicitly requested.” Here the LLM doesn’t own the whole conversation. It’s operating as a disciplined contributor inside an existing codebase, producing output that fits naturally into a pull request workflow.

These patterns embody synthesis coding: humans define the guardrails and expectations; AI operates energetically within them.

## What Happens When LLMs Get Much Better?

A reasonable objection: all of this might be true today, but what about when models become near-perfect? Won’t we eventually just talk to them and skip the code entirely?

Several things will change as models improve. They’ll make fewer obvious mistakes, so you’ll be able to trust them more for local reasoning steps. They’ll operate over larger, richer context windows, able to “see” more of your codebase and documentation at once. They’ll interact more deeply with tools and environments — running tests, inspecting logs, adjusting code autonomously.

But I don’t think any of that removes the need for explicit artifacts. If anything, it makes them more important.

The more powerful the system, the more governance you need. When a tool can change thousands of lines of code or deploy to production in minutes, you want more visibility, review, and auditability, not less.

We’ve been here before with compilers and runtimes. We don’t write machine code by hand anymore, but we still write source code that serves as the human-comprehensible contract. LLMs are a new layer in that stack, not a replacement for the idea of source.

Organizations change slower than models. Your company, regulators, and customers will adapt on multi-year timescales. During that time, you need a stable representation of what your systems do. Code, configurations, and policies will continue to play that role.

And human meaning doesn’t disappear. Even if a model could generate correct behavior from vague instructions, people still need to reason about trade-offs, ethics, incentives, and strategy. That reasoning needs anchors in artifacts that can be read, debated, and revised.

The experience of programming will keep changing. We’ll spend less time typing boilerplate and more time orchestrating. But the deeper pattern — humans defining architecture and standards, AI generating and evolving code within those constraints — looks robust across multiple generations of AI.

## The Heart of It

I've argued throughout this series that synthesis coding isn't merely "using AI to write code." That's table stakes now. Synthesis coding means treating architecture, standards, and context as first-class citizens. It means using LLMs to accelerate the creation and evolution of code, not to bypass it. It means building teams and organizations that can wield AI responsibly and effectively over years, not just in clever demos.

The math puzzle I worked on with Fitz was a small, playful example of that mindset. We took a fuzzy problem and turned it into explicit rules. We used natural language to instruct an LLM, but insisted on an algorithm and executable code as the outcome. We treated the generated program as an artifact we could reason about, not a mysterious oracle producing answers from nowhere.

That same pattern scales from family math games to multi-repo enterprise platforms. If you're an engineer, architect, or CTO wondering how to navigate the next decade of AI-assisted development, the north star I'd suggest is this: let LLMs expand what your teams can build, but keep code as the durable, shared source of truth.

That's the heart of synthesis coding. It's why, even as the models keep improving, we will still be writing code — just with far more capable collaborators at our side.

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Condé Nast’s brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "synthesis coding" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
