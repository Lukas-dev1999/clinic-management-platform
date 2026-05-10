// ============================================================
// src/pages/index.tsx
// DENTAL SAAS — Dashboard Home / Console Index
//
// PRESERVED:
//   • Component name: ConsolePage
//   • All 3 routes: /console/Owner/office, /console/Owner/patient, /actionlog
//   • Grid layout: grid-cols-1 md:grid-cols-3
//   • Link component usage — no routing changes
//   • Pages Router compatibility
//   • Zero new dependencies introduced
//
// ENHANCED:
//   • Page surface uses var(--color-bg) — dark mode aware
//   • Typography aligned to globals.css token scale
//   • Cards use ds-card lift pattern + CSS variable borders/shadows
//   • Staggered entrance animation via ds-stagger (globals.css)
//   • Hover micro-interactions: translateY + shadow + arrow nudge
//   • Icon per card — inline SVG, zero deps
//   • Dark mode: every color via CSS variable
//   • Gradient accent on heading title
// ============================================================

import Link from "next/link";

// ── Card data — single source of truth ──────────────────────
const CARDS = [
  {
    href:        "/console/Owner/office",
    title:       "Offices",
    description: "Manage dental offices and clinic locations",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "1.25rem", height: "1.25rem" }}
        aria-hidden="true"
      >
        <path d="M3 10.5V17h5v-4h4v4h5v-6.5M1 10l9-8 9 8" />
      </svg>
    ),
  },
  {
    href:        "/console/Owner/patient",
    title:       "Patients",
    description: "View and manage patient records",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "1.25rem", height: "1.25rem" }}
        aria-hidden="true"
      >
        <circle cx="10" cy="6" r="3.5" />
        <path d="M2 18c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    href:        "/actionlog",
    title:       "Action Logs",
    description: "Review system activity and audit trail",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "1.25rem", height: "1.25rem" }}
        aria-hidden="true"
      >
        <path d="M4 4h12M4 8h8M4 12h10M4 16h6" />
      </svg>
    ),
  },
] as const;

// ── Arrow icon — reused in each card ────────────────────────
function ArrowRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        width:      "0.875rem",
        height:     "0.875rem",
        flexShrink: 0,
        transition: `transform var(--duration-base) var(--ease-out-expo)`,
      }}
      className="nav-arrow"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function ConsolePage() {
  return (
    <div
      style={{
        minHeight:   "100vh",
        background:  "var(--color-bg)",
        padding:     "clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)",
        // Smooth dark mode bg transition
        transition:  `background var(--duration-slow) var(--ease-in-out)`,
      }}
    >
      {/* ── Max-width shell — matches Nav's max-w-7xl ──── */}
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

        {/* ── Page header ────────────────────────────────── */}
        <div
          className="ds-fade-in"
          style={{ marginBottom: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          {/* Eyebrow label */}
          <p
            style={{
              fontSize:      "var(--text-xs)",
              fontWeight:    "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         "var(--color-primary)",
              marginBottom:  "0.5rem",
            }}
          >
            Console
          </p>

          {/* Main heading */}
          <h1
            style={{
              fontSize:   "clamp(1.75rem, 4vw, var(--text-3xl))",
              fontWeight: "700",
              lineHeight: "var(--leading-tight)",
              color:      "var(--color-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Dental{" "}
            {/* Gradient accent — reuses finallyQuietStyling keyframe */}
            <span
              style={{
                color:                "transparent",
                backgroundImage:      "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip:       "text",
                WebkitTextFillColor:  "transparent",
              }}
            >
              Dashboard
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize:  "var(--text-base)",
              color:     "var(--color-text-secondary)",
              maxWidth:  "36rem",
              lineHeight: "var(--leading-normal)",
            }}
          >
            Manage your clinic operations from one place.
          </p>
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <hr className="ds-divider" style={{ marginBottom: "clamp(1.5rem, 3vw, 2rem)" }} />

        {/* ── Cards grid ─────────────────────────────────── */}
        {/*
          grid-cols-1 md:grid-cols-3 preserved exactly.
          ds-stagger applies staggered slide-up to each child.
        */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 ds-stagger"
          style={{ gap: "clamp(0.875rem, 2vw, 1.25rem)" }}
        >
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="ds-card"
              style={{
                display:        "flex",
                flexDirection:  "column",
                gap:            "1rem",
                padding:        "clamp(1.25rem, 3vw, 1.75rem)",
                textDecoration: "none",
                cursor:         "pointer",
                // GPU-only hover handled via onMouse events below
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform  = "translateY(-3px)";
                el.style.boxShadow  = "var(--shadow-card-hover)";
                el.style.borderColor = "var(--color-border-subtle)";
                // Nudge arrow
                const arrow = el.querySelector<SVGElement>(".nav-arrow");
                if (arrow) arrow.style.transform = "translateX(3px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform  = "translateY(0)";
                el.style.boxShadow  = "var(--shadow-sm)";
                el.style.borderColor = "var(--color-border)";
                const arrow = el.querySelector<SVGElement>(".nav-arrow");
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              {/* Card header row */}
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Icon badge */}
                <div
                  style={{
                    display:        "inline-flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    width:          "2.25rem",
                    height:         "2.25rem",
                    borderRadius:   "var(--radius-md)",
                    background:     "var(--color-primary-soft)",
                    color:          "var(--color-primary)",
                    flexShrink:     0,
                  }}
                >
                  {card.icon}
                </div>

                {/* Arrow */}
                <span
                  style={{
                    color:      "var(--color-text-muted)",
                    transition: `color var(--duration-fast) var(--ease-in-out)`,
                  }}
                >
                  <ArrowRight />
                </span>
              </div>

              {/* Card body */}
              <div>
                <h2
                  style={{
                    fontSize:     "var(--text-lg)",
                    fontWeight:   "600",
                    color:        "var(--color-text-primary)",
                    lineHeight:   "var(--leading-tight)",
                    marginBottom: "0.375rem",
                  }}
                >
                  {card.title}
                </h2>
                <p
                  style={{
                    fontSize:   "var(--text-sm)",
                    color:      "var(--color-text-secondary)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
