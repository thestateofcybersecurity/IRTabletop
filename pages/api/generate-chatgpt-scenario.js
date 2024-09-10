import { Configuration, OpenAIApi } from 'openai-edge';

export const config = {
  runtime: 'edge',
  maxDuration: 60, // Set to maximum allowed by your hosting platform
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
          role: 'system',
          content: 'You are a JSON generator. Your responses should always be in valid JSON format, with no additional text or formatting.'
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
           - Content (as bullet points)
           - Recommendations

          Format the response as a valid JSON object with the following structure:
          {
            "title": "string",
            "description": ["string", "string", ...],
            "attackVector": "string",
            "businessImpact": "string",
            "steps": "string"
          }

          Ensure all string values are properly escaped. The response should be a single, valid JSON object and nothing else.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const completion = await response.json();
    const generatedContent = completion.choices[0].message.content;

    // Attempt to parse the generated content as JSON
    let parsedScenario;
    try {
      parsedScenario = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Error parsing generated content:', parseError);
      console.error('Generated content:', generatedContent);
      return new Response(JSON.stringify({ error: 'Failed to generate valid JSON scenario' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate the structure of the parsed scenario
    const requiredKeys = ['title', 'description', 'attackVector', 'businessImpact'];
    for (const key of requiredKeys) {
      if (!(key in parsedScenario)) {
        return new Response(JSON.stringify({ error: `Generated scenario is missing required key: ${key}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Ensure description is an array
    if (!Array.isArray(parsedScenario.description)) {
      parsedScenario.description = [parsedScenario.description];
    }

    return new Response(JSON.stringify(parsedScenario), {
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
