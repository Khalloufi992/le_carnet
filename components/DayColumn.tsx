"use client";
import { useStore, Note, Mood } from "@/lib/store";
import { useT } from "@/lib/utils";
import { moodEmojis, moodColors } from "@/lib/themes";
import { Plus, FileText, Mic, Image } from "lucide-react";

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
      className="flex flex-col rounded-lg cursor-pointer transition-all duration-200 notebook-page"
      style={{
        minHeight: "220px",
        border: isSelected
          ? "2px solid var(--accent)"
          : isToday
          ? "2px solid var(--accent-light)"
          : "1px solid var(--border)",
        boxShadow: isSelected
          ? "0 4px 12px var(--shadow)"
          : "1px 2px 6px var(--shadow)",
        opacity: 1,
      }}
    >
      {/* Day header */}
      <div
        className="p-2 text-center rounded-t-lg flex-shrink-0"
        style={{
          background: isToday
            ? "var(--accent)"
            : isSelected
            ? "var(--accent-light)"
            : "var(--header-bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="text-xs font-medium uppercase tracking-wide"
          style={{
            color: isToday ? "var(--btn-text)" : "var(--text-muted)",
          }}
        >
          {dayLabel}
        </div>
        <div
          className="text-lg font-bold"
          style={{
            color: isToday ? "var(--btn-text)" : "var(--text)",
            fontFamily: "var(--font)",
          }}
        >
          {date.getDate()}
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 p-2 overflow-y-auto relative z-10" style={{ maxHeight: "160px" }}>
        {notes.length === 0 ? (
          <div
            className="h-full flex items-center justify-center text-xs"
            style={{ color: "var(--text-muted)", opacity: 0.6 }}
          >
            —
          </div>
        ) : (
          <div className="space-y-1.5">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start gap-1.5 p-1.5 rounded text-xs"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Mood square with emoji */}
                <span
                  className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] flex-shrink-0"
                  style={{ background: moodColors[note.mood] ?? moodColors.none }}
                >
                  {moodEmojis[note.mood] !== "○" ? moodEmojis[note.mood] : ""}
                </span>
                {/* Note type icon */}
                <span style={{ color: "var(--text-muted)" }}>
                  {note.type === "text" ? (
                    <FileText size={10} />
                  ) : note.type === "voice" ? (
                    <Mic size={10} />
                  ) : (
                    <Image size={10} />
                  )}
                </span>
                {/* Content preview */}
                <span
                  className="truncate flex-1"
                  style={{ color: "var(--text)", lineHeight: "1.2" }}
                >
                  {note.title || note.content.slice(0, 30) || (note.type === "voice" ? "🎙️" : "🖼️")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddNote();
        }}
        className="w-full p-1.5 flex items-center justify-center gap-1 rounded-b-lg transition-colors text-xs"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--accent)",
          background: "transparent",
          fontFamily: "var(--font)",
        }}
        title={t("addNote")}
      >
        <Plus size={12} />
        <span>{t("addNote")}</span>
      </button>
    </div>
  );
}
