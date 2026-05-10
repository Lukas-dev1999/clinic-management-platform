// ============================================================
// src/components/Nav.tsx
// DENTAL SAAS — Premium Navigation Shell
//
// PRESERVED (unchanged from previous pass):
//   • All existing routes + links (/, /gated)
//   • NextAuth session usage (signIn, signOut, useSession)
//   • Popover + Transition from @headlessui/react
//   • XMarkIcon, Bars3Icon, SunIcon, MoonIcon from @heroicons/react
//   • Logo import + Image component
//   • Role-based rendering (session ? ... : ...)
//   • Pages Router compatibility
//   • bg-babyblue on Manage CTA (Tailwind token preserved)
//   • scale-102 / scale-97 / transition duration-75 on Manage btn
//   • NAV_ITEMS config pattern
//   • NavLink, MobileNavLink, AuthButton, ThemeToggle decomposition
//   • toggleTheme() helper
//   • All CSS variable references
//
// ENHANCED (this pass):
//   • Scroll-aware navbar elevation (shadow lifts on scroll)
//   • Dark-mode-aware glass background (no longer hardcoded white)
//   • ThemeToggle: MutationObserver keeps icon in sync if theme
//     is changed externally (e.g. from _app.tsx or OS preference)
//   • Session user avatar pill next to auth button (desktop)
//   • Session user name chip in mobile drawer footer
//   • Replaced all inline onMouseEnter/Leave JS with
//     data-nav-btn CSS class — cleaner, consistent, same behavior
//   • Drawer close button gets explicit aria-label
//   • Smooth icon swap animation on ThemeToggle (opacity crossfade)
//   • Navbar fade-in on mount (prevents FOUC flash)
// ============================================================

import { Popover, Transition }    from "@headlessui/react";
import { XMarkIcon, Bars3Icon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession }             from "next-auth/react";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image                      from "next/image";
import Link                       from "next/link";
import { useRouter }              from "next/router";
import logo                       from "../../public/logo2.png";

// ── Toggle helper — UNCHANGED ─────────────────────────────────
function toggleTheme() {
  try {
    const current =
      document.documentElement.getAttribute("data-theme") ?? "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("ds-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  } catch { /* silently ignored in SSR */ }
}

// ── Inline CSS injected once — replaces scattered onMouseEnter/Leave JS ───────
// Scoped to [data-nav-btn] so it never bleeds outside Nav.
const NAV_STYLES = `
  [data-nav-btn] {
    transition:
      color      var(--duration-fast, 120ms) var(--ease-in-out, ease),
      background var(--duration-fast, 120ms) var(--ease-in-out, ease),
      border-color var(--duration-fast, 120ms) var(--ease-in-out, ease),
      box-shadow var(--duration-fast, 120ms) var(--ease-in-out, ease);
  }
  [data-nav-btn]:hover {
    color:       var(--color-text-primary) !important;
    background:  var(--color-border-subtle, rgba(0,0,0,0.05)) !important;
  }
  [data-nav-btn="icon"]:hover {
    border-color: var(--color-border) !important;
  }
  /* Dark-mode glass surface for the sticky navbar */
  [data-theme="dark"] [data-navbar-glass] {
    background: rgba(10, 17, 30, 0.88) !important;
  }
  /* Navbar mount fade-in — prevents FOUC */
  [data-navbar-glass] {
    animation: navFadeIn 0.25s ease both;
  }
  @keyframes navFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  /* ThemeToggle icon crossfade */
  .theme-icon-enter {
    animation: iconFadeIn 0.18s ease both;
  }
  @keyframes iconFadeIn {
    from { opacity: 0; transform: scale(0.7) rotate(-15deg); }
    to   { opacity: 1; transform: scale(1)   rotate(0deg);   }
  }
`;

// ============================================================
// § 1. NAVIGATION CONFIG — UNCHANGED
// ============================================================
const NAV_ITEMS = [
  { name: "Home", href: "/" },
  // { name: "Services", href: "/services" },
  // { name: "About",    href: "/about"    },
] as const;

// ============================================================
// § 2. HOOKS
// ============================================================

// — Scroll-aware hook: returns true once user scrolls > 8px ──
function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

