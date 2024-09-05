export default function TabletopGuide({ scenario }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tabletop Exercise Guide</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-2">Scenario: {scenario.title}</h3>
        <p className="mb-4">{scenario.description}</p>
        
        <h4 className="text-lg font-semibold mb-2">Objectives:</h4>
        <ul className="list-disc pl-5 mb-4">
          {scenario.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
        
        <h4 className="text-lg font-semibold mb-2">MITRE ATT&CK Tactics:</h4>
        <ul className="list-disc pl-5 mb-4">
          {scenario.mitreTactics.map((tactic, index) => (
            <li key={index}>{tactic.name}: {tactic.description}</li>
          ))}
        </ul>
        
        <h4 className="text-lg font-semibold mb-2">Discussion Topics:</h4>
        <ul className="list-disc pl-5 mb-4">
          {scenario.discussionTopics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
        
        <h4 className="text-lg font-semibold mb-2">Questions:</h4>
        <ol className="list-decimal pl-5 mb-4">
          {scenario.questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
