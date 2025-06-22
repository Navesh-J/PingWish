// import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../services/api.js";
import { motion, AnimatePresence } from "framer-motion";

const BirthdayList = ({ birthdays, onDelete, onEdit, searchQuery }) => {

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this birthday?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`/birthdays/${id}`);
      toast.error("Birthday deleted");
      // setBirthdays(birthdays.filter((b) => b._id !== id));
      onDelete();
    } catch (err) {
      toast.warn("Delete failed");
      // setError("Delete Failed :", err.message);
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      await axios.put(`/birthdays/${id}/toggle`);
      onDelete(); // refresh the list
      toast.success("Reminder toggled");
    } catch (err) {
      toast.error("Toggle failed");
    }
  };

  const filteredBirthdays = birthdays.filter(({ name, email }) =>
    `${name} ${email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date();
  const sorted = [...birthdays].sort((a, b) => {
    const nextA = new Date(
      today.getFullYear(),
      new Date(a.dob).getMonth(),
      new Date(a.dob).getDate()
    );
    const nextB = new Date(
      today.getFullYear(),
      new Date(b.dob).getMonth(),
      new Date(b.dob).getDate()
    );

    // If birthday already passed this year, shift to next year
    if (nextA < today) nextA.setFullYear(today.getFullYear() + 1);
    if (nextB < today) nextB.setFullYear(today.getFullYear() + 1);

    return nextA - nextB;
  });

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]">
      <h2 className="text-xl font-semibold mb-4">Saved Birthdays</h2>
      <ul className="space-y-2">
        <AnimatePresence>
          {Array.isArray(birthdays) &&
            sorted
              .filter(({ name, email }) =>
                `${name} ${email}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map(({ _id, name, dob, email, reminder }) => (
                <motion.li
                  key={_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm">{new Date(dob).toDateString()}</p>
                    <p className="text-xs text-gray-600">{email}</p>
                  </div>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit({ _id, name, dob, email })}
                      className="bg-yellow-200 text-gray-700 px-2 py-1 rounded mr-2 cursor-pointer"
                    >
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(_id)}
                      className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleReminder(_id)}
                      className={`px-2 py-1 rounded  m-2 cursor-pointer ${
                        reminder
                          ? "bg-green-600 text-white"
                          : "bg-gray-400 text-black"
                      }`}
                    >
                      {reminder ? "🔔" : "🔕"}
                    </motion.button>
                  </div>
                </motion.li>
              ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default BirthdayList;
