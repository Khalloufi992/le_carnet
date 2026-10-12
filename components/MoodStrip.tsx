"use client";
import { useStore, Note, Mood } from "@/lib/store";
import { useT } from "@/lib/utils";
import { moodEmojis, moodColors } from "@/lib/themes";

interface MoodStripProps {
  notes: Note[];
  onSelectMood?: (mood: Mood) => void;
}

const allMoods: Mood[] = [
  "sad",
  "happy",
  "in-love",
  "proud",
  "anxious",
  "calm",
  "excited",
  "angry",
  "none",
];

export function MoodStrip({ notes, onSelectMood }: MoodStripProps) {
  const { language } = useStore();
  const t = useT(language);

  const moodCounts: Record<string, number> = {};
  notes.forEach((n) => {
    moodCounts[n.mood] = (moodCounts[n.mood] ?? 0) + 1;
  });

  return (
    <div className="mood-strip" title={t("mood")}>
      {allMoods.map((mood) => {
        const count = moodCounts[mood] ?? 0;
        const hasNotes = count > 0;
        const color = moodColors[mood];

        return (
          <div
            key={mood}
            className="group relative flex flex-col items-center"
            title={t(mood as any)}
          >
            {/* Colored square with emoji inside */}
            <button
              type="button"
              onClick={() => onSelectMood?.(mood)}
              className="transition-all duration-200"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: hasNotes ? color : `${color}28`,
                border: hasNotes ? `2px solid ${color}` : `1.5px solid ${color}88`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                cursor: onSelectMood ? "pointer" : "default",
                position: "relative",
                boxShadow: hasNotes
                  ? `0 2px 8px ${color}66`
                  : `0 1px 3px rgba(0,0,0,0.06)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span className="select-none leading-none">{moodEmojis[mood]}</span>

              {/* Note count badge */}
              {hasNotes && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    minWidth: "15px",
                    height: "15px",
                    padding: "0 2px",
                    borderRadius: "4px",
                    background: "var(--card-bg)",
                    border: `1.5px solid ${color}`,
                    color: color,
                    fontSize: "9px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
              )}
            </button>

            {/* Tooltip on hover */}
            <div
              className="absolute hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none"
              style={{
                left: "calc(100% + 8px)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--card-bg)",
                border: `1px solid ${color}`,
                color: "var(--text)",
                boxShadow: `0 4px 12px var(--shadow)`,
                fontFamily: "var(--font)",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ background: color }}
              />
              <span>{moodEmojis[mood]}</span>
              <span className="font-medium">{t(mood as any)}</span>
              {hasNotes && (
                <span style={{ color, fontWeight: "bold" }}>({count})</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
