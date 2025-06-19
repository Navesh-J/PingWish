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
  const [loading, setLoading] = useState(true);
  const [editBirthday, setEditBirthday] = useState(null);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/");
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

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        🎉 PingWish
      </h1>
      <ToastContainer position="top-right" autoClose={3000} />
      <BirthdayForm onAdd={fetchBirthdays} editData={editBirthday} setEditData={setEditBirthday}/>
      {/* <BirthdayList birthdays={birthdays} onDelete={fetchBirthdays}/> */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <ScaleLoader size={50} color="#3b82f6" />
        </div>
      ) : (
        <BirthdayList birthdays={birthdays} onDelete={fetchBirthdays} onEdit={setEditBirthday}/>
      )}
    </motion.div>
  );
}

export default App;
