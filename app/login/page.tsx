"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Language } from "@/lib/store";
import { useT } from "@/lib/utils";
import { BookOpen, User, Lock, Eye, EyeOff, Mail, Calendar, UserCheck } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function LoginPage() {
  const { login, register, isAuthenticated, language, setLanguage, darkMode } = useStore();
  const router = useRouter();
  const t = useT(language);

  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Extra registration form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/select-theme");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "login") {
      if (!identifier.trim()) {
        setError(t("usernameRequired"));
        return;
      }
      if (!password.trim()) {
        setError(t("passwordRequired"));
        return;
      }

      const ok = login(identifier.trim(), password);
      if (!ok) {
        setError(t("loginError"));
      } else {
        router.push("/select-theme");
      }
    } else {
      // Registration validations
      if (!fullName.trim()) {
        setError(t("fullNameRequired"));
        return;
      }
      if (!username.trim()) {
        setError(t("usernameRequired"));
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
      const todayStr = new Date().toISOString().split("T")[0];
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
      if (!password.trim()) {
        setError(t("passwordRequired"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("passwordMismatch"));
        return;
      }

      const ok = register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        birthDate,
        password,
        provider: "local",
      });

      if (!ok) {
        setError(t("registerError"));
      } else {
        setSuccess(t("registerSuccess"));
        setMode("login");
        setIdentifier(username.trim());
        setPassword("");
        setConfirmPassword("");
      }
    }
  };


  const languages: { id: Language; label: string; flag: string }[] = [
    { id: "fr", label: "Français", flag: "🇫🇷" },
    { id: "en", label: "English", flag: "🇬🇧" },
    { id: "ar", label: "عربي", flag: "🇹🇳" },
  ];

  return (
    <div
      data-theme="nature"
      data-dark={darkMode ? "true" : "false"}
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${
        darkMode
          ? "from-neutral-950 via-stone-900 to-zinc-900"
          : "from-green-50 via-emerald-50 to-green-100"
      } p-4 py-8 relative overflow-hidden`}
    >
      {/* Decorative background blobs */}
      <div
        className="login-bg-blob"
        style={{
          width: "300px",
          height: "300px",
          background: "var(--accent)",
          top: "-50px",
          left: "-80px",
          animationDelay: "0s",
        }}
      />
      <div
        className="login-bg-blob"
        style={{
          width: "200px",
          height: "200px",
          background: "var(--accent-light)",
          bottom: "10%",
          right: "-40px",
          animationDelay: "4s",
        }}
      />
      <div
        className="login-bg-blob"
        style={{
          width: "150px",
          height: "150px",
          background: "var(--accent)",
          bottom: "25%",
          left: "20%",
          animationDelay: "8s",
        }}
      />

      {/* Top Controls: Dark Mode & Language */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <DarkModeToggle />
        <div className="flex items-center gap-1.5 p-1 rounded-full shadow-md"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1"
              style={{
                background: language === l.id ? "var(--accent)" : "transparent",
                color: language === l.id ? "var(--btn-text)" : "var(--text-muted)",
              }}
            >
              <span>{l.flag}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md my-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{
              background: "var(--accent)",
              boxShadow: "0 8px 24px var(--shadow), 0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <BookOpen size={28} color="var(--btn-text)" />
          </div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {t("appName")}
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("appSubtitle")}
          </p>

          {/* Decorative leaves */}
          <div className="flex justify-center gap-2 mt-2">
            {["🍃", "🌿", "🍃"].map((leaf, i) => (
              <span
                key={i}
                className="text-base"
                style={{
                  display: "inline-block",
                  animation: "leafSway 3s ease-in-out infinite",
                  animationDelay: `${i * 0.7}s`,
                }}
              >
                {leaf}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div
          className="carnet-card p-6 md:p-8 fade-in shadow-xl relative z-10"
          style={{
            borderRadius: "20px",
            boxShadow: "0 24px 80px var(--shadow), 0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header tabs (Login / Register) */}
          <div
            className="flex rounded-xl p-1 mb-6 border"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                background: mode === "login" ? "var(--card-bg)" : "transparent",
                color: mode === "login" ? "var(--text)" : "var(--text-muted)",
                boxShadow: mode === "login" ? "0 2px 6px var(--shadow)" : "none",
              }}
            >
              {t("login")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                background: mode === "register" ? "var(--card-bg)" : "transparent",
                color: mode === "register" ? "var(--text)" : "var(--text-muted)",
                boxShadow: mode === "register" ? "0 2px 6px var(--shadow)" : "none",
              }}
            >
              {t("register")}
            </button>
          </div>



          {/* Error & Success alerts */}
          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-xs md:text-sm text-center font-medium"
              style={{
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-4 p-3 rounded-xl text-xs md:text-sm text-center font-medium"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#16a34a",
              }}
            >
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "login" ? (
              <>
                {/* Identifier (Username or Email) */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {language === "fr"
                      ? "Nom d'utilisateur ou Adresse e-mail"
                      : language === "ar"
                      ? "اسم المستخدم أو البريد الإلكتروني"
                      : "Username or Email"}
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "14px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "14px",
                      }}
                      placeholder={t("username")}
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("password")}
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "38px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "38px",
                      }}
                      placeholder={t("password")}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "left" : "right"]: "12px",
                        color: "var(--text-muted)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* REGISTRATION FORM WITH DATE DE NAISSANCE & ADDITIONAL FIELDS */}

                {/* Nom complet */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("fullName")} *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <UserCheck size={16} />
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "14px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "14px",
                      }}
                      placeholder={language === "fr" ? "Ex: Pierre Martin" : "Full Name"}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* Nom d'utilisateur */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("username")} *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "14px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "14px",
                      }}
                      placeholder={language === "fr" ? "Ex: pierre_m" : "username"}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("email")} *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "14px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "14px",
                      }}
                      placeholder="exemple@email.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Date de naissance */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("birthDate")} *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Calendar size={16} />
                    </span>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "14px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "14px",
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("password")} *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "38px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "38px",
                      }}
                      placeholder={t("password")}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "left" : "right"]: "12px",
                        color: "var(--text-muted)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmer le mot de passe */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("confirmPassword")} *
                  </label>
                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "right" : "left"]: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="carnet-input text-sm"
                      style={{
                        paddingLeft: language === "ar" ? "38px" : "38px",
                        paddingRight: language === "ar" ? "38px" : "38px",
                      }}
                      placeholder={t("confirmPassword")}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        [language === "ar" ? "left" : "right"]: "12px",
                        color: "var(--text-muted)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="theme-btn w-full mt-4"
              style={{ fontSize: "1rem", padding: "12px", borderRadius: "10px" }}
            >
              {mode === "login" ? t("loginBtn") : t("registerBtn")}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-5 text-center text-xs md:text-sm" style={{ color: "var(--text-muted)" }}>
            {mode === "login" ? (
              <>
                {t("noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccess("");
                  }}
                  className="font-semibold hover:underline"
                  style={{
                    color: "var(--accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("register")}
                </button>
              </>
            ) : (
              <>
                {t("haveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="font-semibold hover:underline"
                  style={{
                    color: "var(--accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("login")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative branding below card */}
        <div
          className="mt-6 text-center text-xs opacity-60 flex items-center justify-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="w-8 h-[1px] bg-current opacity-30 inline-block" />
          <span>{t("appName")}</span>
          <span className="w-8 h-[1px] bg-current opacity-30 inline-block" />
        </div>
      </div>

    </div>
  );
}
