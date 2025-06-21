import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../services/api.js";
import { motion } from "framer-motion";

const AddBirthdayForm = ({ onAdd, editData, setEditData }) => {
  const [form, setForm] = useState({ name: "", dob: "", email: "" });

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        dob: editData.dob.slice(0, 10), // ensures proper format
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await axios.put(`/${editData._id}`, form);
        toast.success("Birthday updated");
      } else {
        await axios.post("/", form);
        toast.success("Birthday saved!");
      }
      setForm({ name: "", dob: "", email: "" });
      setEditData(null);
      onAdd();
    } catch (err) {
      toast.error("Operation Failed");
      console.error("Operation failed:", err.message);
    }
  };

  return (
    <motion.form
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded mb-6 bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]"
    >
      <h2 className="text-xl font-semibold">
        {editData ? "Edit Birthday" : "Add Birthday"}
      </h2>
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
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          {editData ? "Update" : "Save Birthday"}
        </motion.button>
        {editData && (
          <button
            type="button"
            onClick={() => {
              setEditData(null);
              setForm({ name: "", dob: "", email: "" });
            }}
            className="text-sm underline cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default AddBirthdayForm;
