# 🤝 Contributing to GyMPal

Thanks for your interest in contributing! GyMPal is a community-driven, free workout app and all contributions are welcome — whether that's fixing a bug, adding an exercise, improving the UI, or writing documentation.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

Be kind. Be constructive. We're all here to build something useful and keep it free for everyone.

- Respect other contributors regardless of experience level
- Give helpful, specific feedback on pull requests
- Assume good intent

---

## How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/GyMPal.git
cd GyMPal
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

Keep changes focused — one feature or fix per PR makes review faster.

### 4. Test

- Open `index.html` in your browser and verify your changes work
- Test on both desktop and mobile viewport sizes (use DevTools)
- Make sure the app still works offline (no external API calls without fallback)

### 5. Submit a Pull Request

Push your branch and open a PR against `main`. Fill in the PR template.

---

## Development Setup

GyMPal is a static site — no build step required for basic development.

```bash
# Serve locally with any static server:
npx serve .
# or
python3 -m http.server 8080
```

Visit `http://localhost:8080` in your browser.

### Recommended Tools

- **VS Code** with the Live Server extension for instant reload
- **Chrome DevTools** for mobile responsiveness testing
- **Lighthouse** (built into Chrome DevTools) to check performance and PWA readiness

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, deployed to GitHub Pages |
| `develop` | Integration branch for upcoming release |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation only |

---

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add rest timer sound alert
fix: mobile layout overflow on exercise cards
docs: update ROADMAP with PWA milestone
refactor: extract workout logger into separate module
style: align button spacing on workout builder
```

Prefixes: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`

---

## Pull Request Process

1. Fill in the PR description — what does this change and why?
2. Link any related issue (e.g. `Closes #42`)
3. Keep PRs small and focused — large PRs are harder to review
4. A maintainer will review within a few days
5. Address any requested changes, then the PR will be merged

### PR Checklist

- [ ] Tested in Chrome and Firefox
- [ ] Tested on mobile viewport (375px wide minimum)
- [ ] No new external dependencies added without discussion
- [ ] No features locked behind a paywall or signup

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/le-e-lab/GyMPal/issues/new) and include:

- **Description** of the bug
- **Steps to reproduce**
- **Expected behaviour**
- **Actual behaviour**
- **Browser and OS** (e.g. Chrome 120 on Windows 11)
- **Screenshot** if applicable

---

## Requesting Features

Open a [GitHub Issue](https://github.com/le-e-lab/GyMPal/issues/new) with the label `enhancement` and include:

- What problem does this feature solve?
- Describe the expected behaviour
- Any examples from other apps

Check [ROADMAP.md](ROADMAP.md) first — your idea might already be planned!

---

## What NOT to Contribute

To keep GyMPal aligned with its core values, please don't submit PRs that:

- Add ads or sponsored content
- Gate any features behind a login or subscription
- Add heavy dependencies that slow down load time
- Collect or transmit user data externally

---

Thanks for contributing! 🏋️
