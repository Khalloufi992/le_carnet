"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Theme, Language, User as UserType } from "@/lib/store";
import { useT } from "@/lib/utils";
import { AppShell } from "@/components/AppShell";
import { Check, User, Calendar, Mail, Save, Sun, Moon } from "lucide-react";

const themes: { id: Theme; emoji: string }[] = [
  { id: "gothic", emoji: "🥀" },
  { id: "children", emoji: "🌸" },
  { id: "nature", emoji: "🍃" },
  { id: "ocean", emoji: "🌊" },
  { id: "vintage", emoji: "📜" },
];

export default function SettingsPage() {
  const {
    isAuthenticated,
    currentUser,
    getUser,
    updateUser,
    theme,
    setTheme,
    language,
    setLanguage,
    viewMode,
    setViewMode,
    darkMode,
    toggleDarkMode,
  } = useStore();
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

  if (!mounted || !isAuthenticated) {
    return null;
  }

  const user = getUser(currentUser);
  const t = useT(language);

  const themeNames: Record<Theme, string> = {
    gothic: t("gothic"),
    children: t("children"),
    nature: t("nature"),
    ocean: t("ocean"),
    vintage: t("vintage"),
  };

  const languagesList: { id: Language; flag: string; label: string }[] = [
    { id: "fr", flag: "🇫🇷", label: t("french") },
    { id: "en", flag: "🇬🇧", label: t("english") },
    { id: "ar", flag: "🇹🇳", label: t("arabic") },
  ];

  return (
    <div
      data-theme={theme}
      data-dark={darkMode ? "true" : "false"}
      dir={language === "ar" ? "rtl" : "ltr"}
      style={{ minHeight: "100vh", background: "var(--page-bg)", fontFamily: "var(--font)" }}
    >
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {t("settingsTitle")}
          </h1>

          {/* User Profile Section */}
          {user && (
            <div className="slide-in-up stagger-1">
              <UserProfileCard
                key={user.username}
                user={user}
                onUpdate={(updates) => updateUser(user.username, updates)}
              />
            </div>
          )}

          {/* Theme Section */}
          <section className="slide-in-up stagger-2">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              {t("themeSection")}
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {themes.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className="relative flex flex-col items-center p-3 rounded-xl transition-all group"
                  style={{
                    background: "var(--card-bg)",
                    border: theme === opt.id ? "2px solid var(--accent)" : "2px solid var(--border)",
                    boxShadow: theme === opt.id ? "0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent), 0 4px 12px var(--shadow)" : "none",
                    transform: theme === opt.id ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span className="text-3xl mb-1 transition-transform group-hover:scale-110">{opt.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>
                    {themeNames[opt.id]}
                  </span>
                  {theme === opt.id && (
                    <div
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
                      style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }}
                    >
                      <Check size={10} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Light / Dark Mode Section */}
          <section className="slide-in-up stagger-3">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              {darkMode ? t("darkMode") : t("lightMode")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (darkMode) toggleDarkMode();
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl justify-center transition-all"
                style={{
                  background: "var(--card-bg)",
                  border: !darkMode ? "2px solid var(--accent)" : "2px solid var(--border)",
                  color: "var(--text)",
                  fontFamily: "var(--font)",
                  boxShadow: !darkMode ? "0 0 0 2px var(--accent-light)" : "none",
                }}
              >
                <Sun size={18} style={{ color: "#f59e0b" }} />
                <span className="text-sm font-medium">{t("lightMode")}</span>
                {!darkMode && <Check size={14} style={{ color: "var(--accent)" }} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!darkMode) toggleDarkMode();
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl justify-center transition-all"
                style={{
                  background: "var(--card-bg)",
                  border: darkMode ? "2px solid var(--accent)" : "2px solid var(--border)",
                  color: "var(--text)",
                  fontFamily: "var(--font)",
                  boxShadow: darkMode ? "0 0 0 2px var(--accent-light)" : "none",
                }}
              >
                <Moon size={18} style={{ color: "#a78bfa" }} />
                <span className="text-sm font-medium">{t("darkMode")}</span>
                {darkMode && <Check size={14} style={{ color: "var(--accent)" }} />}
              </button>
            </div>
          </section>

          {/* Language Section (Français, English, Arabic) */}
          <section className="slide-in-up stagger-4">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              {t("languageSection")}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {languagesList.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl justify-center transition-all hover-lift"
                  style={{
                    background: "var(--card-bg)",
                    border: language === lang.id ? "2px solid var(--accent)" : "2px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "var(--font)",
                    boxShadow: language === lang.id ? "0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent), 0 2px 8px var(--shadow)" : "0 1px 4px var(--shadow)",
                  }}
                >
                  <span className="text-2xl leading-none">{lang.flag}</span>
                  <span className="text-sm font-semibold">{lang.label}</span>
                  {language === lang.id && <Check size={15} style={{ color: "var(--accent)" }} />}
                </button>
              ))}
            </div>
          </section>

          {/* View Mode Section */}
          <section className="slide-in-up" style={{ animationDelay: "300ms" }}>
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              {t("viewSection")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { id: "daily", icon: "📄", label: t("dailyView") },
                { id: "weekly", icon: "📅", label: t("weeklyView") },
                { id: "monthly", icon: "🗓️", label: t("monthlyView") },
                { id: "yearly", icon: "📆", label: t("yearlyView") },
              ] as const).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl justify-center transition-all text-xs sm:text-sm"
                  style={{
                    background: "var(--card-bg)",
                    border: viewMode === mode.id ? "2px solid var(--accent)" : "2px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "var(--font)",
                    boxShadow: viewMode === mode.id ? "0 0 0 2px var(--accent-light)" : "none",
                  }}
                >
                  <span className="text-base">{mode.icon}</span>
                  <span className="truncate">{mode.label}</span>
                  {viewMode === mode.id && <Check size={14} style={{ color: "var(--accent)" }} />}
                </button>
              ))}
            </div>
          </section>

          {/* Back to notebook */}
          <div className="slide-in-up" style={{ animationDelay: "360ms" }}>
            <button
              onClick={() => router.push("/notebook")}
              className="theme-btn px-6 py-2.5 rounded-xl text-sm"
            >
              ← {t("notebook")}
            </button>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

