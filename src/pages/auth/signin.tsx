/* eslint-disable @typescript-eslint/no-misused-promises */
// ============================================================
// src/pages/auth/signin.tsx
// DENTAL SAAS — Clinic Portal Sign In
//
// PRESERVED:
//   • getServerSideProps — session redirect + getProviders untouched
//   • providers.map() + signIn(provider.id) — untouched
//   • Split layout: left panel + right image — untouched
//   • backgroundImage (right) + bg (mobile) — untouched
//   • AiOutlineGoogle icon — untouched
//   • Session redirect to "/" — untouched
//   • Pages Router + NextAuth architecture — untouched
//   • Responsive md:px-28 left panel behavior — untouched
//   • bg-babyblue on OAuth button — preserved
//
// ENHANCED (Public-First UX Strategy):
//   • "← Back to home" escape path — public-first recovery
//   • Heading reframed: Clinic Portal, not generic "Sign in"
//   • Sub-copy clarifies: auth = staff/clinic access only
//   • Trust indicators below button (OAuth, HIPAA-aware, secure)
//   • Surface: bg-white → var(--color-surface) — dark mode aware
//   • Text: gray-* → CSS variable tokens throughout
//   • OAuth button: lift hover + glow matching Hero CTA pattern
//   • Right panel: gradient overlay + brand tagline
//   • Staggered entrance animation via ds-slide-up
//   • Mobile bg: token-aligned opacity handling
// ============================================================

import React                              from "react";
import { signIn, getProviders }           from "next-auth/react";
import { getServerSession }               from "next-auth/next";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
}                                         from "next";
import { authOptions }                    from "~/server/auth";
import Link                               from "next/link";
import Head                               from "next/head";
import Image                              from "next/image";
import { AiOutlineGoogle }                from "react-icons/ai";
import backgroundImage                    from "../../../public/background-auth.jpg";
import bg                                 from "../../../public/bg.jpg";
import logo                               from "../../../public/logo2.png";

// ── Stagger helper — reuses ds-slide-up from globals.css ────
function fadeUp(delayMs: number): React.CSSProperties {
  return {
    animation:  `ds-slide-up var(--duration-slow) var(--ease-out-expo) ${delayMs}ms both`,
    willChange: "transform, opacity",
  };
}

// ── Trust indicators — healthcare conversion signals ────────
const TRUST_ITEMS = [
  { icon: "🔒", label: "Secured via Google OAuth" },
  { icon: "🏥", label: "HIPAA-aware infrastructure" },
  { icon: "🚫", label: "No passwords stored" },
] as const;

