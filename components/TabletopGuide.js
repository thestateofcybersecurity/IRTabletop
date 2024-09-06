export default function TabletopGuide({ scenario }) {
  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tabletop Exercise Guide</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-2">Scenario: {scenario.title}</h3>
        <p className="mb-4">{scenario.description}</p>
        
        {scenario.tactic && (
          <>
            <h4 className="text-lg font-semibold mb-2">Tactic:</h4>
            <p className="mb-4">{scenario.tactic.name}</p>
          </>
        )}
        
        {scenario.technique && (
          <>
            <h4 className="text-lg font-semibold mb-2">Technique:</h4>
            <p className="mb-4">{scenario.technique.name}</p>
          </>
        )}
        
        {scenario.mitigation && (
          <>
            <h4 className="text-lg font-semibold mb-2">Mitigation:</h4>
            <p className="mb-4">{scenario.mitigation.name}</p>
          </>
        )}
        
        <h4 className="text-lg font-semibold mb-2">IR Experience Level:</h4>
        <p className="mb-4">{scenario.irExperience}</p>
        
        <h4 className="text-lg font-semibold mb-2">Security Maturity:</h4>
        <p className="mb-4">{scenario.securityMaturity}</p>
      </div>
    </div>
  );
}
