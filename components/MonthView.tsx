"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT, toDateString } from "@/lib/utils";
import { moodColors } from "@/lib/themes";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { NoteModal } from "./NoteModal";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function MonthView() {
  const { language, notes, selectedDate, setSelectedDate, setSelectedWeek, setViewMode } = useStore();
  const t = useT(language);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [addingNoteDate, setAddingNoteDate] = useState<string | null>(null);

  const monthNames = {
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
    fr: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid for this month
  // First day of month
  const firstDay = new Date(year, month, 1);
  // Day of week for first day (Monday=0 ... Sunday=6)
  const startDow = (firstDay.getDay() + 6) % 7; // convert Sun=0 to Mon=0 scheme
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build rows (6 rows max)
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const todayStr = toDateString(today);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={language === "ar" ? nextMonth : prevMonth}
          className="p-2 rounded-lg"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {monthNames[language][month]}
          </h2>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>{year}</div>
        </div>

        <button
          onClick={language === "ar" ? prevMonth : nextMonth}
          className="p-2 rounded-lg"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar grid */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)", boxShadow: "0 2px 12px var(--shadow)" }}
      >
        {/* Day-of-week header */}
        <div
          className="grid grid-cols-7"
          style={{ background: "var(--header-bg)", borderBottom: "1px solid var(--border)" }}
        >
          {DAY_KEYS.map((dk) => (
            <div
              key={dk}
              className="py-2 text-center text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font)" }}
            >
              {t(dk)}
            </div>
          ))}
        </div>

        {/* Weeks rows */}
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="grid grid-cols-7"
            style={{ borderBottom: ri < rows.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            {row.map((date, ci) => {
              if (!date) {
                return (
                  <div
                    key={ci}
                    style={{ background: "var(--sidebar-bg)", minHeight: "90px" }}
                  />
                );
              }

              const dateStr = toDateString(date);
              const dayNotes = notes.filter((n) => n.date === dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <div
                  key={ci}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setViewMode("daily");
                  }}
                  className="relative cursor-pointer transition-colors group hover:brightness-105"
                  style={{
                    minHeight: "90px",
                    background: isSelected
                      ? `${moodColors["none"]}11`
                      : "var(--card-bg)",
                    borderLeft: ci > 0 ? "1px solid var(--border)" : "none",
                    outline: isSelected ? `2px solid var(--accent)` : "none",
                    outlineOffset: "-2px",
                  }}
                >
                  {/* Day number */}
                  <div className="p-2 flex items-start justify-between">
                    <span
                      className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        background: isToday ? "var(--accent)" : "transparent",
                        color: isToday ? "var(--btn-text)" : "var(--text)",
                        fontFamily: "var(--font)",
                      }}
                    >
                      {date.getDate()}
                    </span>

                    {/* Add note button appears on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddingNoteDate(dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                      style={{ color: "var(--accent)" }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Note mood dots (compact) */}
                  {dayNotes.length > 0 && (
                    <div className="px-2 pb-2 flex flex-wrap gap-1">
                      {dayNotes.slice(0, 5).map((note) => (
                        <div
                          key={note.id}
                          className="rounded"
                          style={{
                            width: "18px",
                            height: "18px",
                            background: moodColors[note.mood] ?? moodColors.none,
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={note.title || note.content.slice(0, 20)}
                        >
                          {note.type === "voice" ? "🎙️" : note.type === "image" ? "🖼️" : ""}
                        </div>
                      ))}
                      {dayNotes.length > 5 && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          +{dayNotes.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Add note modal */}
      {addingNoteDate && (
        <NoteModal date={addingNoteDate} onClose={() => setAddingNoteDate(null)} />
      )}
    </div>
  );
}
