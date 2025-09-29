import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/products";
const api = axios.create({
    baseURL: REST_API_BASE_URL,
    headers: { "Content-Type": "application/json" }
  });



export const getAllProducts = () => {
    return api.get(REST_API_BASE_URL);
}
export const getProductById = (sku) => {
    return api.get(REST_API_BASE_URL + "/sku/" + sku);
}
export const newProduct = (product) => {
   
    return api.post(REST_API_BASE_URL, product);
   

}

export const addStock = (sku, quantity) => {
    return api.put(REST_API_BASE_URL + "/sku/" + sku + "/add/" + quantity);
}

export const removeStock = (sku, quantity) => {
    return api.put(REST_API_BASE_URL + "/sku/" + sku + "/remove/" + quantity);
}