import axios from "axios";

// Works in local + Docker without requiring Netlify env vars
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

const API_BASE = `${API_URL}${API_PREFIX}`;

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const getAllProducts = () => api.get("/products");
export const getProductBySKU = (sku) => api.get(`/sku/${encodeURIComponent(sku)}`);
export const newProduct = (product) => api.post("/products", product);
export const addStock = (sku, quantity) => api.put(`/sku/${encodeURIComponent(sku)}/add/${quantity}`);
export const removeStock = (sku, quantity) => api.put(`/sku/${encodeURIComponent(sku)}/remove/${quantity}`);
export const deleteProduct = (sku) => api.delete(`/sku/${encodeURIComponent(sku)}`);
