"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
          // Auto-redirect to login after 3s
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #f97316, transparent)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #fb923c, transparent)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 p-8 rounded-[2rem] shadow-2xl text-center"
        >
          {status === "loading" && (
            <>
              <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-6">
                <span className="inline-block w-8 h-8 border-3 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-2">
                Verifying your email…
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Just a moment!
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6 text-4xl"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-2">
                Email verified!
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                Your account is now active. Redirecting you to sign in…
              </p>
              <Link
                href="/login"
                className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-display font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all"
              >
                Sign in now →
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6 text-4xl">
                ⏰
              </div>
              <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-2">
                Link expired
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                {message || "This verification link is invalid or has expired."}
              </p>
              <Link
                href="/unverified"
                className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-display font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all"
              >
                Request a new link →
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
