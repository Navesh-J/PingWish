import { useState, useEffect } from "react";
import axios from "./services/api.js";
import api from "./services/api.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "react-toastify/dist/ReactToastify.css";

import { useUser } from "./context/UserContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import AuthPage from "./components/Auth/AuthPage.jsx";
import BirthdayForm from "./components/AddBirthdayForm";
import BirthdayList from "./components/BirthdayList";
import useAuthCheck from "./hooks/useAuthCheck.jsx";
import logo from "./assets/logo.svg";

function Home() {
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
      prev.map((b) => (b._id === id ? { ...b, reminder: !b.reminder } : b))
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

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       await axios.get("/auth/check");
  //     } catch {
  //       navigate("/auth");
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const isAuthenticated = useAuthCheck();
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center mt-20">
        <ScaleLoader size={50} color="#3b82f6" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // window.location.href = "/auth"; // redirect to auth page
    navigate("/auth")
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <img src={logo} className="w-10" alt="logo" /> PingWish
        </h1>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDark}
            className="w-10 h-10 flex items-center pb-0.5 justify-center rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] cursor-pointer"
          >
            {isDark ? "🌙" : "☀️"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="text-white cursor-pointer bg-red-800 font-semibold p-2 rounded-full"
          >
            Logout
          </motion.button>
        </div>
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

export default function App() {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}
