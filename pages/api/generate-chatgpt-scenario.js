import { OpenAIStream } from 'nextjs-openai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { predefinedSteps } from '../../utils/predefinedSteps';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export default async function handler(req) {
  // Extract the `prompt` from the body of the request
  const { irExperience, securityMaturity, industrySector, complianceRequirements, stakeholderInvolvement } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
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
    ]
    
    const openaiResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    const stream = await OpenAIStream(openaiResponse);
    return res.send(stream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
