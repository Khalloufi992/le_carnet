"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Theme } from "@/lib/store";
import { useT } from "@/lib/utils";
import { Check } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const themeOptions: {
  id: Theme;
  emoji: string;
  gradient: string;
  preview: string;
}[] = [
  {
    id: "gothic",
    emoji: "🥀",
    gradient: "from-amber-950 via-stone-900 to-black",
    preview: "bg-stone-950",
  },
  {
    id: "children",
    emoji: "🌸",
    gradient: "from-pink-200 to-purple-200",
    preview: "bg-pink-200",
  },
  {
    id: "nature",
    emoji: "🍃",
    gradient: "from-green-200 to-emerald-300",
    preview: "bg-green-200",
  },
  {
    id: "ocean",
    emoji: "🌊",
    gradient: "from-blue-200 to-cyan-300",
    preview: "bg-blue-200",
  },
  {
    id: "vintage",
    emoji: "📜",
    gradient: "from-amber-200 to-yellow-300",
    preview: "bg-amber-200",
  },
];

export default function SelectThemePage() {
  const { theme, setTheme, isAuthenticated, language, darkMode } = useStore();
  const router = useRouter();
  const t = useT(language);
  const [selected, setSelected] = useState<Theme>(theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelected(theme);
  }, [theme]);

  useEffect(() => {
    if (mounted && !isAuthenticated) router.replace("/login");
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  const handleContinue = () => {
    setTheme(selected);
    router.push("/notebook");
  };

  const themeNames: Record<Theme, { name: string; desc: string }> = {
    gothic: { name: t("gothic"), desc: t("gothicDesc") },
    children: { name: t("children"), desc: t("childrenDesc") },
    nature: { name: t("nature"), desc: t("natureDesc") },
    ocean: { name: t("ocean"), desc: t("oceanDesc") },
    vintage: { name: t("vintage"), desc: t("vintageDesc") },
  };

  return (
    <div
      data-theme={selected}
      data-dark={darkMode ? "true" : "false"}
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{ background: "var(--page-bg)", transition: "all 0.4s ease" }}
    >
      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {t("chooseTheme")}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{t("themeSubtitle")}</p>
        </div>

        {/* Theme Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className="relative rounded-2xl overflow-hidden transition-all duration-300 text-left hover-lift cursor-pointer"
              style={{
                border: selected === opt.id
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border)",
                boxShadow: selected === opt.id
                  ? "0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent), 0 8px 24px var(--shadow)"
                  : "0 2px 8px var(--shadow)",
                transform: selected === opt.id ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Detailed preview area */}
              <div className={`h-28 bg-gradient-to-br ${opt.gradient} p-3 flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl filter drop-shadow">{opt.emoji}</span>
                  {selected === opt.id && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]"></span>
                    </span>
                  )}
                </div>

                {/* Notebook mockup lines inside preview */}
                <div className="rounded-lg p-2 bg-white/50 dark:bg-black/35 backdrop-blur-xs space-y-1 shadow-xs border border-white/20">
                  <div className="h-1.5 w-12 rounded bg-current opacity-40" />
                  <div className="h-1.5 w-full rounded bg-current opacity-25" />
                  <div className="h-1.5 w-3/4 rounded bg-current opacity-20" />
                </div>
              </div>

              {/* Label */}
              <div
                className="p-3.5"
                style={{ background: "var(--card-bg)" }}
              >
                <div
                  className="font-bold text-sm tracking-tight"
                  style={{ color: "var(--text)", fontFamily: "var(--font)" }}
                >
                  {themeNames[opt.id].name}
                </div>
                <div
                  className="text-xs mt-0.5 leading-snug line-clamp-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {themeNames[opt.id].desc}
                </div>
              </div>

              {/* Check mark */}
              {selected === opt.id && (
                <div
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-md animate-pulse"
                  style={{ background: "var(--accent)" }}
                >
                  <Check size={14} color="var(--btn-text)" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleContinue}
            className="theme-btn px-12 py-3.5 text-lg font-bold rounded-2xl shadow-xl flex items-center gap-2.5 transition-all hover:scale-105"
            style={{
              boxShadow: "0 8px 24px var(--shadow)",
            }}
          >
            <span>{t("continueBtn")}</span>
            <span className={language === "ar" ? "rotate-180" : ""}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
