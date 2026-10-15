"use client";
import { useState, useRef, useEffect } from "react";
import { useStore, Mood, NoteType } from "@/lib/store";
import { useT, formatDate } from "@/lib/utils";
import { moodEmojis, moodColors } from "@/lib/themes";
import {
  X, FileText, Mic, Image as ImageIcon,
  Upload, Save, StopCircle, Clock,
} from "lucide-react";

interface NoteModalProps {
  date: string;
  onClose: () => void;
  initialMood?: Mood;
}

const moods: Mood[] = [
  "none", "happy", "sad", "in-love", "proud", "anxious", "calm", "excited", "angry",
];

function getNowHHMM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function NoteModal({ date, onClose, initialMood }: NoteModalProps) {
  const { language, addNote } = useStore();
  const t = useT(language);

  const [noteType, setNoteType] = useState<NoteType>("text");
  const [mood, setMood] = useState<Mood>(initialMood || "none");
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [imageContent, setImageContent] = useState<string>("");
  const [audioContent, setAudioContent] = useState<string>("");
  const [audioDuration, setAudioDuration] = useState(0);

  // Time state
  const [noteTime, setNoteTime] = useState(getNowHHMM());

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dateObj = new Date(date + "T12:00:00");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioContent(reader.result as string);
          setAudioDuration(recordingSeconds);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageContent(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    let content = "";
    if (noteType === "text") content = textContent.trim();
    else if (noteType === "voice") content = audioContent;
    else content = imageContent;

    if (!content) return;

    addNote({
      type: noteType,
      content,
      mood,
      date,
      title: title.trim() || undefined,
      audioDuration: noteType === "voice" ? audioDuration : undefined,
      time: noteTime,
    });
    onClose();
  };

  const canSave =
    (noteType === "text" && textContent.trim()) ||
    (noteType === "voice" && audioContent) ||
    (noteType === "image" && imageContent);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg overflow-hidden fade-in"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25), 0 8px 24px var(--shadow)",
          maxHeight: "92vh",
          overflow: "auto",
          fontFamily: "var(--font)",
          borderRadius: "16px",
        }}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between relative"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--header-bg)",
            padding: "16px 20px",
          }}
        >
          {/* Subtle top accent gradient line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, var(--accent), var(--accent-light), transparent)`,
            }}
          />
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>
              {t("newNote")}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {formatDate(dateObj, language)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all hover:scale-105"
            style={{
              color: "var(--text-muted)",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
            aria-label={t("cancel")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Note type selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              {t("newNote")}
            </label>
            <div className="flex gap-2">
              {(["text", "voice", "image"] as NoteType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setNoteType(type)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center"
                  style={{
                    background: noteType === type ? "var(--accent)" : "var(--input-bg)",
                    color: noteType === type ? "var(--btn-text)" : "var(--text-muted)",
                    border: `1px solid ${noteType === type ? "var(--accent)" : "var(--border)"}`,
                    boxShadow: noteType === type ? "0 2px 6px var(--shadow)" : "none",
                  }}
                >
                  {type === "text" ? <FileText size={14} /> : type === "voice" ? <Mic size={14} /> : <ImageIcon size={14} />}
                  {t(type === "text" ? "textNote" : type === "voice" ? "voiceNote" : "imageNote")}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Mood selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              {t("chooseMood")}
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  title={t(m as any)}
                  className="w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: mood === m ? moodColors[m] : `${moodColors[m]}20`,
                    border: mood === m ? `2px solid var(--text)` : `1px solid ${moodColors[m]}55`,
                    boxShadow: mood === m ? `0 0 10px ${moodColors[m]}88` : "none",
                    transform: mood === m ? "scale(1.12)" : "scale(1)",
                  }}
                >
                  {moodEmojis[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Time & Title section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Time picker inline */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {t("noteTime")}
                </span>
              </label>
              <input
                type="time"
                value={noteTime}
                onChange={(e) => setNoteTime(e.target.value)}
                className="carnet-input text-sm w-full"
              />
            </div>

            {/* Title (optional) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                {t("noteTitle")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="carnet-input text-sm w-full"
                placeholder={t("noteTitle")}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Content area */}
          {noteType === "text" && (
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="carnet-input text-sm resize-none"
              rows={5}
              placeholder={t("writeNote")}
              style={{ lineHeight: "1.8" }}
              autoFocus
            />
          )}

          {noteType === "voice" && (
            <div className="flex flex-col items-center gap-4 py-4">
              {!audioContent ? (
                <>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105"
                    style={{
                      background: isRecording ? "#ef4444" : "var(--accent)",
                      color: "white",
                      boxShadow: isRecording ? "0 0 0 8px rgba(239,68,68,0.2)" : "0 4px 14px var(--shadow)",
                    }}
                  >
                    {isRecording ? <StopCircle size={32} /> : <Mic size={32} />}
                  </button>

                  <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    {isRecording ? (
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                        ● {t("recording")} {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, "0")}
                      </span>
                    ) : (
                      t("startRecording")
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <div
                    className="flex items-center gap-3 p-3.5 rounded-xl"
                    style={{ background: "var(--input-bg)", border: "1px solid var(--border)" }}
                  >
                    <Mic size={20} style={{ color: "var(--accent)" }} />
                    <span className="text-sm flex-1 font-medium" style={{ color: "var(--text)" }}>
                      {Math.floor(audioDuration / 60)}:{String(audioDuration % 60).padStart(2, "0")} audio
                    </span>
                    <button
                      onClick={() => { setAudioContent(""); setAudioDuration(0); }}
                      className="text-xs font-semibold px-2 py-1 rounded-md"
                      style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {noteType === "image" && (
            <div className="flex flex-col items-center gap-3">
              {!imageContent ? (
                <label
                  className="w-full flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all hover:border-[var(--accent)]"
                  style={{
                    border: "2px dashed var(--border)",
                    background: "var(--input-bg)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm font-medium">{t("chooseImage")}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="w-full relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageContent}
                    alt="Preview"
                    className="w-full rounded-xl"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                  <button
                    onClick={() => setImageContent("")}
                    className="absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all hover:scale-105"
                    style={{ background: "#ef4444", color: "white" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--header-bg)",
            padding: "14px 20px",
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              color: "var(--text-muted)",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="theme-btn flex items-center gap-2 px-5 py-2 text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
