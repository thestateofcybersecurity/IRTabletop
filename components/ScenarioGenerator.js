// Update file: components/ScenarioGenerator.js

import { useState } from 'react';

export default function ScenarioGenerator({ setScenario }) {
  const [irExperience, setIrExperience] = useState('');
  const [securityMaturity, setSecurityMaturity] = useState('');
  const [industrySector, setIndustrySector] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Here you would typically make an API call to generate the scenario
      // For now, we'll create a scenario object based on the form inputs
      const generatedScenario = {
        title: `${incidentSeverity} ${incidentType} Incident in ${industrySector} Sector`,
        description: `A ${incidentSeverity} ${incidentType} incident has occurred in a ${industrySector} organization with ${irExperience} IR experience and ${securityMaturity} security maturity.`,
        irExperience,
        securityMaturity,
        industrySector,
        incidentType,
        incidentSeverity,
        teamSize: parseInt(teamSize),
      };

      setScenario(generatedScenario);
    } catch (error) {
      console.error('Error generating scenario:', error);
      setError('An error occurred while generating the scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label htmlFor="irExperience" className="block mb-2">IR Experience Level:</label>
        <select
          id="irExperience"
          value={irExperience}
          onChange={(e) => setIrExperience(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="securityMaturity" className="block mb-2">Security Maturity:</label>
        <select
          id="securityMaturity"
          value={securityMaturity}
          onChange={(e) => setSecurityMaturity(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select maturity level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="industrySector" className="block mb-2">Industry Sector:</label>
        <input
          type="text"
          id="industrySector"
          value={industrySector}
          onChange={(e) => setIndustrySector(e.target.value)}
          className="w-full p-2 border rounded"
          required
          placeholder="e.g., Healthcare, Finance, Technology"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="incidentType" className="block mb-2">Incident Type:</label>
        <select
          id="incidentType"
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select incident type</option>
          <option value="phishing">Phishing</option>
          <option value="ransomware">Ransomware</option>
          <option value="insiderThreat">Insider Threat</option>
          <option value="supplyChain">Supply Chain Attack</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="incidentSeverity" className="block mb-2">Incident Severity:</label>
        <select
          id="incidentSeverity"
          value={incidentSeverity}
          onChange={(e) => setIncidentSeverity(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select severity</option>
          <option value="minor">Minor</option>
          <option value="major">Major</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="teamSize" className="block mb-2">Team Size:</label>
        <input
          type="number"
          id="teamSize"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="w-full p-2 border rounded"
          required
          min="1"
          max="20"
          placeholder="Enter team size (1-20)"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Scenario'}
      </button>
    </form>
  );
}
