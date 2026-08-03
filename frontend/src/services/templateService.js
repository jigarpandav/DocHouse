import axios from "axios";

const apiTemp = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/template`
})

export default apiTemp;