import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Optimize and load fonts
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PingWish — Never Miss a Birthday",
  description: "Save birthdays and get automatic email reminders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body className="font-body bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased selection:bg-brand-500 selection:text-white transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}