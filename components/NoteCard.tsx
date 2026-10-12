"use client";
import { useState } from "react";
import { useStore, Note } from "@/lib/store";
import { useT } from "@/lib/utils";
import { moodEmojis, moodColors } from "@/lib/themes";
import { FileText, Mic, Image as ImageIcon, Trash2, Edit3, Play, Pause } from "lucide-react";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { language, deleteNote, updateNote } = useStore();
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

  const typeIcon = note.type === "text"
    ? <FileText size={14} />
    : note.type === "voice"
    ? <Mic size={14} />
    : <ImageIcon size={14} />;

  return (
    <div
      className="fade-in rounded-lg overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        boxShadow: "1px 2px 6px var(--shadow)",
        position: "relative",
      }}
    >
      {/* Left mood accent bar */}
      <div
        style={{
          position: "absolute",
          [language === "ar" ? "right" : "left"]: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          background: moodColors[note.mood] ?? moodColors.none,
          borderRadius: language === "ar" ? "0 8px 8px 0" : "8px 0 0 8px",
        }}
      />

      <div style={{ padding: "12px 16px 12px", paddingLeft: language === "ar" ? "16px" : "20px", paddingRight: language === "ar" ? "20px" : "16px" }}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Type icon */}
            <span style={{ color: "var(--accent)" }}>{typeIcon}</span>
            {/* Mood emoji */}
            <span title={t(note.mood as any)}>
              {moodEmojis[note.mood]}
            </span>
            {/* Title */}
            {note.title && (
              <span
                className="font-semibold text-sm"
                style={{ color: "var(--text)", fontFamily: "var(--font)" }}
              >
                {note.title}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {confirmDelete ? (
              <>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 rounded text-xs"
                  style={{ background: "#ef4444", color: "white" }}
                >
                  {t("yes")}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded text-xs"
                  style={{ background: "var(--border)", color: "var(--text)" }}
                >
                  {t("no")}
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                title={t("delete")}
                className="p-1.5 rounded opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "#ef4444" }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {note.type === "text" && (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            {note.content}
          </p>
        )}

        {note.type === "voice" && (
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ background: "var(--accent)", color: "var(--btn-text)" }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
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
          <div className="mt-2 rounded-lg overflow-hidden" style={{ maxHeight: "200px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={note.content}
              alt={note.title || "Note image"}
              className="w-full object-contain"
              style={{ maxHeight: "200px", borderRadius: "6px" }}
            />
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          {new Date(note.createdAt).toLocaleTimeString(
            language === "ar" ? "ar-DZ" : "en-US",
            { hour: "2-digit", minute: "2-digit" }
          )}
        </div>
      </div>
    </div>
  );
}
