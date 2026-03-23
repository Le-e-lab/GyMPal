# 🚀 GyMPal Improvement Guide

A practical, prioritised guide for making GyMPal better — all free, all open-source.

---

## Progress Snapshot (March 2026)

- [x] Priority 1 complete: installable PWA setup, service worker generation, update/offline toasts, and in-app install prompt + iOS install hint
- [x] Priority 2 complete: rest timer alerts, skip controls, wake lock handling, and improved timer UX
- [x] New shipped feature: Jog tab with distance-based post-jog workouts (use this path or normal workout path)
- [x] Priority 3 baseline complete: bundled offline exercise library with search, filters, and instruction panel
- [~] Priority 4 partially complete: 14-day analytics and body-weight trend chart exist; per-exercise charts still pending
- [ ] Priority 5 pending: full light/dark theme toggle system
- [x] Priority 6 baseline complete: AI workout generator panel (optional API key + local fallback)
- [x] Priority 7 baseline complete: workout export JSON, import JSON/URL/file, and shareable plan links
- [x] Plan application flow complete: imported/AI plans can be applied as today's mission

---

## Priority 1 — PWA (Biggest Impact, Relatively Easy)

Turn GyMPal into an installable Progressive Web App. Users get a native-app feel with zero App Store fees.

### Step 1: Add `manifest.json`

Create `manifest.json` in the root:

```json
{
  "name": "GyMPal",
  "short_name": "GyMPal",
  "description": "Your free workout companion",
  "start_url": "/GyMPal/",
  "display": "standalone",
  "background_color": "#0f0f0f",
  "theme_color": "#e63946",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Link it in `<head>`:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#e63946">
```

### Step 2: Register a Service Worker

Create `sw.js` in the root:

```javascript
const CACHE = 'gympal-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js'];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
);

self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
```

Register in `app.js`:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/GyMPal/sw.js');
}
```

**Result:** Users can install GyMPal to their phone's home screen on Android and iOS and use it offline.

---

## Priority 2 — Rest Timer Improvements

The rest timer is used every single workout. Make it great.

```javascript
// Play a beep when timer ends (no library needed)
function playBeep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

// Prevent phone screen from sleeping during workout
async function keepAwake() {
  if ('wakeLock' in navigator) {
    try {
      await navigator.wakeLock.request('screen');
    } catch (e) {
      console.log('Wake lock not available');
    }
  }
}
```

---

## Priority 3 — Free Exercise Database Integration

Current status: baseline shipped with an offline bundled exercise library, multi-filter search, and per-exercise instruction view.
Next step: optional external API integration (ExerciseDB/wger) for a larger catalog and GIF media.

Replace or supplement the current exercise list with the free **ExerciseDB** dataset or **wger** open-source database.

### Option A: Bundled JSON (best for offline)

Download the [free-exercise-db](https://github.com/yuhonas/free-exercise-db) dataset and bundle it with the app:

```bash
# ~800 exercises in JSON, public domain
curl -o exercises.json https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json
```

Then load it in JS:

```javascript
const res = await fetch('./exercises.json');
const exercises = await res.json();
```

### Option B: wger REST API (free, no key required)

```javascript
const res = await fetch('https://wger.de/api/v2/exercise/?format=json&language=2&limit=20');
const data = await res.json();
```

---

## Priority 4 — Progress Charts (Free, No Backend)

Current status: baseline shipped with a 14-day analytics panel (completed sessions + jog distance trend) and existing weight trend/BMI visuals.
Next step: add per-exercise volume/weight charts and PR detection.

Use [Chart.js](https://www.chartjs.org/) (free, MIT license) to visualise progress from localStorage data.

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

```javascript
// Get bench press history from localStorage
const history = JSON.parse(localStorage.getItem('workoutLog') || '[]');
const benchData = history
  .filter(s => s.exercise === 'Bench Press')
  .map(s => ({ x: s.date, y: s.weight }));

new Chart(document.getElementById('progressChart'), {
  type: 'line',
  data: {
    datasets: [{
      label: 'Bench Press (kg)',
      data: benchData,
      borderColor: '#e63946',
      tension: 0.3
    }]
  },
  options: { scales: { x: { type: 'time' } } }
});
```

---

## Priority 5 — Dark Mode

Add a CSS variable-based theme system with a toggle:

```css
:root {
  --bg: #ffffff;
  --text: #111111;
  --accent: #e63946;
  --card: #f5f5f5;
}

[data-theme="dark"] {
  --bg: #0f0f0f;
  --text: #f0f0f0;
  --card: #1a1a1a;
}

body { background: var(--bg); color: var(--text); }
```

```javascript
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Persist theme on load
const saved = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', saved);
```

---

## Priority 6 — AI Workout Generator (Free via Claude API)

Current status: shipped with optional Anthropic API generation and a no-key local fallback generator.
Next step: smart progression suggestions and form-tip generation.

Use Anthropic's free API tier to add an AI workout generator — no backend needed, runs in the browser.

```javascript
async function generateWorkout(goal, equipment, days) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': userApiKey, // user provides their own free key
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Create a ${days}-day workout plan for someone with goal: ${goal}. 
                  Available equipment: ${equipment}. 
                  Return as JSON array of workouts.`
      }]
    })
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text);
}
```

> The user provides their own free API key — GyMPal never stores or transmits it beyond the API call.

---

## Priority 7 — Workout Export & Sharing

Current status: shipped with export JSON, import JSON/file/share URL, and copyable URL payload links.
Next step: add short-link compression and shareable visual summary cards.

Allow users to export their routines as JSON or a shareable URL.

```javascript
// Export as JSON file
function exportWorkout(workout) {
  const blob = new Blob([JSON.stringify(workout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workout.name}.json`;
  a.click();
}

// Encode workout into URL (for short routines)
function shareWorkout(workout) {
  const encoded = btoa(JSON.stringify(workout));
  return `${location.origin}/GyMPal/?workout=${encoded}`;
}
```

---

## Free APIs & Resources Used

| Resource | What it provides | Cost |
|----------|-----------------|------|
| [free-exercise-db](https://github.com/yuhonas/free-exercise-db) | 800+ exercises, JSON | Free / Public Domain |
| [wger REST API](https://wger.de/api/v2/) | Exercise + nutrition DB | Free, no key |
| [Open Food Facts](https://world.openfoodfacts.org/) | 1.9M food items | Free, no key |
| [Chart.js](https://www.chartjs.org/) | Charts & graphs | Free / MIT |
| [Anthropic Claude API](https://www.anthropic.com/api) | AI workout generation | Free tier available |
| Web Audio API | Timer beeps | Built into browser |
| Screen Wake Lock API | Prevent screen sleep | Built into browser |
| Service Worker API | Offline / PWA | Built into browser |

---

## Performance Tips

- Use `IndexedDB` instead of `localStorage` for workout history (handles larger datasets)
- Lazy-load the exercise database only when the user opens the exercise browser
- Use `requestAnimationFrame` for the rest timer animation instead of `setInterval`
- Add `loading="lazy"` to any exercise GIF images
- Aim for a Lighthouse performance score of 90+ (check via Chrome DevTools)

---

_All improvements above keep GyMPal 100% free and require no paid services or backend infrastructure._
