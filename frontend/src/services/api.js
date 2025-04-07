import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
      const tokens = JSON.parse(authTokens);
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Blog posts API functions
export const getPosts = (page = 1) => {
  return axiosInstance.get(`posts/?page=${page}`);
};

export const getPost = (id) => {
  return axiosInstance.get(`posts/${id}/`);
};

export const createPost = (data) => {
  return axiosInstance.post('posts/', data);
};

export const updatePost = (id, data) => {
  return axiosInstance.put(`posts/${id}/`, data);
};

export const deletePost = (id) => {
  return axiosInstance.delete(`posts/${id}/`);
};

export default axiosInstance;