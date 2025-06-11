import { useState,useEffect } from "react"
import axios from "./services/api.js"
import ScaleLoader from "react-spinners/ScaleLoader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BirthdayForm from "./components/AddBirthdayForm"
import BirthdayList from "./components/BirthdayList"

function App() {


  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/');
      setBirthdays(res.data);
    } catch (err) {
      console.error('Failed to fetch birthdays:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🎉 PingWish - Birthday Reminder</h1>
      <ToastContainer position="top-right" autoClose={3000} />
      <BirthdayForm onAdd={fetchBirthdays}/>
      {/* <BirthdayList birthdays={birthdays} onDelete={fetchBirthdays}/> */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <ScaleLoader size={50} color="#3b82f6" />
        </div>
      ) : (
        <BirthdayList birthdays={birthdays} onDelete={fetchBirthdays} />
      )}
    </div>
  )
}

export default App