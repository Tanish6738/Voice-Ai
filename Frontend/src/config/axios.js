import axios from "axios";

// When bundled by Vite, import.meta.env is available; when imported directly by Node (e.g., tests) fallback.
const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:3000/api";

const api = axios.create({ baseURL });

export default api;
