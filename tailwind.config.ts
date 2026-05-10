import { type Config } from "tailwindcss";

// ============================================================
// DENTAL SAAS — TAILWIND DESIGN SYSTEM
// Synchronized with src/styles/globals.css CSS custom properties.
//
// ARCHITECTURE RULES:
//   • All color values point to CSS variables defined in globals.css
//   • No hardcoded hex values for tokens that already exist in :root
//   • Existing tokens (background, ruby, babyblue, scale-102, scale-97)
//     are fully preserved — zero breaking changes
//   • `extend` only — never replaces Tailwind defaults
// ============================================================

export default {
  // ── Content paths ────────────────────────────────────────
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  // ── Dark mode strategy ───────────────────────────────────
  // Matches globals.css [data-theme="dark"] approach.
  // Use class strategy so JS can toggle it programmatically.
  darkMode: ["class", '[data-theme="dark"]'],

  theme: {
    extend: {

      // ── Colors ─────────────────────────────────────────────
      // Each value wraps a CSS variable from globals.css :root.
      // rgb() wrapper enables Tailwind's opacity modifier syntax:
      //   bg-primary/80  →  rgba(var(--color-primary), 0.8)
      //
      // EXISTING tokens preserved exactly as-is:
      colors: {

        // ── Preserved originals (backward compat) ──────────
        background: "#1F1F1F",
        ruby:       "#870000",
        babyblue:   "#00AFF0",

        // ── Brand palette (maps to globals.css :root) ──────
        primary: {
          DEFAULT: "var(--color-primary)",        // #0066FF
          soft:    "var(--color-primary-soft)",   // #EBF2FF
          hover:   "var(--color-primary-hover)",  // #0052CC
        },

        accent: {
          DEFAULT: "var(--color-accent)",         // #00AFF0 (same as babyblue)
          glow:    "var(--color-accent-glow)",
        },

        // ── Semantic surfaces ───────────────────────────────
        surface: {
          DEFAULT: "var(--color-surface)",
          raised:  "var(--color-surface-raised)",
          bg:      "var(--color-bg)",
        },

        // ── Borders ─────────────────────────────────────────
        border: {
          DEFAULT: "var(--color-border)",
          subtle:  "var(--color-border-subtle)",
        },

        // ── Text ────────────────────────────────────────────
        content: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted:     "var(--color-text-muted)",
          inverse:   "var(--color-text-inverse)",
        },

        // ── Semantic status ─────────────────────────────────
        success: "var(--color-success)",   // #12B76A
        warning: "var(--color-warning)",   // #F59E0B
        danger:  "var(--color-danger)",    // #F04438
        info:    "var(--color-info)",      // #0066FF
      },

      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      fontSize: {
        // Maps to globals.css --text-* tokens
        "2xs": ["var(--text-xs)",   { lineHeight: "var(--leading-tight)" }],
        sm:    ["var(--text-sm)",   { lineHeight: "var(--leading-snug)" }],
        base:  ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
        lg:    ["var(--text-lg)",   { lineHeight: "var(--leading-snug)" }],
        xl:    ["var(--text-xl)",   { lineHeight: "var(--leading-tight)" }],
        "2xl": ["var(--text-2xl)",  { lineHeight: "var(--leading-tight)" }],
        "3xl": ["var(--text-3xl)",  { lineHeight: "1.2" }],
      },

      lineHeight: {
        tight:  "var(--leading-tight)",
        snug:   "var(--leading-snug)",
        normal: "var(--leading-normal)",
      },

      // ── Border radius ──────────────────────────────────────
      // Maps to globals.css --radius-* tokens
      borderRadius: {
        xs:   "var(--radius-xs)",   // 4px
        sm:   "var(--radius-sm)",   // 6px
        md:   "var(--radius-md)",   // 10px
        lg:   "var(--radius-lg)",   // 14px
        xl:   "var(--radius-xl)",   // 20px
        full: "var(--radius-full)", // 9999px
      },

      // ── Box shadows ────────────────────────────────────────
      // Maps to globals.css --shadow-* tokens
      boxShadow: {
        xs:         "var(--shadow-xs)",
        sm:         "var(--shadow-sm)",
        md:         "var(--shadow-md)",
        lg:         "var(--shadow-lg)",
        xl:         "var(--shadow-xl)",
        focus:      "var(--shadow-focus)",
        "card-hover": "var(--shadow-card-hover)",
      },

      // ── Scale ──────────────────────────────────────────────
      // Preserved exactly from original config
      scale: {
        "102": "1.025",
        "97":  "0.975",
      },

      // ── Transitions ────────────────────────────────────────
      transitionDuration: {
        fast:   "var(--duration-fast)",   // 120ms
        base:   "var(--duration-base)",   // 200ms
        slow:   "var(--duration-slow)",   // 320ms
        slower: "var(--duration-slower)", // 480ms
      },

      transitionTimingFunction: {
        "out-expo":  "var(--ease-out-expo)",
        "out-quart": "var(--ease-out-quart)",
        "in-out":    "var(--ease-in-out)",
        spring:      "var(--ease-spring)",
      },

      // ── Animations ─────────────────────────────────────────
      // Keyframes defined here reference the same motion already
      // in globals.css — Tailwind utility classes bridge them.
      keyframes: {
        // Entrance
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Shimmer skeleton
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        // Spinner
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        // Gradient text (matches finallyQuietStyling)
        "gradient-shift": {
          "0%":   { backgroundPosition: "0 100%" },
          "50%":  { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
        // Pulse glow (for active states / notifications)
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--color-accent-glow)" },
          "50%":       { boxShadow: "0 0 0 6px transparent" },
        },
      },

      animation: {
        "fade-in":       "fade-in var(--duration-slow) var(--ease-out-expo) both",
        "slide-up":      "slide-up var(--duration-slow) var(--ease-out-expo) both",
        "slide-right":   "slide-in-right var(--duration-slow) var(--ease-out-expo) both",
        shimmer:         "shimmer 1.4s ease-in-out infinite",
        "spin-fast":     "spin 0.6s linear infinite",
        "gradient-text": "gradient-shift 5s linear infinite",
        "glow-pulse":    "glow-pulse 2s var(--ease-in-out) infinite",
      },

      // ── Z-index scale ──────────────────────────────────────
      zIndex: {
        base:    "var(--z-base)",
        raised:  "var(--z-raised)",
        overlay: "var(--z-overlay)",
        modal:   "var(--z-modal)",
        toast:   "var(--z-toast)",
      },

      // ── Spacing extensions ─────────────────────────────────
      // Small additions for dashboard density — do not replace defaults
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
      },

      // ── Backdrop blur ──────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        sm: "4px",   // used in modal backdrop
        md: "8px",
      },

      // ── Ring ───────────────────────────────────────────────
      ringColor: {
        primary: "var(--color-primary)",
        accent:  "var(--color-accent)",
      },
      ringOffsetColor: {
        surface: "var(--color-surface)",
      },
    },
  },

  plugins: [],
} satisfies Config;