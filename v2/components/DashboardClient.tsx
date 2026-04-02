"use client";

import { useState, useEffect, useMemo } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import BirthdayForm from "./BirthdayForm";
import BirthdayList from "./BirthdayList";

interface Birthday {
  _id: string;
  name: string;
  dob: string;
  email: string;
  reminder: boolean;
}

interface Props {
  initialBirthdays: Birthday[];
  userName: string;
}

interface UpcomingBirthday {
  birthday: Birthday;
  daysUntil: number;
}

export default function DashboardClient({ initialBirthdays, userName }: Props) {
  const [birthdays, setBirthdays] = useState<Birthday[]>(initialBirthdays);
  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState<Birthday | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [lastUsedEmail, setLastUsedEmail] = useState("");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const isNowDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
    setIsDark(isNowDark);
  };

  const handleAdd = (newBirthday: Birthday) => {
    setBirthdays((prev) => [...prev, newBirthday]);
    setLastUsedEmail(newBirthday.email);
    setShowForm(false);
  };

  const handleUpdate = (updated: Birthday) => {
    setBirthdays((prev) =>
      prev.map((b) => (b._id === updated._id ? updated : b)),
    );
    setLastUsedEmail(updated.email);
    setEditData(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setBirthdays((prev) => {
      const updated = prev.filter((b) => b._id !== id);

      const totalPagesAfterDelete = Math.ceil(updated.length / itemsPerPage);

      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }

      return updated;
    });
  };

  const handleToggle = (id: string) => {
    setBirthdays((prev) =>
      prev.map((b) => (b._id === id ? { ...b, reminder: !b.reminder } : b)),
    );
  };

  const handleEdit = (birthday: Birthday) => {
    setEditData(birthday);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    toast.loading("Signing out...");
    await signOut({ callbackUrl: "/login" });
  };

  // Sort by nearest upcoming birthday
  const sorted = useMemo(() => {
    const today = new Date();
    return [...birthdays].sort((a, b) => {
      const getNext = (dob: string) => {
        const d = new Date(dob);
        const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        return next.getTime();
      };
      return getNext(a.dob) - getNext(b.dob);
    });
  }, [birthdays]);

  // Search only by name
  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return sorted;

    return sorted.filter(({ name }) => name.toLowerCase().includes(query));
  }, [sorted, searchQuery]);

  // Upcoming birthdays within next 7 days
  const upcomingBirthdays = useMemo<UpcomingBirthday[]>(() => {
    const today = new Date();

    return sorted
      .map((birthday) => {
        const d = new Date(birthday.dob);
        const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);

        const daysUntil = Math.ceil(
          (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        return { birthday, daysUntil };
      })
      .filter(({ daysUntil }) => daysUntil <= 7);
  }, [sorted]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const effectivePage = Math.min(currentPage, Math.max(1, totalPages));

  const startIndex = (effectivePage - 1) * itemsPerPage;
  const paginatedBirthdays = filtered.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const firstName = userName.split(" ")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 font-body text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <span className="text-xl">🎂</span>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              PingWish
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hidden sm:block">
              Hey, {firstName}
            </span>
            <button
              onClick={toggleDark}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? "🌙" : "☀️"}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-display font-bold px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 transition-all shadow-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 animate-slide-down">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Birthdays", value: birthdays.length, delay: 0.05 },
            {
              label: "Days until next",
              value:
                upcomingBirthdays.length > 0
                  ? upcomingBirthdays[0].daysUntil
                  : "—",
              delay: 0.1,
            },
            {
              label: "Reminders on",
              value: birthdays.filter((b) => b.reminder).length,
              delay: 0.15,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-3xl text-center shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all group"
            >
              <p className="text-4xl font-display font-bold text-brand-500 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-sm mt-2 font-medium text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {upcomingBirthdays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-3xl p-6 flex items-center gap-5 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/50 shadow-sm relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-8xl opacity-10 blur-sm pointer-events-none">
              🎈
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center text-3xl animate-float relative z-10">
              🎈
            </div>
            <div className="relative z-10">
              {/* Names */}
              <div className="font-display font-bold text-lg text-brand-900 dark:text-brand-100">
                {upcomingBirthdays.map(({ birthday, daysUntil }) => (
                  <p key={birthday._id} className="mb-1">
                    {daysUntil === 0
                      ? `🎉 Today is ${birthday.name}'s birthday!`
                      : daysUntil === 1
                        ? ` ${birthday.name}'s birthday is tomorrow!`
                        : `${birthday.name}'s birthday is in ${daysUntil} days`}
                  </p>
                ))}
              </div>

              {/* Single Date */}
              {/* <div className="text-sm mt-2 text-brand-600 dark:text-brand-300 font-medium">
                {new Date(upcomingBirthdays[0].birthday.dob).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                  },
                )}
              </div> */}
            </div>
          </motion.div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white tracking-tight">
            {showForm
              ? editData
                ? "Edit Birthday"
                : "Add Birthday"
              : "Your Birthdays"}
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (showForm && editData) setEditData(null);
              setShowForm(!showForm);
            }}
            className="font-display font-bold text-sm px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 transition-all"
          >
            {showForm ? "✕ Cancel" : "+ Add Birthday"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              style={{ overflow: "hidden" }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xl">
                <BirthdayForm
                  editData={editData}
                  defaultEmail={lastUsedEmail}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onCancel={() => {
                    setEditData(null);
                    setShowForm(false);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-2xl py-3.5 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400"
            placeholder="Search by name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-sm overflow-hidden mb-6">
          {paginatedBirthdays.length > 0 ? (
            <BirthdayList
              birthdays={paginatedBirthdays}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          ) : (
            <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">
              {searchQuery
                ? "No birthdays found matching your search."
                : "No birthdays added yet."}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-2 shadow-sm">
            <button
              onClick={goToPrevPage}
              disabled={effectivePage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <span className="text-sm font-medium text-neutral-500">
              Page{" "}
              <strong className="text-neutral-900 dark:text-white">
                {effectivePage}
              </strong>{" "}
              of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={effectivePage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Next
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
