"use client";
import { useStore, Note, Mood } from "@/lib/store";
import { useT } from "@/lib/utils";
import { moodColors } from "@/lib/themes";
import { Plus } from "lucide-react";

interface DayColumnProps {
  date: Date;
  dayIndex: number;
  notes: Note[];
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onAddNote: () => void;
}

const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function DayColumn({
  date,
  dayIndex,
  notes,
  isToday,
  isSelected,
  onSelect,
  onAddNote,
}: DayColumnProps) {
  const { language } = useStore();
  const t = useT(language);
  const dayLabel = t(dayKeys[dayIndex]);

  return (
    <div
      onClick={onSelect}
      className="flex flex-col rounded-xl cursor-pointer transition-all duration-200 notebook-page overflow-hidden"
      style={{
        minHeight: "200px",
        border: isSelected
          ? "2px solid var(--accent)"
          : isToday
          ? "1.5px solid var(--accent-light)"
          : "1px solid var(--border)",
        boxShadow: isSelected
          ? "0 4px 16px var(--shadow)"
          : isToday
          ? "0 2px 8px var(--shadow)"
          : "0 1px 4px var(--shadow)",
        transform: isSelected ? "translateY(-1px)" : "none",
      }}
    >
      {/* Day header */}
      <div
        className="p-2.5 text-center flex-shrink-0"
        style={{
          background: isToday
            ? "var(--accent)"
            : isSelected
            ? `color-mix(in srgb, var(--accent) 12%, var(--header-bg))`
            : "var(--header-bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: isToday ? "var(--btn-text)" : "var(--text-muted)", opacity: isToday ? 0.85 : 1 }}
        >
          {dayLabel}
        </div>
        <div
          className="text-xl font-bold leading-none"
          style={{
            color: isToday ? "var(--btn-text)" : isSelected ? "var(--accent)" : "var(--text)",
            fontFamily: "var(--font)",
          }}
        >
          {date.getDate()}
        </div>
        {isToday && (
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--btn-text)", opacity: 0.75 }}>
            ●
          </div>
        )}
      </div>

      {/* Notes list */}
      <div className="flex-1 p-1.5 overflow-y-auto relative z-10" style={{ maxHeight: "150px" }}>
        {notes.length === 0 ? (
          <div
            className="h-full flex items-center justify-center text-base"
            style={{ color: "var(--text-muted)", opacity: 0.3 }}
          >
            ·
          </div>
        ) : (
          <div className="space-y-1">
            {notes.slice(0, 4).map((note) => (
              <div
                key={note.id}
                className="flex items-center gap-1 px-1.5 py-1 rounded-md text-xs truncate"
                style={{
                  background: `${moodColors[note.mood] ?? moodColors.none}12`,
                  borderLeft: `2px solid ${moodColors[note.mood] ?? moodColors.none}`,
                }}
              >
                <span className="truncate flex-1" style={{ color: "var(--text)", lineHeight: "1.2" }}>
                  {note.title || (note.type === "text" ? note.content.slice(0, 24) : note.type === "voice" ? "🎙️ audio" : "🖼️ image")}
                </span>
              </div>
            ))}
            {notes.length > 4 && (
              <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                +{notes.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddNote();
        }}
        className="w-full p-1.5 flex items-center justify-center gap-1 rounded-b-xl transition-all text-xs font-medium"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--accent)",
          background: "transparent",
          fontFamily: "var(--font)",
          opacity: 0.75,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = `color-mix(in srgb, var(--accent) 8%, transparent)`; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.background = "transparent"; }}
        title={t("addNote")}
      >
        <Plus size={11} />
        <span>{t("addNote")}</span>
      </button>
    </div>
  );
}
