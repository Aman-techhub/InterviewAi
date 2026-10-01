import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

const api = axios.create({
    baseURL: apiUrl ? `${apiUrl}/api` : "/api",
    withCredentials: true,
});

export default api;