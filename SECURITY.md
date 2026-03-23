# 🔐 Security Policy

## Our Approach to Security

GyMPal is a **client-side only** application. All data is stored locally in your browser using `localStorage` or `IndexedDB`. We do not operate any servers, databases, or user accounts.

This means:
- No user data is ever transmitted to us or any third party
- There is no backend to breach
- You are in full control of your data

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (main branch) | ✅ |
| Older releases | ❌ Please update |

---

## Reporting a Vulnerability

If you discover a security issue (e.g. XSS vulnerability, unsafe use of `eval`, malicious dependency), please **do not open a public issue**.

Instead, email the maintainer directly or open a [GitHub Security Advisory](https://github.com/le-e-lab/GyMPal/security/advisories/new).

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fix if you have one

We will respond within 7 days and aim to patch confirmed vulnerabilities within 14 days.

---

## Dependency Security

GyMPal aims to minimise external dependencies. Before adding any new library, consider:
- Is it actively maintained?
- Does it have known CVEs?
- Can it be self-hosted or vendored to avoid CDN supply-chain risks?

Run `npm audit` (if using npm) periodically to check for known vulnerabilities.

---

## Data Privacy

GyMPal does not collect, store, or transmit any personal data. See our [Privacy Policy](PRIVACY.md) for more details.
