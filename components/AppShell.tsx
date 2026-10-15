"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/utils";
import { BookOpen, Settings, LogOut, CalendarDays, Calendar, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "./DarkModeToggle";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { language, currentUser, getUser, logout, viewMode, setViewMode } = useStore();
  const router = useRouter();
  const t = useT(language);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = mounted ? getUser(currentUser) : undefined;
  const displayName = mounted ? (user?.fullName || currentUser || "") : "";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const views = [
    { id: "daily" as const,   label: t("dailyView"),   icon: <List size={15} /> },
    { id: "weekly" as const,  label: t("weeklyView"),  icon: <CalendarDays size={15} /> },
    { id: "monthly" as const, label: t("monthlyView"), icon: <Calendar size={15} /> },
    { id: "yearly" as const,  label: t("yearlyView"),  icon: <LayoutGrid size={15} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 h-14"
        style={{
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 8px var(--shadow)",
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "var(--accent)", boxShadow: "0 2px 8px var(--shadow)" }}
          >
            <BookOpen size={16} color="var(--btn-text)" />
          </div>
          <span
            className="text-base font-bold hidden sm:block tracking-tight"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {t("appName")}
          </span>
        </div>

        {/* Center: View toggle */}
        <nav
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
          aria-label="View mode"
        >
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: viewMode === v.id ? "var(--accent)" : "transparent",
                color: viewMode === v.id ? "var(--btn-text)" : "var(--text-muted)",
                fontFamily: "var(--font)",
                whiteSpace: "nowrap",
                boxShadow: viewMode === v.id ? "0 1px 4px var(--shadow)" : "none",
              }}
              title={v.label}
              aria-pressed={viewMode === v.id}
            >
              {v.icon}
              <span className="hidden md:inline">{v.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: User + Actions */}
        <div className="flex items-center gap-1.5">
          {mounted && displayName && (
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--accent)", color: "var(--btn-text)" }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text)" }} suppressHydrationWarning>
                {displayName}
                {user?.provider === "google" && (
                  <span title="Google" className="inline-flex items-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </span>
                )}
                {user?.provider === "facebook" && (
                  <span title="Facebook" className="inline-flex items-center">
                    <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </span>
                )}
              </span>
            </div>
          )}
          <DarkModeToggle />
          <Link href="/settings">
            <button
              title={t("settings")}
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
              aria-label={t("settings")}
            >
              <Settings size={18} />
            </button>
          </Link>
          <button
            onClick={handleLogout}
            title={t("logout")}
            className="p-2 rounded-lg transition-all hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
            aria-label={t("logout")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
