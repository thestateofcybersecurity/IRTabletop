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

    const addBullets = (bulletPoints) => {
      bulletPoints.forEach((bullet, index) => {
        const splitText = doc.splitTextToSize(bullet, 170);
        doc.text(`• ${splitText[0]}`, 20, yPos + (index * 7)); // Bullet point with indentation
        if (splitText.length > 1) {
          doc.text(splitText.slice(1).join(' '), 30, yPos + ((index + 1) * 7));
        }
        yPos += (splitText.length * 7);
      });
      yPos += 10;
    };

    const addPageBreak = () => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 10;
      }
    };

    // Title
    addSectionTitle('Incident Response Tabletop Exercise Report', 20);

    // Scenario Summary
    if (scenario) {
      addSectionTitle('Scenario Summary', 16);
      addText(`Title: ${scenario.title}`, 12, true);
      addText(`Description: ${scenario.description}`, 12);
    }

    // Assigned Roles
    if (roles && roles.length > 0) {
      addSectionTitle('Assigned Roles', 16);
      roles.forEach((role) => {
        addText(`${role.title}: ${role.assignee}`, 12);
      });
      addPageBreak(); // Ensure page break if roles overflow the page
    }

    // Scenario Steps
    if (scenario.steps && scenario.steps.length > 0) {
      addSectionTitle('Scenario Steps', 16);
      scenario.steps.forEach((step, index) => {
        addText(`Step ${index + 1}: ${step.title}`, 14, true);
        addText(`Initial Question: ${step.question || 'Not Available'}`, 12);

        // User notes for each step
        if (notes && notes[`step${index + 1}`]) {
          addText('User Notes:', 12, true);
          addText(notes[`step${index + 1}`], 12);
        }

        // Convert HTML to Bullet Points (Recommendations and Prompts)
        if (step.recommendations) {
          addText('Recommendations:', 12, true);
          const recommendations = step.recommendations
            .replace(/<\/li><li>/g, '\n')
            .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
            .split('\n');
          addBullets(recommendations);
        }

        if (step.discussionPrompts) {
          addText('Discussion Prompts:', 12, true);
          const prompts = step.discussionPrompts
            .replace(/<\/li><li>/g, '\n')
            .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
            .split('\n');
          addBullets(prompts);
        }

        addPageBreak(); // Ensure page break after each step if needed
      });
    }

    // Action Timeline
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
      
      {/* Scenario Summary */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold bg-gray-200 p-2 rounded">Scenario Summary</h3>
        <p><strong>Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>
      </div>

      {/* Assigned Roles */}
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

      {/* Scenario Steps */}
      {scenario.steps && scenario.steps.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold bg-gray-200 p-2 rounded">Scenario Steps</h3>
          {scenario.steps.map((step, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p><strong>Initial Question:</strong> {step.question || 'Not Available'}</p>
              
              {/* User notes for each step */}
              {notes && notes[`step${index + 1}`] && (
                <div>
                  <strong>User Notes:</strong>
                  <p>{notes[`step${index + 1}`]}</p>
                </div>
              )}

              {/* Recommendations and discussion prompts */}
              {step.recommendations && (
                <div>
                  <strong>Recommendations:</strong>
                  <p>{step.recommendations}</p>
                </div>
              )}
              {step.discussionPrompts && (
                <div>
                  <strong>Discussion Prompts:</strong>
                  <p>{step.discussionPrompts}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Timeline */}
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
