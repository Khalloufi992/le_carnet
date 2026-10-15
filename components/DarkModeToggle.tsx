"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode, language } = useStore();
  const t = useT(language);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? darkMode : false;

  return (
    <button
      onClick={toggleDarkMode}
      title={isDark ? t("lightMode") : t("darkMode")}
      suppressHydrationWarning
      className="relative p-2 rounded-full transition-all duration-300"
      style={{
        background: isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.06)",
        color: isDark ? "#fbbf24" : "var(--text-muted)",
        border: "1px solid",
        borderColor: isDark
          ? "rgba(255,255,255,0.15)"
          : "var(--border)",
      }}
    >
      <div
        className="transition-transform duration-300"
        style={{
          transform: isDark ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </div>
    </button>
  );
}
