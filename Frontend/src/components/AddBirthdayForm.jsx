import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../services/api.js";
import { motion } from "framer-motion";

const AddBirthdayForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", dob: "", email: "" });
  // const [message, setMessage] = useState()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/", form);
      toast.success("Birthday saved!");
      // setMessage(res.data.message || "Submitted Successfully");
      setForm({ name: "", dob: "", email: "" });
      onAdd();
    } catch (err) {
      // setMessage("Error"+ err.response?.data?.error || "Something went wrong")
      toast.error("Failed to save birthday");
      console.error("Add failed:", err.message);
    }
  };

  return (
    <motion.form
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      //   className="space-y-4 max-w-md mx-auto p-4 border rounded"
      className="max-w-md mx-auto p-4 border rounded mb-6"
    >
      <h2 className="text-xl font-semibold">Add Birthday</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
        required
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Save Birthday
      </motion.button>
      {/* {message && <p className="mt-2 text-sm text-green-700">{message}</p>} */}
    </motion.form>
  );
};

export default AddBirthdayForm;
