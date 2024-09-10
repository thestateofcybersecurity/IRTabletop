import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const { irExperience, securityMaturity, industrySector, complianceRequirements, stakeholderInvolvement } = await req.json();

    const prompt = `Generate a unique incident response scenario for a tabletop exercise with the following details:
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
    5. A list of 8 steps (Detection, Initial Evaluation, Containment, Forensics and Evidence Gathering, Notification and Stakeholder Involvement, Mitigation and Eradication, Recovery, and Post-Incident Review) for the tabletop exercise, each with:
       - A title
       - An initial question
       - Content (as bullet points)
       - Recommendations
       - Discussion prompts

    Format the response as a valid JSON object.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // You can add any initialization logic here
      },
      onToken: async (token) => {
        // You can process each token here if needed
      },
      onCompletion: async (completion) => {
        // You can process the full completion here if needed
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    return new Response(JSON.stringify({ error: 'Error generating scenario', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
