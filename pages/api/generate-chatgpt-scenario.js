import { Configuration, OpenAIApi } from 'openai';
import { predefinedSteps } from '../../utils/predefinedSteps';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { irExperience, securityMaturity, industrySector, complianceRequirements, stakeholderInvolvement } = req.body;

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
    }

    Ensure all string values are properly escaped.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    const generatedScenario = JSON.parse(response.data.choices[0].message.content);

    const fullScenario = {
      ...generatedScenario,
      steps: predefinedSteps,
      irExperience,
      securityMaturity,
      industrySector,
      complianceRequirements,
      stakeholderInvolvement,
    };

    res.status(200).json(fullScenario);
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    res.status(500).json({ error: 'Error generating scenario', details: error.message });
  }
}
