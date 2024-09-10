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
    
    console.log('Finished reading the stream');

    // Ensure we have a valid response
    if (!result.trim()) {
      throw new Error('Received empty response from the server');
    }

    // Process the full result to extract the JSON
    let jsonString = result
      .split('\n') // Split the response by newlines
      .filter(line => line.startsWith('data:')) // Only keep the lines starting with "data:"
      .map(line => line.slice(5).trim()) // Remove the "data:" prefix and trim the line
      .join(''); // Recombine the JSON fragments into a full string

    console.log('Processed JSON string:', jsonString);

    // Verify if JSON string is complete and valid
    if (!jsonString.endsWith('}')) {
      throw new Error('Incomplete JSON response');
    }

    // Check for empty response
    if (!result.trim()) {
      throw new Error('Received empty response from the server');
    }

    // Parse the JSON once the stream is complete
    try {
      const jsonResult = JSON.parse(result.trim());
      console.log('Successfully parsed JSON:', jsonResult);
      return jsonResult;
    } catch (err) {
      console.error('JSON parsing error:', err);
      throw new Error('Incomplete JSON response received.');
    }

  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    throw error;
  }
};

// Add other API calls here...

export default api;
