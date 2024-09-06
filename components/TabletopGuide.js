import { useState, useEffect, useRef } from 'react';
import { getRandomInject } from './Injects';

export default function TabletopGuide({ scenario, addAction }) {
  const [currentInject, setCurrentInject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // Initialize currentStep state
  const previousInjects = useRef([]); // Track previously generated injects
  const steps = [
    {
      title: 'Step 1: Detection',
      initialQuestion: 'How was the attack detected?',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>What monitoring systems provided the first alert? (e.g., SIEM, EDR, IDS/IPS)</li>
            <li>Was the detection internal or external (e.g., customer or partner reported the issue)?</li>
            <li>How long after the compromise was the attack detected?</li>
            <li>What indicators of compromise (IoCs) were observed?</li>
            <li>Could earlier detection have prevented the breach?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Enhance monitoring and detection tools to reduce detection time.</li>
          <li>Increase network visibility by deploying IDS/IPS or anomaly detection systems.</li>
          <li>Regularly update threat intelligence feeds to ensure new threats are detected quickly.</li>
          <li>Deploy endpoint detection and response (EDR) across critical systems to capture suspicious activities.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li className="mb-2">What were the initial indicators of compromise (IoCs)? 
              <ul className="list-disc pl-6">
                <li>Which systems or logs first showed signs of abnormal behavior?</li>
                <li>Were there any patterns in the IoCs (e.g., malware signatures, unusual network traffic)?</li>
                <li>Were any user-reported incidents part of the initial detection?</li>
                <li>What tools or technologies identified these IoCs (e.g., SIEM, EDR)?</li>
              </ul>
            </li>
            <li className="mb-2">How did the team determine the severity of the incident? 
              <ul className="list-disc pl-6">
                <li>Was there a formal process for determining incident severity?</li>
                <li>Were factors such as data exposure, system impact, and critical assets considered?</li>
                <li>How was the potential business impact factored into the severity assessment?</li>
                <li>Was the severity classification adjusted as more information became available?</li>
              </ul>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 2: Initial Evaluation',
      initialQuestion: 'What was the initial response after detection?',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>Who was notified first (e.g., Incident Commander, SOC Team)?</li>
            <li>What criteria were used to classify the incident (critical, major, minor)?</li>
            <li>Was there any immediate triage or analysis done before escalation?</li>
            <li>What priority level was assigned to the incident?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Review and enhance the incident classification process.</li>
          <li>Ensure clear ownership and responsibility for decision-making during the initial evaluation phase.</li>
          <li>Ensure prompt communication with key stakeholders to expedite the evaluation process.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>How well did the communication flow during the incident? Were any stakeholders left out?</li>
            <li>Did the team follow established processes, or were any processes missed?</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 3: Containment',
      initialQuestion: 'What actions were taken to contain the incident?',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>Which systems were isolated to prevent the spread of the attack?</li>
            <li>What communication channels were used to coordinate containment?</li>
            <li>Were backup or redundant systems engaged?</li>
            <li>Was there a decision to monitor the attacker further before containment, and why?</li>
            <li>Was the containment fully successful, or were there breaches after the containment was applied?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Test and improve containment procedures regularly through tabletop exercises.</li>
          <li>Ensure that communication protocols between teams are optimized for efficiency.</li>
          <li>Document all containment actions for forensic and legal purposes.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>Were the containment measures effective in preventing further spread?</li>
            <li>Did any communication issues delay or complicate containment?</li>
            <li>Were additional vulnerabilities discovered during containment?</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 4: Forensics and Evidence Gathering',
      initialQuestion: 'What data and logs were collected for forensic analysis?',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>Were memory snapshots, disk images, or log files collected?</li>
            <li>What forensic tools were used (e.g., FTK, EnCase, open-source tools)?</li>
            <li>Was evidence collected in a forensically sound manner to preserve integrity (chain of custody)?</li>
            <li>What artifacts were prioritized for collection (network traffic, file changes, etc.)?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Conduct additional training on forensics tools and evidence collection.</li>
          <li>Ensure all team members know how to maintain the chain of custody for evidence.</li>
          <li>Simulate forensic analysis during tabletop exercises to enhance team proficiency.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>What challenges did the team face during forensics?</li>
            <li>Were any critical data sources (logs, system snapshots) missing or corrupted?</li>
            <li>Was there enough documentation and tracking of forensic processes?</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 5: Notification and Stakeholder Involvement',
      initialQuestion: 'Who was notified about the incident, and when?',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>Which internal and external stakeholders were notified (e.g., Legal, PR, C-Suite)?</li>
            <li>Were customers or partners impacted, and were they notified?</li>
            <li>Was there a regulatory requirement to disclose the breach (GDPR, HIPAA, etc.)?</li>
            <li>Were law enforcement agencies involved in the response?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Strengthen communication channels for better coordination between internal teams and external stakeholders.</li>
          <li>Ensure legal and compliance teams are actively involved in notification processes.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>How well did communication flow during the notification process?</li>
            <li>Were any key stakeholders unaware of the incident until later stages?</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 6: Mitigation and Eradication',
      initialQuestion: 'How was the attack vector mitigated?',
      content: (
        <div>
          <ul className="list-disc pl-6">
                    <li>What mitigation steps were taken (e.g., patching, reconfiguration, removing malware)?</li>
            <li>Was a fix tested in a non-production environment before deployment?</li>
            <li>Were any bypasses attempted or successful against the mitigation?</li>
            <li>How was the success of the mitigation verified?</li>
            <li>Was there any residual risk after mitigation, and how was it addressed?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Regularly review mitigation techniques and test them in simulated environments.</li>
          <li>Ensure backup strategies are resilient to malware attacks and tested regularly.</li>
          <li>Perform post-mitigation testing to confirm all vulnerabilities have been closed.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>Were any mitigation bypass attempts discovered? How were they handled?</li>
            <li>Did the mitigation create any further vulnerabilities or issues?</li>
            <li>Were the mitigation steps sufficient to prevent further exploitation?</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 7: Recovery',
      initialQuestion: 'What steps were taken to recover systems and restore business operations?',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>Were systems restored from backups, or were new systems built?</li>
            <li>What was the time required for full recovery?</li>
            <li>Were there challenges in restoring services (e.g., data corruption, configuration issues)?</li>
            <li>Was there any communication with customers about the recovery process?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Review recovery workflows to ensure minimal downtime and test regularly.</li>
          <li>Ensure that backups are regularly tested for integrity and ease of use in real incidents.</li>
          <li>Strengthen disaster recovery and business continuity plans (BCP) to minimize business disruption.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>What obstacles were faced during recovery?</li>
            <li>Were there any delays in restoring systems due to untested backups?</li>
            <li>Were recovery efforts prioritized based on business impact?</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 8: Post-Incident Review',
      initialQuestion: 'Conduct a blameless post-incident review (retrospective).',
      content: (
        <div>
          <ul className="list-disc pl-6">
            <li>What worked well during the response?</li>
            <li>What areas need improvement?</li>
            <li>Were there any major communication breakdowns?</li>
            <li>Did the tools and processes in place meet the team’s needs?</li>
            <li>What gaps were identified in detection, response, or recovery?</li>
          </ul>
        </div>
      ),
      recommendations: (
        <ul className="list-disc pl-6">
          <li>Ensure post-incident reviews focus on process improvement, not blame.</li>
          <li>Document lessons learned and update the incident response plan accordingly.</li>
          <li>Incorporate feedback from the team to improve future incident responses.</li>
        </ul>
      ),
      discussionPrompts: (
        <div>
          <h4 className="text-lg font-semibold mb-2">Discussion Prompts and Key Questions:</h4>
          <ul className="list-disc pl-6">
            <li>What lessons were learned from this incident?</li>
            <li>What gaps were identified in the incident response playbook?</li>
            <li>How can the response process be improved for future incidents?</li>
          </ul>
        </div>
      ),
    }
  ];

  const handleCompleteStep = (role) => {
    addAction({
      description: `Completed: ${steps[currentStep].title}`,
      actor: role,
      timestamp: new Date().toLocaleTimeString(),
    });
    setCurrentStep((prevStep) => (prevStep + 1 < steps.length ? prevStep + 1 : prevStep)); // Move to the next step
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 >= 0 ? prevStep - 1 : prevStep));
  };

  const generateUniqueInject = () => {
    let inject;
    do {
      inject = getRandomInject();
    } while (previousInjects.current.includes(inject.description));
    previousInjects.current.push(inject.description);
    return inject;
  };
  
  // Effect to periodically generate injects
  useEffect(() => {
    const injectInterval = setInterval(() => {
      const newInject = generateUniqueInject();
      setCurrentInject(newInject);
      addAction({
        description: `New inject: ${newInject.description}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 5 * 60 * 1000); // Generate new inject every 5 minutes

    return () => clearInterval(injectInterval);
  }, [addAction]);

  // Define handleActionComplete to track when an action is completed
  const handleActionComplete = (description, actor) => {
    addAction({
      description,
      actor,
      timestamp: new Date().toLocaleTimeString()
    });
  }; 

  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  const renderSection = (title, content) => (
    <>
      <h4 className="text-lg font-semibold mb-2">{title}:</h4>
      <p className="mb-4">{content || 'Not specified'}</p>
    </>
  );

  // PDF Export Function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Incident Response Tabletop Exercise Report`, 10, 10);
    steps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step.title}`, 10, 20 + index * 10);
      doc.text(`Initial Question: ${step.initialQuestion}`, 10, 30 + index * 20);
      doc.text(`Recommendations:`, 10, 40 + index * 20);
      step.recommendations.props.children.forEach((recommendation, idx) => {
        doc.text(`${idx + 1}. ${recommendation.props.children}`, 15, 50 + index * 20 + idx * 10);
      });
    });
    doc.save('tabletop-exercise.pdf');
  };

  return (          
    <div className="tabletop-guide mt-8">
      {/* Progress Indicator */}
      <div className="progress-indicator mb-4">
        <span>Step {currentStep + 1} of {steps.length}</span>
      </div>

      {/* Step Content */}
      <div className="step-content bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h3>
        <p className="mb-4 font-semibold">{steps[currentStep].initialQuestion}</p>
        {steps[currentStep].content}
        <h4 className="mt-4 font-semibold">Recommendations:</h4>
        {steps[currentStep].recommendations}
        <h4 className="mt-4 font-semibold">Discussion Prompts:</h4>
        {steps[currentStep].discussionPrompts}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons mt-4 flex justify-between">
        {currentStep > 0 && <button className="btn-secondary" onClick={goToPreviousStep}>Previous</button>}
        {currentStep < steps.length - 1 && (
          <button className="btn-primary" onClick={() => handleActionComplete('Completed', roles['Next Role'])}>
            Next
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button className="btn-primary" onClick={exportToPDF}>Export to PDF</button>
        )}
        <button
          className="ml-4 text-blue-500"
          onClick={() => handleActionComplete('Completed detection discussion.', roles?.['Security Analyst'] || 'Unassigned')}
        >
          Mark as Completed
        </button>
      </div>
    </div>
  );
}
