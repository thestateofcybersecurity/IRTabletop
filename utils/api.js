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

    // Clean up the result
    result = result.replace(/^\d+:/gm, '');  // Remove number prefixes
    result = result.replace(/\\n/g, '');     // Remove escaped newlines
    result = result.replace(/\\/g, '');      // Remove remaining backslashes
    result = result.replace(/"\s+"/g, '');   // Remove spaces between quotes
    result = result.replace(/\s+/g, ' ');    // Replace multiple spaces with single space
    result = result.replace(/^"|"$/g, '');   // Remove leading and trailing quotes
    result = result.trim();                  // Trim whitespace
    result = result.replace(/}"+$/, '}');    // Remove any trailing quotes after the closing brace

    console.log('Cleaned response:', result);

    // Attempt to parse the JSON
    let generatedScenario;
    try {
      generatedScenario = JSON.parse(result);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Cleaned response:', result);
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

export const getChatGPTResponse = async (scenario, currentStep, prompt) => {
  try {
    const response = await fetch('/api/chatgpt-prompt-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario,
        currentStep,
        prompt,
      }),
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

    // Parse and clean the result
    const cleanedResult = parseStreamResponse(result);
    return cleanedResult;
  } catch (error) {
    console.error('Error getting ChatGPT response:', error);
    throw error;
  }
};

// Helper function to parse and clean the stream response
function parseStreamResponse(response) {
  // Split the response into lines
  const lines = response.split('\n');
  
  // Initialize an empty array to store the cleaned words
  let cleanedWords = [];
  
  // Process each line
  for (const line of lines) {
    // Split the line by the colon character
    const parts = line.split(':');
    
    // If there are at least two parts (number and word)
    if (parts.length >= 2) {
      // Get the word part (everything after the first colon)
      const word = parts.slice(1).join(':').trim();
      
      // If the word is not empty, add it to the cleaned words array
      if (word) {
        cleanedWords.push(word);
      }
    }
  }
  
  // Join the cleaned words into a single string
  return cleanedWords.join(' ');
}

// Add other API calls here...

export default api;