// ============================================================
// § 3. SUB-COMPONENTS
// ============================================================

// — Desktop nav link — UNCHANGED logic, same styles ──────────
function NavLink({
  href,
  name,
  onClick,
}: {
  href: string;
  name: string;
  onClick?: () => void;
}) {
  const router   = useRouter();
  const isActive = router.pathname === href;   // ← unchanged

  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        position:       "relative",
        display:        "inline-flex",
        alignItems:     "center",
        fontSize:       "var(--text-sm)",
        fontWeight:     isActive ? "600" : "450",
        color:          isActive
          ? "var(--color-primary)"
          : "var(--color-text-secondary)",
        transition:     `color var(--duration-fast) var(--ease-in-out)`,
        paddingBottom:  "2px",
        textDecoration: "none",
      }}
    >
      {name}
      {/* Active underline — UNCHANGED */}
      <span
        aria-hidden="true"
        style={{
          position:        "absolute",
          bottom:          "-2px",
          left:            0,
          right:           0,
          height:          "2px",
          borderRadius:    "var(--radius-full)",
          background:      "var(--color-primary)",
          transform:       isActive ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition:      `transform var(--duration-base) var(--ease-out-expo)`,
        }}
      />
    </Link>
  );
}

// — Mobile nav link — UNCHANGED ──────────────────────────────
function MobileNavLink({
  href,
  name,
  onClick,
}: {
  href: string;
  name: string;
  onClick?: () => void;
}) {
  const router   = useRouter();
  const isActive = router.pathname === href;   // ← unchanged

  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display:        "block",
        borderRadius:   "var(--radius-md)",
        padding:        "0.5rem 0.75rem",
        fontSize:       "var(--text-base)",
        fontWeight:     isActive ? "600" : "450",
        color:          isActive
          ? "var(--color-primary)"
          : "var(--color-text-primary)",
        background:     isActive ? "var(--color-primary-soft)" : "transparent",
        transition:     `background var(--duration-fast) var(--ease-in-out),
                         color var(--duration-fast) var(--ease-in-out)`,
        textDecoration: "none",
      }}
    >
      {name}
    </Link>
  );
}

// — Auth button — UNCHANGED logic; inline hover replaced by data-nav-btn ──
function AuthButton({
  hasSession,
  fullWidth = false,
}: {
  hasSession: boolean;
  fullWidth?: boolean;
}) {
  const handleClick = useCallback(() => {    // ← unchanged
    if (hasSession) void signOut();
    else            void signIn();
  }, [hasSession]);

  return (
    <button
      data-nav-btn                           // ← CSS class replaces onMouseEnter/Leave
      onClick={handleClick}
      style={{
        display:       fullWidth ? "block" : "inline-flex",
        width:         fullWidth ? "100%" : "auto",
        textAlign:     fullWidth ? "center" : undefined,
        fontSize:      "var(--text-sm)",
        fontWeight:    "500",
        color:         "var(--color-text-secondary)",
        background:    "transparent",
        border:        "none",
        padding:       fullWidth ? "0.75rem 1rem" : "0.375rem 0.5rem",
        borderRadius:  "var(--radius-md)",
        cursor:        "pointer",
        letterSpacing: "0.01em",
      }}
    >
      {hasSession ? "Log out" : "Log in"}
    </button>
  );
}

