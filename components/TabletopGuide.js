export default function TabletopGuide({ scenario, roles, addAction, inject }) {
  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tabletop Exercise Guide</h2>

      {/* Random Inject Display */}
      {inject && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <strong>Random Inject:</strong> {inject.description}
        </div>
      )}

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
          {/* Expanded Questions and Steps */}
          <li className="mb-2">
            <strong>Step 1: Detection</strong>: How was the attack detected? 
            <ul className="list-disc pl-6">
              <li>What monitoring systems provided the first alert? (e.g., SIEM, EDR, IDS/IPS)</li>
              <li>Was the detection internal or external (e.g., customer or partner reported the issue)?</li>
              <li>How long after the compromise was the attack detected?</li>
              <li>What indicators of compromise (IoCs) were observed?</li>
              <li>Could earlier detection have prevented the breach?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Discussed detection methods.', actor: roles['Security Analyst'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 2: Initial Evaluation</strong>: What was the initial response after detection?
            <ul className="list-disc pl-6">
              <li>Who was notified first (e.g., Incident Commander, SOC Team)?</li>
              <li>What criteria were used to classify the incident (critical, major, minor)?</li>
              <li>Was there any immediate triage or analysis done before escalation?</li>
              <li>What priority level was assigned to the incident?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Evaluated incident severity.', actor: roles['Incident Commander'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 3: Containment</strong>: What actions were taken to contain the incident?
            <ul className="list-disc pl-6">
              <li>Which systems were isolated to prevent the spread of the attack?</li>
              <li>What communication channels were used to coordinate containment?</li>
              <li>Were backup or redundant systems engaged?</li>
              <li>Was there a decision to monitor the attacker further before containment, and why?</li>
              <li>Was the containment fully successful, or were there breaches after the containment was applied?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Described containment actions.', actor: roles['Network Engineer'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 4: Forensics and Evidence Gathering</strong>: What data and logs were collected for forensic analysis?
            <ul className="list-disc pl-6">
              <li>Were memory snapshots, disk images, or log files collected?</li>
              <li>What forensic tools were used (e.g., FTK, EnCase, open-source tools)?</li>
              <li>Was evidence collected in a forensically sound manner to preserve integrity (chain of custody)?</li>
              <li>What artifacts were prioritized for collection (network traffic, file changes, etc.)?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Collected forensic evidence.', actor: roles['Forensic Investigator'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 5: Notification and Stakeholder Involvement</strong>: Who was notified about the incident, and when?
            <ul className="list-disc pl-6">
              <li>Which internal and external stakeholders were notified (e.g., Legal, PR, C-Suite)?</li>
              <li>Were customers or partners impacted, and were they notified?</li>
              <li>Was there a regulatory requirement to disclose the breach (GDPR, HIPAA, etc.)?</li>
              <li>Were law enforcement agencies involved in the response?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Notified stakeholders.', actor: roles['Legal Advisor'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 6: Mitigation and Eradication</strong>: How was the attack vector mitigated?
            <ul className="list-disc pl-6">
              <li>What mitigation steps were taken (e.g., patching, reconfiguration, removing malware)?</li>
              <li>Was a fix tested in a non-production environment before deployment?</li>
              <li>Were any bypasses attempted or successful against the mitigation?</li>
              <li>How was the success of the mitigation verified?</li>
              <li>Was there any residual risk after mitigation, and how was it addressed?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Mitigated the attack vector.', actor: roles['Security Engineer'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 7: Recovery</strong>: What steps were taken to recover systems and restore business operations?
            <ul className="list-disc pl-6">
              <li>Were systems restored from backups, or were new systems built?</li>
              <li>What was the time required for full recovery?</li>
              <li>Were there challenges in restoring services (e.g., data corruption, configuration issues)?</li>
              <li>Was there any communication with customers about the recovery process?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Recovered systems and services.', actor: roles['Recovery Manager'] })}>
              Mark as Completed
            </button>
          </li>

          <li className="mb-2">
            <strong>Step 8: Post-Incident Review</strong>: Conduct a blameless post-incident review (retrospective).
            <ul className="list-disc pl-6">
              <li>What worked well during the response?</li>
              <li>What areas need improvement?</li>
              <li>Were there any major communication breakdowns?</li>
              <li>Did the tools and processes in place meet the team’s needs?</li>
              <li>What gaps were identified in detection, response, or recovery?</li>
            </ul>
            <button className="ml-4 text-blue-500" onClick={() => addAction({ description: 'Conducted post-incident review.', actor: roles['Incident Commander'] })}>
              Mark as Completed
            </button>
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
