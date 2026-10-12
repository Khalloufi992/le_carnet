"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/utils";
import { Shield, Calendar, User, Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface SocialAuthModalProps {
  isOpen: boolean;
  provider: "google" | "facebook" | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SocialAuthModal({
  isOpen,
  provider,
  onClose,
  onSuccess,
}: SocialAuthModalProps) {
  if (!isOpen || !provider) return null;

  return (
    <SocialAuthDialogContent
      key={provider}
      provider={provider}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

interface DialogContentProps {
  provider: "google" | "facebook";
  onClose: () => void;
  onSuccess: () => void;
}

function SocialAuthDialogContent({
  provider,
  onClose,
  onSuccess,
}: DialogContentProps) {
  const { socialAuth, language } = useStore();
  const t = useT(language);

  const googleAccounts = [
    {
      name: "Alexandre Martin",
      email: "alexandre.martin@gmail.com",
      username: "alex_martin",
      birthDate: "1997-04-12",
    },
    {
      name: "Sophie Bernard",
      email: "sophie.bernard@gmail.com",
      username: "sophie_b",
      birthDate: "2000-08-23",
    },
  ];

  const facebookAccounts = [
    {
      name: "Alexandre Martin",
      email: "alex.martin@fb-mail.com",
      username: "alexandre_fb",
      birthDate: "1997-04-12",
    },
    {
      name: "Sophie Bernard",
      email: "sophie.bernard@fb-mail.com",
      username: "sophie_fb",
      birthDate: "2000-08-23",
    },
  ];

  const accounts = provider === "google" ? googleAccounts : facebookAccounts;

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);
  const [fullName, setFullName] = useState(accounts[0]?.name || "");
  const [email, setEmail] = useState(accounts[0]?.email || "");
  const [username, setUsername] = useState(accounts[0]?.username || "");
  const [birthDate, setBirthDate] = useState(accounts[0]?.birthDate || "1998-06-15");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSelectPredefined = (idx: number) => {
    setSelectedIdx(idx);
    setIsCustom(false);
    const acc = accounts[idx];
    setFullName(acc.name);
    setEmail(acc.email);
    setUsername(acc.username);
    setBirthDate(acc.birthDate);
    setError("");
  };

  const handleToggleCustom = () => {
    setIsCustom(true);
    setSelectedIdx(-1);
    setFullName("");
    setEmail("");
    setUsername("");
    setBirthDate("");
  };

  const handleAuthorize = async () => {
    setError("");
    const todayStr = new Date().toISOString().split("T")[0];

    if (!fullName.trim()) {
      setError(t("fullNameRequired"));
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(t("emailRequired"));
      return;
    }
    if (!birthDate) {
      setError(t("birthDateRequired"));
      return;
    }
    if (birthDate > todayStr) {
      setError(
        language === "fr"
          ? "La date de naissance ne peut pas être dans le futur"
          : language === "ar"
          ? "تاريخ الميلاد لا يمكن أن يكون في المستقبل"
          : "Date of birth cannot be in the future"
      );
      return;
    }

    const finalUsername =
      username.trim() ||
      email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") ||
      "user_" + Math.floor(Math.random() * 1000);

    setIsAuthorizing(true);

    setTimeout(() => {
      socialAuth({
        provider,
        fullName: fullName.trim(),
        email: email.trim(),
        username: finalUsername,
        birthDate,
      });

      setIsAuthorizing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 850);
  };

  const isGoogle = provider === "google";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl transition-all"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          fontFamily: "var(--font)",
        }}
      >
        {/* Header bar styled according to provider */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isGoogle
              ? "bg-gradient-to-r from-red-50/50 via-yellow-50/50 to-blue-50/50 border-gray-200"
              : "bg-blue-600 text-white border-blue-700"
          }`}
          style={{
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            {isGoogle ? (
              <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center p-1.5 border border-gray-100">
                <svg className="w-full h-full" viewBox="0 0 24 24">
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
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
                <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
            )}
            <div>
              <h3 className={`text-base font-bold ${isGoogle ? "text-gray-800" : "text-white"}`}>
                {isGoogle
                  ? language === "fr"
                    ? "Connexion avec Google"
                    : language === "ar"
                    ? "تسجيل الدخول عبر Google"
                    : "Sign in with Google"
                  : language === "fr"
                  ? "Connexion avec Facebook"
                  : language === "ar"
                  ? "تسجيل الدخول عبر Facebook"
                  : "Sign in with Facebook"}
              </h3>
              <p
                className={`text-xs ${
                  isGoogle ? "text-gray-500" : "text-blue-100"
                }`}
              >
                OAuth 2.0 Authorization Dialog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isAuthorizing || isSuccess}
            className={`p-1.5 rounded-full transition-colors ${
              isGoogle
                ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                : "text-blue-200 hover:text-white hover:bg-blue-700"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* App title and consent banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl border"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg"
              style={{ background: "var(--accent)", color: "var(--btn-text)" }}
            >
              📖
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">Le Carnet</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                >
                  {language === "fr" ? "Vérifié" : language === "ar" ? "موثق" : "Verified"}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t("socialAuthSubtitle")}
              </p>
            </div>
          </div>

          {/* Account Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              {t("quickAccounts")}
            </label>
            <div className="space-y-2">
              {accounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPredefined(idx)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all"
                  style={{
                    background:
                      !isCustom && selectedIdx === idx
                        ? "var(--input-bg)"
                        : "var(--card-bg)",
                    borderColor:
                      !isCustom && selectedIdx === idx
                        ? "var(--accent)"
                        : "var(--border)",
                    boxShadow:
                      !isCustom && selectedIdx === idx
                        ? "0 0 0 2px var(--accent-light)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                      style={{
                        backgroundColor:
                          idx === 0
                            ? isGoogle
                              ? "#4285F4"
                              : "#1877F2"
                            : "#8b5cf6",
                      }}
                    >
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{acc.name}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {acc.email}
                      </div>
                    </div>
                  </div>
                  {!isCustom && selectedIdx === idx && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              ))}

              {/* Custom Account option */}
              <button
                type="button"
                onClick={handleToggleCustom}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed text-xs transition-all"
                style={{
                  background: isCustom ? "var(--input-bg)" : "transparent",
                  borderColor: isCustom ? "var(--accent)" : "var(--border)",
                  color: isCustom ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <span>➕ {t("customAccount")}</span>
                {isCustom && <span className="font-bold">✓</span>}
              </button>
            </div>
          </div>

          {/* If custom account selected, show input fields */}
          {isCustom && (
            <div className="space-y-3 p-3.5 rounded-xl border bg-black/5 dark:bg-white/5" style={{ borderColor: "var(--border)" }}>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                  {t("fullName")} *
                </label>
                <div className="relative">
                  <span
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      [language === "ar" ? "right" : "left"]: "10px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="carnet-input text-sm"
                    style={{
                      paddingLeft: language === "ar" ? "12px" : "32px",
                      paddingRight: language === "ar" ? "32px" : "12px",
                    }}
                    placeholder={language === "fr" ? "Ex: Pierre Martin" : "Full Name"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                  {t("email")} *
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="carnet-input text-sm"
                    style={{
                      paddingLeft: language === "ar" ? "12px" : "32px",
                      paddingRight: language === "ar" ? "32px" : "12px",
                    }}
                    placeholder={isGoogle ? "mon.nom@gmail.com" : "mon.nom@facebook.com"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DATE DE NAISSANCE: Highlighted required field */}
          <div
            className="p-3.5 rounded-xl border relative"
            style={{
              background: "rgba(var(--accent-rgb, 74, 124, 89), 0.05)",
              borderColor: "var(--accent)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: "var(--accent)" }}
              >
                <Calendar size={14} />
                <span>{t("birthDate")} *</span>
              </label>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "var(--card-bg)", color: "var(--accent)", border: "1px solid var(--border)" }}
              >
                {language === "fr"
                  ? "Champ requis pour l'inscription"
                  : language === "ar"
                  ? "حقل مطلوب للتسجيل"
                  : "Required field for registration"}
              </span>
            </div>

            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="carnet-input text-sm font-medium"
              required
            />
            <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              {language === "fr"
                ? "Votre date de naissance permet de personnaliser votre calendrier et de célébrer vos étapes de vie dans Le Carnet."
                : language === "ar"
                ? "يسمح تاريخ ميلادك بتخصيص التقويم والاحتفال بمحطات حياتك في الدفتر."
                : "Your date of birth helps personalize your notebook and celebrate your milestones."}
            </p>
          </div>

          {/* Permissions / Scopes Accordion */}
          <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              <Shield size={14} style={{ color: "var(--accent)" }} />
              <span>{t("socialAuthPermissions")}</span>
            </div>
            <ul className="text-xs space-y-1.5 pl-5" style={{ color: "var(--text-muted)" }}>
              <li className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>{t("socialPermProfile")}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>{t("socialPermEmail")}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>{t("socialPermBirthDate")}</span>
              </li>
            </ul>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success display */}
          {isSuccess && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900 font-semibold">
              <CheckCircle2 size={16} className="shrink-0 text-green-500" />
              <span>
                {language === "fr"
                  ? "Autorisation accordée ! Connexion en cours..."
                  : language === "ar"
                  ? "تم منح التفويض بنجاح! جاري الدخول..."
                  : "Authorization granted! Connecting..."}
              </span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div
          className="p-4 border-t flex items-center justify-end gap-3"
          style={{
            borderColor: "var(--border)",
            background: "var(--header-bg)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isAuthorizing || isSuccess}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleAuthorize}
            disabled={isAuthorizing || isSuccess}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
              isGoogle
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-[#1877F2] hover:bg-blue-700 text-white"
            }`}
          >
            {isAuthorizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("authorizing")}</span>
              </>
            ) : (
              <>
                <Shield size={14} />
                <span>{t("authorizeBtn")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
