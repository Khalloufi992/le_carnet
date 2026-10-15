"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { MonthView } from "@/components/MonthView";
import { YearView } from "@/components/YearView";

export default function NotebookPage() {
  const { isAuthenticated, theme, language, viewMode, darkMode } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div
      data-theme={theme}
      data-dark={darkMode ? "true" : "false"}
      dir={language === "ar" ? "rtl" : "ltr"}
      style={{ minHeight: "100vh", background: "var(--page-bg)", fontFamily: "var(--font)" }}
    >
      <AppShell>
        {viewMode === "weekly" && <WeekView />}
        {viewMode === "daily" && <DayView />}
        {viewMode === "monthly" && <MonthView />}
        {viewMode === "yearly" && <YearView />}
      </AppShell>
    </div>
  );
}
