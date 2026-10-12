"use client";
import { useState } from "react";
import { useStore, Mood } from "@/lib/store";
import { useT, formatDate, toDateString, getISOWeek } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { NoteModal } from "./NoteModal";
import { MoodStrip } from "./MoodStrip";

export function DayView() {
  const { language, selectedDate, setSelectedDate, notes } = useStore();
  const t = useT(language);
  const [addingNote, setAddingNote] = useState(false);
  const [initialMoodForNew, setInitialMoodForNew] = useState<Mood>("none");

  const dateObj = new Date(selectedDate + "T12:00:00");
  const dayNotes = notes.filter((n) => n.date === selectedDate);

  const prevDay = () => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    setSelectedDate(toDateString(d));
  };

  const nextDay = () => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    setSelectedDate(toDateString(d));
  };

  const goToday = () => setSelectedDate(toDateString(new Date()));

  const isToday = selectedDate === toDateString(new Date());

  const handleOpenAddWithMood = (mood: Mood) => {
    setInitialMoodForNew(mood);
    setAddingNote(true);
  };

  return (
    <div>
      {/* Day navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={language === "ar" ? nextDay : prevDay}
          className="p-2 rounded-lg"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <div
            className="font-bold text-xl"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {formatDate(dateObj, language)}
          </div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            {t("week")} {getISOWeek(dateObj)}
            {isToday && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{ background: "var(--accent)", color: "var(--btn-text)" }}
              >
                {t("today")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={goToday}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                color: "var(--accent)",
                fontFamily: "var(--font)",
              }}
            >
              {t("today")}
            </button>
          )}
          <button
            onClick={language === "ar" ? prevDay : nextDay}
            className="p-2 rounded-lg"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Notebook page with mood strip guaranteed on the left */}
      <div
        className="notebook-page flex flex-row"
        dir="ltr"
        style={{ minHeight: "520px", borderRadius: "8px" }}
      >
        {/* Spiral rings on the left edge */}
        <div className="notebook-spiral">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="spiral-ring" />
          ))}
        </div>

        {/* Mood strip on the left of the page with colored squares & emojis */}
        <MoodStrip notes={dayNotes} onSelectMood={handleOpenAddWithMood} />

        {/* Notes area (respects RTL if Arabic) */}
        <div className="flex-1 relative z-10" dir={language === "ar" ? "rtl" : "ltr"}>
          {/* Add note button */}
          <div className="p-4 pb-2 flex justify-end">
            <button
              onClick={() => {
                setInitialMoodForNew("none");
                setAddingNote(true);
              }}
              className="theme-btn flex items-center gap-2 px-4 py-2 text-sm shadow-sm"
            >
              <Plus size={16} />
              {t("addNote")}
            </button>
          </div>

          {/* Notes list */}
          <div className="p-4 pt-2 space-y-4">
            {dayNotes.length === 0 ? (
              <div
                className="text-center py-20"
                style={{ color: "var(--text-muted)" }}
              >
                <div className="text-5xl mb-4">📄</div>
                <div className="font-semibold text-base" style={{ fontFamily: "var(--font)" }}>
                  {t("noNotes")}
                </div>
                <div className="text-xs mt-1 opacity-80">{t("startNote")}</div>
              </div>
            ) : (
              dayNotes
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))
            )}
          </div>
        </div>
      </div>

      {addingNote && (
        <NoteModal
          date={selectedDate}
          initialMood={initialMoodForNew}
          onClose={() => setAddingNote(false)}
        />
      )}
    </div>
  );
}
