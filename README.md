# GyMPal

GyMPal is a free, local-first calisthenics + skipping tracker built for daily consistency. It runs as an installable PWA, stores progress locally, and includes a guided workout system, jog tracking, and analytics.

## Features
- Daily workout missions with rest timers and interval support
- Jog + post-workout mode with distance-based tiers
- 14-day analytics (sessions + jog volume)
- Weight tracking with trend chart
- Offline exercise library with filters
- AI workout generator (local fallback, optional API key)
- Export/import workout plans + shareable URLs
- Local-first persistence with safe localStorage handling
- PWA install prompts + offline support

## Quick Start

Requirements: Node 20+ and npm

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build & Preview

```bash
npm run build
npm run preview
```

Preview runs at http://localhost:4173

## Deployment

GyMPal can be deployed to any static host (Vercel, Netlify, GitHub Pages).

```bash
npm run build
```

The output is in ./dist

## Project Structure

```
GyMPal/
  public/
  src/
    components/
    data/
    hooks/
    utils/
  index.html
  vite.config.js
```

## Local Storage Keys

- gympal_start_date
- gympal_history
- gympal_daily_progress
- gympal_punishments
- gympal_protein_streak
- gympal_last_protein_date
- gympal_weight_logs
- gympal_jog_logs
- gympal_timer_alerts
- gympal_sleep_target_check
- gympal_jog_session

## Docs

- ROADMAP.md
- IMPROVEMENTS.md
- CHANGELOG.md
- SECURITY.md
- PRIVACY.md
- CONTRIBUTING.md

## License

MIT
