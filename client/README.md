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
  App.jsx                        # Composes routes and layout shell
  index.css                      # Tailwind + dark-only CSS variables
  lib/
    utils.js                     # cn() helper for shadcn
    api.js                       # fetch wrapper (falls back gracefully)
  components/
    ui/                          # shadcn primitives (Button, Card, Badge, Separator)
    layout/                      # Navbar, Footer
    motion/MotionPrimitives.jsx  # Reusable Framer Motion variants + Section wrapper
    sections/                    # Hero, Services, Projects, Credentials, Experience
```

## Theme

Dark-only cyber palette: deep slate background, neon cyan primary, purple secondary, matrix green accent, grid backdrop, and JetBrains Mono headings.

