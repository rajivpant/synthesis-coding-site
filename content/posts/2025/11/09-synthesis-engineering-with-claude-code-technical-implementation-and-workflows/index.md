---
title: 'Synthesis Coding with Claude Code: Technical Implementation and Workflows'
slug: synthesis-engineering-with-claude-code-technical-implementation-and-workflows
date: '2025-11-09T19:39:00'
modified: '2025-12-09'
description: 'A hands-on guide to practicing Synthesis Coding (a.k.a. Synthesis Engineering) with concrete examples, real workflows, and lessons from production systems I wrote this blog post for Software Engineers, Architects, and Technical Leads. This one is code-heavy and implementation-focused. In the first t'
canonical_url: 'https://rajiv.com/blog/2025/11/09/synthesis-engineering-with-claude-code-technical-implementation-and-workflows/'
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
category: Technical guide
featured_image: 'https://i0.wp.com/rajiv.com/wp-content/uploads/2025/11/Synthesis-Engineering-Logo-2-e1764033363626.webp?fit=800%2C400&ssl=1'
wordpress:
  post_id: 6673
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
  synced_at: '2025-12-10T04:04:41.062Z'
---

*A hands-on guide to practicing **[synthesis coding](https://synthesiscoding.com/)** — the craft of rigorous AI-assisted development within the **synthesis engineering** discipline — with concrete examples, real workflows, and lessons from production systems*

![Claude Code: TODO: Everything. Let's start.](claude-code-todo-everything.png)
*Claude Code's minimalist interface belies its power: give it a TODO list and architectural direction, and synthesis coding begins.*

I wrote this blog post for Software Engineers, Architects, and Technical Leads. This one is code-heavy and implementation-focused.

In the first two articles of this series, I introduced synthesis engineering as an emerging professional practice and detailed the framework for organizational implementation. Now let's get technical.

This article demonstrates synthesis engineering using Claude Code — I'll use it because I understand it deeply, though these patterns apply broadly. The specific workflows are Claude Code implementations.

If you’re an engineer evaluating AI-assisted development approaches, this will show you concrete technical practices. If you’re a CTO assessing tools for your organization, this will help you understand what effective usage actually looks like. If you’re skeptical about AI coding tools, this might change your mind — or confirm your concerns, which is equally valuable.

## Why Claude Code for Synthesis Coding

Claude Code aligns particularly well with synthesis engineering principles.

Claude Code maintains conversation context across an entire project session. When you establish architectural decisions early in a session, Claude remembers and applies them consistently throughout implementation. If you establish that you’re using PostgreSQL with a specific ORM following repository pattern with service layer separation, Claude Code maintains those constraints across all subsequent code generation.

Real software systems aren’t single files. Claude Code can read and understand relationships across multiple files simultaneously — critical for maintaining system coherence while making changes. When refactoring an API endpoint, it can understand the controller, service layer, repository, and tests simultaneously, ensuring changes propagate correctly.

Claude Code excels at systematic analysis: security audits, performance bottlenecks, test coverage gaps, architectural issues. This aligns perfectly with synthesis engineering's emphasis on systematic quality.

Running directly in the terminal where engineers already work reduces friction. The workflow feels natural rather than requiring context switching to separate interfaces.

Some constraints worth understanding: Very large codebases can exceed context limits. You need to scope sessions appropriately. When implementing genuinely novel approaches without established patterns, Claude Code works but requires more iteration and verification. With complex legacy systems using outdated patterns, Claude Code can struggle to maintain consistency with existing patterns while also suggesting improvements. For teams generating massive amounts of code daily, API costs can become significant.

## Core Workflow 1: Building a Production API Endpoint

Here’s a real implementation end-to-end: adding rate-limited user authentication to an existing API service.

### Phase 1: Architectural Context Setting

This is the foundation. I don’t let Claude Code make these decisions — I establish them explicitly.

```bash
$ claude "I'm adding user authentication to our API service. Here's our architectural approach:

- PostgreSQL for user storage with SQLAlchemy ORM
- Repository pattern for data access
- Service layer for business logic
- JWT tokens for authentication with 1-hour expiry
- Redis for rate limiting (5 login attempts per IP per minute)
- Bcrypt for password hashing with cost factor 12
- Response models using Pydantic
- Structured logging with correlation IDs
- Error responses follow RFC 7807 problem details

Do you understand this architecture?"
```

Claude confirms understanding and asks clarifying questions: token refresh strategy, password requirements, account lockout policy, session management approach. I answer each explicitly, establishing complete architectural context.

These 2-3 minutes of architectural clarity save hours of refactoring later. I’m establishing constraints that ensure implementation consistency.

### Phase 2: Implementation with Iteration

I use Claude Code for rapid implementation:

```bash
$ claude "Generate the user model, repository, and initial database migration following our architecture"
```

Claude generates three files: SQLAlchemy model, data access layer, and database migration.

I review the generated code. The user model looks solid, but I notice an issue in the repository — it returns None for non-existent users, which makes error handling awkward downstream. I refine:

```bash
$ claude "The repository should raise UserNotFound exception instead of returning None. Update the repository pattern to use explicit exceptions for error cases."
```

Claude refactors appropriately. This is classic synthesis engineering: I caught the design issue, specified what I wanted, AI implemented it systematically across the file.

### Phase 3: Security Implementation

Authentication is security-critical, so I’m extremely explicit about requirements:

```bash
$ claude "Implement the authentication service with these security requirements:

1. Password hashing: bcrypt with cost 12, handle timing attacks
2. Rate limiting: Redis-based, 5 attempts per IP per minute
3. Token generation: JWT with HS256, include user_id and issued_at claims
4. No sensitive data in logs - mask emails in log output
5. Constant-time password comparison to prevent timing attacks
6. Account lockout: 10 failed attempts locks account for 1 hour

Include comprehensive error handling and security tests."
```

Claude generates the service implementation. I review it carefully, specifically checking password handling, rate limiting, and token generation.

Password handling uses bcrypt correctly with constant-time comparison. Rate limiting implementation is correct but missing edge case for Redis connection failure. Token generation has correct structure but no expiry claim.

I iterate:

```bash
$ claude "Two issues:
1. Rate limiter needs circuit breaker pattern - if Redis is down, fail open rather than blocking all auth
2. JWT tokens need 'exp' claim with 1-hour expiry

Fix both and explain your approach."
```

Claude updates the implementation and explains the circuit breaker logic. I verify it makes sense.

I’m reviewing systematically for security issues, then having AI fix them with specific requirements.

### Phase 4: Comprehensive Testing

The testing strategy:

```bash
$ claude "Generate comprehensive tests for the authentication system covering:

Happy path:
- Successful registration and login
- Token generation and validation

Security scenarios:
- SQL injection attempts in email field
- Password too weak (should reject)
- Rate limiting triggers correctly
- Account lockout after failed attempts
- Expired token rejection
- Invalid token signature rejection

Edge cases:
- Redis connection failure (circuit breaker)
- Database connection failure
- Concurrent login attempts
- Token issued at boundary timestamps

Include fixtures for test data and Redis mocking."
```

Claude generates a comprehensive test suite — over 100 tests covering scenarios I specified plus additional edge cases it identified.

I review the tests for whether they actually test what they claim to test. Found one issue where a test claimed to test SQL injection but didn’t actually attempt injection or verify the database wasn’t affected. I have Claude fix it to properly verify database integrity.

Time accounting: Architectural planning took 15 minutes. Implementation iterations took 45 minutes. Security review and refinement took 30 minutes. Test generation and review took 25 minutes. Total: about 2 hours for production-ready authentication system.

Traditional approach would have taken me 6-8 hours. But I maintained the same (arguably higher) quality standards through systematic review.

## Core Workflow 2: Performance Optimization

Something more sophisticated: optimizing a slow API endpoint in a production system.

### The Problem

A dashboard API endpoint was taking 2-3 seconds to respond. Users were complaining.

### Phase 1: Systematic Analysis

```bash
$ claude "Analyze the /api/dashboard endpoint for performance bottlenecks. Review:
- Database queries (check for N+1 patterns)
- Serialization overhead
- External API calls
- Missing indexes
- Cache opportunities

Provide specific line numbers and explain the impact of each issue."
```

Claude analyzes the code and identifies: N+1 query in user dashboard (loading user, then querying posts individually, resulting in 40-50 queries per request), missing database index (filtering posts by user\_id without index), synchronous external API calls (fetching user avatars from external service sequentially), JSON serialization using default serializer (missing optimization), and no caching (dashboard data rarely changes but rebuilds every request).

Each finding includes line numbers, explains the performance impact, and estimates improvement potential.

I don’t blindly trust this analysis. I verify against actual production metrics. The N+1 query is definitely real (I can see it in our APM). The external API calls are actually cached by a CDN, so that’s a false positive. The missing index is correct and probably significant.

### Phase 2: Targeted Optimization

I prioritize based on impact:

```bash
$ claude "Fix the N+1 query using SQLAlchemy eager loading. Show me the before and after queries that will be executed."
```

Claude updates the query to use eager loading and shows me the actual SQL that will execute. I verify this is correct.

Next optimization:

```bash
$ claude "Add database index for posts.user_id. Generate the migration and explain the query plan improvement."
```

Claude generates the migration and explains how the query planner will use the index. I check this makes sense against our table size and query patterns.

### Phase 3: Caching Layer

```bash
$ claude "Implement Redis caching for dashboard data:
- Cache key: dashboard:{user_id}
- TTL: 5 minutes
- Invalidate on: user post creation, user profile update
- Handle cache miss gracefully
- Include cache hit/miss metrics

Follow our existing Redis client patterns in services/cache.py"
```

Claude generates the caching implementation following our existing patterns. I review for cache key collisions (good namespacing), race conditions (missing lock on cache invalidation), and metrics (properly integrated).

I have it add cache invalidation locking:

```bash
$ claude "Add distributed lock for cache invalidation to prevent thundering herd when cache expires under high load. Use Redis-based locking with 10-second timeout."
```

### Phase 4: Validation

I don’t trust the optimizations without measurement:

```bash
$ claude "Generate load test script that:
- Simulates 100 concurrent users
- Requests dashboard endpoint
- Measures p50, p95, p99 latency
- Reports query count and cache hit rate
- Runs for 60 seconds

Use locust framework."
```

Claude generates comprehensive load test. I run it against staging.

Before optimization: p50 latency 2,100ms, p95 latency 3,400ms, 45 queries per request, no cache. After optimization: p50 latency 180ms (91% improvement), p95 latency 340ms (90% improvement), 1 query per request, 87% cache hit rate.

Synthesis engineering means systematic analysis, targeted optimization, and rigorous validation. AI accelerated every phase, but I maintained architectural control and quality standards.

## Advanced Pattern 1: Event Loop Architecture and True Parallelism

Diagnosing and fixing concurrency issues in an agentic AI system that orchestrates multiple LLM API calls.

### The Problem: Async That Wasn’t Actually Async

I built an agentic workflow system where specialized AI agents collaborate to process complex tasks. The architecture was designed for parallelism — multiple agents should execute concurrently, not serially. When I tested with three agent calls (each taking 25-30 seconds), I expected ~30 second total execution. I got 90+ seconds.

The code looked correct. Async/await everywhere. But the system executed serially.

### The Investigation

This is where deep technical understanding matters. I didn’t ask Claude Code to “fix the slow code.” I diagnosed the conceptual problem first.

The architecture supported concurrent execution. PostgreSQL connection pooling was configured (20 connections + 10 overflow). The Python event loop should parallelize I/O-bound operations. The bug had to be in how we were using async, not the async syntax itself.

Twenty minutes of investigation revealed it: we’d used `anthropic.Anthropic()` (synchronous client) instead of `anthropic.AsyncAnthropic()`. Every AI API call blocked the event loop, forcing serial execution despite perfect async syntax.

### The Fix: Proper Async Architecture

Here’s what proper async architecture looks like for multi-agent orchestration:

```python
# WRONG - Blocks event loop
from anthropic import Anthropic

client = Anthropic(api_key=settings.anthropic_api_key)

async def generate_variant(variant_id: str):
    # This BLOCKS despite being in async function
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

# RIGHT - True async execution
from anthropic import AsyncAnthropic

client = AsyncAnthropic(api_key=settings.anthropic_api_key)

async def generate_variant(variant_id: str):
    # Event loop can context-switch during API call
    response = await client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

The fix required systematic updates across the codebase. I used Claude Code to help with the refactoring:

```bash
$ claude "Refactor all Anthropic client usage to AsyncAnthropic. Files to update:
- services/ai_client.py (client initialization)
- agents/research.py (3 call sites)
- agents/synthesis.py (2 call sites)
- agents/validation.py (1 call site)

Ensure all call sites use 'await' and functions are marked async. Verify connection pooling settings match our PostgreSQL configuration."
```

Claude systematically updated all six files, ensuring async consistency. I reviewed each change to verify correctness.

### Rate Limiting for Concurrent API Calls

True parallelism created a new problem: without rate limiting, we’d slam the Anthropic API with concurrent requests exceeding our tier limits.

```bash
$ claude "Add semaphore-based rate limiting for concurrent Anthropic API calls:
- Max 30 concurrent requests (matching our connection pool size)
- Queue additional requests
- Include metrics for queue depth and wait time
- Graceful degradation if semaphore acquisition times out

Implement in services/ai_client.py following our existing patterns."
```

Claude generated the rate limiting implementation:

```python
import asyncio
from contextlib import asynccontextmanager

class RateLimitedAIClient:
    def __init__(self, max_concurrent: int = 30):
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    @asynccontextmanager
    async def acquire(self):
        async with self.semaphore:
            yield

    async def create_message(self, **kwargs):
        async with self.acquire():
            return await self.client.messages.create(**kwargs)
```

I reviewed this and caught a subtle issue: the semaphore prevents more than 30 concurrent *acquisitions*, but doesn’t enforce fair queuing. Under high load, some requests could starve. I had Claude add fairness:

```bash
$ claude "Add fair queuing to the semaphore - requests should be processed FIFO, not randomly when slot becomes available."
```

### The Result

After refactoring: Three concurrent agent calls completed in 32 seconds (3x improvement). The system now properly parallelizes I/O-bound operations. Rate limiting prevents API tier violations. Metrics show healthy queue behavior under load.

Synthesis engineering principle: AI didn't diagnose the root cause (synchronous client blocking event loop). I did that through systems thinking and debugging experience. But once I understood the problem, AI systematically applied the fix across six files with perfect consistency.

## Advanced Pattern 2: Security Audit and Systematic Remediation

Security reviews demonstrate synthesis engineering's systematic quality approach.

### The Scenario

Before deploying a new API service to production, I wanted comprehensive security review. Not just “does it look secure?” but systematic analysis against known vulnerability classes.

### Phase 1: Systematic Security Analysis

```bash
$ claude "Perform comprehensive security audit of our API service against OWASP Top 10:

1. Injection vulnerabilities (SQL, NoSQL, command)
2. Authentication failures
3. Sensitive data exposure
4. XML external entities (if applicable)
5. Broken access control
6. Security misconfiguration
7. Cross-site scripting (XSS)
8. Insecure deserialization
9. Known vulnerabilities in dependencies
10. Insufficient logging and monitoring

For each category:
- Check if vulnerability exists
- Provide specific file and line numbers
- Explain potential exploit
- Recommend remediation

Review files in: routes/, models/, services/, middleware/"
```

Claude systematically analyzed the codebase and identified seven issues:

**SQL Injection (routes/search.py, line 47):** Raw string formatting in search query. Potential for SQL injection via search parameter.

**Sensitive Data Exposure (models/user.py, line 23):** Password hashes returned in API responses for admin endpoints.

**Broken Access Control (routes/admin.py, line 12):** Admin routes check for user.is\_admin but don’t validate JWT contains admin claim.

**Security Misconfiguration (config/settings.py, line 8):** DEBUG=True in production configuration.

**Insecure Deserialization (routes/webhooks.py, line 34):** pickle.loads() on webhook payload without signature verification.

**Known Vulnerabilities:** Dependency audit shows Pillow 9.0.0 has known vulnerability CVE-2022-22817.

**Insufficient Logging:** No audit logs for admin actions or authentication failures.

Each finding included specific code references and exploitation scenarios.

### Phase 2: Prioritization and Remediation

I don’t fix everything blindly. I verify each finding and prioritize by severity.

The SQL injection is real and critical. The insecure deserialization is real but the webhook endpoint is internal-only (still needs fixing). The password hash exposure is a false positive — that endpoint is only for debugging in development. The DEBUG flag is concerning — I check our deployment configs and it’s correctly set to False in production, just True in local dev config.

Systematic remediation:

```bash
$ claude "Fix the SQL injection in routes/search.py. Use parameterized queries with SQLAlchemy. Show me the vulnerable code and the corrected version side-by-side."
```

```bash
$ claude "Fix the insecure deserialization in routes/webhooks.py.
- Replace pickle with JSON
- Add HMAC signature verification using webhook secret
- Reject requests with invalid signatures
- Log rejected requests for security monitoring

Follow patterns in middleware/auth.py for signature verification."
```

```bash
$ claude "Fix the access control issue in routes/admin.py.
- Verify JWT contains 'admin' scope claim
- Raise 403 if claim missing or false
- Add test cases for:
  - Valid admin JWT allows access
  - Valid user JWT without admin claim returns 403
  - Invalid JWT returns 401
  - Missing JWT returns 401"
```

For each fix, Claude generated the corrected code. I reviewed for correctness and security.

### Phase 3: Dependency Updates

```bash
$ claude "Generate requirements.txt update that:
- Updates Pillow to latest stable version (verify CVE-2022-22817 is fixed)
- Checks all other dependencies for known vulnerabilities
- Notes any breaking changes requiring code updates
- Provides migration guide if API changes exist"
```

Claude updated dependencies with detailed migration notes. I reviewed against our usage patterns to ensure no breaking changes affected our code.

### Phase 4: Security Test Suite

```bash
$ claude "Generate security-focused test suite covering:

SQL Injection attempts:
- Single quotes in search
- Union-based injection
- Time-based blind injection

Access control tests:
- Attempt admin actions without admin claim
- Token tampering detection
- Privilege escalation attempts

Deserialization tests:
- Webhook with invalid signature rejected
- Malicious pickle payload rejected
- Well-formed JSON webhook accepted

Include both positive (attack blocked) and negative (legitimate use allowed) test cases."
```

Claude generated 40+ security tests. I reviewed them focusing on whether they actually test security properties vs. just covering code paths.

### The Result

The security audit found seven issues. Five were real vulnerabilities. Two were false positives or non-production concerns. All real issues were systematically remediated and covered by tests. The process took 3 hours. Manual security review by a security team would have taken days and potentially missed the systematic coverage we achieved.

Synthesis engineering principle: I directed the audit scope and categories. I validated findings and prioritized remediation. AI performed systematic analysis more thoroughly than humans typically would and generated comprehensive test coverage.

## When synthesis coding works well vs. when it struggles

After hundreds of hours using this approach, I've learned when it excels and when it struggles.

### Excellent Results For:

**CRUD APIs and standard patterns** – If you're building RESTful APIs with standard database operations, synthesis engineering is exceptional. The patterns are well-established, testing is straightforward, and AI understands them deeply.

**Refactoring and modernization** – Taking legacy code and modernizing it — updating deprecated APIs, improving structure, adding tests — is tedious for humans but perfect for AI assistance.

**Comprehensive testing** – Generating test suites covering edge cases, security scenarios, and error conditions. AI is more systematic than humans at this.

**Security audits** – Systematic checking for common vulnerabilities. AI doesn’t get tired or skip patterns.

**Documentation** – Generating API docs, architecture documentation, runbooks. Stays current because regeneration is easy.

### Requires More Iteration:

**Complex business logic** – When rules are nuanced and context-dependent, expect more iteration to get AI to understand the requirements correctly.

**Performance optimization** – AI can identify bottlenecks and suggest optimizations, but validating they actually work requires human measurement and judgment.

**Integration with legacy systems** – AI struggles with undocumented legacy patterns and quirky existing code. Human knowledge is critical here.

**Novel algorithms** – If you’re implementing something genuinely new without established patterns, AI provides less value — you’re doing original work, not applying patterns.

### Poor Results For:

**Distributed systems debugging** – When you have race conditions, timing issues, or complex system interactions, AI’s analysis is limited. Human experience and intuition are essential.

**Architectural strategy decisions** – Should we use microservices or monolith? Event-driven or request-response? These require human judgment about tradeoffs AI can’t fully evaluate.

**Product decisions** – What features to build, how to prioritize, what user experience makes sense — fundamentally human decisions.

---

### December 2025 update: organizational content moved

*Based on feedback from [Guthrie Collin](https://www.linkedin.com/in/guthriecollin/), I've reorganized this article to better serve different audiences. The "Organizational Adoption" section that previously appeared here has been expanded into a dedicated article: [Scaling Synthesis Coding in Your Organization](https://rajiv.com/blog/2025/12/09/scaling-synthesis-coding-in-your-organization/).*

*That article provides comprehensive guidance for CTOs and engineering leaders on:*
- *Cost analysis and ROI framework*
- *Week-by-week team rollout strategy*
- *Training curriculum for different experience levels*
- *Security and compliance considerations*
- *Metrics for tracking adoption success*

*This article remains focused on the technical workflows. Thank you, Guthrie, for helping make this series more accessible to different audiences.*

---

## What I've learned

After months of practicing synthesis engineering with Claude Code, this approach amplifies engineering skill rather than replacing it.

The engineers who thrive aren't those who reject AI or those who blindly accept its output. They're those who maintain architectural thinking and quality standards while using AI's systematic analysis and rapid implementation capabilities.

### Key Takeaways for Practitioners:

Architectural authority is non-negotiable. You decide the architecture, AI implements it.

Quality standards must be maintained. Review everything, trust nothing initially.

Systematic beats ad-hoc. Have frameworks for how you use AI, don’t make it up each time.

Understanding is essential. If you don’t understand what AI generated, either learn it or reject it.

Context matters. Different problems need different approaches.

### For engineering leaders

For organizational guidance—cost analysis, team rollout strategy, training curriculum, and metrics—see [Scaling Synthesis Coding in Your Organization](https://rajiv.com/blog/2025/12/09/scaling-synthesis-coding-in-your-organization/).

### The path forward

Synthesis engineering is emerging as the professional practice for AI-assisted development. The next evolution will bring more sophisticated AI architectural analysis, better integration with existing development tools, organizational patterns and best practices, and educational programs and training materials.

The fundamentals won't change: systematic integration of human expertise with AI capabilities, maintaining engineering discipline while accelerating delivery, and building software that's both fast to create and sustainable to maintain.

That's the promise of synthesis engineering. That's what I'm building. That's what I'm teaching.

The future of software engineering combines systematic human expertise with AI capabilities.

## A Note to the Claude Code and Anthropic Communities

The synthesis engineering framework maps directly to Claude Code's capabilities – the extended context, the MCP servers, the systematic project approach. These tools enable this practice.

I'm releasing "synthesis engineering" (the discipline) and "synthesis coding" (the craft), along with the logo, under CC0 1.0 Universal. If Anthropic finds these terms useful for documentation, training, or community building around Claude Code, use them freely. If developer communities want shared vocabulary for professional AI-assisted development practices, here it is.

The terminology exists to serve the practice. Use whatever helps teams work more effectively.

---

*This article is part of the [synthesis engineering series](https://synthesiscoding.com/), which explores the discipline of rigorous human-AI collaboration in professional software development.*

---

*Rajiv Pant is President of [Flatiron Software](https://www.flatiron.software/) and [Snapshot AI](https://www.snapshot.reviews/), where he leads organizational growth and AI innovation. He is former Chief Product & Technology Officer at The Wall Street Journal, The New York Times, and Hearst Magazines. Earlier in his career, he headed technology for Conde Nast's brands including Reddit. Rajiv has been working with AI in software engineering since the early days of natural language processing and was an early investor and advisor to AI search company [You.com](https://you.com/). He coined the terms "synthesis engineering" and "[synthesis coding](https://synthesiscoding.com/)" to describe the systematic integration of human expertise with AI capabilities in professional software development. Connect with him on [LinkedIn](https://www.linkedin.com/in/rajivpant/) or read more at [rajiv.com](https://rajiv.com/).*
