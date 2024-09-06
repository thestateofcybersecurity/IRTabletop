import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import PDFExport from './PDFExport';
import CSVExport from './CSVExport';

export default function ReportingTemplate() {
  const { state } = useAppContext();
  const { scenario, actions, metrics } = state;
  if (!scenario) {
    return <p>No scenario to report on yet. Complete a scenario to generate the report.</p>;
  }

  return (
    <div className="reporting-template">
      <h2 className="text-2xl font-bold mb-4">Incident Response Report</h2>

      <div id="report-content" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-2">Incident Overview</h3>
        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        <p><strong>Scenario Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Timeline of Events</h4>
        <ul className="list-disc pl-6">
          {actions.map((action, index) => (
            <li key={index} className="mb-2">
              <strong>{action.timestamp}:</strong> {action.description}
            </li>
          ))}
        </ul>

        <h4 className="text-lg font-semibold mt-4 mb-2">Metrics</h4>
        <ul className="list-disc pl-6">
          {metrics && (
            <>
              <li>Containment Time: {metrics.containmentTime || "Not marked yet"}</li>
              <li>Recovery Time: {metrics.recoveryTime || "Not marked yet"}</li>
            </>
          )}
        </ul>

        <h4 className="text-lg font-semibold mt-4 mb-2">Forensic Evidence Collected</h4>
        <p>Key evidence collected during this scenario includes {scenario.forensics}.</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Lessons Learned</h4>
        <p>The lessons learned from this tabletop include {scenario.lessonsLearned}.</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Post-Incident Recommendations</h4>
        <ul className="list-disc pl-6">
          {scenario.recommendations.map((recommendation, index) => (
            <li key={index} className="mb-2">{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="export-options">
        <PDFExport scenario={scenario} actions={actions} metrics={metrics} />
        <CSVExport scenario={scenario} actions={actions} metrics={metrics} />
      </div>

      {/* Add PDF Export Button */}
      <PDFExport actions={actions} scenario={scenario} metrics={metrics} />
    </div>
  );
}
