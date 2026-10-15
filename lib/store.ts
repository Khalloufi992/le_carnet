import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "gothic" | "children" | "nature" | "ocean" | "vintage";
export type Mood =
  | "sad"
  | "happy"
  | "in-love"
  | "proud"
  | "anxious"
  | "calm"
  | "excited"
  | "angry"
  | "none";
export type NoteType = "text" | "voice" | "image";
export type Language = "en" | "ar" | "fr";
export type ViewMode = "weekly" | "daily" | "monthly" | "yearly";

export interface Note {
  id: string;
  userId: string; // username of note owner
  type: NoteType;
  content: string; // text content or base64 for image/audio
  mood: Mood;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: number;
  title?: string;
  audioDuration?: number;
  time?: string; // HH:MM chosen by user (past or future)
}

export interface User {
  username: string;
  passwordHash?: string;
  fullName?: string;
  email?: string;
  birthDate?: string; // ISO string YYYY-MM-DD
  provider?: "local" | "google" | "facebook";
  avatar?: string;
  createdAt?: number;
}

export interface RegisterParams {
  username: string;
  password?: string;
  fullName?: string;
  email?: string;
  birthDate?: string;
  provider?: "local" | "google" | "facebook";
  avatar?: string;
}

export interface SocialAuthParams {
  provider: "google" | "facebook";
  email: string;
  fullName: string;
  username: string;
  birthDate?: string;
  avatar?: string;
}

interface AppState {
  // Auth
  users: User[];
  currentUser: string | null;
  isAuthenticated: boolean;

  // Preferences
  theme: Theme;
  language: Language;
  viewMode: ViewMode;
  darkMode: boolean;

  // Notes
  notes: Note[];

  // Navigation
  selectedDate: string;
  selectedWeek: number;
  selectedYear: number;

  // Actions
  register: (userOrUsername: RegisterParams | string, legacyPassword?: string) => boolean;
  login: (identifier: string, password: string) => boolean;
  socialAuth: (account: SocialAuthParams) => { success: boolean; isNewUser: boolean };
  getUser: (username?: string | null) => User | undefined;
  updateUser: (username: string, updates: Partial<User>) => void;
  logout: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleDarkMode: () => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "userId">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getUserNotes: () => Note[];
  setSelectedDate: (date: string) => void;
  setSelectedWeek: (week: number, year: number) => void;
}

function hashPassword(password: string): string {
  // Simple hash for localStorage demo
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

const today = new Date();
const todayStr = today.toISOString().split("T")[0];

// Get ISO week number
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,
      theme: "nature",
      language: "en",
      viewMode: "weekly",
      darkMode: false,
      notes: [],
      selectedDate: todayStr,
      selectedWeek: getISOWeek(today),
      selectedYear: today.getFullYear(),

      register: (userOrUsername, legacyPassword) => {
        const { users } = get();
        let newUser: User;

        if (typeof userOrUsername === "string") {
          const username = userOrUsername.trim();
          if (!username || users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
            return false;
          }
          newUser = {
            username,
            passwordHash: hashPassword(legacyPassword || ""),
            provider: "local",
            createdAt: Date.now(),
          };
        } else {
          const username = userOrUsername.username.trim();
          if (!username || users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
            return false;
          }
          newUser = {
            username,
            fullName: userOrUsername.fullName?.trim() || username,
            email: userOrUsername.email?.trim() || "",
            birthDate: userOrUsername.birthDate || "",
            passwordHash: userOrUsername.password ? hashPassword(userOrUsername.password) : undefined,
            provider: userOrUsername.provider || "local",
            avatar: userOrUsername.avatar || "",
            createdAt: Date.now(),
          };
        }

        set({
          users: [...users, newUser],
        });
        return true;
      },

      login: (identifier, password) => {
        const { users } = get();
        const clean = identifier.trim().toLowerCase();
        const user = users.find(
          (u) =>
            (u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean)) &&
            u.passwordHash === hashPassword(password)
        );
        if (!user) return false;
        set({ currentUser: user.username, isAuthenticated: true });
        return true;
      },

      socialAuth: (account) => {
        const { users } = get();
        const cleanEmail = account.email.trim().toLowerCase();
        const cleanUsername = account.username.trim();

        // Check if user exists by email or username
        const existingIndex = users.findIndex(
          (u) =>
            (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
            u.username.toLowerCase() === cleanUsername.toLowerCase()
        );

        if (existingIndex >= 0) {
          const existing = users[existingIndex];
          const updatedUsers = [...users];
          updatedUsers[existingIndex] = {
            ...existing,
            fullName: existing.fullName || account.fullName,
            birthDate: account.birthDate || existing.birthDate,
            avatar: account.avatar || existing.avatar,
            provider: existing.provider || account.provider,
          };
          set({
            users: updatedUsers,
            currentUser: existing.username,
            isAuthenticated: true,
          });
          return { success: true, isNewUser: false };
        } else {
          const newUser: User = {
            username: cleanUsername,
            fullName: account.fullName,
            email: account.email,
            birthDate: account.birthDate || "",
            provider: account.provider,
            avatar: account.avatar || "",
            createdAt: Date.now(),
          };
          set({
            users: [...users, newUser],
            currentUser: cleanUsername,
            isAuthenticated: true,
          });
          return { success: true, isNewUser: true };
        }
      },

      getUser: (username) => {
        const target = username || get().currentUser;
        if (!target) return undefined;
        return get().users.find((u) => u.username.toLowerCase() === target.toLowerCase());
      },

      updateUser: (username, updates) => {
        const { users, currentUser } = get();
        const updated = users.map((u) => {
          if (u.username.toLowerCase() === username.toLowerCase()) {
            return { ...u, ...updates };
          }
          return u;
        });
        set({
          users: updated,
          currentUser:
            updates.username && currentUser?.toLowerCase() === username.toLowerCase()
              ? updates.username
              : currentUser,
        });
      },

      logout: () =>
        set({ currentUser: null, isAuthenticated: false, theme: "nature" }),

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: crypto.randomUUID(),
              userId: state.currentUser || "",
              createdAt: Date.now(),
            },
          ],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id && n.userId === state.currentUser ? { ...n, ...updates } : n
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) =>
            !(n.id === id && n.userId === state.currentUser)
          ),
        })),

      getUserNotes: () => {
        const { notes, currentUser } = get();
        if (!currentUser) return [];
        return notes.filter((n) => n.userId === currentUser);
      },

      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedWeek: (week, year) =>
        set({ selectedWeek: week, selectedYear: year }),
    }),
    {
      name: "le-carnet-storage",
    }
  )
);
