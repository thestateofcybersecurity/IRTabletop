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
    const response = await fetch('/api/generate-chatgpt-scenario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    // Parse the JSON response
    let generatedScenario;
    try {
      generatedScenario = JSON.parse(result);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Raw response:', result);
      throw new Error('Failed to parse scenario data');
    }

    // Ensure description is an array
    if (!Array.isArray(generatedScenario.description)) {
      generatedScenario.description = [generatedScenario.description];
    }

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
