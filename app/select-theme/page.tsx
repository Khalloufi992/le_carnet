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

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

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
              className="relative rounded-xl overflow-hidden transition-all duration-300 text-left"
              style={{
                border: selected === opt.id
                  ? "3px solid var(--accent)"
                  : "2px solid transparent",
                boxShadow: selected === opt.id
                  ? "0 0 0 2px var(--accent-light)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
                transform: selected === opt.id ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Preview gradient */}
              <div className={`h-24 bg-gradient-to-br ${opt.gradient} flex items-center justify-center`}>
                <span className="text-4xl">{opt.emoji}</span>
              </div>

              {/* Label */}
              <div
                className="p-3"
                style={{ background: "var(--card-bg)" }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--text)", fontFamily: "var(--font)" }}
                >
                  {themeNames[opt.id].name}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {themeNames[opt.id].desc}
                </div>
              </div>

              {/* Check mark */}
              {selected === opt.id && (
                <div
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent)" }}
                >
                  <Check size={14} color="white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="theme-btn px-12 py-3 text-lg"
          >
            {t("continueBtn")} →
          </button>
        </div>
      </div>
    </div>
  );
}
