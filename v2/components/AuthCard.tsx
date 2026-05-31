"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  defaultTab: "login" | "register";
}

// 👁 Reusable password input with peek toggle
function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  minLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minLength?: number;
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
        minLength={minLength}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          // Eye-off icon
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          // Eye icon
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function AuthCard({ defaultTab }: Props) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back! 🎉");
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }
      await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });
      toast.success("Account created! 🎊");
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const isLogin = tab === "login";

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="text-center mb-8 animate-slide-down">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <span className="text-2xl">🎂</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-neutral-900 dark:text-white tracking-tight">
            PingWish
          </h1>
        </div>
        <div>
          <span className="mt-2 inline-flex items-center justify-center text-xs sm:text-sm font-display font-medium tracking-wide text-neutral-500 dark:text-neutral-400 bg-neutral-100/80 dark:bg-neutral-800/50 backdrop-blur-md px-5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm transition-colors">
            🎉 Never Miss a Birthday
          </span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex mb-8 rounded-2xl p-1.5 bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700/50">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-display font-bold capitalize transition-all duration-300 ${
              tab === t
                ? "bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            {t === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 p-8 rounded-[2rem] shadow-2xl">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Email
                </label>
                <input
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                    Password
                  </label>
                  {/* Forgot password link */}
                  <Link
                    href="/reset-password"
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  value={loginPassword}
                  onChange={setLoginPassword}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Sign In →"}
              </button>

              <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 pt-2">
                No account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline transition-colors"
                >
                  Register free
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Your Name
                </label>
                <input
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
                  type="text"
                  placeholder="Alex Johnson"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Email
                </label>
                <input
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Password
                </label>
                <PasswordInput
                  value={regPassword}
                  onChange={setRegPassword}
                  placeholder="min. 8 characters"
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Create Account →"}
              </button>

              <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 pt-2">
                Already have one?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}