// ============================================================
// COMPONENT
// ============================================================
const FinallyAuth = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div
      className="relative flex h-[100vh] min-h-full justify-center md:px-12 lg:px-0"
      style={{
        background: "var(--color-bg)",
      }}
    >
      {/* ── Left panel ──────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-1 flex-col px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28"
        style={{
          background: "var(--color-surface)",
          boxShadow:  "var(--shadow-xl)",
          transition: `background var(--duration-slow) var(--ease-in-out)`,
        }}
      >
        {/* Mobile background — preserved, token-aligned opacity */}
        <Image
          alt="background"
          src={bg}
          className="object-fit absolute left-0 top-0 -z-10 h-[100vh] min-h-full md:hidden"
          style={{ opacity: 0.08 }}
        />

        <main className="mx-auto mt-12 flex w-full max-w-md flex-col items-center justify-center sm:mt-0 sm:px-4 md:w-96 md:max-w-sm md:items-start md:px-0">

          <Head>
            <title>Clinic Portal — Finally Quiet</title>
            <meta
              name="description"
              content="Sign into the Finally Quiet clinic portal"
            />
            <link rel="icon" href="/logo2.png" />
          </Head>

          {/* ── Back to home — public-first escape path ─── */}
          <div style={{ ...fadeUp(0), width: "100%", marginBottom: "1.5rem" }}>
            <Link
              href="/"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "0.375rem",
                fontSize:       "var(--text-sm)",
                color:          "var(--color-text-muted)",
                textDecoration: "none",
                transition:     `color var(--duration-fast) var(--ease-in-out)`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-text-secondary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-text-muted)";
              }}
            >
              {/* Arrow */}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "0.875rem", height: "0.875rem" }}
                aria-hidden="true"
              >
                <path d="M10 4L6 8l4 4" />
              </svg>
              Back to home
            </Link>
          </div>

          {/* ── Logo ────────────────────────────────────── */}
          <div style={{ ...fadeUp(40) }}>
            <Link href="/" aria-label="Home">
              <Image
                src={logo}
                alt="Finally Quiet Logo"
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* ── Portal badge ─────────────────────────────── */}
          <div
            style={{
              ...fadeUp(80),
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "0.375rem",
              marginTop:     "1.25rem",
              padding:       "0.25rem 0.625rem",
              borderRadius:  "var(--radius-full)",
              background:    "var(--color-primary-soft)",
              border:        "1px solid rgba(0,102,255,0.15)",
            }}
          >
            <span
              style={{
                width:        "0.4rem",
                height:       "0.4rem",
                borderRadius: "var(--radius-full)",
                background:   "var(--color-primary)",
                flexShrink:   0,
              }}
            />
            <span
              style={{
                fontSize:      "var(--text-xs)",
                fontWeight:    "600",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "var(--color-primary)",
              }}
            >
              Clinic Portal
            </span>
          </div>

          {/* ── Heading ──────────────────────────────────── */}
          <h2
            style={{
              ...fadeUp(120),
              marginTop:    "1rem",
              fontSize:     "var(--text-2xl)",
              fontWeight:   "700",
              lineHeight:   "var(--leading-tight)",
              letterSpacing: "-0.01em",
              color:        "var(--color-text-primary)",
            }}
          >
            Welcome back to
            <br />
            <span
              className="text-babyblue"
              style={{
                filter: "drop-shadow(0 0 16px rgba(0,175,240,0.20))",
              }}
            >
              Finally Quiet
            </span>
          </h2>

          {/* ── Sub-copy — public-first framing ─────────── */}
          <p
            style={{
              ...fadeUp(160),
              marginTop:  "0.75rem",
              fontSize:   "var(--text-sm)",
              color:      "var(--color-text-secondary)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            This portal is for{" "}
            <strong style={{ color: "var(--color-text-primary)", fontWeight: "500" }}>
              clinic staff and administrators
            </strong>
            . Patients can{" "}
            <Link
              href="/"
              style={{
                color:          "var(--color-primary)",
                textDecoration: "none",
                fontWeight:     "500",
              }}
            >
              book appointments without signing in →
            </Link>
          </p>

          {/* ── Divider ──────────────────────────────────── */}
          <hr
            className="ds-divider"
            style={{
              width:     "100%",
              margin:    "1.5rem 0",
              opacity:   0.6,
            }}
          />

          {/* ── OAuth providers ──────────────────────────── */}
          <div
            style={{
              ...fadeUp(200),
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  type="button"
                  className="bg-babyblue"
                  style={{
                    width:         "100%",
                    display:       "flex",
                    alignItems:    "center",
                    justifyContent: "center",
                    gap:           "0.5rem",
                    padding:       "0.875rem 1.5rem",
                    borderRadius:  "var(--radius-md)",
                    border:        "none",
                    fontWeight:    "600",
                    fontSize:      "var(--text-base)",
                    color:         "#fff",
                    cursor:        "pointer",
                    boxShadow:     "0 1px 2px rgba(0,175,240,0.30)",
                    letterSpacing: "0.01em",
                    transition:    `transform var(--duration-fast) var(--ease-out-expo),
                                    box-shadow var(--duration-fast) var(--ease-out-expo)`,
                    willChange:    "transform",
                  }}
                  onMouseEnter={e => {
                    const btn = e.currentTarget;
                    btn.style.transform = "translateY(-2px)";
                    btn.style.boxShadow = "0 6px 20px rgba(0,175,240,0.38)";
                  }}
                  onMouseLeave={e => {
                    const btn = e.currentTarget;
                    btn.style.transform = "translateY(0)";
                    btn.style.boxShadow = "0 1px 2px rgba(0,175,240,0.30)";
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                >
                  <AiOutlineGoogle style={{ fontSize: "1.125rem" }} />
                  Continue with {provider.name}
                </button>
              ))}
          </div>

          {/* ── Trust indicators ─────────────────────────── */}
          <div
            style={{
              ...fadeUp(240),
              marginTop:     "1.5rem",
              width:         "100%",
              display:       "flex",
              flexDirection: "column",
              gap:           "0.5rem",
            }}
          >
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "0.5rem",
                  fontSize:   "var(--text-xs)",
                  color:      "var(--color-text-muted)",
                }}
              >
                <span style={{ fontSize: "0.75rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* ── Footer note ──────────────────────────────── */}
          <p
            style={{
              ...fadeUp(280),
              marginTop:  "2rem",
              fontSize:   "var(--text-xs)",
              color:      "var(--color-text-muted)",
              lineHeight: "var(--leading-normal)",
              textAlign:  "center",
              width:      "100%",
            }}
          >
            By continuing, you agree to Finally Quiet&apos;s{" "}
            <Link
              href="/terms"
              style={{
                color:          "var(--color-text-secondary)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              style={{
                color:          "var(--color-text-secondary)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Privacy Policy
            </Link>
            .
          </p>

        </main>
      </div>

      {/* ── Right panel: background image + overlay ─────── */}
      <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
        {/* Full-bleed background image — preserved */}
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt=""
          unoptimized
        />

        {/* Dark gradient overlay for legibility + depth */}
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(135deg, rgba(10,14,22,0.72) 0%, rgba(0,102,255,0.15) 100%)",
            zIndex:     1,
          }}
        />

        {/* Brand tagline — centered on right panel */}
        <div
          style={{
            position:       "absolute",
            inset:          0,
            zIndex:         2,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "2rem",
            textAlign:      "center",
            animation:      `ds-fade-in var(--duration-slower) var(--ease-out-expo) 300ms both`,
          }}
        >
          <p
            style={{
              fontSize:      "var(--text-xs)",
              fontWeight:    "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:         "rgba(255,255,255,0.5)",
              marginBottom:  "0.75rem",
            }}
          >
            Dental Practice Management
          </p>
          <h3
            style={{
              fontSize:      "clamp(2rem, 4vw, 3rem)",
              fontWeight:    "700",
              lineHeight:    "var(--leading-tight)",
              letterSpacing: "-0.02em",
              color:         "#fff",
              marginBottom:  "1rem",
            }}
          >
            Your office can be
            <br />
            <span
              style={{
                color:  "var(--color-accent)",
                filter: "drop-shadow(0 0 24px rgba(0,175,240,0.4))",
              }}
            >
              Finally Quiet
            </span>
          </h3>
          <p
            style={{
              fontSize:  "var(--text-base)",
              color:     "rgba(255,255,255,0.65)",
              maxWidth:  "22rem",
              lineHeight: "var(--leading-normal)",
            }}
          >
            Streamline your clinic operations and give your staff the calm they deserve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinallyAuth;

// ── Server-side — preserved exactly ─────────────────────────
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
