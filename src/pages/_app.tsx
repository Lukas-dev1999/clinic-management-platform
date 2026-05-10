// ============================================================
// src/pages/_app.tsx
// DENTAL SAAS — Global App Shell
//
// ARCHITECTURE:
//   • All existing providers preserved (SessionProvider, tRPC)
//   • All existing imports preserved (Nav, Toaster, globals.css)
//   • Added: ThemeProvider (CSS variable–based, no extra deps)
//   • Added: premium <Head> meta for SaaS polish
//   • Added: page transition wrapper (GPU-only, CSS-driven)
//   • Pages Router only — zero App Router patterns
// ============================================================

import { type Session }      from "next-auth";
import { SessionProvider }   from "next-auth/react";
import { type AppType }      from "next/app";
import { type AppProps }     from "next/app";
import Head                  from "next/head";
import { useRouter }         from "next/router";
import { useEffect, useRef, useState } from "react";

import { api }               from "~/utils/api";
import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import Nav                   from "~/components/Nav";
import { Toaster }           from "react-hot-toast";

// ── Constants ────────────────────────────────────────────────
const APP_NAME        = "DentalOS";
const APP_DESCRIPTION = "Premium dental clinic management platform";
const APP_URL         = process.env.NEXT_PUBLIC_APP_URL ?? "";

// ============================================================
// § 1. THEME PROVIDER
// Lightweight — zero deps beyond React.
// Reads OS preference on first load, persists to localStorage.
// Writes to [data-theme] on <html> — syncs with globals.css.
// ============================================================
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;

    try {
      const stored = localStorage.getItem("ds-theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const theme = stored ?? (prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      // SSR / localStorage blocked — fail silently
    }
  }, []);

  return <>{children}</>;
}

// ── Public helper — call from any component ──────────────────
export function setTheme(theme: "light" | "dark") {
  try {
    localStorage.setItem("ds-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  } catch { /* silently ignored */ }
}

export function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") ?? "light";
  setTheme(current === "dark" ? "light" : "dark");
}

// ============================================================
// § 2. PAGE TRANSITION
// CSS class toggle on route change — GPU-only (opacity +
// translateY). No animation library required.
// ============================================================
const TRANSITION_CLASS = "ds-page-transition";

function PageTransition({ children }: { children: React.ReactNode }) {
  const router        = useRouter();
  const [ready, setReady] = useState(true);

  useEffect(() => {
    const handleStart = () => setReady(false);
    const handleDone  = () => {
      // Small delay lets the new page paint before fading in
      requestAnimationFrame(() => setReady(true));
    };

    router.events.on("routeChangeStart",    handleStart);
    router.events.on("routeChangeComplete", handleDone);
    router.events.on("routeChangeError",    handleDone);

    return () => {
      router.events.off("routeChangeStart",    handleStart);
      router.events.off("routeChangeComplete", handleDone);
      router.events.off("routeChangeError",    handleDone);
    };
  }, [router.events]);

  return (
    <div
      className={TRANSITION_CLASS}
      style={{
        opacity:    ready ? 1 : 0,
        transform:  ready ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 220ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)), transform 220ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1))",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// § 3. TOASTER CONFIG
// Premium toast styling — synced with globals.css tokens.
// react-hot-toast accepts a `toastOptions` prop; no extra CSS.
// ============================================================
const TOASTER_CONFIG = {
  position: "bottom-right" as const,
  toastOptions: {
    duration: 3500,
    style: {
      background:   "var(--color-surface, #ffffff)",
      color:        "var(--color-text-primary, #0F1623)",
      border:       "1px solid var(--color-border, #E4E7EC)",
      borderRadius: "var(--radius-lg, 14px)",
      boxShadow:    "var(--shadow-lg, 0 8px 24px rgba(15,22,35,0.12))",
      fontSize:     "var(--text-sm, 0.8125rem)",
      fontWeight:   "450",
      padding:      "0.625rem 1rem",
      maxWidth:     "360px",
    },
    success: {
      iconTheme: {
        primary:    "var(--color-success, #12B76A)",
        secondary:  "#fff",
      },
    },
    error: {
      iconTheme: {
        primary:    "var(--color-danger, #F04438)",
        secondary:  "#fff",
      },
    },
  },
} as const;

// ============================================================
// § 4. APP SHELL
// Provider order (outer → inner):
//   api.withTRPC  →  SessionProvider  →  ThemeProvider
//   →  Head  →  Toaster  →  Nav  →  PageTransition  →  Page
// ============================================================
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>

        {/* ── Global <head> ─────────────────────────────── */}
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/logo2.png" />

          {/* App identity */}
          <meta name="application-name"  content={APP_NAME} />
          <meta name="description"       content={APP_DESCRIPTION} />

          {/* Viewport — prevents iOS zoom on input focus */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />

          {/* Theme colour — matches --color-bg token */}
          <meta name="theme-color" content="#F8F9FB" />
          <meta
            name="theme-color"
            content="#0C0F17"
            media="(prefers-color-scheme: dark)"
          />

          {/* Open Graph baseline */}
          <meta property="og:type"        content="website" />
          <meta property="og:site_name"   content={APP_NAME} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          {APP_URL && <meta property="og:url" content={APP_URL} />}

          {/* Preconnect for any external font CDN if added later */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </Head>

        {/* ── Global toast notifications ─────────────────── */}
        <Toaster
          position={TOASTER_CONFIG.position}
          toastOptions={TOASTER_CONFIG.toastOptions}
        />

        {/* ── Persistent navigation ─────────────────────── */}
        <Nav />

        {/* ── Page with entrance transition ─────────────── */}
        <PageTransition>
          <Component {...pageProps} />
        </PageTransition>

      </ThemeProvider>
    </SessionProvider>
  );
};

// tRPC HOC wraps the outermost shell — preserved exactly
export default api.withTRPC(MyApp);
