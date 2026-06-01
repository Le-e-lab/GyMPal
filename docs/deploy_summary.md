# GyMPal Deployment Summary

## Project Location
- Local: `/home/lee/Documents/Github/GyMPal`
- GitHub: https://github.com/Le-e-lab/GyMPal
- Production (Vercel): https://gympal-nine.vercel.app

## Recent Changes
1. Capped long runs at 10km until user reaches 75kg goal (src/data/workoutData.js)
2. Installed Vercel CLI globally
3. Built and tested the application locally
4. Deployed to Vercel (preview and production)

## Deployment Commands Used
```bash
# Build the project
npm run build

# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy to preview
vercel --yes

# Deploy to production
vercel --prod --yes
```

## Production URL
https://gympal-nine.vercel.app

## Local Development
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Documentation
- See README.md for general project information
- See docs/ for additional documentation (this file)
- Check CHANGELOG.md, ROADMAP.md, IMPROVEMENTS.md for project history and plans

## Notes
- The application is a PWA and can be installed locally
- All data is stored in localStorage (browser-based)
- The workout plan now caps long distance runs at 10km until the user reaches their 75kg weight goal