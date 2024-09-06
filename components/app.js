import { useState } from 'react';
import ScenarioGenerator from './ScenarioGenerator';
import TabletopGuide from './TabletopGuide';
import ReportingTemplate from './ReportingTemplate';

export default function App() {
  const [scenario, setScenario] = useState(null); // Stores the generated scenario
  const [actions, setActions] = useState([]); // Stores actions taken during the tabletop exercise

  const addAction = (action) => {
    setActions([...actions, { ...action, timestamp: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Incident Response Tabletop Exercise</h1>
      
      {/* Scenario Generator */}
      <ScenarioGenerator setScenario={setScenario} />

      {/* Show the Tabletop Guide and Reporting Template after a scenario is generated */}
      {scenario && (
        <>
          <TabletopGuide scenario={scenario} addAction={addAction} />
          <ReportingTemplate scenario={scenario} actions={actions} />
        </>
      )}
    </div>
  );
}
