import { useState } from 'react';

export default function ScenarioGenerator({ setScenario }) {
  const [irExperience, setIrExperience] = useState('');
  const [securityMaturity, setSecurityMaturity] = useState('');
  const [industrySector, setIndustrySector] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [complianceRequirements, setComplianceRequirements] = useState('');
  const [attackTarget, setAttackTarget] = useState('');
  const [stakeholderInvolvement, setStakeholderInvolvement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [companySize, setCompanySize] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          irExperience,
          securityMaturity,
          industrySector,
          incidentType,
          complianceRequirements,
          attackTarget,
          stakeholderInvolvement,
          companySize
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const data = await response.json();
      setScenario(data);
    } catch (error) {
      console.error('Error generating scenario:', error);
      setError('An error occurred while generating the scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-xl font-bold mb-4">Customize Your Scenario</h2>
      <div className="mb-4">
        <label htmlFor="irExperience" className="block mb-2">IR Experience Level:</label>
        <select id="irExperience" value={irExperience} onChange={(e) => setIrExperience(e.target.value)} required>
          <option value="">Select experience level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="securityMaturity" className="block mb-2">Security Maturity:</label>
        <select id="securityMaturity" value={securityMaturity} onChange={(e) => setSecurityMaturity(e.target.value)} required>
          <option value="">Select maturity level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="industrySector" className="block mb-2">Industry Sector:</label>
        <input id="industrySector" type="text" value={industrySector} onChange={(e) => setIndustrySector(e.target.value)} required />
      </div>

        <div className="mb-4">
        <label htmlFor="companySize" className="block mb-2">Company Size:</label>
        <select
          id="companySize"
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select company size</option>
          <option value="small">Small (1-50 employees)</option>
          <option value="medium">Medium (51-500 employees)</option>
          <option value="large">Large (501+ employees)</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="incidentType" className="block mb-2">Incident Type:</label>
        <input id="incidentType" type="text" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label htmlFor="complianceRequirements" className="block mb-2">Compliance Requirements:</label>
        <input id="complianceRequirements" type="text" value={complianceRequirements} onChange={(e) => setComplianceRequirements(e.target.value)} />
      </div>

      <div className="mb-4">
        <label htmlFor="attackTarget" className="block mb-2">Attack Target:</label>
        <input id="attackTarget" type="text" value={attackTarget} onChange={(e) => setAttackTarget(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label htmlFor="stakeholderInvolvement" className="block mb-2">Stakeholder Involvement:</label>
        <input id="stakeholderInvolvement" type="text" value={stakeholderInvolvement} onChange={(e) => setStakeholderInvolvement(e.target.value)} />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Scenario'}
      </button>
    </form>
  );
}
