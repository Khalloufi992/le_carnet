"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Home() {
  const { isAuthenticated, theme, darkMode } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/notebook");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div
      data-theme={theme}
      data-dark={darkMode ? "true" : "false"}
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--page-bg)" }}
    >
      <div
        className="w-8 h-8 border-4 rounded-full animate-spin"
        style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
      />
    </div>
  );
}
