import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FetchRole from "~/hooks/fetchRole";
import Link from "next/link";
import SystemAdminPage from "~/components/roles/SystemAdminPage";
import DentalStaff from "~/components/roles/DentalStaff";

// ─── Role display config ──────────────────────────────────────────────────────
// Pure UI metadata — does NOT affect routing or role validation logic.
const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SuperAdmin:   { label: "Super Admin",    color: "#7C3AED" },
  SystemAdmin:  { label: "System Admin",   color: "#0D9488" },
  TenantAdmin:  { label: "Tenant Admin",   color: "#2563EB" },
  Doctor:       { label: "Doctor",         color: "#0891B2" },
  Receptionist: { label: "Receptionist",  color: "#16A34A" },
  Patient:      { label: "Patient",        color: "#D97706" },
};

const getRoleLabel = (role?: string) =>
  role ? (ROLE_LABELS[role]?.label ?? role) : "Unknown";

const getRoleColor = (role?: string) =>
  role ? (ROLE_LABELS[role]?.color ?? "#6B7280") : "#6B7280";

// ─── Loading skeleton ─────────────────────────────────────────────────────────
// Shown while FetchRole() is still resolving — prevents flash of wrong state.
const RoleSkeleton: React.FC = () => (
  <div
    className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950"
    style={{ animation: "fadeIn 0.3s ease" }}
  >
    <div className="flex flex-col items-center gap-6">
      {/* Pulsing logo mark */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)",
          boxShadow: "0 0 0 0 rgba(13,148,136,0.4)",
          animation: "pulse-glow 2s ease-in-out infinite",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12h6M12 9v6M7.8 3A9 9 0 1 0 20.2 15.5" />
          <circle cx="19" cy="5" r="2" fill="white" stroke="none" />
        </svg>
      </div>

      {/* Skeleton bars */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-3 w-48 rounded-full bg-slate-200 dark:bg-slate-800"
          style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
        />
        <div
          className="h-2 w-32 rounded-full bg-slate-200 dark:bg-slate-800"
          style={{ animation: "shimmer 1.6s ease-in-out infinite 0.2s" }}
        />
      </div>

      <p className="text-xs tracking-widest text-slate-400 dark:text-slate-600 uppercase">
        Verifying your session…
      </p>
    </div>

    {/* Inline keyframes — scoped, no globals.css dependency */}
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(13,148,136,0.35); }
        50%       { box-shadow: 0 0 0 14px rgba(13,148,136,0); }
      }
      @keyframes shimmer {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
    `}</style>
  </div>
);

// ─── Wrong page state ─────────────────────────────────────────────────────────
// Replaces the plain red text with a premium healthcare-grade warning card.
// Logic: unchanged — still renders when userRole !== role param.
interface WrongPageCardProps {
  currentRole: string;
  requestedRole: string;
}

const WrongPageCard: React.FC<WrongPageCardProps> = ({
  currentRole,
  requestedRole,
}) => {
  const currentColor  = getRoleColor(currentRole);
  const currentLabel  = getRoleLabel(currentRole);
  const requestedLabel = getRoleLabel(requestedRole);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
      style={{ animation: "fadeIn 0.4s ease" }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
        style={{ animation: "slideUp 0.45s ease both" }}
      >
        {/* Top accent strip */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #F87171 0%, #FCA5A5 100%)",
          }}
        />

        <div className="p-8">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1.5px solid rgba(239,68,68,0.18)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="mb-2 text-center text-xl font-semibold text-slate-900 dark:text-white"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
          >
            Access Restricted
          </h1>
          <p className="mb-6 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            This console is not configured for your account. You may have
            followed an incorrect link.
          </p>

          {/* Role info cards */}
          <div className="mb-6 space-y-2">
            {/* Requested */}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Requested
              </span>
              <span
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#EF4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {requestedLabel}
              </span>
            </div>
            {/* Your role */}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Your Role
              </span>
              <span
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: `${currentColor}18`,
                  color: currentColor,
                  border: `1px solid ${currentColor}30`,
                }}
              >
                {currentLabel}
              </span>
            </div>
          </div>

          {/* CTA — href unchanged: /gated */}
          <Link
            href="/gated"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)",
              boxShadow: "0 4px 14px rgba(13,148,136,0.25)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go to Role Selector
          </Link>

          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
            If you believe this is an error, contact your system administrator.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:translateY(0)    }
        }
      `}</style>
    </div>
  );
};

// ─── Authorized shell ─────────────────────────────────────────────────────────
// Replaces "You are on the right page!" with a clean, invisible wrapper.
// ALL existing component conditions are 100% preserved — untouched.
interface AuthorizedShellProps {
  role: string;
}

const AuthorizedShell: React.FC<AuthorizedShellProps> = ({ role }) => (
  <div
    className="w-full"
    style={{ animation: "fadeIn 0.35s ease" }}
  >
    {/* Admin consoles — condition UNCHANGED */}
    <div className="mx-auto">
      {(role === "SystemAdmin" ||
        role === "TenantAdmin" ||
        role === "SuperAdmin") && <SystemAdminPage />}
    </div>

    {/* Dental staff console — condition UNCHANGED */}
    <div className="mx-auto">
      {role !== "TenantAdmin" &&
        role !== "SystemAdmin" &&
        role !== "SuperAdmin" &&
        role !== "Patient" && <DentalStaff />}
    </div>

    <style>{`
      @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    `}</style>
  </div>
);

// ─── Page component ───────────────────────────────────────────────────────────
// Core routing + role validation logic: FULLY PRESERVED.
// Only the rendered UI shells have been replaced.
const RoleConsole: React.FC = () => {
  const router   = useRouter();
  const { role } = router.query;          // ← unchanged
  const userRole = FetchRole();           // ← unchanged

  // ── Loading gate ─────────────────────────────────────────────────────────
  // NEW: hold rendering until both the router and FetchRole() have resolved.
  // Prevents the brief flash of WrongPageCard when session hasn't loaded yet.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // router.isReady ensures [role] param is populated (Pages Router pattern).
    // userRole truthy means FetchRole() has returned a value.
    if (router.isReady && userRole) {
      setReady(true);
    }
  }, [router.isReady, userRole]);

  if (!ready) {
    return <RoleSkeleton />;
  }

  // ── Role mismatch — LOGIC UNCHANGED ──────────────────────────────────────
  if (userRole !== (role as string)) {
    return (
      <WrongPageCard
        currentRole={userRole}
        requestedRole={role as string}
      />
    );
  }

  // ── Authorized — LOGIC UNCHANGED ─────────────────────────────────────────
  return <AuthorizedShell role={role as string} />;
};

export default RoleConsole;
