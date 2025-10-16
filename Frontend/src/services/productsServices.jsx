import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL; 
if (!rawBase) {
  throw new Error("Missing VITE_API_URL. Set it in Netlify env.");
}

const API_BASE = `${rawBase}${import.meta.env.VITE_API_PREFIX}`;

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
