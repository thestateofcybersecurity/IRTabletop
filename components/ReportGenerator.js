import React from 'react';
import { jsPDF } from 'jspdf';

export default function ReportGenerator({ scenario, roles, actions, notes, exerciseDetails }) {
  const generateReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Incident Response Tabletop Exercise Report', 10, 20);

    // Add Introduction
    doc.setFontSize(16);
    doc.text('Introduction', 10, 40);
    doc.setFontSize(12);
    doc.text(`In an effort to validate ${exerciseDetails.companyName}'s Incident Response Plan, a tabletop exercise was conducted. The exercise focused on validating the organization’s ability to respond and recover from security incidents.`, 10, 50);

    // Add Scenario Details
    doc.setFontSize(16);
    doc.text('Scenario Details', 10, 70);
    doc.setFontSize(12);
    doc.text(`Title: ${scenario.title}`, 10, 80);
    doc.text(`Description: ${scenario.description}`, 10, 90);
    
    // Include dynamic questions from the scenario
    doc.text('Key Questions:', 10, 100);
    scenario.questions.forEach((question, index) => {
      doc.text(`${index + 1}. ${question}`, 10, 110 + (index * 10));
    });

    // Add roles
    doc.setFontSize(16);
    doc.text('Assigned Roles', 10, 140);
    doc.setFontSize(12);
    roles.forEach((role, index) => {
      doc.text(`${role.title}: ${role.assignee}`, 10, 150 + (index * 10));
    });

    // Add user notes for each step
    doc.setFontSize(16);
    doc.text('User Notes', 10, 180);
    doc.setFontSize(12);
    Object.keys(notes).forEach((step, index) => {
      doc.text(`${step}: ${notes[step]}`, 10, 190 + (index * 10));
    });

    // Add action timeline
    doc.setFontSize(16);
    doc.text('Action Timeline', 10, 230);
    doc.setFontSize(12);
    actions.forEach((action, index) => {
      doc.text(`${action.timestamp}: ${action.description}`, 10, 240 + (index * 10));
    });

    // Add debrief questions from the document
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Debrief/Hotwash Questions', 10, 20);
    const debriefQuestions = [
      "Are there any other issues you would like to discuss that were not raised?",
      "What are the strengths of the contingency plan? What areas require closer examination?",
      "Was the exercise beneficial? Did it help prepare you for follow-up testing?",
      "What did you gain from the exercise?",
      "How can we improve future exercises and tests?"
    ];
    debriefQuestions.forEach((question, index) => {
      doc.text(`${index + 1}. ${question}`, 10, 30 + (index * 10));
    });

    // Save the PDF
    doc.save('Incident_Response_Exercise_Report.pdf');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Exercise Report</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Scenario Summary</h3>
        <p><strong>Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Assigned Roles</h3>
        <ul>
          {roles.map((role, index) => (
            <li key={index}>{role.title}: {role.assignee}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">User Notes</h3>
        <ul>
          {Object.keys(notes).map((step, index) => (
            <li key={index}><strong>{step}:</strong> {notes[step]}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Action Timeline</h3>
        <ul>
          {actions.map((action, index) => (
            <li key={index}>{action.timestamp}: {action.description}</li>
          ))}
        </ul>
      </div>

      <button 
        onClick={generateReport} 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Generate PDF Report
      </button>
    </div>
  );
}
