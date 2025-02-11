import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/user')
};

export const blog = {
  getPosts: (page = 1, limit = 9) => api.get(`/blog?page=${page}&limit=${limit}`),
  createPost: (formData) => {
    const token = localStorage.getItem('token');
    console.log('Token in createPost:', token); // Debug log
    
    return api.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },
  updatePost: (id, formData) => api.put(`/blog/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deletePost: (id) => api.delete(`/blog/${id}`)
};

export default api; 