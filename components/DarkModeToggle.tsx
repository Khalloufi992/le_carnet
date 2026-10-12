"use client";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode, language } = useStore();
  const t = useT(language);

  return (
    <button
      onClick={toggleDarkMode}
      title={darkMode ? t("lightMode") : t("darkMode")}
      className="relative p-2 rounded-full transition-all duration-300"
      style={{
        background: darkMode
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.06)",
        color: darkMode ? "#fbbf24" : "var(--text-muted)",
        border: "1px solid",
        borderColor: darkMode
          ? "rgba(255,255,255,0.15)"
          : "var(--border)",
      }}
    >
      <div
        className="transition-transform duration-300"
        style={{
          transform: darkMode ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </div>
    </button>
  );
}