// — Theme toggle — ENHANCED: MutationObserver keeps in sync ──
function ThemeToggle() {
  const [isDark, setIsDark]       = useState(false);
  const [mounted, setMounted]     = useState(false);  // icon key for animation
  const iconKeyRef                = useRef(0);

  useEffect(() => {
    // Initial read
    const read = () =>
      document.documentElement.getAttribute("data-theme") === "dark";
    setIsDark(read());

    // Stay in sync if theme is toggled externally (e.g. _app.tsx, OS pref)
    const observer = new MutationObserver(() => {
      setIsDark(read());
      iconKeyRef.current += 1;      // forces icon re-mount → crossfade animation
      setMounted(v => !v);          // trigger re-render
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    toggleTheme();                  // ← unchanged
    setIsDark(d => !d);
    iconKeyRef.current += 1;
    setMounted(v => !v);
  };

  return (
    <button
      data-nav-btn="icon"           // ← CSS class replaces onMouseEnter/Leave
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark         ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        justifyContent:  "center",
        width:           "2rem",
        height:          "2rem",
        borderRadius:    "var(--radius-md)",
        border:          "1px solid var(--color-border)",
        background:      "transparent",
        color:           "var(--color-text-muted)",
        cursor:          "pointer",
        flexShrink:      0,
      }}
    >
      {/* key forces remount → triggers CSS animation on icon swap */}
      {isDark
        ? <SunIcon  key={`sun-${iconKeyRef.current}`}  className="theme-icon-enter" style={{ width: "1rem", height: "1rem" }} />
        : <MoonIcon key={`moon-${iconKeyRef.current}`} className="theme-icon-enter" style={{ width: "1rem", height: "1rem" }} />
      }
    </button>
  );
}

// — NEW: Session user avatar pill (desktop only) ─────────────
// Shows initials from session.user.name — purely additive UI.
// Renders nothing if session is null — no logic change.
function UserPill({ name }: { name?: string | null }) {
  if (!name) return null;

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      aria-hidden="true"          // decorative — screen readers use the Log out button
      title={name}
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        gap:             "0.5rem",
        padding:         "0.25rem 0.625rem 0.25rem 0.25rem",
        borderRadius:    "var(--radius-full)",
        border:          "1px solid var(--color-border)",
        background:      "var(--color-surface-raised, rgba(0,0,0,0.03))",
        flexShrink:      0,
        userSelect:      "none",
      }}
    >
      {/* Avatar circle */}
      <span
        style={{
          width:           "1.5rem",
          height:          "1.5rem",
          borderRadius:    "50%",
          background:      "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)",
          display:         "inline-flex",
          alignItems:      "center",
          justifyContent:  "center",
          fontSize:        "0.625rem",
          fontWeight:      "700",
          color:           "#fff",
          letterSpacing:   "0.03em",
          flexShrink:      0,
        }}
      >
        {initials}
      </span>
      {/* Name — truncated at 14 chars to keep pill compact */}
      <span
        style={{
          fontSize:      "var(--text-xs, 0.75rem)",
          fontWeight:    "500",
          color:         "var(--color-text-secondary)",
          maxWidth:      "7rem",
          overflow:      "hidden",
          textOverflow:  "ellipsis",
          whiteSpace:    "nowrap",
        }}
      >
        {name.split(" ")[0]}  {/* First name only */}
      </span>
    </div>
  );
}

