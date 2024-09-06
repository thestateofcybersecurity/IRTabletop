import { useState } from 'react';
import ScenarioGenerator from './ScenarioGenerator';
import TabletopGuide from './TabletopGuide';
import MetricsTracker from './Metrics';
import RoleAssignment from './Roles';

export default function App() {
  const [scenario, setScenario] = useState(null); // Stores the generated scenario
  const [actions, setActions] = useState([]); // Stores actions taken during the tabletop exercise
  const [roles, setRoles] = useState({}); // Stores assigned roles for participants

  const addAction = (action) => {
    setActions([...actions, { ...action, timestamp: new Date().toLocaleTimeString() }]);
  };

  const assignRoles = (assignedRoles) => {
    setRoles(assignedRoles); // Capture assigned roles
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Incident Response Tabletop Exercise</h1>

      {/* Step 1: Generate Scenario */}
      <ScenarioGenerator setScenario={setScenario} />

      {/* Step 2: Assign Roles */}
      {scenario && !Object.keys(roles).length && (
        <RoleAssignment assignRoles={assignRoles} />
      )}

      {/* Step 3: Begin Tabletop Guide and Metrics Tracking */}
      {Object.keys(roles).length > 0 && scenario && (
        <>
          <TabletopGuide scenario={scenario} roles={roles} addAction={addAction} />
          <MetricsTracker scenario={scenario} addAction={addAction} />
        </>
      )}

      {/* Step 4: Display Summary of Actions */}
      {actions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Summary of Actions</h2>
          <ul className="list-disc pl-6">
            {actions.map((action, index) => (
              <li key={index} className="mb-2">
                <strong>{action.timestamp}:</strong> {action.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
