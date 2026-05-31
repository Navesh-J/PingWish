"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

// 👁 Password input with peek toggle (same as AuthCard)
function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={8}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

// ── Step 1: Request email ────────────────────────────────────────────────────
function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 404) {
        toast.error("No account found with that email address.");
      } else if (res.ok) {
        setSent(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto text-3xl">
          📬
        </div>
        <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white">
          Check your inbox
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          If{" "}
          <strong className="text-neutral-700 dark:text-neutral-200">
            {email}
          </strong>{" "}
          is registered, you'll receive a reset link shortly. Check your spam
          folder too!
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Link expires in 1 hour.
        </p>
        <Link
          href="/login"
          className="inline-block mt-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          ← Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-1">
          Forgot password?
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <div>
        <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          Email
        </label>
        <input
          className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-display font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Send Reset Link →"
        )}
      </button>
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Remember it?{" "}
        <Link
          href="/login"
          className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}

// ── Step 2: Set new password ─────────────────────────────────────────────────
// REPLACE the entire SetNewPasswordForm function with this:
function SetNewPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false); // ← new
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setExpired(true); // ← show expired UI instead of toast
        return;
      }
      setDone(true);
      toast.success("Password updated! Redirecting…");
      setTimeout(() => router.push("/login"), 2000);
    } finally {
      setLoading(false);
    }
  };

  // ── Expired / invalid token state ──
  if (expired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto text-3xl">
          ⏰
        </div>
        <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white">
          Link expired
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          This reset link is invalid or has expired. Reset links are only valid
          for 1 hour.
        </p>
        <Link
          href="/reset-password"
          className="inline-block mt-2 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all"
        >
          Request a new link →
        </Link>
      </motion.div>
    );
  }

  // ── Success state ──
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto text-3xl">
          ✅
        </div>
        <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-white">
          Password updated!
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Redirecting you to sign in…
        </p>
      </motion.div>
    );
  }

  // ── Form ──
  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-1">
          Set new password
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Choose a strong password for your account.
        </p>
      </div>
      <div>
        <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          New Password
        </label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="min. 8 characters"
        />
      </div>
      <div>
        <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
          Confirm Password
        </label>
        <PasswordInput
          value={confirm}
          onChange={setConfirm}
          placeholder="same password again"
        />
        <AnimatePresence>
          {confirm.length > 0 && password !== confirm && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-500 mt-1.5"
            >
              Passwords don't match
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <button
        type="submit"
        disabled={loading || password !== confirm}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-display font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Update Password →"
        )}
      </button>
    </motion.form>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────────────────
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Background blobs */}
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <span className="text-xl">🎂</span>
            </div>
            <span className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              PingWish
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 p-8 rounded-[2rem] shadow-2xl">
          <AnimatePresence mode="wait">
            {token ? (
              <SetNewPasswordForm key="set" token={token} />
            ) : (
              <RequestResetForm key="request" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
