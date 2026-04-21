/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Extra "pop" tokens (light theme vibrancy / dark theme neon)
        pop: {
          pink: "hsl(var(--pop-pink))",
          lime: "hsl(var(--pop-lime))",
          cyan: "hsl(var(--pop-cyan))",
          purple: "hsl(var(--pop-purple))",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px hsl(var(--primary) / 0.35), 0 0 40px hsl(var(--primary) / 0.15)",
        "neon-purple": "0 0 20px hsl(var(--secondary) / 0.35), 0 0 40px hsl(var(--secondary) / 0.15)",
        "pop": "6px 6px 0 0 hsl(var(--foreground))",
        "pop-primary": "6px 6px 0 0 hsl(var(--primary))",
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
        "vibrant-mesh":
          "radial-gradient(at 15% 20%, hsl(var(--primary) / 0.18) 0px, transparent 55%), radial-gradient(at 85% 15%, hsl(var(--secondary) / 0.18) 0px, transparent 55%), radial-gradient(at 50% 90%, hsl(var(--accent) / 0.18) 0px, transparent 55%)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { opacity: "0.85", filter: "drop-shadow(0 0 6px hsl(var(--primary)))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 16px hsl(var(--primary)))" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1.5deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2.6s ease-in-out infinite",
        scanline: "scanline 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        blink: "blink 1.1s steps(2, start) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
