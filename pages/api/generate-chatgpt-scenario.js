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
    const { irExperience, securityMaturity, industrySector, complianceRequirements, stakeholderInvolvement } = await req.json();

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a JSON generator. Your responses should always be in valid JSON format, with no additional text, formatting, or characters before or after the JSON object. Do not include any quotes around the entire JSON object or any trailing characters after the closing brace.'
        },
        {
          role: 'user',
          content: `Generate a unique incident response scenario for a tabletop exercise with the following details:
          - IR Experience Level: ${irExperience}
          - Security Maturity: ${securityMaturity}
          - Industry Sector: ${industrySector}
          - Compliance Requirements: ${complianceRequirements}
          - Key Stakeholders: ${stakeholderInvolvement}
      
          Ensure that the scenario is adjusted based on the IR Experience Level and Security Maturity:
          - If the IR Experience Level or Security Maturity is low, provide detailed, over-explained instructions and break down the incident in simple terms as if explaining to someone with no technical background.
          - If the IR Experience Level or Security Maturity is high, provide more complex scenarios and assume some prior knowledge.
      
          The scenario should include:
          1. A title.
          2. A detailed description of the incident (as an array of strings, each string being a paragraph). If the experience level or maturity is low, explain each step thoroughly, including what the attackers are doing, why they are doing it, and how it impacts the organization. Use clear and simple language as if explaining to someone who knows nothing about cybersecurity. For higher experience levels, you can use more advanced terminology and expect some understanding.
          3. The attack vector used. Make sure the attack vector is realistic for the industry and highlight why this method was chosen by the attacker. Explain how the attack vector exploits potential vulnerabilities, especially for lower security maturity.
          4. Potential business impact. Tailor the business impact explanation to compliance requirements and stakeholder involvement. For lower experience levels, explain why the potential impacts are severe, what the consequences might be, and why it's important to address these issues promptly. For higher experience levels, focus on regulatory impacts, loss of customer trust, and financial implications.
      
          Format the response as a valid JSON object with the following structure:
          {
            "title": "string",
            "description": ["string", "string", ...],
            "attackVector": "string",
            "businessImpact": "string"
          }
      
          Ensure all string values are properly escaped. The response should be a single, valid JSON object and nothing else.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    // Transform the response into a readable stream
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    return new Response(JSON.stringify({ error: 'Error generating scenario', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
