import { useState,useEffect } from "react";
import axios from '../services/api.js'

const BirthdayList=()=>{
    const [birthdays,setBirthdays] = useState([])
    const [error,setError] = useState()

    const fetchBirthdays = async()=>{
        try{
            const res = await axios.get("/");
            setBirthdays(res.data);
        }catch(err){
            setError("Failed to fetch birthdays")
        }
    }

    const handleDelete = async (id)=>{
        try{
            await axois.delete('/delete/${id}');
            setBirthdays(birthdays.filter((b) => b._id !== id));
        }catch(err){
            setError("Delete Failed");
        }
    }

    useEffect(()=>{
        fetchBirthdays();
    },[]);

    return(
        <div className="max-w-md mx-auto mt-6 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Saved Birthdays</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
                {birthdays.map(({_id,name,dob,email}) =>(
                    <li key={_id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                            <p className="font-semibold">{name}</p>
                            <p className="text-sm">{new Date(dob).toDateString()}</p>
                            <p className="text-xs text-gray-600">{email}</p>
                        </div>
                        <button onClick={()=>handleDelete(_id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BirthdayList;