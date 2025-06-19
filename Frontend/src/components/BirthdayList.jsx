// import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../services/api.js";
import { motion, AnimatePresence } from "framer-motion";

const BirthdayList = ({ birthdays, onDelete, onEdit}) => {
  // const [birthdays,setBirthdays] = useState([])
  // const [error,setError] = useState()

  // const fetchBirthdays = async()=>{
  //     try{
  //         const res = await axios.get("/");
  //         setBirthdays(res.data);
  //     }catch(err){
  //         setError("Failed to fetch birthdays")
  //     }
  // }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this birthday?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`/${id}`);
      toast.error("Birthday deleted");
      // setBirthdays(birthdays.filter((b) => b._id !== id));
      onDelete();
    } catch (err) {
      toast.warn("Delete failed");
      // setError("Delete Failed :", err.message);
    }
  };

  // useEffect(()=>{
  //     fetchBirthdays();
  // },[]);

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Saved Birthdays</h2>
      <ul className="space-y-2">
        <AnimatePresence>
          {Array.isArray(birthdays) &&
            birthdays.map(({ _id, name, dob, email }) => (
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
                </div>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default BirthdayList;
