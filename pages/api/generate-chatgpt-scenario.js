import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

export const config = {
  runtime: 'edge',
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

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
    const { irExperience, securityMaturity, industrySector, complianceRequirements, stakeholderInvolvement } = await req.json();

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate a unique incident response scenario for a tabletop exercise with the following details:
          - IR Experience Level: ${irExperience}
          - Security Maturity: ${securityMaturity}
          - Industry Sector: ${industrySector}
          - Compliance Requirements: ${complianceRequirements}
          - Key Stakeholders: ${stakeholderInvolvement}

          The scenario should include:
          1. A title
          2. A detailed description of the incident
          3. The attack vector used
          4. Potential business impact

          Format the response as a valid JSON object with the following structure:
          {
            "title": "string",
            "description": "string",
            "attackVector": "string",
            "businessImpact": "string"
          }

          Ensure all string values are properly escaped. Do not include any text, numbers, or characters before or after the JSON object. The response should be a single, valid JSON object and nothing else.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    const stream = OpenAIStream(response);
    
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    return new Response(JSON.stringify({ error: 'Error generating scenario', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
