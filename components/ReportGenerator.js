import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

export default function ReportGenerator({ scenario, roles, actions, notes }) {
  const generateReport = async () => {
    const doc = new jsPDF();
    let yPos = 10;

    const addSectionTitle = (title, fontSize = 16) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, 'bold');
      doc.setFillColor(230, 230, 250);
      doc.rect(10, yPos, 190, 10, 'F');
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

    const addHtmlContent = async (elementId) => {
      const element = document.getElementById(elementId);
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = yPos;

      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      yPos += imgHeight + 10;
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
    }

    // Scenario Steps
    if (scenario.steps && scenario.steps.length > 0) {
      addSectionTitle('Scenario Steps', 16);
      for (let index = 0; index < scenario.steps.length; index++) {
        const step = scenario.steps[index];
        addText(`Step ${index + 1}: ${step.title}`, 14, true);
        addText(`Initial Question: ${step.initialQuestion || 'Not Available'}`, 12);

        if (notes && notes[`step${index + 1}`]) {
          addText('User Notes:', 12, true);
          addText(notes[`step${index + 1}`], 12);
        }

        // Add HTML content for recommendations and discussion prompts
        await addHtmlContent(`recommendations-${index}`);
        await addHtmlContent(`discussion-prompts-${index}`);

        if (index < scenario.steps.length - 1) {
          doc.addPage();
          yPos = 10;
        }
      }
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
              <p><strong>Initial Question:</strong> {step.initialQuestion || 'Not Available'}</p>
              
              {notes && notes[`step${index + 1}`] && (
                <div>
                  <strong>User Notes:</strong>
                  <p>{notes[`step${index + 1}`]}</p>
                </div>
              )}

              <div id={`recommendations-${index}`}>
                <strong>Recommendations:</strong>
                <div dangerouslySetInnerHTML={{ __html: step.recommendations }} />
              </div>
              
              <div id={`discussion-prompts-${index}`}>
                <strong>Discussion Prompts:</strong>
                <div dangerouslySetInnerHTML={{ __html: step.discussionPrompts }} />
              </div>
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
