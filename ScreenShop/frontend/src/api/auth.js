import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/auth",
});

export const signup = (userData) => API.post("/register", userData);
export const login = (userData) => API.post("/login", userData);
