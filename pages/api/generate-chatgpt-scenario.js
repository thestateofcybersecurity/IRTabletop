import { OpenAIStream, StreamingTextResponse } from 'nextjs-openai';

// IMPORTANT! Set the runtime to edge
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { irExperience, securityMaturity, industrySector, complianceRequirements, stakeholderInvolvement } = await req.json();

    const stream = await OpenAIStream({
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

          Ensure all string values are properly escaped.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    return new Response(JSON.stringify({ error: 'Error generating scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
