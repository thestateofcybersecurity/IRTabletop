// File: pages/api/chatgpt-prompt-response.js

import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const config = {
  runtime: 'edge',
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { scenario, currentStep, prompt } = await req.json();

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in cybersecurity incident response. Provide detailed and insightful responses to questions about a tabletop exercise scenario.'
        },
        {
          role: 'user',
          content: `Given the following scenario:
          ${JSON.stringify(scenario)}

          For the step "${currentStep.title}", respond to this prompt:
          ${prompt}

          Provide a detailed and contextual response based on the scenario and the current step.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating ChatGPT response:', error);
    return new Response(JSON.stringify({ error: 'Error generating response', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
