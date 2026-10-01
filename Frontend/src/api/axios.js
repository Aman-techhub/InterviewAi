import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
}

const api = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true,
});

export default api;
