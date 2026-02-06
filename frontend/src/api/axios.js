import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// REQUEST → attach token
// ============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================
// RESPONSE → auto logout
// ============================
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
