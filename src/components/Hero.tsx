// ============================================================
// src/components/Hero.tsx
// DENTAL SAAS — Public Hero Section
//
// PRESERVED:
//   • useSession + signIn + signOut logic — untouched
//   • useEffect modal trigger — untouched
//   • ModalHome component + all props — untouched
//   • Both CTA states (signed-in disabled / signed-out active)
//   • #pricing anchor on "Learn more"
//   • Image source (fQ from public/images/bgremoved/Inked3.jpg)
//   • xl:grid xl:grid-cols-2 two-column layout
//   • text-babyblue on brand tagline
//   • disabled state on signed-in button
//   • Pages Router + NextAuth compatibility
//
// ENHANCED:
//   • Surface: bg-white → var(--color-surface) — dark mode aware
//   • Text: text-black/gray-600 → CSS variable tokens
//   • CTA primary: lift hover + glow shadow matching ds-btn pattern
//   • CTA secondary: token border + hover fill
//   • Entrance: staggered slide-up on copy, fade-in on image
//   • Image: subtle drop-shadow + soft ambient glow behind
//   • Spacing: clamp() fluid rhythm consistent with index.tsx
//   • Stale @tailwindcss/forms comment removed
// ============================================================

import { useEffect, useState }          from "react";
import Image                            from "next/image";
import { useSession, signIn, signOut }  from "next-auth/react";
import ModalHome                        from "./ModalHome";
import fQ                               from "../../public/images/bgremoved/Inked3.jpg";

// ── Animation delay helper ───────────────────────────────────
// Inline style object for staggered entrance — no library needed.
function fadeUp(delayMs: number): React.CSSProperties {
  return {
    animation:     `ds-slide-up var(--duration-slow) var(--ease-out-expo) ${delayMs}ms both`,
    willChange:    "transform, opacity",
  };
}

