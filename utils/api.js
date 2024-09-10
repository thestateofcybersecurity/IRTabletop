import axios from 'axios';

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
    const response = await api.post('/generate-scenario', params);
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

    // Process the streaming response
    const lines = result.split('\n');
    let jsonString = '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(5);
        if (data === '[DONE]') break;
        jsonString += data;
      }
    }

    // Remove any non-JSON content at the start and end
    jsonString = jsonString.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

    // Attempt to parse the JSON
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Processed JSON string:', jsonString);
      throw new Error('Failed to parse scenario data');
    }
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    throw error;
  }
};

// Add other API calls here...

export default api;
