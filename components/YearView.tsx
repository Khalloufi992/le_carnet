"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT, toDateString, getISOWeek } from "@/lib/utils";
import { moodColors, moodEmojis } from "@/lib/themes";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";
import { NoteModal } from "./NoteModal";

const DAY_LETTERS_EN = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_LETTERS_AR = ["ن", "ث", "ر", "خ", "ج", "س", "ح"];
const DAY_LETTERS_FR = ["L", "M", "M", "J", "V", "S", "D"];

export function YearView() {
  const { language, notes, selectedDate, setSelectedDate, setViewMode } = useStore();
  const t = useT(language);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [addingNoteDate, setAddingNoteDate] = useState<string | null>(null);

  const monthNames = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    ar: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ],
    fr: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ],
  };

  const dayLetters = language === "ar" ? DAY_LETTERS_AR : language === "fr" ? DAY_LETTERS_FR : DAY_LETTERS_EN;

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);
  const goCurrentYear = () => setYear(today.getFullYear());

  const todayStr = toDateString(today);

  // Filter notes that belong to this year
  const yearNotes = notes.filter((n) => n.date.startsWith(`${year}-`));

  // Count moods across the year
  const moodCounts: Record<string, number> = {};
  yearNotes.forEach((n) => {
    moodCounts[n.mood] = (moodCounts[n.mood] || 0) + 1;
  });

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setViewMode("daily");
  };

  return (
    <div className="space-y-6">
      {/* Year Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={language === "ar" ? nextYear : prevYear}
            className="p-2.5 rounded-xl transition-all hover:scale-105"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            title="Previous Year"
          >
            <ChevronLeft size={20} />
          </button>

          <h2
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {year}
          </h2>

          <button
            onClick={language === "ar" ? prevYear : nextYear}
            className="p-2.5 rounded-xl transition-all hover:scale-105"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            title="Next Year"
          >
            <ChevronRight size={20} />
          </button>

          {year !== today.getFullYear() && (
            <button
              onClick={goCurrentYear}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{
                background: "var(--accent)",
                color: "var(--btn-text)",
              }}
            >
              {t("today")} ({today.getFullYear()})
            </button>
          )}
        </div>

        {/* Year Statistics Bar */}
        <div
          className="flex flex-wrap items-center gap-2 px-4 py-2 rounded-xl text-xs"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px var(--shadow)",
          }}
        >
          <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--text)" }}>
            <CalendarIcon size={14} style={{ color: "var(--accent)" }} />
            <span>{yearNotes.length} {t("notes")}</span>
          </div>

          <span style={{ color: "var(--border)" }}>|</span>

          {/* Mood breakdown */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {Object.entries(moodCounts).map(([m, cnt]) => {
              if (cnt === 0) return null;
              return (
                <div
                  key={m}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px]"
                  style={{
                    background: `${moodColors[m]}22`,
                    border: `1px solid ${moodColors[m]}66`,
                    color: "var(--text)",
                  }}
                  title={`${t(m as any)}: ${cnt}`}
                >
                  <span>{moodEmojis[m]}</span>
                  <span className="font-bold">{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, monthIdx) => {
          const firstDay = new Date(year, monthIdx, 1);
          const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
          const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

          const days: (number | null)[] = [];
          for (let i = 0; i < startDow; i++) days.push(null);
          for (let d = 1; d <= daysInMonth; d++) days.push(d);

          const monthName = monthNames[language][monthIdx];
          const monthNotes = yearNotes.filter((n) => {
            const m = parseInt(n.date.split("-")[1], 10);
            return m === monthIdx + 1;
          });

          return (
            <div
              key={monthIdx}
              className="rounded-xl p-3.5 transition-all duration-200 notebook-page hover:shadow-lg"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
              }}
            >
              {/* Month Header */}
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span
                  className="font-bold text-sm"
                  style={{ color: "var(--text)", fontFamily: "var(--font)" }}
                >
                  {monthName}
                </span>

                <div className="flex items-center gap-1">
                  {monthNotes.length > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{
                        background: "var(--header-bg)",
                        color: "var(--accent)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {monthNotes.length}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDate(toDateString(new Date(year, monthIdx, 1)));
                      setViewMode("monthly");
                    }}
                    title="Open Month"
                    className="p-1 rounded hover:opacity-75 transition-opacity"
                    style={{ color: "var(--accent)" }}
                  >
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>

              {/* Day of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                {dayLetters.map((letter, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {letter}
                  </span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-6" />;
                  }

                  const mStr = String(monthIdx + 1).padStart(2, "0");
                  const dStr = String(day).padStart(2, "0");
                  const dateStr = `${year}-${mStr}-${dStr}`;
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  const dayNoteList = notes.filter((n) => n.date === dateStr);
                  const hasNotes = dayNoteList.length > 0;
                  const dominantMood = hasNotes ? dayNoteList[0].mood : "none";

                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(dateStr)}
                      className="h-6 rounded relative flex items-center justify-center text-[11px] font-medium transition-all group hover:scale-110"
                      style={{
                        background: isToday
                          ? "var(--accent)"
                          : isSelected
                          ? "var(--header-bg)"
                          : hasNotes
                          ? `${moodColors[dominantMood]}33`
                          : "transparent",
                        color: isToday
                          ? "var(--btn-text)"
                          : isSelected
                          ? "var(--accent)"
                          : "var(--text)",
                        border: isSelected
                          ? "1px solid var(--accent)"
                          : hasNotes
                          ? `1px solid ${moodColors[dominantMood]}88`
                          : "1px solid transparent",
                      }}
                      title={
                        hasNotes
                          ? `${dateStr} (${dayNoteList.length} ${t("notes")}) - ${t(dominantMood as any)}`
                          : dateStr
                      }
                    >
                      {day}

                      {/* Small square mood marker */}
                      {hasNotes && !isToday && (
                        <span
                          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-sm"
                          style={{
                            background: moodColors[dominantMood] || "var(--accent)",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {addingNoteDate && (
        <NoteModal date={addingNoteDate} onClose={() => setAddingNoteDate(null)} />
      )}
    </div>
  );
}
