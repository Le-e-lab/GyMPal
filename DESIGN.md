# GyMPal Design System

> **Tagline:** Level Up Every Day
> **Brand Essence:** Your personal RPG companion for real-life gains — body, mind, and habits.

---

## 1. Brand Identity

### Logo
- **Primary:** Stylized "G" with an integrated level-up arrow, set inside a rounded square
- **Monogram:** Bold "G" letterform in the emerald accent
- **Wordmark:** "GyMPal" set in bold sans-serif with the level-up icon

### Tagline
```
Level Up Every Day
```

### Brand Voice
- Motivational, direct, gaming-inspired
- "You" / "Your" framing (Your Daily Quest, Your stats, Your streak)
- Short, punchy calls to action
- Anime/military training overtones

---

## 2. Color Tokens

### Base
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#000000` | Page background |
| `--bg-secondary` | `#09090b` | Card backgrounds (zinc-950) |
| `--bg-tertiary` | `#18181b` | Elevated surfaces (zinc-900) |
| `--bg-hover` | `#27272a` | Hover states (zinc-800) |
| `--border` | `#3f3f46` | Borders / dividers (zinc-700) |
| `--border-subtle` | `#27272a` | Subtle borders (zinc-800) |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#f4f4f5` | Primary body text (zinc-100) |
| `--text-secondary` | `#a1a1aa` | Secondary / muted text (zinc-400) |
| `--text-tertiary` | `#71717a` | Tertiary / placeholder (zinc-500) |
| `--text-inverse` | `#000000` | Text on accent backgrounds |

### Accent (Per-Tab)
| Tab | Token | Value | Usage |
|-----|-------|-------|-------|
| **Workout** | `--accent-workout` | `#10b981` (emerald-500) | Primary action, completion |
| **Jog** | `--accent-jog` | `#f59e0b` (amber-500) | Run mode |
| **Habits** | `--accent-habits` | `#3b82f6` (blue-500) | Planner / daily habits |
| **Stats** | `--accent-stats` | `#a855f7` (purple-500) | Analytics |
| **Skills** | `--accent-skills` | `#22c55e` (green-500) | Skill tree |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#10b981` | Completed, PR, streaks |
| `--warning` | `#f59e0b` | Warnings, approaching limits |
| `--error` | `#ef4444` | Errors, missed habits |
| `--info` | `#3b82f6` | Information, tips |

---

## 3. Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Hero | `2.25rem` (text-4xl) | 800 (extrabold) | `1.1` | Page titles, hero text |
| H1 | `1.875rem` (text-3xl) | 700 (bold) | `1.2` | Section headers |
| H2 | `1.5rem` (text-2xl) | 700 (bold) | `1.25` | Card titles |
| H3 | `1.25rem` (text-xl) | 600 (semibold) | `1.3` | Subsection headers |
| Body | `0.875rem` (text-sm) | 400 (normal) | `1.5` | Paragraphs, descriptions |
| Body Large | `1rem` (text-base) | 400 (normal) | `1.5` | Important content |
| Caption | `0.75rem` (text-xs) | 500 (medium) | `1.4` | Labels, timestamps |
| Stat | `2rem` (text-3xl) | 800 (extrabold) | `1` | Number displays |

### Letter Spacing
- Headings: `tracking-tight` (-0.025em)
- Body: normal
- Labels: `tracking-wide` (0.05em)
- Uppercase labels: `tracking-wider` (0.1em)

---

## 4. Spacing

| Token | Rem | PX | Usage |
|-------|-----|----|-------|
| `--space-xs` | 0.25rem | 4px | Inner padding, gaps |
| `--space-sm` | 0.5rem | 8px | Compact spacing |
| `--space-md` | 1rem | 16px | Standard spacing |
| `--space-lg` | 1.5rem | 24px | Section spacing |
| `--space-xl` | 2rem | 32px | Large sections |
| `--space-2xl` | 3rem | 48px | Page-level margins |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.5rem (8px) | Buttons, small elements |
| `--radius-md` | 0.75rem (12px) | Cards, containers |
| `--radius-lg` | 1rem (16px) | Modals, sheets |
| `--radius-xl` | 1.5rem (24px) | Large containers |
| `--radius-full` | 9999px | Pills, avatars, badges |

---

## 6. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` | Cards |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.5)` | Modals, sheets |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.6)` | Toasts, overlays |

---

## 7. Motion

### Durations
| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-normal` | 250ms | Transitions |
| `--duration-slow` | 400ms | Page transitions |

### Easings
| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Interaction Patterns
- **Buttons**: Scale to 0.97 on press, duration 100ms
- **Cards**: Subtle lift on hover (translateY -2px)
- **Tab switch**: Fade + slide content
- **PR / achievement**: Scale pulse (1.15 -> 1) on trigger
- **Streak fire**: Gentle pulsing opacity

---

## 8. Component Patterns

### Cards
- Background: `--bg-tertiary` (zinc-900)
- Border: `--border-subtle` (zinc-800)
- Radius: `--radius-md`
- Padding: `--space-md` to `--space-lg`

### Buttons
- **Primary**: Solid accent color, white text, `--radius-sm`
- **Secondary**: Border only, no fill
- **Ghost**: No border, minimal hover
- All buttons: `touch-action: manipulation`, `cursor: pointer`
- Press state: `transform: scale(0.97)`

### Bottom Navigation
- Active tab: accent color icon + label
- Inactive: zinc-400 icon + label
- Safe-area-aware padding on iOS

### Inputs
- Background: `--bg-tertiary`
- Border: `--border`
- Focus: 2px accent outline
- Placeholder: `--text-tertiary`

---

## 9. Dark Mode (Current Default)

The app is currently dark-mode only. The color tokens above represent the dark palette. Light mode tokens TBD for future implementation.

---

## 10. Iconography

- **Library:** Lucide React (existing)
- **Style:** Outline, stroke-width 1.5-2
- **Size:** 16-24px for inline, 28-36px for tab bar
- **Color:** Inherits from parent text color or accent token

*Last updated: June 2026*
