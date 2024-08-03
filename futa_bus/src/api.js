import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL của server backend

const api = axios.create({
  baseURL: API_URL,
});

export default api;