// ============================================================
// COMPONENT
// ============================================================
export default function Hero() {
  const { data: session } = useSession();
  const [open, setOpen]   = useState(false);

  // Preserved: auto-open modal when session is active
  useEffect(() => {
    if (session) setOpen(true);
  }, [session]);

  return (
    <div className="relative">
      <main>
        <div
          style={{
            background: "var(--color-surface)",
            paddingTop: "clamp(2.5rem, 6vw, 4rem)",
            paddingBottom: "clamp(2rem, 4vw, 3.5rem)",
            overflow:   "hidden",
            // Smooth dark mode transition
            transition: `background var(--duration-slow) var(--ease-in-out)`,
          }}
        >
          {/* Ambient glow — decorative, GPU layer, dark mode visible */}
          <div
            aria-hidden="true"
            style={{
              position:     "absolute",
              top:          "-6rem",
              right:        "-4rem",
              width:        "40rem",
              height:       "40rem",
              borderRadius: "var(--radius-full)",
              background:   "radial-gradient(circle, rgba(0,175,240,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex:       0,
            }}
          />

          <div
            className="mx-auto max-w-7xl xl:px-8"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="xl:grid xl:grid-cols-2 xl:gap-8">

              {/* ── Left column: Copy + CTAs ─────────────── */}
              <div className="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center xl:flex xl:items-center xl:px-0 xl:text-left">
                <div className="xl:py-24">

                  {/* Eyebrow */}
                  <p
                    style={{
                      ...fadeUp(0),
                      fontSize:      "var(--text-xs)",
                      fontWeight:    "600",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color:         "var(--color-primary)",
                      marginBottom:  "1rem",
                    }}
                  >
                    Dental Practice Management
                  </p>

                  {/* Heading — preserved structure, token-aligned */}
                  <h1
                    style={{
                      ...fadeUp(60),
                      fontSize:    "clamp(2.25rem, 6vw, 3.5rem)",
                      fontWeight:  "700",
                      lineHeight:  "var(--leading-tight)",
                      letterSpacing: "-0.02em",
                      color:       "var(--color-text-primary)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <span style={{ display: "block" }}>
                      Your office can be
                    </span>
                    {/* Brand tagline — text-babyblue preserved + subtle glow */}
                    <span
                      className="text-babyblue"
                      style={{
                        display:    "block",
                        filter:     "drop-shadow(0 0 24px rgba(0,175,240,0.25))",
                        transition: `filter var(--duration-slow) var(--ease-in-out)`,
                      }}
                    >
                      Finally Quiet
                    </span>
                  </h1>

                  {/* Body copy */}
                  <p
                    style={{
                      ...fadeUp(120),
                      fontSize:     "var(--text-lg)",
                      color:        "var(--color-text-secondary)",
                      lineHeight:   "var(--leading-normal)",
                      marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                      maxWidth:     "34rem",
                    }}
                  >
                    Save yourself, your staff, and your patients from the
                    loudness of your office. Join Finally Quiet today!
                  </p>

                  {/* ── CTAs ──────────────────────────────── */}
                  <div
                    style={{
                      ...fadeUp(180),
                      display: "flex",
                      gap:     "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Primary CTA — signed out */}
                    {!session && (
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={() => signIn()}
                        style={{
                          flex:          "1 1 auto",
                          minWidth:      "10rem",
                          whiteSpace:    "nowrap",
                          borderRadius:  "var(--radius-md)",
                          padding:       "0.75rem 1.25rem",
                          fontWeight:    "500",
                          fontSize:      "var(--text-base)",
                          color:         "#fff",
                          background:    "var(--color-accent)",
                          border:        "none",
                          cursor:        "pointer",
                          boxShadow:     "0 1px 2px rgba(0,175,240,0.30)",
                          transition:    `transform var(--duration-fast) var(--ease-out-expo),
                                          box-shadow var(--duration-fast) var(--ease-out-expo),
                                          opacity var(--duration-fast) var(--ease-in-out)`,
                          willChange:    "transform",
                        }}
                        onMouseEnter={e => {
                          const btn = e.currentTarget;
                          btn.style.transform  = "translateY(-2px)";
                          btn.style.boxShadow  = "0 6px 20px rgba(0,175,240,0.38)";
                        }}
                        onMouseLeave={e => {
                          const btn = e.currentTarget;
                          btn.style.transform  = "translateY(0)";
                          btn.style.boxShadow  = "0 1px 2px rgba(0,175,240,0.30)";
                        }}
                        onMouseDown={e => {
                          e.currentTarget.style.transform = "translateY(0) scale(0.98)";
                        }}
                        onMouseUp={e => {
                          e.currentTarget.style.transform = "translateY(-2px) scale(1)";
                        }}
                      >
                        Join Finally Quiet
                      </button>
                    )}

                    {/* Primary CTA — signed in (disabled) */}
                    {session && (
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={() => signOut()}
                        disabled
                        style={{
                          flex:          "1 1 auto",
                          minWidth:      "10rem",
                          whiteSpace:    "nowrap",
                          borderRadius:  "var(--radius-md)",
                          padding:       "0.75rem 1.25rem",
                          fontWeight:    "500",
                          fontSize:      "var(--text-base)",
                          color:         "#fff",
                          background:    "var(--color-accent)",
                          border:        "none",
                          cursor:        "not-allowed",
                          opacity:       "0.7",
                        }}
                      >
                        ✓ You joined Finally Quiet!
                      </button>
                    )}

                    {/* Secondary CTA — Learn more → #pricing */}
                    <a
                      href="#pricing"
                      style={{
                        flex:           "1 1 auto",
                        minWidth:       "8rem",
                        display:        "inline-flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        whiteSpace:     "nowrap",
                        borderRadius:   "var(--radius-md)",
                        padding:        "0.75rem 1.25rem",
                        fontWeight:     "500",
                        fontSize:       "var(--text-base)",
                        color:          "var(--color-accent)",
                        background:     "transparent",
                        border:         "1.5px solid var(--color-accent)",
                        textDecoration: "none",
                        boxShadow:      "var(--shadow-xs)",
                        transition:     `background var(--duration-fast) var(--ease-in-out),
                                          color var(--duration-fast) var(--ease-in-out),
                                          transform var(--duration-fast) var(--ease-out-expo)`,
                        willChange:     "transform",
                      }}
                      onMouseEnter={e => {
                        const a = e.currentTarget;
                        a.style.background = "rgba(0,175,240,0.08)";
                        a.style.transform  = "translateY(-1px)";
                      }}
                      onMouseLeave={e => {
                        const a = e.currentTarget;
                        a.style.background = "transparent";
                        a.style.transform  = "translateY(0)";
                      }}
                    >
                      Learn more
                    </a>
                  </div>

                  {/* Trust micro-copy */}
                  <p
                    style={{
                      ...fadeUp(240),
                      marginTop:  "1.25rem",
                      fontSize:   "var(--text-xs)",
                      color:      "var(--color-text-muted)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    No credit card required &nbsp;·&nbsp; Cancel anytime
                  </p>

                </div>
              </div>

              {/* ── Right column: Hero image ──────────────── */}
              <div
                className="mt-12 xl:ml-20 sm:mt-20 xl:mt-36 mb-12"
                style={{
                  animation:  `ds-fade-in var(--duration-slower) var(--ease-out-expo) 200ms both`,
                  willChange: "opacity",
                  position:   "relative",
                }}
              >
                {/* Soft ambient glow behind image */}
                <div
                  aria-hidden="true"
                  style={{
                    position:     "absolute",
                    inset:        "10%",
                    borderRadius: "var(--radius-full)",
                    background:   "radial-gradient(ellipse, rgba(0,175,240,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex:       0,
                    filter:       "blur(24px)",
                  }}
                />
                <Image
                  alt="Finally Quiet headphones"
                  className="mx-auto"
                  src={fQ}
                  style={{
                    position:   "relative",
                    zIndex:     1,
                    filter:     "drop-shadow(0 20px 40px rgba(0,175,240,0.15))",
                  }}
                  priority
                />
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Preserved: ModalHome — props untouched */}
      <ModalHome open={open} setOpen={setOpen} image="/modal.jpg" topText={true} />
    </div>
  );
}
