# Bilt: Practical Security Tooling

## Project

- Name: **Bilt** (`bilt-toolkit` on npm)
- Documentation: [https://bilt.nogs.dev/docs#security-analysis](https://bilt.nogs.dev/docs#security-analysis)
- Source Repository: [https://github.com/Samuel-0228/bilt](https://github.com/Samuel-0228/bilt)

Bilt is a developer security CLI toolkit designed to assess security requirements and identify application-level weaknesses in software developed with AI coding agents (such as Claude Code, Cursor, Windsurf, and Antigravity) as well as human engineering teams.

![Bilt GitHub Repository](screenshots/bilt-repository.png)

## Why I Built It

The project originated from the concept of taking foundational cybersecurity and application security principles and translating them into automated tooling for AI-assisted development workflows.

AI coding agents can rapidly generate large volumes of application code, boilerplate, and database queries. However, they frequently omit essential defensive patterns, such as verifying cryptographic signatures, preventing environment secret leakage into client bundles, validating incoming request payloads, or restricting data binding on persistence updates. Bilt was conceived as a local, zero-configuration verification tool to catch these security oversights directly within the developer's terminal or continuous integration pipeline before code is deployed.

## Connection to My Learning

The development of Bilt directly connects to the core subject areas explored during the INSA Summer Camp:

- OWASP Standards: OWASP guidelines (such as the OWASP Top 10 and API Security Top 10) provided the foundational taxonomy for categorizing security rules within Bilt, covering areas such as Cryptographic Failures (A02), Broken Access Control (A01), Injection (A03), and Identification and Authentication Failures (A07).
- Mass Assignment: Investigating mass-assignment weaknesses reinforced the need for automated inspection of incoming request bodies. In Bilt, specific checks trace data flowing from unconstrained `req.body` parameters directly into database write operations without schema boundaries.
- PHP Vulnerability Research: Studying PHP runtime vulnerabilities and untrusted input parsing emphasized how subtle runtime defaults can lead to severe security compromises. This reinforced the importance of building deterministic, static checks that enforce safe programming patterns at build time.
- Security Automation: Theoretical knowledge gained during network and web security studies was operationalized into runnable CLI tooling that automates repetitive verification tasks.

## What Bilt Does

### How It Is Used

Bilt is distributed as an npm package (`bilt-toolkit`) and executed via the command-line interface:

- `npx bilt check`: Runs deterministic static checks against the local codebase.
- `npx bilt scan`: Performs deeper security and dependency analysis across project files.
- `npx bilt doctor`: Diagnoses configuration errors, missing environment files, and framework inconsistencies.
- `npx bilt fix --safe`: Applies non-destructive automated fixes, such as extracting hardcoded secrets into `.env` files and generating `.env.example` templates.

### Security Analysis Architecture

Bilt relies on deterministic analysis rather than subjective heuristic scoring:

- Abstract Syntax Tree (AST) Parsing: Inspects code structure using Babel AST parsers and visitor walks to analyze function calls, import declarations, and expression patterns.
- Shannon Entropy Calculation: Calculates character entropy (`H > 4.5 bits/char`) alongside regex token patterns to identify hardcoded API tokens, private keys, and high-entropy secrets across 30+ service provider signatures.
- Data Flow Tracking: Traces parameters from HTTP route inputs (`req.body`, `req.query`, `req.params`) to database sinks (`prisma`, `db.query`, ORM models) to identify missing validation boundaries.

![Bilt Implemented Security Checks Matrix](screenshots/bilt-security-matrix.png)

### Relation to AI Coding Agents

In Bilt's design, AI does not act as the authority for whether a check passes or fails. Gate decisions are strictly governed by deterministic static analysis rules. Optional AI capabilities are limited to generating natural language explanations (`bilt explain`) and remediation proposals, ensuring predictable and verifiable gate outcomes.

### Implemented vs. Guided Checks

Bilt distinguishes between fully automated rules and guided review routines:

- Automated Rules (Mandatory Gates):
  - Hardcoded Secrets (`RULE-SEC-001`, `CHECK-SEC-ENV-001/002`): Regex and entropy detection of exposed credentials.
  - Environment Leakage (`RULE-ENV-001`, `SEC-ENV-001 to 004`): Detection of private backend secrets prefixed with client-side bundling tags (`NEXT_PUBLIC_`, `VITE_`).
  - Authentication Weaknesses (`RULE-AUTH-001`): Flagging unverified token decoding calls, such as `jwt.decode()` used without `jwt.verify()`.
  - Mass Assignment (`SEC-API-003`, `SEC-INPUT-002`): Detection of unconstrained request payloads passed directly to database update calls.
  - Injection Flaws (`RULE-INPUT-001`, `SEC-INP-001 to 004`): Dynamic string concatenation in database queries and unsanitized HTML sinks.
- Guided Checks (Review Mode):
  - Broken Object-Level Authorization (`RULE-IDOR-001`, `AUTHZ-GUIDED-001`): Because resource ownership checks require understanding application-specific business logic, Bilt emits a `needs-review` guided finding to prompt human review rather than generating false-positive hard failures.
  - Unsafe File Uploads (`CHECK-UPLOAD-GUIDED-001`): Emits verification prompts for MIME validation, upload destination boundaries, and file size limits.

## Links

- [Bilt Documentation](https://bilt.nogs.dev/docs#security-analysis)
- [Bilt Source Code](https://github.com/Samuel-0228/bilt)
- [Bilt on npm](https://www.npmjs.com/package/bilt-toolkit)

## Summary

Bilt represents a practical application of security knowledge through custom developer tooling. It provides a focused mechanism for detecting common implementation flaws in AI-assisted coding environments without asserting universal security coverage or claiming complete vulnerability discovery.
