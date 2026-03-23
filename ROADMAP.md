# 🗺️ GyMPal Roadmap

This document outlines planned features, improvements, and ideas for GyMPal — all staying **free and open-source**, no premium tier required.

---

## ✅ Current Features (v1.x)

- Custom workout builder
- Jog + Post-Workout mode (distance-based routine tiers)
- Exercise library browser (offline bundled dataset, searchable + filterable)
- Rest timer
- Set/rep/weight logging
- 14-day progress analytics (sessions + jog volume)
- AI workout generator (local fallback + optional API key)
- Workout plan export/import + shareable URL
- Local storage for data persistence
- Responsive layout

---

## 🚧 In Progress

### v1.x Improvements
- [x] UI polish and accessibility improvements (ARIA labels, keyboard nav)
- [x] Fix mobile layout issues on smaller screens
- [x] Improve rest timer UX (sound alert when timer ends)
- [ ] Add "Quick Start" workout for new users
- [x] Add Jog Mode tab with distance-based post-jog workout (or continue normal workout path)

---

## 🔭 Planned Features

### v2.0 — PWA & Offline Support
- [x] **PWA (Progressive Web App)** — Add `manifest.json` and a service worker so users can install GyMPal to their home screen on any device (Android, iOS, Windows, Mac) with offline support
- [ ] Offline-first architecture — cache exercise library and workouts locally
- [x] "Add to Home Screen" prompt for mobile browsers (with iOS install hint + dismiss cooldown)
- [ ] Background sync when connection returns

> 💡 **Why this matters:** Apps like WorkoutGen have shown that PWA technology lets users get a native-app feel with zero App Store friction. This is the single highest-impact improvement for GyMPal.

---

### v2.1 — Exercise Library Expansion
- [ ] Integrate [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) or [wger open-source database](https://wger.de/) for 800+ exercises with GIF demonstrations
- [x] Exercise detail panel: targeted muscles, equipment, difficulty, step-by-step instructions
- [x] Filter by: muscle group, equipment, difficulty, workout type (strength / cardio / bodyweight)
- [ ] Search bar with fuzzy matching

---

### v2.2 — Progress & Analytics
- [ ] Workout history calendar view (see which days you trained)
- [ ] Per-exercise progress charts (weight over time, volume over time)
- [ ] Personal Records (PRs) — auto-detect and celebrate new PRs
- [x] 14-day analytics overview (completed sessions + jog distance trend)
- [ ] Weekly volume summary
- [x] Streak counter

---

### v2.3 — Workout Templates & Sharing
- [ ] Pre-built workout templates: Push/Pull/Legs, Full Body, Upper/Lower, 5x5 Stronglifts
- [x] Export workout as JSON / shareable link (URL payload)
- [x] Import workouts from JSON or shared URL
- [ ] Duplicate and edit existing routines

---

### v2.4 — Body Metrics Tracker
- [x] Body weight log with chart
- [x] BMI calculator
- [ ] Optional: track measurements (chest, waist, arms, etc.)
- [x] Weight trend line and goal setting

---

### v2.5 — UX & Accessibility
- [ ] Dark mode / light mode toggle
- [ ] Custom themes / accent colours
- [ ] Larger tap targets for mobile during active workouts
- [ ] "Active Workout Mode" — distraction-free full-screen view while training
- [ ] Haptic feedback on mobile (via Vibration API)
- [ ] Screen-wake lock during active workout (prevent phone from sleeping)

---

### v3.0 — AI-Powered Features (Free via Anthropic API)
- [x] **AI Workout Generator** — describe your goal and generate a personalised daily plan (local fallback + optional API key)
- [ ] **Smart Suggestions** — recommend progressive overload adjustments based on history
- [ ] **Form Tips** — AI-generated coaching cues per exercise
- [x] No paid API key required for basic usage (local fallback works without key)

---

### v3.1 — Nutrition (Optional Module)
- [ ] Calorie / macro estimator per workout (calories burned)
- [ ] Basic meal log with macro breakdown
- [ ] Integrate [Open Food Facts](https://world.openfoodfacts.org/) free database (1.9M+ foods, no API key)
- [ ] Daily nutrition summary

---

### v3.2 — Social & Gamification
- [ ] Workout streak badges
- [ ] Shareable "Workout Summary" cards (image export)
- [ ] Optional: community workout templates gallery (static JSON, no backend needed)

---

## 🤝 How to Contribute

Have an idea? Open an issue or check [CONTRIBUTING.md](CONTRIBUTING.md).
All contributions must keep GyMPal 100% free to use.

---

## 💡 Design Principles

1. **Always free** — no paywalls, no premium tier, no ads
2. **Privacy first** — data stays on your device (localStorage / IndexedDB)
3. **No account required** — start using it immediately
4. **Lightweight** — fast load times, minimal dependencies
5. **Open source** — transparent, forkable, community-driven
