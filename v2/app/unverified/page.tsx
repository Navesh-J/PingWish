"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

function UnverifiedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to resend");
        return;
      }
      setResent(true);
      toast.success("Verification email sent!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #f97316, transparent)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fb923c, transparent)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <span className="text-xl">🎂</span>
            </div>
            <span className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              PingWish
            </span>
          </Link>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 p-8 rounded-[2rem] shadow-2xl text-center"
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-6 text-4xl">
            📬
          </div>

          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-2">
            Check your inbox
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-2">
            We sent a verification link to
          </p>
          {email && (
            <p className="font-display font-bold text-neutral-800 dark:text-neutral-200 text-sm mb-6 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl inline-block">
              {email}
            </p>
          )}
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-8">
            Click the link in the email to activate your account. Check your spam folder if you don't see it.
          </p>

          {/* Resend button */}
          {!resent ? (
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-display font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mb-4"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Resend verification email"}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 font-display font-bold py-3.5 rounded-xl text-sm mb-4 flex items-center justify-center gap-2"
            >
              ✅ Email sent! Check your inbox
            </motion.div>
          )}

          {/* Wrong email option */}
          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-5 mt-2">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3">
              Used the wrong email?
            </p>
            <Link
              href="/register"
              className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Register with a different email →
            </Link>
          </div>

          <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
            Link expires in 24 hours
          </p>
        </motion.div>

        <p className="text-center mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Already verified?{" "}
          <Link href="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function UnverifiedPage() {
  return (
    <Suspense>
      <UnverifiedContent />
    </Suspense>
  );
}