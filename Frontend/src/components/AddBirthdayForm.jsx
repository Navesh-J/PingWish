import { useState } from 'react'
import axios from '../services/api.js'

const AddBirthdayForm = () => {

    const [form, setForm] = useState({name:"",dob:"",email:""})
    const [message, setMessage] = useState()

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res = await axios.post("/add",form);
            setMessage(res.data.message || "Submitted Successfully");
            setForm({name:"",dob:"",email:""});
        }catch(err){
            setMessage("Error"+ err.response?.data?.error || "Something went wrong")
        }
    };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-md mx-auto p-4 border rounded'>
        <h2 className='text-xl font-semibold'>Add Birthday</h2>
        <input type="text" name="name" placeholder='Name' value={form.name} onChange={handleChange} className='w-full p-2 border rounded' required/>
        <input type="date" name="dob" value={form.dob} onChange={handleChange} className='w-full p-2 border rounded' required/>
        <input type="email" name="email" placeholder='Email' value={form.email} onChange={handleChange} className='w-full p-2 border rounded' required/>

        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>Submit</button>
        {message && <p className='mt-2 text-sm text-green-700'>{message}</p>}

    </form>
  )
}

export default AddBirthdayForm;
