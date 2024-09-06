export default function TabletopGuide({ scenario }) {
  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tabletop Exercise Guide</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-2">Scenario: {scenario.title}</h3>
        <p className="mb-4">{scenario.description}</p>

        <h4 className="text-lg font-semibold mb-2">Tactic:</h4>
        <p className="mb-4">{scenario.tactic.name}</p>

        <h4 className="text-lg font-semibold mb-2">Technique:</h4>
        <p className="mb-4">{scenario.technique.name}</p>

        <h4 className="text-lg font-semibold mb-2">Mitigation:</h4>
        <p className="mb-4">{scenario.mitigation.name}</p>

        <h4 className="text-lg font-semibold mb-2">Incident Response Experience Level:</h4>
        <p className="mb-4">{scenario.irExperience}</p>

        <h4 className="text-lg font-semibold mb-2">Security Maturity:</h4>
        <p className="mb-4">{scenario.securityMaturity}</p>

        <h4 className="text-lg font-semibold mb-2">Industry Sector:</h4>
        <p className="mb-4">{scenario.industrySector}</p>

        <h4 className="text-lg font-semibold mb-2">Incident Type:</h4>
        <p className="mb-4">{scenario.incidentType}</p>

        <h4 className="text-lg font-semibold mb-2">Attack Target:</h4>
        <p className="mb-4">{scenario.attackTarget}</p>

        {scenario.complianceRequirements && (
          <>
            <h4 className="text-lg font-semibold mb-2">Compliance Requirements:</h4>
            <p className="mb-4">{scenario.complianceRequirements}</p>
          </>
        )}

        {scenario.stakeholderInvolvement && (
          <>
            <h4 className="text-lg font-semibold mb-2">Stakeholder Involvement:</h4>
            <p className="mb-4">{scenario.stakeholderInvolvement}</p>
          </>
        )}

        <h4 className="text-lg font-semibold mb-2">Tabletop Walkthrough Instructions:</h4>
          <ol className="mb-4 list-decimal pl-6">
          <li className="mb-2">
            **Step 1: Detection**: Discuss the detection method. How was the attack detected? Discuss monitoring systems, logs, and alerts. 
            - **Prompts**: What triggered the alert? How could the detection have been improved? Did we rely on internal detection, or was it external (third-party alert, customer notification)?
          </li>
          
          <li className="mb-2">
            **Step 2: Initial Evaluation**: Assess the incident’s severity and potential impact. Does this qualify as a major incident? Who makes this decision?
            - **Prompts**: What criteria do we use to evaluate the severity? Is the team clear on the incident classification levels (minor, major, critical)? Should this be escalated?
          </li>

          <li className="mb-2">
            **Step 3: Containment**: Describe the containment actions. What’s the first thing you would do to stop the spread of the attack?
            - **Prompts**: Is network isolation necessary? Should affected systems be taken offline? What’s the impact of containment on business operations?
            - **Subtask**: Simulate communication breakdowns or misconfigurations that delay containment.
          </li>

          <li className="mb-2">
            **Step 4: Forensics and Evidence Gathering**: Discuss the methods used for collecting forensic evidence (logs, memory captures, disk images, etc.). How would you ensure that evidence is preserved for a post-mortem?
            - **Prompts**: How would you ensure the integrity of evidence (chain of custody)? What tools are used for forensic analysis? What data do you prioritize gathering first?
          </li>

          <li className="mb-2">
            **Step 5: Notification and Stakeholder Involvement**: Review the internal and external notifications required.
            - **Prompts**: At what point should stakeholders be notified? Who should be notified first (C-Suite, PR, Legal, Partners)? Are there regulatory obligations (e.g., GDPR, HIPAA)?
          </li>

          <li className="mb-2">
            **Step 6: Mitigation and Eradication**: Implement the mitigation strategy. How will you ensure that the attack vector is eliminated?
            - **Prompts**: What steps will you take to remove the attacker’s foothold? How will you test that the mitigation has been successful? Could there be hidden backdoors left behind?
          </li>

          <li className="mb-2">
            **Step 7: Recovery**: Define recovery steps and how to bring systems back online safely.
            - **Prompts**: What is the recovery process? Will systems be restored from backups, or should they be reimaged? How will you ensure systems are secure before returning them to production?
          </li>

          <li className="mb-2">
            **Step 8: Post-Incident Review**: Conduct a post-incident review (or blameless retrospective). What worked well? What areas need improvement?
            - **Prompts**: How was the communication between team members? Were the detection and response processes clear? What gaps were identified in tooling, policies, or processes?
          </li>
        </ol>

        <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
        <ul className="mb-4 list-disc pl-6">
          <li className="mb-2">What were the initial indicators of compromise?</li>
          <li className="mb-2">How did the team determine the severity of the incident?</li>
          <li className="mb-2">Were the containment measures effective in preventing further spread?</li>
          <li className="mb-2">What challenges did the team face during forensics?</li>
          <li className="mb-2">How well did communication flow during the incident? Were any stakeholders left out?</li>
          <li className="mb-2">Did the team follow established processes, or were any processes missed?</li>
          <li className="mb-2">Was evidence collected properly and preserved for legal and forensic review?</li>
          <li className="mb-2">How quickly were systems recovered, and was the recovery process smooth?</li>
          <li className="mb-2">What improvements can be made to the incident response process for future incidents?</li>
          <li className="mb-2">Was there sufficient clarity around decision-making during the incident? Was there confusion about roles?</li>
          <li className="mb-2">What additional tools or training might be needed to improve response times?</li>
          <li className="mb-2">What lessons can we learn about prioritizing critical systems during a containment?</li>
          <li className="mb-2">How did regulatory or compliance requirements impact the response?</li>
          <li className="mb-2">Was the post-incident review conducted in a blameless and constructive manner?</li>
          <li className="mb-2">How would this incident affect our external reputation (public relations)?</li>
        </ul>

        <h4 className="text-lg font-semibold mb-2">Next Steps and Recommendations:</h4>
        <ul className="mb-4 list-disc pl-6">
          <li className="mb-2">Enhance monitoring and detection tools to reduce detection time.</li>
          <li className="mb-2">Conduct additional training on forensics tools and evidence collection.</li>
          <li className="mb-2">Update incident response policies to reflect lessons learned during the exercise.</li>
          <li className="mb-2">Evaluate the effectiveness of communication between different teams and stakeholders.</li>
          <li className="mb-2">Ensure clear ownership and responsibility for decision-making in incident response teams.</li>
          <li className="mb-2">Review and update system recovery processes to ensure minimal downtime.</li>
          <li className="mb-2">Strengthen the organization’s compliance and regulatory response to security incidents.</li>
        </ul>
      </div>
    </div>
  );
}
