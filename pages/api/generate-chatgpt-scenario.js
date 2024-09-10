import fetch from 'node-fetch';

let lastRequestTime = 0;
const minTimeBetweenRequests = 20000; // 20 seconds

const fetchChatGPTResponse = async (prompt) => {
  const now = Date.now();
  if (now - lastRequestTime < minTimeBetweenRequests) {
    const delay = minTimeBetweenRequests - (now - lastRequestTime);
    console.log(`Rate limiting: Waiting for ${delay}ms before making the next request`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  try {
    console.log('Attempting to connect to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-2024-08-06",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 5000,
        temperature: 0.7
      })
    });

    lastRequestTime = Date.now();

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenAI API responded with status ${response.status}: ${errorBody}`);
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    console.log('Successfully connected to OpenAI API');
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in fetchChatGPTResponse:', error);
    throw new Error('Failed to connect to OpenAI API');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received request body:', req.body);
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
    5. A list of 8 steps (Detection, Initial Evaluation, Containment, Forensics and Evidence Gathering, Notification and Stakeholder Involvement, Mitigation and Eradication, Recovery, and Post-Incident Review) for the tabletop exercise, each with:
       - A title
       - An initial question
       - Content (as bullet points)
       - Recommendations
       - Discussion prompts

    You may use these details as a guide for what the output should look like for each steps:
      Step 1: Detection
      Initial Question: How was the attack detected?
      Recommendations:
      - Enhance monitoring and detection tools to reduce detection time.
      - Increase network visibility by deploying IDS/IPS or anomaly detection systems.
      - Regularly update threat intelligence feeds to ensure new threats are detected quickly.
      - Deploy endpoint detection and response (EDR) across critical systems to capture suspicious activities.
      Discussion Prompts:
      - What were the initial indicators of compromise (IoCs)?
      - Which systems or logs first showed signs of abnormal behavior?
      - Were there any patterns in the IoCs (malware signatures, unusual network traffic)?
      - Were any user-reported incidents part of the initial detection?
      - What tools or technologies identified these IoCs (SIEM, EDR)?
      - How did the team determine the severity of the incident?
      - Was there a formal process for determining incident severity?
      - Were factors such as data exposure, system impact, and critical assets considered?
      - How was the potential business impact factored into the severity assessment?
      - Was the severity classification adjusted as more information became available?
      Step 2: Initial Evaluation
      Initial Question: What was the initial response after detection?
      Recommendations:
      - Review and enhance the incident classification process.
      - Ensure clear ownership and responsibility for decision-making during the initial evaluation phase.
      - Ensure prompt communication with key stakeholders to expedite the evaluation process.
      Discussion Prompts:
      - How well did the communication flow during the incident?
      - Were any stakeholders left out?
      - Did the team follow established processes, or were any processes missed?
      - Were there any challenges in assessing the scope and impact of the incident initially?
      - How quickly was the incident response team mobilized after the initial evaluation?
      Step 3: Containment
      Initial Question: What actions were taken to contain the incident?
      Recommendations:
      - Test and improve containment procedures regularly through tabletop exercises.
      - Ensure that communication protocols between teams are optimized for efficiency.
      - Document all containment actions for forensic and legal purposes.
      - Develop and maintain an up-to-date asset inventory to facilitate rapid containment decisions.
      Discussion Prompts:
      - Were the containment measures effective in preventing further spread?
      - Did any communication issues delay or complicate containment?
      - Were additional vulnerabilities discovered during containment?
      - How did the containment actions impact business operations?
      - Were there any unintended consequences of the containment actions?
      Step 4: Forensics and Evidence Gathering
      Initial Question: What data and logs were collected for forensic analysis?
      Recommendations:
      - Conduct additional training on forensics tools and evidence collection.
      - Ensure all team members know how to maintain the chain of custody for evidence.
      - Simulate forensic analysis during tabletop exercises to enhance team proficiency.
      - Implement automated log collection and centralization to facilitate forensic analysis.
      - Develop relationships with external forensic experts for complex cases.
      Discussion Prompts:
      - What challenges did the team face during forensics?
      - Were any critical data sources (logs, system snapshots) missing or corrupted?
      - Was there enough documentation and tracking of forensic processes?
      - How effective were the forensic tools in analyzing the collected data?
      - Were there any legal or privacy considerations that impacted the forensic process?
      Step 5: Notification and Stakeholder Involvement
      Initial Question: Who was notified about the incident, and when?
      Recommendations:
      - Strengthen communication channels for better coordination between internal teams and external stakeholders.
      - Ensure legal and compliance teams are actively involved in notification processes.
      - Develop pre-approved communication templates for various incident scenarios.
      - Conduct regular training on crisis communication for key personnel.
      - Establish clear escalation paths and decision-making authority for notifications.
      Discussion Prompts:
      - How well did communication flow during the notification process?
      - Were any key stakeholders unaware of the incident until later stages?
      - How effective was the messaging in addressing stakeholder concerns?
      - Were there any reputational impacts from the notification process?
      - How were regulatory and legal requirements balanced with transparency?
      Step 6: Mitigation and Eradication
      Initial Question: How was the attack vector mitigated?
      Recommendations:
      - Regularly review mitigation techniques and test them in simulated environments.
      - Ensure backup strategies are resilient to malware attacks and tested regularly.
      - Perform post-mitigation testing to confirm all vulnerabilities have been closed.
      - Develop a process for tracking and verifying the completion of all mitigation actions.
      - Implement automated vulnerability scanning and patch management processes.
      Discussion Prompts:
      - Were any mitigation bypass attempts discovered?
      - How were they handled?
      - Did the mitigation create any further vulnerabilities or issues?
      - Were the mitigation steps sufficient to prevent further exploitation?
      - How was the trade-off between speed of mitigation and thoroughness managed?
      - Were there any challenges in implementing mitigations across different systems or environments?
      Step 7: Recovery
      Initial Question: What steps were taken to recover systems and restore business operations?
      Recommendations:
      - Review recovery workflows to ensure minimal downtime and test regularly.
      - Ensure that backups are regularly tested for integrity and ease of use in real incidents.
      - Strengthen disaster recovery and business continuity plans (BCP) to minimize business disruption.
      - Implement automated recovery processes where possible to reduce human error.
      - Develop and maintain detailed system configuration documentation to aid in recovery.
      Discussion Prompts:
      - What obstacles were faced during recovery?
      - Were there any delays in restoring systems due to untested backups?
      - Were recovery efforts prioritized based on business impact?
      - How effective was communication with end-users during the recovery process?
      - Were any opportunities for system or process improvements identified during recovery?
      Step 8: Post-Incident Review
      Initial Question: Conduct a blameless post-incident review (retrospective).
      Recommendations:
      - Ensure post-incident reviews focus on process improvement, not blame.
      - Document lessons learned and update the incident response plan accordingly.
      - Incorporate feedback from the team to improve future incident responses.
      - Conduct follow-up reviews to ensure recommended changes are implemented.
      - Share sanitized learnings across the organization to improve overall security posture.
      Discussion Prompts:
      - What lessons were learned from this incident?
      - What gaps were identified in the incident response playbook?
      - How can the response process be improved for future incidents?
      - Were there any 'near misses' or lucky breaks that prevented the incident from being worse?
      - How can the organization better support the incident response team in future events?
      - What additional training or resources would have been helpful during the incident?
      - How effective was the coordination between different teams (IT, security, legal, PR, etc)?
      - Were there any unexpected costs or impacts associated with the incident?
      - How can the organization improve its overall security posture to prevent similar incidents?

    Format the response as a JSON object.`;

    console.log('Sending prompt to OpenAI API');
    const generatedScenarioString = await fetchChatGPTResponse(prompt);
    console.log('Received response from OpenAI API');

    try {
      const generatedScenario = JSON.parse(generatedScenarioString);
      console.log('Successfully parsed JSON response');
      res.status(200).json(generatedScenario);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw response:', generatedScenarioString);
      res.status(500).json({ error: 'Error parsing scenario', details: parseError.message, rawResponse: generatedScenarioString });
    }
  } catch (error) {
    console.error('Error generating ChatGPT scenario:', error);
    if (error.message === 'Rate limit exceeded. Please try again later.') {
      res.status(429).json({ error: 'Rate limit exceeded', message: 'Please try again later' });
    } else {
      res.status(500).json({ error: 'Error generating scenario', details: error.message });
    }
  }
}
