import axios from "axios";

const apiCat = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/category`
})

export default apiCat;