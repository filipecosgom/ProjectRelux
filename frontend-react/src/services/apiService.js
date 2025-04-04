import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { userStore } from "../stores/UserStore";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autenticação, se disponível
api.interceptors.request.use((config) => {
  const token = userStore.getState().token; // Obtém o token da store
  if (token) {
    config.headers.Authorization = token; // Adiciona o token ao header
  }
  return config;
});

export default api;
