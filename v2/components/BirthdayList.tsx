"use client";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Birthday {
  _id: string;
  name: string;
  dob: string;
  email: string;
  reminder: boolean;
}

interface Props {
  birthdays: Birthday[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (b: Birthday) => void;
}

function getDaysUntil(dob: string): number {
  const today = new Date();
  const d = new Date(dob);
  const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getAge(dob: string): number {
  const today = new Date();
  const d = new Date(dob);
  let age = today.getFullYear() - d.getFullYear();
  if (
    today.getMonth() < d.getMonth() ||
    (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())
  )
    age--;
  return age;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "#f97316", "#ef4444", "#8b5cf6", "#06b6d4",
  "#10b981", "#f59e0b", "#ec4899", "#6366f1",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function BirthdayList({ birthdays, onDelete, onToggle, onEdit }: Props) {
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}'s birthday?`)) return;
    try {
      const res = await fetch(`/api/birthdays/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      
      // Upgraded personalized toast
      toast.success(`Removed ${name}'s birthday 🗑️`);
      onDelete(id);
    } catch {
      toast.error("Failed to delete birthday 😕");
    }
  };

  const handleToggle = async (id: string) => {
    // Find the person to give a context-aware toast
    const person = birthdays.find(b => b._id === id);
    const isTurningOn = !person?.reminder;
    const firstName = person?.name.split(" ")[0] || "Birthday";

    try {
      const res = await fetch(`/api/birthdays/${id}/toggle`, { method: "PUT" });
      if (!res.ok) throw new Error();
      
      // Upgraded smart toast
      toast.success(isTurningOn ? `Reminder on for ${firstName} 🔔` : `Reminder off 🔕`);
      onToggle(id);
    } catch {
      toast.error("Failed to toggle reminder 😕");
    }
  };

  if (birthdays.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="card p-12 text-center">
        <p className="text-4xl mb-3">🎈</p>
        <p className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
          No birthdays yet
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Add your first one above!
        </p>
      </motion.div>
    );
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {birthdays.map((b) => {
          const days = getDaysUntil(b.dob);
          const age = getAge(b.dob);
          const isToday = days === 0;
          const isSoon = days <= 7;
          const avatarColor = getAvatarColor(b.name);
          const formattedDate = new Date(b.dob).toLocaleDateString("en-US", {
            month: "short", day: "numeric",
          });

          return (
            <motion.li key={b._id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="card p-4 flex items-center gap-4"
              style={{
                border: isToday
                  ? "1px solid var(--accent)"
                  : isSoon
                  ? "1px solid rgba(249,115,22,0.3)"
                  : "1px solid var(--border)",
                background: isToday ? "var(--accent-soft)" : "var(--surface)",
              }}>
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-display font-bold flex-shrink-0"
                style={{ background: avatarColor }}>
                {getInitials(b.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-bold text-sm truncate" style={{ color: "var(--text)" }}>
                    {b.name}
                  </p>
                  {isToday && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "var(--accent)", color: "white" }}>🎉 Today!</span>
                  )}
                  {!isToday && isSoon && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>Soon</span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {formattedDate} · Turns {isToday ? age : age + 1}
                  {" · "}
                  {isToday ? "🎂 Today" : days === 1 ? "Tomorrow" : `in ${days} days`}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {b.email}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggle(b._id)}
                  title={b.reminder ? "Reminder on" : "Reminder off"}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors"
                  style={{
                    background: b.reminder ? "rgba(249,115,22,0.12)" : "var(--surface2)",
                    border: `1px solid ${b.reminder ? "var(--accent)" : "var(--border)"}`,
                  }}>
                  {b.reminder ? "🔔" : "🔕"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(b)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  ✏️
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(b._id, b.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                  🗑
                </motion.button>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}