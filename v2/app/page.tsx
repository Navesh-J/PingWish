import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30">
              <span className="text-lg">🎂</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tight">PingWish</span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-brand-500 hover:bg-brand-600 text-white font-display font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-display font-bold text-neutral-600 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-display font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-32 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(ellipse, #f97316, transparent)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-display font-bold tracking-wider uppercase px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Free forever · No charges · No Spam
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.05] mb-6">
            Never forget a{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-500">birthday</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-brand-200 dark:bg-brand-900/60 rounded-full -z-0 opacity-60" />
            </span>
            {" "}again 🎉
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10 max-w-xl mx-auto font-medium">
            PingWish saves your loved ones' birthdays and sends you automatic email reminders the day before and on the day. Simple, reliable, free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-display font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-100"
            >
              Start for free →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 font-display font-bold text-base px-8 py-4 rounded-2xl shadow-sm transition-all hover:border-brand-300 dark:hover:border-brand-700"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-neutral-400 dark:text-neutral-500 font-medium">
            🎂 Reminders sent every morning at 9 AM · No spam ever
          </p>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white dark:bg-neutral-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold mb-4">
              Everything you need,{" "}
              <span className="text-brand-500">nothing you don't</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl mx-auto">
              Built for people who care about their relationships but have a lot on their plate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔔",
                title: "Automatic reminders",
                desc: "Get an email the day before and on the birthday itself — at 9 AM sharp, every single time.",
              },
              {
                icon: "📅",
                title: "Smart sorting",
                desc: "Birthdays are always sorted by who's coming up next. See countdowns at a glance.",
              },
              {
                icon: "🔕",
                title: "Per-person toggle",
                desc: "Turn reminders on or off for each person individually. Full control, no noise.",
              },
              {
                icon: "🌙",
                title: "Dark mode",
                desc: "Easy on the eyes day or night. Your preference is saved automatically.",
              },
              {
                icon: "🔒",
                title: "Private & secure",
                desc: "Your data is yours. We never sell it, share it, or use it for anything else.",
              },
              {
                icon: "⚡",
                title: "Blazing fast",
                desc: "Built on Next.js and Vercel. Pages load instantly, actions feel immediate.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-7 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold mb-4">
              Up and running in{" "}
              <span className="text-brand-500">60 seconds</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "✍️", title: "Create your account", desc: "Sign up free — no credit card, no nonsense." },
              { step: "02", icon: "🎂", title: "Add birthdays", desc: "Name, Birthday, and Reminder Email. That's all we need." },
              { step: "03", icon: "📬", title: "We handle the rest", desc: "Sit back. We'll remind you every year automatically." },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 text-white text-2xl shadow-lg shadow-brand-500/30 mb-5">
                  {s.icon}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-display font-bold flex items-center justify-center">
                  {s.step}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-brand-500 rounded-[2.5rem] p-12 shadow-2xl shadow-brand-500/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 text-9xl opacity-10 pointer-events-none select-none">🎂</div>
            <div className="absolute -bottom-10 -left-10 text-9xl opacity-10 pointer-events-none select-none">🎈</div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-4">
                Start wishing on time
              </h2>
              <p className="text-brand-100 text-lg mb-8 font-medium">
                Free forever. Takes 60 seconds to set up.
              </p>
              <Link
                href="/register"
                className="inline-block bg-white text-brand-600 font-display font-extrabold text-base px-10 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-100"
              >
                Get started free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎂</span>
            <span className="font-display font-bold text-neutral-700 dark:text-neutral-300">PingWish</span>
          </div>
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Never miss a birthday again.
          </p>
          <div className="flex items-center gap-5 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <Link href="/login" className="hover:text-brand-500 transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-brand-500 transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}