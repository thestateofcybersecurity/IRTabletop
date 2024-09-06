import { useState } from 'react';
import ScenarioGenerator from './ScenarioGenerator';
import TabletopGuide from './TabletopGuide';
import MetricsTracker from './Metrics';
import RoleAssignment from './RoleAssignment';
import ReportingTemplate from './ReportingTemplate';
import { getRandomInject } from './Injects';

export default function App() {
  const [scenario, setScenario] = useState(null); // Stores the generated scenario
  const [actions, setActions] = useState([]); // Stores actions taken during the tabletop exercise
  const [roles, setRoles] = useState({}); // Stores assigned roles for participants
  const [metrics, setMetrics] = useState(null); // Stores containment and recovery metrics
  const [inject, setInject] = useState(null); // Random inject for the exercise

  const addAction = (action) => {
    setActions([...actions, { ...action, timestamp: new Date().toLocaleTimeString() }]);
  };

  const assignRoles = (assignedRoles) => {
    setRoles(assignedRoles); // Capture assigned roles
  };

  const handleScenarioGeneration = (scenarioData) => {
    setScenario(scenarioData);
    setInject(getRandomInject()); // Set a random inject for the scenario
  };

  const updateMetrics = (newMetrics) => {
    setMetrics(newMetrics); // Track containment and recovery times
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Incident Response Tabletop Exercise</h1>

      {/* Step 1: Generate Scenario */}
      <ScenarioGenerator setScenario={handleScenarioGeneration} />

      {/* Step 2: Assign Roles */}
      {scenario && !Object.keys(roles).length && (
        <RoleAssignment assignRoles={assignRoles} />
      )}

      {/* Step 3: Begin Tabletop Guide and Metrics Tracking */}
      {Object.keys(roles).length > 0 && scenario && (
        <>
                  <TabletopGuide scenario={scenario} roles={roles} addAction={addAction} inject={inject} />
          <MetricsTracker scenario={scenario} addAction={addAction} updateMetrics={updateMetrics} />
        </>
      )}

      {/* Step 4: Display Summary of Actions and Metrics */}
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

      {/* Step 5: Display Incident Report and PDF Export */}
      {scenario && actions.length > 0 && (
        <ReportingTemplate scenario={scenario} actions={actions} metrics={metrics} />
      )}
    </div>
  );
}
