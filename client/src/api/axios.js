import axios from "axios";

const API = axios.create({
  baseURL: "https://shophub-41ca.onrender.com/api",
});

export default API;