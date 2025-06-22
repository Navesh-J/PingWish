import { useState, useEffect } from "react";
import axios from "./services/api.js";
import ScaleLoader from "react-spinners/ScaleLoader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

import BirthdayForm from "./components/AddBirthdayForm";
import BirthdayList from "./components/BirthdayList";

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editBirthday, setEditBirthday] = useState(null);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/birthdays");
      setBirthdays(res.data);
    } catch (err) {
      console.error("Failed to fetch birthdays:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const handleDelete = (id) => {
    setBirthdays((prev) => prev.filter((b) => b._id !== id));
  };

  const handleToggle = (id) => {
    setBirthdays((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, reminder: !b.reminder } : b
      )
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    if (isCurrentlyDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isCurrentlyDark);
  };

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🎉 PingWish</h1>
        <button
          onClick={toggleDark}
          className="w-10 h-10 flex items-center pb-0.5 justify-center rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] cursor-pointer"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <BirthdayForm
        onAdd={fetchBirthdays}
        editData={editBirthday}
        setEditData={setEditBirthday}
      />
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full max-w-md mx-auto mb-4 p-2 border rounded"
      />

      {loading ? (
        <div className="flex justify-center mt-10">
          <ScaleLoader size={50} color="#3b82f6" />
        </div>
      ) : (
        <BirthdayList
          birthdays={birthdays}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onEdit={setEditBirthday}
          searchQuery={searchQuery}
        />
      )}
    </motion.div>
  );
}

export default App;
