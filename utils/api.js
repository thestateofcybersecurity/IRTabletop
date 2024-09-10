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
    console.log('Sending request to generate ChatGPT scenario');
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

    console.log('Starting to read the stream');
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    console.log('Finished reading the stream:', result);

    // Remove any potential unwanted characters like '0:', '//' and rebuild into a valid JSON format
    result = result.replace(/0:"|\\n|\\/g, '').trim();

    // Ensure we have a valid response
    if (!result.trim()) {
      throw new Error('Received empty response from the server');
    }

    // Check if the result is complete and valid JSON
    if (!result.endsWith('}')) {
      throw new Error('Incomplete JSON response');
    }

    const jsonResult = JSON.parse(result);
    console.log('Successfully parsed JSON:', jsonResult);
    return jsonResult;

  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    throw error;
  }
};

// Add other API calls here...

export default api;
