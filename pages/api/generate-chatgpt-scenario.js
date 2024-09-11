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
          content: `Generate a new and unique incident response scenario for an incident response cybersecurity tabletop exercise, with real world data and with the following details:
          - IR Experience Level: ${irExperience}
          - Security Maturity: ${securityMaturity}
          - Industry Sector: ${industrySector}
          - Compliance Requirements: ${complianceRequirements}
          - Key Stakeholders: ${stakeholderInvolvement}
          - Organization Size: ${organizationSize}
          - Geographic Location: ${geographicLocation}
          - IT Infrastructure Complexity: ${infrastructureComplexity}
          - Third-Party Dependencies: ${thirdPartyDependencies}
          - Critical Business Functions: ${businessFunctions}
          - Risk Tolerance: ${riskTolerance}
          - Incident Response Team Structure: ${teamStructure}
          - Previous Incidents: ${previousIncidents}
          - Security Technology Stack: ${securityStack}
      
          Ensure that the scenario is adjusted based on the IR Experience Level and Security Maturity:
          - If the IR Experience Level or Security Maturity is low, provide detailed, over-explained instructions and break down the incident in simple terms as if explaining to someone with no technical background.
          - If the IR Experience Level or Security Maturity is high, provide more complex scenarios and assume some prior knowledge.

          Ensure that each stakeholder listed below influences the scenario by making decisions that affect how the incident response unfolds:
          - **CEO/Executive Leadership**: Focuses on business continuity, public perception, and long-term financial impact. They prioritize minimizing operational downtime but must also make decisions about informing stakeholders.
          - **Legal Team**: Focuses on regulatory compliance, potential lawsuits, and breach notifications. They may delay public or regulatory notification until the full impact is understood but must balance this with legal deadlines.
          - **Public Relations**: Manages public announcements and customer communications. They may want to release information early to preserve customer trust but must coordinate with legal and executives to craft messaging.
          - **IT and Security Teams**: Responsible for containing the breach, identifying its origin, and restoring affected systems. They may need to delay business recovery to prevent further damage but must communicate the technical details effectively to non-technical stakeholders.
          - **Compliance Officers**: Ensure the organization adheres to all regulatory requirements, including breach reporting and documentation. They may push for certain actions to avoid penalties and fines.
          - **Customer Service**: Manages direct communication with affected customers and must balance being transparent about the incident while reassuring customers.

          Ensure that compliance requirements, such as ${complianceRequirements}, influence the scenario by:
          - Incorporating legal obligations related to data breach reporting and regulatory fines.
          - Outlining the potential impact of non-compliance, including reputational damage and financial penalties.
          - Including compliance-related steps in the incident response, such as notifying regulators, documenting response efforts, and issuing breach notifications.
          - Describing how different stakeholders, including legal teams, compliance officers, and public relations teams, should be involved in the response.
                
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
