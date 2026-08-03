import axios from "axios";
console.log(`${import.meta.env.VITE_API_URL}/firm`)
const apiFirm = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/firm`
    
})

export default apiFirm; 