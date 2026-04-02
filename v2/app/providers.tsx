"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply saved theme or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          // Tailwind classes handle the heavy lifting for styling now
          className: "font-body text-sm font-medium shadow-2xl dark:bg-neutral-900 dark:text-white dark:border-neutral-800 border border-neutral-100",
          style: {
            borderRadius: "1rem",
            padding: "16px 20px",
          },
          success: {
            iconTheme: { primary: "#f97316", secondary: "white" }, // Brand orange
            style: {
              background: "var(--surface)",
              color: "var(--text)",
            }
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
          }
        }}
      />
    </SessionProvider>
  );
}