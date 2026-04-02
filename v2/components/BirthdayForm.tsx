"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Birthday {
  _id: string;
  name: string;
  dob: string;
  email: string;
  reminder: boolean;
}

interface Props {
  editData: Birthday | null;
  defaultEmail?: string;
  onAdd: (b: Birthday) => void;
  onUpdate: (b: Birthday) => void;
  onCancel: () => void;
}

export default function BirthdayForm({
  editData,
  defaultEmail = "",
  onAdd,
  onUpdate,
  onCancel,
}: Props) {
  const [form, setForm] = useState({ name: "", dob: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        dob: editData.dob.slice(0, 10),
        email: editData.email,
      });
    } else {
      setForm((prev) => ({
        name: "",
        dob: "",
        email: defaultEmail || prev.email || "",
      }));
    }
  }, [editData, defaultEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        const res = await fetch(`/api/birthdays/${editData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        toast.success("Birthday updated! ✏️");
        onUpdate(updated);
      } else {
        const res = await fetch("/api/birthdays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        toast.success("Birthday saved! 🎂");
        onAdd(created);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              Name
            </label>
            <input
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
              type="text"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              Date of Birth
            </label>
            <input
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2 font-display tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Email for Reminder
          </label>
          <input
            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-neutral-400 shadow-sm"
            type="email"
            placeholder="alex@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editData ? (
              "Update Birthday"
            ) : (
              "Save Birthday"
            )}
          </motion.button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 rounded-xl text-sm font-bold font-display text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}