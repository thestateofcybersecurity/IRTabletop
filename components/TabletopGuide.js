import React, { useState, useEffect } from 'react';
import { getRandomInject } from '/components/Injects';

export default function TabletopGuide({ scenario, roles, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState({}); // Store user notes for each step
  
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
    <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
        <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
      <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
      <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
      <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
      <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
      <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
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
      <textarea placeholder="Add your notes here" onChange={(e) => setNotes({ ...notes, step1: e.target.value })} />
        </div>
      ),
    }
  ];
  
  useEffect(() => {
    const injectInterval = setInterval(() => {
      const newInject = getRandomInject();
      setActions(prevActions => [...prevActions, {
        description: `New inject: ${newInject.description}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 5 * 60 * 1000);

    return () => clearInterval(injectInterval);
  }, []);
  const generateUniqueInject = () => {
    let inject;
    do {
      inject = getRandomInject();
    } while (previousInjects.current.includes(inject.description));
    previousInjects.current.push(inject.description);
    return inject;
  };

  const handleCompleteStep = () => {
    setActions(prevActions => [...prevActions, {
      description: `Completed: ${steps[currentStep].title}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(actions, metrics, notes);
    }
  };

  const handleMetricUpdate = (metricType) => {
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      [metricType]: new Date().toLocaleTimeString()
    }));
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  // Define handleActionComplete to track when an action is completed
  const handleActionComplete = (description, role) => {
    const assignedRole = roles?.[role] || 'Unassigned';
    addAction({
      description,
      actor: assignedRole,
      timestamp: new Date().toLocaleTimeString(),
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
    <div className="tabletop-guide">
      <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
      <div className="mb-4">
        <p className="font-semibold">{steps[currentStep].initialQuestion}</p>
        {steps[currentStep].content}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Recommendations:</h3>
        {steps[currentStep].recommendations}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Discussion Prompts:</h3>
        {steps[currentStep].discussionPrompts}
      </div>
      <div className="flex justify-between">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="bg-gray-500 text-white p-2 rounded"
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button 
          onClick={handleCompleteStep}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {currentStep === steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
        </button>
      </div>
      <div className="mt-4">
        <button 
          onClick={() => handleMetricUpdate('containmentStart')}
          className="bg-green-500 text-white p-2 rounded mr-2"
        >
          Mark Containment Start
        </button>
        <button 
          onClick={() => handleMetricUpdate('recoveryStart')}
          className="bg-yellow-500 text-white p-2 rounded"
        >
          Mark Recovery Start
        </button>
      </div>
    </div>
  );
}
