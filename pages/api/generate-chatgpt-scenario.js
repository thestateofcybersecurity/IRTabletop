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
          content: 'You are a JSON generator. Your responses should always be in valid JSON format, with no additional text, formatting, or line breaks. Do not include any quotes around the entire JSON object.'
        },
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
          2. A detailed description of the incident (as an array of strings, each string being a paragraph)
          3. The attack vector used
          4. Potential business impact
          5. A list of 8 steps (Detection, Initial Evaluation, Containment, Forensics and Evidence Gathering, Notification and Stakeholder Involvement, Mitigation and Eradication, Recovery, and Post-Incident Review) for the tabletop exercise, each with:
           - A title
           - An initial question
           - Content (as an array of strings)
           - Recommendations (as a string)

          Format the response as a valid JSON object with the following structure:
          {
            "title": "string",
            "description": ["string", "string", ...],
            "attackVector": "string",
            "businessImpact": "string",
            "steps": [
              {
                "title": "string",
                "initialQuestion": "string",
                "content": ["string", "string", ...],
                "recommendations": "string"
              },
              ...
            ]
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
