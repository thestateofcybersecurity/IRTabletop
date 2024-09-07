import React from 'react';
import { jsPDF } from "jspdf";

export default function ReportGenerator({ scenario, roles, actions, notes }) {
  const generateReport = () => {
    const doc = new jsPDF();
    let yPos = 10;

    const addSectionTitle = (title, fontSize = 16) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, 'bold');
      doc.setFillColor(230, 230, 250); // Light lavender background
      doc.rect(10, yPos, 190, 10, 'F'); // Background for the section title
      doc.text(title, 15, yPos + 7);
      yPos += 15;
    };

    const addText = (text, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 15, yPos);
      yPos += (splitText.length * fontSize * 0.35) + 5;

      if (yPos > 280) {
        doc.addPage();
        yPos = 10;
      }
    };

    // Title with Design Enhancements
    addSectionTitle('Incident Response Tabletop Exercise Report', 20);

    // Scenario Summary Section
    if (scenario) {
      addSectionTitle('Scenario Summary', 16);
      addText(`Title: ${scenario.title}`, 12, true);
      addText(`Description: ${scenario.description}`, 12);
    }

    // Assigned Roles mixed with scenario
    if (roles && roles.length > 0) {
      addSectionTitle('Assigned Roles', 16);
      roles.forEach((role) => {
        addText(`${role.title}: ${role.assignee}`, 12);
      });
    }

    // Scenario Steps with Assigned Roles and User Notes
    if (scenario.steps && scenario.steps.length > 0) {
      addSectionTitle('Scenario Steps', 16);
      scenario.steps.forEach((step, index) => {
        addText(`Step ${index + 1}: ${step.title}`, 14, true);
        addText(`Initial Question: ${step.question}`, 12);

        // Role associated with this step
        if (roles[index]) {
          addText(`Assigned Role: ${roles[index].assignee}`, 12, true);
        }

        // User notes for each step
        if (notes && notes[`step${index + 1}`]) {
          addText('User Notes:', 12, true);
          addText(notes[`step${index + 1}`], 12);
        }
      });
    }

    // Action Timeline Section
    if (actions && actions.length > 0) {
      addSectionTitle('Action Timeline', 16);
      actions.forEach(action => {
        addText(`${action.timestamp}: ${action.description}`, 12);
      });
    }

    // Save the PDF
    doc.save('Incident_Response_Exercise_Report.pdf');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Exercise Report</h2>
      
      {/* Scenario Summary Section */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold bg-gray-200 p-2 rounded">Scenario Summary</h3>
        <p><strong>Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>
      </div>

      {/* Assigned Roles Section */}
      {roles && roles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold bg-gray-200 p-2 rounded">Assigned Roles</h3>
          <ul className="list-disc pl-6">
            {roles.map((role, index) => (
              <li key={index}>{role.title}: {role.assignee}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Scenario Steps Section */}
      {scenario.steps && scenario.steps.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold bg-gray-200 p-2 rounded">Scenario Steps</h3>
          {scenario.steps.map((step, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p><strong>Initial Question:</strong> {step.question}</p>
              
              {/* Show role assigned to the step */}
              {roles[index] && <p><strong>Assigned Role:</strong> {roles[index].assignee}</p>}
              
              {/* User notes for each step */}
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

      {/* Action Timeline Section */}
      {actions && actions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold bg-gray-200 p-2 rounded">Action Timeline</h3>
          <ul className="list-disc pl-6">
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