// ============================================================
// § 4. MAIN NAV COMPONENT
// ============================================================
const Nav = () => {
  const { data: session } = useSession();   // ← UNCHANGED
  const scrolled          = useScrolled();  // NEW: scroll state for elevation

  return (
    <>
      {/* Inject scoped styles once — avoids scattered inline handlers */}
      <style>{NAV_STYLES}</style>

      <Popover
        as="header"
        style={{ position: "relative", zIndex: "var(--z-raised)" }}
      >
        {/* ── Desktop navbar ────────────────────────────── */}
        <div
          data-navbar-glass                      // ← dark-mode selector hook
          style={{
            // Light mode glass — dark mode overridden by [data-theme="dark"] CSS above
            background:           "rgba(255, 255, 255, 0.85)",
            backdropFilter:       "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom:         "1px solid var(--color-border)",
            // Scroll-aware elevation: shadow lifts when user scrolls
            boxShadow: scrolled
              ? "0 4px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)"
              : "var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.04))",
            position:             "sticky",
            top:                  0,
            zIndex:               "var(--z-raised)",
            // Smooth shadow transition on scroll
            transition:           "box-shadow 0.25s var(--ease-in-out, ease)",
          }}
        >
          <nav
            className="relative mx-auto flex max-w-7xl items-center justify-between px-6"
            aria-label="Global"
            style={{ height: "3.75rem" }}
          >

            {/* ── Left: Logo + nav links ─────────────────── */}
            <div className="flex flex-1 items-center">
              <div className="flex w-full items-center justify-between md:w-auto">

                {/* Logo — UNCHANGED */}
                <Link
                  href="/"
                  style={{
                    display:    "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                    transition: `opacity var(--duration-fast) var(--ease-in-out)`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <span className="sr-only">DentalOS</span>
                  <Image
                    className="h-8 w-auto sm:h-10"
                    src={logo}
                    alt="DentalOS Logo"
                    priority
                  />
                </Link>

                {/* Mobile hamburger — UNCHANGED */}
                <div
                  className="-mr-2 flex items-center md:hidden"
                  style={{ marginLeft: "auto" }}
                >
                  <Popover.Button
                    data-nav-btn="icon"
                    aria-label="Open main menu"
                    style={{
                      display:         "inline-flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      borderRadius:    "var(--radius-md)",
                      padding:         "0.375rem",
                      border:          "1px solid var(--color-border)",
                      background:      "transparent",
                      color:           "var(--color-text-secondary)",
                      cursor:          "pointer",
                    }}
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon style={{ width: "1.25rem", height: "1.25rem" }} aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              {/* Desktop nav links — UNCHANGED */}
              <div
                className="hidden md:flex"
                style={{ marginLeft: "2.5rem", gap: "1.75rem" }}
              >
                {NAV_ITEMS.map(item => (
                  <NavLink key={item.name} href={item.href} name={item.name} />
                ))}
              </div>
            </div>

            {/* ── Right: Avatar + Auth + CTA + Theme ──────── */}
            <div
              className="flex items-center"
              style={{ gap: "0.5rem" }}
            >
              {/* Theme toggle — ENHANCED */}
              <ThemeToggle />

              {/* NEW: User avatar pill — only when session exists */}
              {session && (
                <UserPill name={session.user?.name} />
              )}

              {/* Auth button — UNCHANGED logic */}
              <AuthButton hasSession={!!session} />

              {/* Manage CTA — UNCHANGED: Tailwind classes untouched */}
              {session && (
                <Link
                  href="/gated"
                  className="inline-flex hover:scale-102 transition duration-75 active:scale-97 items-center rounded-md border border-transparent bg-babyblue px-4 py-2 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                  style={{
                    boxShadow:     "0 1px 2px rgba(0, 175, 240, 0.25)",
                    fontSize:      "var(--text-sm)",
                    fontWeight:    "500",
                    letterSpacing: "0.01em",
                    transition:    `box-shadow var(--duration-fast) var(--ease-in-out),
                                    transform 75ms var(--ease-out-expo)`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 3px 10px rgba(0, 175, 240, 0.35)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 1px 2px rgba(0, 175, 240, 0.25)";
                  }}
                >
                  Manage
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* ── Mobile drawer — UNCHANGED structure ──────────── */}
        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 z-10 origin-top transform p-2 transition md:hidden"
          >
            {({ close }) => (
              <div
                style={{
                  overflow:     "hidden",
                  borderRadius: "var(--radius-xl)",
                  background:   "var(--color-surface)",
                  boxShadow:    "var(--shadow-xl)",
                  border:       "1px solid var(--color-border)",
                }}
              >
                {/* Drawer header — UNCHANGED structure */}
                <div
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    padding:        "1rem 1.25rem",
                    borderBottom:   "1px solid var(--color-border)",
                  }}
                >
                  <Image
                    className="h-8 w-auto"
                    src={logo}
                    alt="DentalOS Logo"
                  />
                  {/* Close button — ENHANCED: explicit aria-label added */}
                  <Popover.Button
                    data-nav-btn="icon"
                    aria-label="Close navigation menu"
                    style={{
                      display:         "inline-flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      borderRadius:    "var(--radius-md)",
                      padding:         "0.375rem",
                      border:          "1px solid var(--color-border)",
                      background:      "transparent",
                      color:           "var(--color-text-muted)",
                      cursor:          "pointer",
                    }}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon style={{ width: "1.25rem", height: "1.25rem" }} aria-hidden="true" />
                  </Popover.Button>
                </div>

                {/* Drawer nav links — UNCHANGED */}
                <div style={{ padding: "0.75rem 0.75rem 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {NAV_ITEMS.map(item => (
                      <MobileNavLink
                        key={item.name}
                        href={item.href}
                        name={item.name}
                        onClick={close}
                      />
                    ))}
                  </div>
                </div>

                {/* Drawer footer — UNCHANGED logic; NEW: user name chip */}
                <div
                  style={{
                    padding:       "1rem 1.25rem",
                    marginTop:     "0.5rem",
                    borderTop:     "1px solid var(--color-border)",
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "0.5rem",
                  }}
                >
                  {/* NEW: Logged-in user name chip inside drawer */}
                  {session?.user?.name && (
                    <div
                      style={{
                        display:       "flex",
                        alignItems:    "center",
                        gap:           "0.5rem",
                        padding:       "0.5rem 0",
                        marginBottom:  "0.25rem",
                        borderBottom:  "1px solid var(--color-border)",
                      }}
                    >
                      {/* Avatar circle */}
                      <span
                        style={{
                          width:           "2rem",
                          height:          "2rem",
                          borderRadius:    "50%",
                          background:      "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)",
                          display:         "inline-flex",
                          alignItems:      "center",
                          justifyContent:  "center",
                          fontSize:        "0.7rem",
                          fontWeight:      "700",
                          color:           "#fff",
                          flexShrink:      0,
                        }}
                      >
                        {session.user.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n: string) => n[0]?.toUpperCase() ?? "")
                          .join("")}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                        <span
                          style={{
                            fontSize:   "var(--text-sm)",
                            fontWeight: "600",
                            color:      "var(--color-text-primary)",
                          }}
                        >
                          {session.user.name}
                        </span>
                        {session.user?.email && (
                          <span
                            style={{
                              fontSize:     "var(--text-xs, 0.75rem)",
                              color:        "var(--color-text-muted)",
                              overflow:     "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace:   "nowrap",
                              maxWidth:     "13rem",
                            }}
                          >
                            {session.user.email}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Theme toggle row — UNCHANGED */}
                  <div
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      marginBottom:   "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize:   "var(--text-sm)",
                        color:      "var(--color-text-muted)",
                        fontWeight: "450",
                      }}
                    >
                      Appearance
                    </span>
                    <ThemeToggle />
                  </div>

                  {/* Auth CTA — UNCHANGED logic */}
                  {!session ? (
                    <button
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={() => signIn()}
                      style={{
                        display:      "block",
                        width:        "100%",
                        textAlign:    "center",
                        borderRadius: "var(--radius-md)",
                        padding:      "0.75rem 1rem",
                        fontSize:     "var(--text-base)",
                        fontWeight:   "500",
                        color:        "#fff",
                        background:   "var(--color-primary)",
                        border:       "none",
                        cursor:       "pointer",
                        boxShadow:    "0 1px 2px rgba(0,102,255,0.25)",
                        transition:   `opacity var(--duration-fast) var(--ease-in-out)`,
                      }}
                    >
                      Log in
                    </button>
                  ) : (
                    <>
                      {/* Manage link — UNCHANGED: bg-babyblue class preserved */}
                      <Link
                        href="/gated"
                        onClick={close}
                        className="bg-babyblue"
                        style={{
                          display:        "block",
                          textAlign:      "center",
                          borderRadius:   "var(--radius-md)",
                          padding:        "0.75rem 1rem",
                          fontSize:       "var(--text-base)",
                          fontWeight:     "500",
                          color:          "#fff",
                          textDecoration: "none",
                          boxShadow:      "0 1px 2px rgba(0,175,240,0.25)",
                        }}
                      >
                        Manage
                      </Link>
                      {/* Log out — UNCHANGED */}
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={() => signOut()}
                        style={{
                          display:      "block",
                          width:        "100%",
                          textAlign:    "center",
                          borderRadius: "var(--radius-md)",
                          padding:      "0.625rem 1rem",
                          fontSize:     "var(--text-sm)",
                          fontWeight:   "450",
                          color:        "var(--color-text-secondary)",
                          background:   "transparent",
                          border:       "1px solid var(--color-border)",
                          cursor:       "pointer",
                          transition:   `background var(--duration-fast) var(--ease-in-out)`,
                        }}
                      >
                        Log out
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default Nav;
