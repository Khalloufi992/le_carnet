"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Theme, Language, User as UserType } from "@/lib/store";
import { useT } from "@/lib/utils";
import { AppShell } from "@/components/AppShell";
import { Check, User, Calendar, Mail, Shield, Save, Sun, Moon } from "lucide-react";

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
  const t = useT(language);

  const user = getUser(currentUser);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

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
            <UserProfileCard
              key={user.username}
              user={user}
              onUpdate={(updates) => updateUser(user.username, updates)}
            />
          )}

          {/* Theme Section */}
          <section>
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
                  className="relative flex flex-col items-center p-3 rounded-xl transition-all"
                  style={{
                    background: "var(--card-bg)",
                    border: theme === opt.id ? "2px solid var(--accent)" : "2px solid var(--border)",
                    boxShadow: theme === opt.id ? "0 0 0 2px var(--accent-light)" : "none",
                    transform: theme === opt.id ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span className="text-3xl mb-1">{opt.emoji}</span>
                  <span className="text-xs" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>
                    {themeNames[opt.id]}
                  </span>
                  {theme === opt.id && (
                    <div
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "var(--accent)" }}
                    >
                      <Check size={10} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Light / Dark Mode Section */}
          <section>
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
          <section>
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
                  className="flex items-center gap-2 px-4 py-3 rounded-xl justify-center transition-all"
                  style={{
                    background: "var(--card-bg)",
                    border: language === lang.id ? "2px solid var(--accent)" : "2px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "var(--font)",
                    boxShadow: language === lang.id ? "0 0 0 2px var(--accent-light)" : "none",
                  }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                  {language === lang.id && <Check size={14} style={{ color: "var(--accent)" }} />}
                </button>
              ))}
            </div>
          </section>

          {/* View Mode Section */}
          <section>
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
          <div>
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
      className="carnet-card p-6 rounded-2xl shadow-sm"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <User size={16} />
          <span>{t("profileSection")}</span>
        </h2>

        {/* Provider Badge */}
        {user.provider === "google" ? (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </span>
        ) : user.provider === "facebook" ? (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30">
            <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300">
            <Shield size={12} />
            <span>{t("providerLocal")}</span>
          </span>
        )}
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
