import React from 'react';
import { jsPDF } from "jspdf";

export default function ReportGenerator({ scenario, roles, actions, metrics }) {
  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Incident Response Tabletop Exercise Report', 10, 20);
    
    // Add scenario details
    doc.setFontSize(16);
    doc.text('Scenario Details', 10, 40);
    doc.setFontSize(12);
    doc.text(`Title: ${scenario.title}`, 10, 50);
    doc.text(`Description: ${scenario.description}`, 10, 60);
    
    // Add roles
    doc.setFontSize(16);
    doc.text('Assigned Roles', 10, 80);
    doc.setFontSize(12);
    roles.forEach((role, index) => {
      doc.text(`${role.title}: ${role.assignee}`, 10, 90 + (index * 10));
    });
    
    // Add actions
    doc.setFontSize(16);
    doc.text('Action Timeline', 10, 120);
    doc.setFontSize(12);
    actions.forEach((action, index) => {
      doc.text(`${action.timestamp}: ${action.description}`, 10, 130 + (index * 10));
    });
    
    // Add metrics
    doc.setFontSize(16);
    doc.text('Metrics', 10, 200);
    doc.setFontSize(12);
    doc.text(`Containment Start: ${metrics.containmentStart || 'Not marked'}`, 10, 210);
    doc.text(`Recovery Start: ${metrics.recoveryStart || 'Not marked'}`, 10, 220);

    // Save the PDF
    doc.save('tabletop_exercise_report.pdf');
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
        <h3 className="text-xl font-semibold">Action Timeline</h3>
        <ul>
          {actions.map((action, index) => (
            <li key={index}>{action.timestamp}: {action.description}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Metrics</h3>
        <p>Containment Start: {metrics.containmentStart || 'Not marked'}</p>
        <p>Recovery Start: {metrics.recoveryStart || 'Not marked'}</p>
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
