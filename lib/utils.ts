import { Language } from "./store";
import { translations, TranslationKey } from "./translations";

export function useT(language: Language) {
  return function t(key: TranslationKey): string {
    return translations[language][key] ?? translations.en[key] ?? key;
  };
}

export function getWeekDates(weekNumber: number, year: number): Date[] {
  // Get Monday of that ISO week
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - jan4Day + 1 + (weekNumber - 1) * 7);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeeksInYear(year: number): number {
  const dec28 = new Date(year, 11, 28);
  return getISOWeek(dec28);
}

export function formatDate(date: Date, language: Language): string {
  const months = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    ar: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ],
    fr: [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ],
  };
  const day = date.getDate();
  const month = months[language][date.getMonth()];
  const year = date.getFullYear();
  if (language === "ar") return `${day} ${month} ${year}`;
  if (language === "fr") return `${day} ${month} ${year}`;
  return `${month} ${day}, ${year}`;
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getGreeting(language: Language): string {
  const hour = new Date().getHours();
  if (hour < 12) return translations[language].goodMorning;
  if (hour < 17) return translations[language].goodAfternoon;
  return translations[language].goodEvening;
}
