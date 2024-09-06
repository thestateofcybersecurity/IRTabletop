import { useState, useEffect } from 'react';
import { getRandomInject } from './Injects';

export default function TabletopGuide({ scenario, addAction }) {
  const [currentInject, setCurrentInject] = useState(null);

  useEffect(() => {
    // Get a new random inject every 5 minutes
    const injectInterval = setInterval(() => {
      const newInject = getRandomInject();
      setCurrentInject(newInject);
      addAction({
        description: `New inject: ${newInject.description}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(injectInterval);
  }, [addAction]);

  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  const renderSection = (title, content) => (
    <>
      <h4 className="text-lg font-semibold mb-2">{title}:</h4>
      <p className="mb-4">{content || 'Not specified'}</p>
    </>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tabletop Exercise Guide</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-2">Scenario: {scenario.title}</h3>
        <p className="mb-4">{scenario.description}</p>

        {renderSection('Tactic', scenario.tactic?.name)}
        {renderSection('Technique', scenario.technique?.name)}
        {renderSection('Mitigation', scenario.mitigation?.name)}
        {renderSection('IR Experience Level', scenario.irExperience)}
        {renderSection('Security Maturity', scenario.securityMaturity)}
        {renderSection('Industry Sector', scenario.industrySector)}
        {renderSection('Incident Type', scenario.incidentType)}
        {renderSection('Incident Severity', scenario.incidentSeverity)}
        {renderSection('Team Size', scenario.teamSize)}

      {currentInject && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <strong>Random Inject:</strong> {currentInject.description}
        </div>
      )}

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
            <button className="ml-4 text-blue-500" onClick={() => handleActionComplete('Discussed detection methods.', roles['Security Analyst'])}>
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
  <li className="mb-2">What were the initial indicators of compromise (IoCs)? 
    <ul class="list-disc pl-6">
      <li>Which systems or logs first showed signs of abnormal behavior?</li>
      <li>Were there any patterns in the IoCs (e.g., malware signatures, unusual network traffic)?</li>
      <li>Were any user-reported incidents part of the initial detection?</li>
      <li>What tools or technologies identified these IoCs (e.g., SIEM, EDR)?</li>
    </ul>
  </li>
  
  <li className="mb-2">How did the team determine the severity of the incident? 
    <ul class="list-disc pl-6">
      <li>Was there a formal process for determining incident severity?</li>
      <li>Were factors such as data exposure, system impact, and critical assets considered?</li>
      <li>How was the potential business impact factored into the severity assessment?</li>
      <li>Was the severity classification adjusted as more information became available?</li>
    </ul>
  </li>
  
  <li className="mb-2">Were the containment measures effective in preventing further spread? 
    <ul class="list-disc pl-6">
      <li>Which specific measures were implemented (e.g., network isolation, user lockout)?</li>
      <li>Was there any sign of lateral movement after containment actions were taken?</li>
      <li>Were any additional vulnerabilities discovered during containment?</li>
      <li>Did any communication issues delay or complicate containment?</li>
    </ul>
  </li>

  <li className="mb-2">What challenges did the team face during forensics? 
    <ul class="list-disc pl-6">
      <li>Were any critical data sources (logs, system snapshots) missing or corrupted?</li>
      <li>Were there any difficulties in acquiring or preserving evidence?</li>
      <li>Did the team encounter technical challenges with forensic tools?</li>
      <li>Was there enough documentation and tracking of forensic processes?</li>
    </ul>
  </li>

  <li className="mb-2">How well did communication flow during the incident? Were any stakeholders left out? 
    <ul class="list-disc pl-6">
      <li>Was there a clear chain of communication established at the onset of the incident?</li>
      <li>How effectively were external stakeholders, such as customers and vendors, informed?</li>
      <li>Were there any issues with keeping upper management or board members updated?</li>
      <li>Were any key stakeholders unaware of the incident until later stages?</li>
    </ul>
  </li>

  <li className="mb-2">Did the team follow established processes, or were any processes missed? 
    <ul class="list-disc pl-6">
      <li>Was the incident response playbook followed, and if not, why?</li>
      <li>Were there any deviations from the response protocols?</li>
      <li>Did the team overlook any critical steps (e.g., stakeholder notification, legal reviews)?</li>
      <li>Was the reason for any missed process due to unclear roles or lack of training?</li>
    </ul>
  </li>

  <li className="mb-2">Was evidence collected properly and preserved for legal and forensic review? 
    <ul class="list-disc pl-6">
      <li>Were there appropriate chain-of-custody procedures in place for collected evidence?</li>
      <li>Was evidence collected in a way that would be admissible in a legal case?</li>
      <li>Were forensic images taken of compromised systems to avoid data tampering?</li>
      <li>Was there an audit trail maintained for all forensic activities?</li>
    </ul>
  </li>

  <li className="mb-2">How quickly were systems recovered, and was the recovery process smooth? 
    <ul class="list-disc pl-6">
      <li>Were there any delays in restoring systems due to untested backups or other issues?</li>
      <li>Were recovery efforts prioritized based on business impact (e.g., restoring critical systems first)?</li>
      <li>Was there proper testing of systems post-recovery to ensure they were secure?</li>
      <li>How was user access and business operations affected during recovery?</li>
    </ul>
  </li>

  <li className="mb-2">What improvements can be made to the incident response process for future incidents? 
    <ul class="list-disc pl-6">
      <li>Were there any identified gaps in tools, processes, or people that delayed response?</li>
      <li>Did any particular steps or procedures slow down containment or recovery?</li>
      <li>Were all team members adequately trained for their roles in the incident response?</li>
      <li>Were there any tools or processes that were insufficient or outdated?</li>
    </ul>
  </li>

  <li className="mb-2">Was there sufficient clarity around decision-making during the incident? Was there confusion about roles? 
    <ul class="list-disc pl-6">
      <li>Were decisions centralized around the Incident Commander or decentralized?</li>
      <li>Was there any confusion about who had the authority to make decisions at key moments?</li>
      <li>Did team members understand their roles and responsibilities?</li>
      <li>Were any decisions delayed because of unclear communication or leadership gaps?</li>
    </ul>
  </li>

  <li className="mb-2">What additional tools or training might be needed to improve response times? 
    <ul class="list-disc pl-6">
      <li>Were there any tools that were insufficient for detection or response?</li>
      <li>Would additional training for forensic tools or malware analysis have sped up the response?</li>
      <li>Did the team lack visibility into certain parts of the network or infrastructure?</li>
      <li>Were there any collaboration tools or systems that could have improved communication?</li>
    </ul>
  </li>

  <li className="mb-2">What lessons can we learn about prioritizing critical systems during a containment? 
    <ul class="list-disc pl-6">
      <li>Were critical systems prioritized correctly for protection and containment?</li>
      <li>Did the business experience any significant downtime due to incorrect prioritization?</li>
      <li>What additional measures could have been taken to protect mission-critical assets?</li>
      <li>Were there any surprises in the dependencies between systems?</li>
    </ul>
  </li>

  <li className="mb-2">How did regulatory or compliance requirements impact the response? 
    <ul class="list-disc pl-6">
      <li>Were there legal or regulatory deadlines that influenced the speed of response?</li>
      <li>Was there sufficient documentation to meet compliance requirements (e.g., GDPR, HIPAA)?</li>
      <li>Did the legal team provide adequate guidance on disclosure obligations?</li>
      <li>Were third-party vendors or clients informed in compliance with regulations?</li>
    </ul>
  </li>

  <li className="mb-2">Was the post-incident review conducted in a blameless and constructive manner? 
    <ul class="list-disc pl-6">
      <li>Did the review focus on process improvement instead of assigning blame?</li>
      <li>Were all team members given the opportunity to provide feedback?</li>
      <li>Were lessons learned documented for future improvement?</li>
      <li>Was the review used as an opportunity to train the team and close process gaps?</li>
    </ul>
  </li>

  <li className="mb-2">How would this incident affect our external reputation (public relations)? 
    <ul class="list-disc pl-6">
      <li>Was there any media coverage or social media exposure of the incident?</li>
      <li>Did the PR team have a strategy in place for responding to public concerns?</li>
      <li>Was there any customer fallout from the incident (e.g., loss of trust, churn)?</li>
      <li>Were stakeholders reassured about the steps taken to contain and recover from the incident?</li>
    </ul>
  </li>
</ul>

        <h4 className="text-lg font-semibold mb-2">Next Steps and Recommendations:</h4>
        <ul className="mb-4 list-disc pl-6">
 <li className="mb-2">Enhance monitoring and detection tools to reduce detection time.
    <ul class="list-disc pl-6">
      <li>Implement better SIEM rules to catch earlier indicators of compromise.</li>
      <li>Increase network visibility by deploying IDS/IPS or anomaly detection systems.</li>
      <li>Regularly update threat intelligence feeds to ensure new threats are detected quickly.</li>
      <li>Deploy endpoint detection and response (EDR) across critical systems to capture suspicious activities.</li>
      <li>Use automated alerting and correlation tools to minimize detection delays.</li>
    </ul>
  </li>

  <li className="mb-2">Conduct additional training on forensics tools and evidence collection.
    <ul class="list-disc pl-6">
      <li>Schedule regular hands-on training sessions for forensic tools (e.g., FTK, EnCase, open-source tools).</li>
      <li>Provide training on the legal and regulatory aspects of forensic evidence preservation.</li>
      <li>Simulate forensic analysis during tabletop exercises to enhance team proficiency.</li>
      <li>Ensure all team members know how to maintain chain of custody for evidence.</li>
    </ul>
  </li>

  <li className="mb-2">Update incident response policies to reflect lessons learned during the exercise.
    <ul class="list-disc pl-6">
      <li>Revise the incident classification and escalation policies to streamline decision-making.</li>
      <li>Incorporate new procedures for containment and recovery into the response playbook.</li>
      <li>Document best practices discovered during the exercise and share them with the team.</li>
      <li>Ensure that the post-incident review process is formalized and part of every incident response.</li>
    </ul>
  </li>

  <li className="mb-2">Evaluate the effectiveness of communication between different teams and stakeholders.
    <ul class="list-disc pl-6">
      <li>Perform a communication audit to identify delays or miscommunication points during the incident.</li>
      <li>Review how internal and external communications were handled and identify gaps.</li>
      <li>Test and improve communication protocols between the SOC, legal, and executive teams.</li>
      <li>Ensure that crisis communication templates and contact lists are always up to date.</li>
    </ul>
  </li>

  <li className="mb-2">Ensure clear ownership and responsibility for decision-making in incident response teams.
    <ul class="list-disc pl-6">
      <li>Clearly define the role of Incident Commander and assign authority for critical decisions.</li>
      <li>Ensure that each role (forensics, containment, communications) has an assigned lead with decision-making power.</li>
      <li>Use role-based incident response templates to clarify tasks and responsibilities for all team members.</li>
      <li>Evaluate decision logs to see if there were delays or disputes in responsibilities during the incident.</li>
    </ul>
  </li>

  <li className="mb-2">Review and update system recovery processes to ensure minimal downtime.
    <ul class="list-disc pl-6">
      <li>Test recovery procedures in a controlled environment to identify potential issues.</li>
      <li>Ensure that backups are regularly tested for integrity and ease of use in real incidents.</li>
      <li>Prioritize critical systems for faster recovery and ensure that failover mechanisms are well-documented.</li>
      <li>Enhance automation in recovery workflows to minimize human intervention during an incident.</li>
    </ul>
  </li>

  <li className="mb-2">Strengthen the organization’s compliance and regulatory response to security incidents.
    <ul class="list-disc pl-6">
      <li>Review regulatory requirements (e.g., GDPR, CCPA, HIPAA) to ensure that response timelines are met.</li>
      <li>Conduct mock compliance audits to ensure that all evidence and documentation are properly maintained.</li>
      <li>Ensure that all legal and compliance team members are trained on incident disclosure requirements.</li>
      <li>Develop clear policies on when and how to involve law enforcement and regulatory bodies during incidents.</li>
    </ul>
  </li>

  <li className="mb-2">Implement automated incident response tools to accelerate detection, containment, and recovery.
    <ul class="list-disc pl-6">
      <li>Use SOAR (Security Orchestration, Automation, and Response) platforms to automate repetitive tasks.</li>
      <li>Automate the collection and analysis of logs, alerts, and forensic data to improve response time.</li>
      <li>Leverage machine learning for anomaly detection and predictive threat analysis.</li>
      <li>Set up automated containment workflows that isolate compromised systems immediately.</li>
    </ul>
  </li>

  <li className="mb-2">Improve collaboration and coordination with third-party vendors and external security partners.
    <ul class="list-disc pl-6">
      <li>Ensure third-party security vendors are integrated into your incident response plans.</li>
      <li>Conduct joint incident response simulations with key external partners (e.g., cloud service providers).</li>
      <li>Review contracts and service level agreements (SLAs) to ensure they reflect your current security posture.</li>
      <li>Verify that external parties can quickly be notified and assist in an emergency, including during off-hours.</li>
    </ul>
  </li>

  <li className="mb-2">Strengthen disaster recovery and business continuity plans (BCP) to minimize business disruption.
    <ul class="list-disc pl-6">
      <li>Test business continuity and disaster recovery plans under various attack scenarios (e.g., ransomware, DDoS).</li>
      <li>Ensure that business-critical processes have redundancies and failover mechanisms.</li>
      <li>Update BCP to account for new risks identified during the tabletop exercise.</li>
      <li>Integrate response and recovery plans with external partners who are critical to business operations.</li>
    </ul>
  </li>

  <li className="mb-2">Regularly conduct incident response tabletop exercises to reinforce team readiness.
    <ul class="list-disc pl-6">
      <li>Run tabletop exercises at least quarterly, focusing on various types of attacks (e.g., insider threats, phishing, supply chain attacks).</li>
      <li>Rotate roles within the team to give each member experience in different parts of the response process.</li>
      <li>Conduct post-exercise debriefs to discuss gaps and action items to be addressed before the next incident.</li>
      <li>Ensure that lessons learned from each exercise are used to continuously update response playbooks and training plans.</li>
    </ul>
  </li>
</ul>
      </div>
    </div>
  );
}
