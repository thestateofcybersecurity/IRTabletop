// Use fetch directly instead of relying on OpenAI class from nextjs-openai
import { Configuration, OpenAIApi } from 'openai';  // Import from standard openai package

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

    // Define the prompt based on the user input
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
    
    Format the response as a valid JSON object with the following structure:
    {
      "title": "string",
      "description": "string",
      "attackVector": "string",
      "businessImpact": "string"
    }`;

    // Use the OpenAI package for making requests
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,  // Ensure the API key is correctly set
    });

    const openai = new OpenAIApi(configuration);

    // Call the OpenAI API
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      prompt,
      max_tokens: 5000,
      temperature: 0.7,
    });

    // Extract the generated text from the API response
    const generatedScenario = response.data.choices[0].text.trim();

    // Return the result as a JSON response
    return new Response(JSON.stringify(generatedScenario), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    return new Response(JSON.stringify({ error: 'Error generating scenario', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
