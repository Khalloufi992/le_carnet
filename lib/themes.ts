import { Theme } from "./store";

export interface ThemeConfig {
  id: Theme;
  name: string;
  // CSS variable values
  pageBg: string;
  pagePattern: string;
  accentColor: string;
  accentLight: string;
  textColor: string;
  textMuted: string;
  borderColor: string;
  headerBg: string;
  sidebarBg: string;
  cardBg: string;
  buttonBg: string;
  buttonText: string;
  inputBg: string;
  fontFamily: string;
  leafColor1: string;
  leafColor2: string;
  shadowColor: string;
  navActive: string;
  // Tailwind class strings for unique elements
  loginGradient: string;
  noteLineColor: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  gothic: {
    id: "gothic",
    name: "Gothic",
    pageBg: "#0c0a0e",
    pagePattern: "gothic",
    accentColor: "#6b4e36",
    accentLight: "#9e7956",
    textColor: "#e8dcc4",
    textMuted: "#9e8e7a",
    borderColor: "#3b2d20",
    headerBg: "#120e16",
    sidebarBg: "#151119",
    cardBg: "#191420",
    buttonBg: "#4f3926",
    buttonText: "#f7eedb",
    inputBg: "#130f17",
    fontFamily: "'Georgia', 'Palatino Linotype', 'Times New Roman', serif",
    leafColor1: "#3b2d20",
    leafColor2: "#6b4e36",
    shadowColor: "rgba(0,0,0,0.9)",
    navActive: "#6b4e36",
    loginGradient: "from-black via-stone-950 to-neutral-900",
    noteLineColor: "rgba(90, 60, 32, 0.3)",
  },
  children: {
    id: "children",
    name: "Playful",
    pageBg: "#fff9f0",
    pagePattern: "children",
    accentColor: "#ff6b9d",
    accentLight: "#ffb3d1",
    textColor: "#4a3728",
    textMuted: "#8b6e5a",
    borderColor: "#ffd6e7",
    headerBg: "#fff0f8",
    sidebarBg: "#fff5fb",
    cardBg: "#ffffff",
    buttonBg: "#ff6b9d",
    buttonText: "#ffffff",
    inputBg: "#fff9f0",
    fontFamily: "'Comic Sans MS', 'Segoe UI', cursive",
    leafColor1: "#ffb3d1",
    leafColor2: "#ffd6e7",
    shadowColor: "rgba(255,107,157,0.2)",
    navActive: "#ff6b9d",
    loginGradient: "from-pink-100 via-purple-100 to-yellow-100",
    noteLineColor: "#ffd6e7",
  },
  nature: {
    id: "nature",
    name: "Nature",
    pageBg: "#f5f5e8",
    pagePattern: "nature",
    accentColor: "#4a7c59",
    accentLight: "#7bab8b",
    textColor: "#2c3e1f",
    textMuted: "#6b7c5e",
    borderColor: "#c8d9b8",
    headerBg: "#e8f0d8",
    sidebarBg: "#edf4e0",
    cardBg: "#fafff5",
    buttonBg: "#4a7c59",
    buttonText: "#ffffff",
    inputBg: "#f5f5e8",
    fontFamily: "'Palatino Linotype', 'Palatino', serif",
    leafColor1: "#7bab8b",
    leafColor2: "#4a7c59",
    shadowColor: "rgba(74,124,89,0.15)",
    navActive: "#4a7c59",
    loginGradient: "from-green-50 via-emerald-50 to-green-100",
    noteLineColor: "#c8d9b8",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    pageBg: "#f0f8ff",
    pagePattern: "ocean",
    accentColor: "#1a6fa0",
    accentLight: "#4db8e8",
    textColor: "#0d2a3d",
    textMuted: "#4a7a9b",
    borderColor: "#b8dff0",
    headerBg: "#e0f0ff",
    sidebarBg: "#e8f5ff",
    cardBg: "#f8fbff",
    buttonBg: "#1a6fa0",
    buttonText: "#ffffff",
    inputBg: "#f0f8ff",
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
    leafColor1: "#4db8e8",
    leafColor2: "#1a6fa0",
    shadowColor: "rgba(26,111,160,0.15)",
    navActive: "#1a6fa0",
    loginGradient: "from-blue-50 via-cyan-50 to-sky-100",
    noteLineColor: "#b8dff0",
  },
  vintage: {
    id: "vintage",
    name: "Vintage",
    pageBg: "#f2e8d0",
    pagePattern: "vintage",
    accentColor: "#8b6914",
    accentLight: "#c9a227",
    textColor: "#3d2b0a",
    textMuted: "#8b7355",
    borderColor: "#d4b896",
    headerBg: "#e8d9b8",
    sidebarBg: "#eedfc0",
    cardBg: "#f8f0e0",
    buttonBg: "#8b6914",
    buttonText: "#f5e6c8",
    inputBg: "#f2e8d0",
    fontFamily: "'Times New Roman', Times, serif",
    leafColor1: "#c9a227",
    leafColor2: "#8b6914",
    shadowColor: "rgba(139,105,20,0.2)",
    navActive: "#8b6914",
    loginGradient: "from-amber-50 via-yellow-50 to-orange-50",
    noteLineColor: "#d4b896",
  },
};

export const moodEmojis: Record<string, string> = {
  none: "○",
  sad: "😢",
  happy: "😊",
  "in-love": "🥰",
  proud: "😤",
  anxious: "😰",
  calm: "😌",
  excited: "🤩",
  angry: "😡",
};

export const moodColors: Record<string, string> = {
  none: "#9ca3af",
  sad: "#6b7fc4",
  happy: "#f59e0b",
  "in-love": "#ec4899",
  proud: "#8b5cf6",
  anxious: "#f97316",
  calm: "#10b981",
  excited: "#f43f5e",
  angry: "#ef4444",
};
