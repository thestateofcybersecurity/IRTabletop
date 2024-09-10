import axios from 'axios';
import { predefinedSteps } from './predefinedSteps';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const generateScenario = async (params) => {
  try {
    const response = await api.post('/pages/api/generate-scenario', params);
    return response.data;
  } catch (error) {
    console.error('Error generating scenario:', error);
    throw error;
  }
};

export const generateChatGPTScenario = async (params) => {
  try {
    const response = await axios.post('/api/generate-chatgpt-scenario', params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const generatedScenario = response.data;

    // Combine the generated scenario with predefined steps and input parameters
    const fullScenario = {
      ...generatedScenario,
      steps: predefinedSteps,
      ...params
    };

    return fullScenario;
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    throw error;
  }
};

// Add other API calls here...

export default api;
