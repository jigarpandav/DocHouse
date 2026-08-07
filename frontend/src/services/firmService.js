import axios from "axios";

const apiFirm = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/firm`
    
})

export default apiFirm; 