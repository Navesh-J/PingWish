import axios from "axios";

export default axios.create({
    baseURL:"http://localhost:5000/api/birthdays",
})

// const instance = axios.create({
//   baseURL: 'http://localhost:5000', // or your actual backend URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default instance;