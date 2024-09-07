import React from 'react';
import { jsPDF } from 'jspdf';

export default function ReportGenerator({ scenario, roles, actions, notes }) {
  const generateReport = () => {
    const doc = new jsPDF();
    let yPos = 10;

    const addText = (text, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont(undefined, 'bold');
      else doc.setFont(undefined, 'normal');
      
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 15, yPos);
      yPos += (splitText.length * fontSize * 0.35) + 5;
      
      if (yPos > 280) {
        doc.addPage();
        yPos = 10;
      }
    };

    // Title
    addText('Incident Response Tabletop Exercise Report', 20, true);
    
    // Scenario Summary
    if (scenario) {
      addText('Scenario Summary', 16, true);
      addText(`Title: ${scenario.title}`);
      addText(`Description: ${scenario.description}`);
    }
    
    // Assigned Roles
    if (roles && roles.length > 0) {
      addText('Assigned Roles', 16, true);
      roles.forEach(role => {
        addText(`${role.title}: ${role.assignee}`);
      });
    }
    
    // Scenario Steps
    if (scenario && scenario.steps && scenario.steps.length > 0) {
      addText('Scenario Steps', 16, true);
      scenario.steps.forEach((step, index) => {
        addText(`Step ${index + 1}: ${step.title}`, 14, true);
        addText(`Initial Question: ${step.initialQuestion}`);
        
        if (notes && notes[`step${index + 1}`]) {
          addText('User Notes:', 12, true);
          addText(notes[`step${index + 1}`]);
        }
      });
    }
    
    // Action Timeline
    if (actions && actions.length > 0) {
      addText('Action Timeline', 16, true);
      actions.forEach(action => {
        addText(`${action.timestamp}: ${action.description}`);
      });
    }

    // Save the PDF
    doc.save('Incident_Response_Exercise_Report.pdf');
  };

  if (!scenario) {
    return <div>No scenario data available. Please generate a scenario first.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Exercise Report</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Scenario Summary</h3>
        <p><strong>Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>
      </div>

      {roles && roles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Assigned Roles</h3>
          <ul>
            {roles.map((role, index) => (
              <li key={index}>{role.title}: {role.assignee}</li>
            ))}
          </ul>
        </div>
      )}

      {scenario.steps && scenario.steps.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Scenario Steps</h3>
          {scenario.steps.map((step, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p><strong>Initial Question:</strong> {step.initialQuestion}</p>
              {notes && notes[`step${index + 1}`] && (
                <div>
                  <strong>User Notes:</strong>
                  <p>{notes[`step${index + 1}`]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Action Timeline</h3>
          <ul>
            {actions.map((action, index) => (
              <li key={index}>{action.timestamp}: {action.description}</li>
            ))}
          </ul>
        </div>
      )}

      <button 
        onClick={generateReport} 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Generate PDF Report
      </button>
    </div>
  );
}
