import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // baseURL: "http://localhost:5000/api",
    withCredentials: true,
})