"use client";
import { useState } from "react";
import { useStore, Note } from "@/lib/store";
import { useT } from "@/lib/utils";
import { moodEmojis, moodColors } from "@/lib/themes";
import { FileText, Mic, Image as ImageIcon, Trash2, Play, Pause, Clock } from "lucide-react";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { language, deleteNote } = useStore();
  const t = useT(language);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteNote(note.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const toggleAudio = () => {
    if (!audioEl) {
      const audio = new Audio(note.content);
      audio.onended = () => { setIsPlaying(false); setAudioEl(null); };
      audio.play();
      setAudioEl(audio);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioEl.pause();
        setIsPlaying(false);
      } else {
        audioEl.play();
        setIsPlaying(true);
      }
    }
  };

  const moodColor = moodColors[note.mood] ?? moodColors.none;
  const isRTL = language === "ar";

  return (
    <div
      className="fade-in rounded-xl overflow-hidden hover-lift group"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        boxShadow: "0 1px 4px var(--shadow)",
        position: "relative",
      }}
    >
      {/* Mood accent bar */}
      <div
        style={{
          position: "absolute",
          [isRTL ? "right" : "left"]: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: moodColor,
          borderRadius: isRTL ? "0 8px 8px 0" : "8px 0 0 8px",
        }}
      />

      <div style={{ padding: "12px 14px", [isRTL ? "paddingRight" : "paddingLeft"]: "18px" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Type badge */}
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
              style={{
                background: `${moodColor}18`,
                color: "var(--accent)",
                border: `1px solid ${moodColor}30`,
              }}
            >
              {note.type === "text" ? <FileText size={10} /> : note.type === "voice" ? <Mic size={10} /> : <ImageIcon size={10} />}
              <span className="hidden sm:inline">
                {note.type === "text" ? t("textNote") : note.type === "voice" ? t("voiceNote") : t("imageNote")}
              </span>
            </span>
            {/* Mood emoji */}
            <span
              className="text-base leading-none"
              title={t(note.mood as any)}
            >
              {moodEmojis[note.mood]}
            </span>
            {/* Title */}
            {note.title && (
              <span
                className="font-semibold text-sm truncate"
                style={{ color: "var(--text)", fontFamily: "var(--font)" }}
              >
                {note.title}
              </span>
            )}
          </div>

          {/* Delete actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {confirmDelete ? (
              <>
                <button
                  onClick={handleDelete}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "#ef444415", color: "#ef4444", border: "1px solid #ef444430" }}
                >
                  {t("yes")}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={{ background: "var(--input-bg)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                  {t("no")}
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                title={t("delete")}
                className="p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                style={{ color: "#ef4444", background: "transparent" }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {note.type === "text" && note.content && (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3"
            style={{ color: "var(--text)", fontFamily: "var(--font)", opacity: 0.9 }}
          >
            {note.content}
          </p>
        )}

        {note.type === "voice" && (
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isPlaying ? "#ef444415" : `${moodColor}18`,
                color: isPlaying ? "#ef4444" : "var(--accent)",
                border: `1px solid ${isPlaying ? "#ef444430" : moodColor + "30"}`,
              }}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              {isPlaying ? t("stopAudio") : t("playAudio")}
            </button>
            {note.audioDuration && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {Math.floor(note.audioDuration / 60)}:{String(Math.floor(note.audioDuration % 60)).padStart(2, "0")}
              </span>
            )}
          </div>
        )}

        {note.type === "image" && note.content && (
          <div className="mt-2 rounded-lg overflow-hidden" style={{ maxHeight: "160px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={note.content}
              alt={note.title || "Note image"}
              className="w-full object-contain"
              style={{ maxHeight: "160px", borderRadius: "6px" }}
            />
          </div>
        )}

        {/* Footer: timestamp */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Clock size={10} />
          <span>
            {note.time
              ? note.time
              : new Date(note.createdAt).toLocaleTimeString(
                  language === "ar" ? "ar-DZ" : "en-US",
                  { hour: "2-digit", minute: "2-digit" }
                )}
          </span>
        </div>
      </div>
    </div>
  );
}
