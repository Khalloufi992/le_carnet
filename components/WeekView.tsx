"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT, getWeekDates, getISOWeek, getWeeksInYear, formatDate, toDateString } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DayColumn } from "./DayColumn";
import { NoteModal } from "./NoteModal";

export function WeekView() {
  const { language, selectedWeek, selectedYear, selectedDate, setSelectedDate, setSelectedWeek, getUserNotes } = useStore();
  const t = useT(language);
  const [addingNoteDate, setAddingNoteDate] = useState<string | null>(null);
  const notes = getUserNotes();

  const weekDates = getWeekDates(selectedWeek, selectedYear);
  const totalWeeks = getWeeksInYear(selectedYear);

  const prevWeek = () => {
    if (selectedWeek === 1) {
      const prevYear = selectedYear - 1;
      setSelectedWeek(getWeeksInYear(prevYear), prevYear);
    } else {
      setSelectedWeek(selectedWeek - 1, selectedYear);
    }
  };

  const nextWeek = () => {
    if (selectedWeek === totalWeeks) {
      setSelectedWeek(1, selectedYear + 1);
    } else {
      setSelectedWeek(selectedWeek + 1, selectedYear);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedWeek(getISOWeek(today), today.getFullYear());
    setSelectedDate(toDateString(today));
  };

  const monthRange = (() => {
    const first = weekDates[0];
    const last = weekDates[6];
    const months = {
      en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
      fr: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"],
    };
    const m = months[language];
    if (first.getMonth() === last.getMonth()) {
      return `${m[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${m[first.getMonth()]} – ${m[last.getMonth()]} ${last.getFullYear()}`;
  })();

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevWeek}
          className="p-2 rounded-xl transition-all"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            boxShadow: "0 1px 4px var(--shadow)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          {language === "ar" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <div className="text-center">
          <div
            className="font-bold text-lg tracking-tight"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {monthRange}
          </div>
          <div
            className="text-xs mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
            style={{
              color: "var(--text-muted)",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {t("week")} {selectedWeek} / {totalWeeks}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--accent)",
              fontFamily: "var(--font)",
              boxShadow: "0 1px 4px var(--shadow)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = `color-mix(in srgb, var(--accent) 8%, var(--card-bg))`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card-bg)"; }}
          >
            {t("today")}
          </button>
          <button
            onClick={nextWeek}
            className="p-2 rounded-xl transition-all"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              boxShadow: "0 1px 4px var(--shadow)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {language === "ar" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {/* Day columns - horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-7 gap-3" style={{ minWidth: "700px" }}>
          {weekDates.map((date, idx) => {
            const dayKey = toDateString(date);
            const dayNotes = notes.filter((n) => n.date === dayKey);
            const isToday = dayKey === toDateString(new Date());
            const isSelected = dayKey === selectedDate;

            return (
              <DayColumn
                key={dayKey}
                date={date}
                dayIndex={idx}
                notes={dayNotes}
                isToday={isToday}
                isSelected={isSelected}
                onSelect={() => setSelectedDate(dayKey)}
                onAddNote={() => setAddingNoteDate(dayKey)}
              />
            );
          })}
        </div>
      </div>

      {/* Add note modal */}
      {addingNoteDate && (
        <NoteModal
          date={addingNoteDate}
          onClose={() => setAddingNoteDate(null)}
        />
      )}
    </div>
  );
}
