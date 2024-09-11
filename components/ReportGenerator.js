import React from 'react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export default function ReportGenerator({ scenario, roles, actions, notes }) {
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const parseHtmlContent = (html) => {
    const stripped = stripHtml(html);
    return stripped
      .split(/(?<=\.|\?|\!)\s*/)
      .flatMap(sentence => sentence.split(/(?<=:)\s*/))
      .map(line => line.trim())
      .filter(line => line !== '');
  };

  const generateReport = () => {
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

    const addWrappedText = (text, fontSize = 12, isBold = false, indent = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      
      const splitText = doc.splitTextToSize(text, 180 - indent);
      splitText.forEach((line, index) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 10;
        }
        doc.text(line, 15 + indent, yPos);
        yPos += fontSize * 0.5;
        if (index === splitText.length - 1) yPos += 2;
      });
    };

    const addBulletPoints = (points, fontSize = 10) => {
      points.forEach(point => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 10;
        }
        doc.setFontSize(fontSize);
        doc.text('•', 15, yPos);
        addWrappedText(point, fontSize, false, 5);
        yPos += 2; // Add a small gap between bullet points
      });
      yPos += 5;
    };

    const addPageBreak = () => {
      doc.addPage();
      yPos = 10;
    };

    // Title
    addSectionTitle('Incident Response Tabletop Exercise Report', 20);
    yPos += 10;

    // Scenario Summary
    if (scenario) {
      addSectionTitle('Scenario Summary', 16);
      addWrappedText(`Title: ${scenario.title}`, 12, true);
      addWrappedText(`Description: ${scenario.description}`, 12);
    }

    addPageBreak();

    // Assigned Roles
    if (roles && roles.length > 0) {
      addSectionTitle('Assigned Roles', 16);
      roles.forEach((role) => {
        addWrappedText(`${role.title}: ${role.assignee}`, 12);
      });
    }

    addPageBreak();

    // Scenario Steps
    if (scenario.steps && scenario.steps.length > 0) {
      scenario.steps.forEach((step, index) => {
        addSectionTitle(`Step ${index + 1}: ${step.title}`, 14);
        addWrappedText(`Initial Question: ${step.initialQuestion || 'Not Available'}`, 12);

        if (notes && notes[`step${index + 1}`]) {
          addWrappedText('User Notes:', 12, true);
          addWrappedText(notes[`step${index + 1}`], 12);
        }

        addWrappedText('Recommendations:', 12, true);
        const recommendations = parseHtmlContent(step.recommendations);
        addBulletPoints(recommendations);

        addWrappedText('Discussion Prompts:', 12, true);
        const prompts = parseHtmlContent(step.discussionPrompts);
        addBulletPoints(prompts);

        // Include ChatGPT response if available
        if (notes && notes[`step${index + 1}`] && notes[`step${index + 1}`].includes('ChatGPT Response:')) {
          addWrappedText('ChatGPT Response:', 12, true);
          const chatGPTResponse = notes[`step${index + 1}`].split('ChatGPT Response:')[1].trim();
          addWrappedText(chatGPTResponse, 10);
        }

        addPageBreak();
      });
    }

    // Action Timeline
    addSectionTitle('Action Timeline', 16);
    actions.forEach(action => {
      addWrappedText(`${action.timestamp}: ${action.description}`, 12);
    });

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
            <div key={index} className="mb-4 p-4 border rounded">
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p><strong>Initial Question:</strong> {step.initialQuestion || 'Not Available'}</p>
              
              {notes && notes[`step${index + 1}`] && (
                <div className="mt-2">
                  <strong>User Notes:</strong>
                  <p>{notes[`step${index + 1}`]}</p>
                </div>
              )}

              <div className="mt-2">
                <strong>Recommendations:</strong>
                <div dangerouslySetInnerHTML={{ __html: step.recommendations }} />
              </div>
              
              <div className="mt-2">
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
