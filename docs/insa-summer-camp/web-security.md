# Web Application Security and PHP Vulnerability Research

## Overview

This section collects technical references, standards, and conceptual notes regarding web application security and PHP vulnerability research studied during the INSA Summer Camp. The curriculum explored common flaw categories in web architectures, established security frameworks, and runtime-level weakness mechanisms.

## PHP Vulnerability Research

Web security research included the study of PHP language characteristics, historical vulnerability classes, and recent Common Vulnerabilities and Exposures (CVE) publications.

### Understanding CVE Identifiers

A Common Vulnerabilities and Exposures (CVE) identifier is a standardized, globally unique reference assigned to a publicly known information security vulnerability. Managed under the CVE Program in partnership with authoritative organizations such as MITRE and the National Institute of Standards and Technology (NIST), CVE records allow software developers, administrators, and security analysts to track, prioritize, and remediate specific security weaknesses systematically.

- Authoritative Reference: [CVE Program Official Website](https://www.cve.org)
- Comprehensive Vulnerability Database: [NIST National Vulnerability Database (NVD)](https://nvd.nist.gov)

### Scope of Research

During the camp, research focused on the architectural mechanics of PHP runtime environments, including session handling routines and input parsing mechanisms. One specific mechanism analyzed was the exploitation of `session.upload_progress` directives to achieve unauthenticated remote code execution, as examined in the PHP2Shell laboratory.

The complete list of individual PHP CVE records evaluated during general study is not formally cataloged in this repository at this time. Authoritative records and detailed technical analyses can be reviewed directly via the [CVE.org](https://www.cve.org) database and the [PHP Security Releases](https://www.php.net) documentation.

## Application Security Concepts

### OWASP

The Open Worldwide Application Security Project (OWASP) is an international nonprofit foundation dedicated to improving the security of software. OWASP maintains community-driven documentation, testing guidelines, and vulnerability taxonomies widely adopted by industry security teams and automated scanner vendors.

- [OWASP Official Website](https://owasp.org): Central repository of application security resources and community initiatives.
- [OWASP Web Security Testing Guide (WSTG)](https://owasp.org/www-project-web-security-testing-guide/): A comprehensive framework and manual for testing the security controls of modern web applications.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/): A globally recognized awareness report representing the most critical security risks to web applications.

### Mass Assignment

Mass assignment occurs when a web framework or application automatically binds client-supplied request parameters (such as JSON request bodies or URL-encoded form data) directly to internal object models or database records without an explicit field allowlist.

When developers use unconstrained data-binding calls (such as passing `req.body` directly to an ORM update operation), an external client can inject unexpected attributes into the payload. If the underlying data model contains sensitive fields such as `role`, `isAdmin`, `isVerified`, or `accountBalance`, an attacker can modify values they should not be authorized to control.

- Prevention Guidance: [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)

Standard mitigations include explicit parameter destructuring, Data Transfer Object (DTO) mapping, strict schema validation (using tools like Zod or Joi), and configuring ORM model boundaries to reject unauthorized properties.

### Input Validation

Input validation ensures that data received from untrusted clients adheres to expected syntactic formats, data types, allowed lengths, and allowable character sets before the application processes or stores it.

Applications must never trust client-supplied data. In the absence of strict input validation, untrusted data can traverse application logic and reach vulnerable execution sinks, leading to critical vulnerabilities including:

- SQL Injection (concatenating input into database queries)
- Command Injection (passing user input to system shell functions)
- Path Traversal (using client-controlled file paths in filesystem operations)
- Cross-Site Scripting (rendering untrusted strings directly into browser DOM trees)

Input validation should be enforced at application trust boundaries using positive validation (allowlists) in conjunction with contextual output encoding and parameterized query interfaces.

- Technical Guidance: [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## Further Reading

The following official resources provide authoritative guidance on the security concepts discussed above:

- [CVE.org](https://www.cve.org): Authoritative database for standardized identification and tracking of publicly disclosed software vulnerabilities.
- [NIST National Vulnerability Database (NVD)](https://nvd.nist.gov): Federal vulnerability management repository providing CVSS severity metrics and technical summaries.
- [OWASP Foundation](https://owasp.org): Central organization providing vendor-neutral guidelines, documentation, and tools for software security.
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/): Comprehensive technical manual for evaluating web application security controls.
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html): Clear technical instructions and patterns for preventing unconstrained parameter binding.
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html): Best practices for implementing syntactic and semantic validation on untrusted input.

## Important Note

The concepts and vulnerability classes detailed above reflect theoretical topics and lab exercises studied during the summer camp. They do not represent discoveries of novel zero-day vulnerabilities by the author, nor does this repository claim that every security concept has been implemented across the tooling described herein.
