export default function ReportingTemplate({ scenario, actions }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Incident Response Report</h2>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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

        <h4 className="text-lg font-semibold mt-4 mb-2">Team Actions</h4>
        <ul className="list-disc pl-6">
          {actions.map((action, index) => (
            <li key={index} className="mb-2">
              <strong>{action.actor}:</strong> {action.actionTaken}
            </li>
          ))}
        </ul>

        <h4 className="text-lg font-semibold mt-4 mb-2">Forensic Evidence Collected</h4>
        <p>{scenario.forensics}</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Lessons Learned</h4>
        <p>{scenario.lessonsLearned}</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Post-Incident Recommendations</h4>
        <ul className="list-disc pl-6">
          {scenario.recommendations.map((recommendation, index) => (
            <li key={index} className="mb-2">{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
