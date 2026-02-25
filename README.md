# GyMPal 🏋️‍♂️

A sleek, 6-Month progression Progressive Web App (PWA) designed to track daily Calisthenics and Skipping Rope routines. Features an integrated "Anime Motivation" engine that pulls inspirational quotes based on workout intensity.

## ✨ Features

- **180-Day Progression Tracking:** Automatically scales from Foundation to Lean/Stamina HIIT routines over a 6-month period, highly optimized for a 70kg weight-loss goal.
- **PWA Ready:** Installable on iOS and Android devices directly from the browser for a native app experience.
- **Interactive Checklists & Haptics:** Track each exercise individually during your workout with physical vibration feedback on supported devices.
- **Timer WakeLock:** The skipping timer utilizes the Screen Wake Lock API to prevent your phone from sleeping mid-workout!
- **Weekend Night Runs:** Special cardio-focused routines exclusive to Saturdays, while Sundays remain a strict active recovery day.
- **Snack Punishments:** A fun accountability feature that lets you tap "I Snacked" to instantly add randomized penalty burns (e.g., Burpees, Long Planks) to your daily routine.
- **Motivation Engine:** Dynamically generated quotes from characters like Vegeta, Goku, Batman, and Spiderman depending on the day's difficulty, rotating automatically every 5 minutes.

## 🚀 Quick Start (Local Development)

To run this project locally, ensure you have Node.js installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/GymPal.git
   cd GymPal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deploying to GitHub Pages

This project is pre-configured to deploy easily to GitHub Pages.

1. Ensure your repository is named `GymPal` (or change the `base` property in `vite.config.js` to match your repo name).
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
3. GitHub will build the site and deploy the `dist` folder to the `gh-pages` branch. Just make sure GitHub Pages is enabled in your repository settings pointing to that branch.

## 🛠️ Stack

- **React 19** + **Vite**
- **Tailwind CSS v4** (Dark Mode Theme)
- **Lucide React** (Icons)
- **Vite PWA Plugin** (Service Workers & Offline Support)

## 🤝 Modifying the Workouts

The progression data is fully separated. If you want to modify the routines, quotes, or add your own Phases:
- **Workouts:** Edit `src/data/workoutData.js`
- **Quotes:** Edit `src/data/quotes.js`