interface UserProfileCardProps {
  user: UserType;
  onUpdate: (updates: Partial<UserType>) => void;
}

function UserProfileCard({ user, onUpdate }: UserProfileCardProps) {
  const { language } = useStore();
  const t = useT(language);

  const [editFullName, setEditFullName] = useState(user.fullName || user.username || "");
  const [editBirthDate, setEditBirthDate] = useState(user.birthDate || "");
  const [isSaved, setIsSaved] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user.birthDate) {
        setUserAge(null);
        return;
      }
      const birth = new Date(user.birthDate);
      if (!isNaN(birth.getTime())) {
        const diff = Date.now() - birth.getTime();
        const ageDate = new Date(diff);
        setUserAge(Math.abs(ageDate.getUTCFullYear() - 1970));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user.birthDate]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      fullName: editFullName.trim(),
      birthDate: editBirthDate,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <section
      className="carnet-card p-6 rounded-2xl"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 6px 24px var(--shadow), 0 2px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div className="mb-5">
        <h2
          className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <User size={16} />
          <span>{t("profileSection")}</span>
        </h2>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              {t("fullName")}
            </label>
            <input
              type="text"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              className="carnet-input text-sm"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              {t("username")}
            </label>
            <input
              type="text"
              value={user.username}
              disabled
              className="carnet-input text-sm opacity-60 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              {t("email")}
            </label>
            <div className="relative">
              <span
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  [language === "ar" ? "right" : "left"]: "10px",
                  color: "var(--text-muted)",
                }}
              >
                <Mail size={14} />
              </span>
              <input
                type="text"
                value={user.email || "—"}
                disabled
                className="carnet-input text-sm opacity-60 cursor-not-allowed"
                style={{
                  paddingLeft: language === "ar" ? "12px" : "32px",
                  paddingRight: language === "ar" ? "32px" : "12px",
                }}
              />
            </div>
          </div>

          {/* Date of birth */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                {t("birthDate")}
              </label>
              {userAge !== null && (
                <span className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>
                  {userAge} {t("yearsOld")}
                </span>
              )}
            </div>
            <div className="relative">
              <span
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  [language === "ar" ? "right" : "left"]: "10px",
                  color: "var(--text-muted)",
                }}
              >
                <Calendar size={14} />
              </span>
              <input
                type="date"
                value={editBirthDate}
                onChange={(e) => setEditBirthDate(e.target.value)}
                className="carnet-input text-sm"
                style={{
                  paddingLeft: language === "ar" ? "12px" : "32px",
                  paddingRight: language === "ar" ? "32px" : "12px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
              ✓ {t("profileUpdated")}
            </span>
          ) : <span />}

          <button
            type="submit"
            className="theme-btn px-4 py-2 text-sm flex items-center gap-2 rounded-xl"
          >
            <Save size={14} />
            <span>{t("saveChanges")}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
