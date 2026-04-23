# brantsimpson.com (client)

React + Vite + Tailwind + Framer Motion + shadcn/ui frontend.

## Commands

```powershell
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

## Environment

Create `.env` (optional) to point at a non-default API:

```
VITE_API_BASE_URL=http://localhost:8765
```

## Structure

```
src/
  main.jsx                       # React entry
  App.jsx                        # Composes sections inside ThemeProvider
  index.css                      # Tailwind + dual-theme CSS variables
  context/ThemeProvider.jsx      # light/dark theme context
  hooks/useTheme.js
  lib/
    utils.js                     # cn() helper for shadcn
    api.js                       # fetch wrapper (falls back gracefully)
  components/
    ui/                          # shadcn primitives (Button, Card, Badge, Separator)
    layout/                      # Navbar, Footer, ThemeToggle
    motion/MotionPrimitives.jsx  # Reusable Framer Motion variants + Section wrapper
    sections/                    # Hero, Services, Projects, Credentials, Experience
```

## Theme system

Dual-theme with CSS variables:

- **Light:** warm off-white, electric orange primary, electric blue secondary, vivid yellow accent, chunky borders + neobrutalist `shadow-pop`.
- **Dark:** deep slate, neon cyan primary, neon purple secondary, matrix green accent, subtle grid backdrop + `shadow-neon-*` glows.

Typography flavor also swaps: Space Grotesk headings in light mode, JetBrains Mono headings in dark mode.

Toggle lives in the navbar; choice persists via `localStorage`.
