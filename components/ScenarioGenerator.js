import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function ScenarioGenerator({ setScenario }) {
  const [formData, setFormData] = useState({
    irExperience: '',
    securityMaturity: '',
    industrySector: '',
    incidentType: '',
    incidentSeverity: '',
    teamSize: '',
    attackTarget: '',
    complianceRequirements: '',
    stakeholderInvolvement: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const generatedScenario = await response.json();
      setScenario(generatedScenario);
    } catch (error) {
      console.error('Error generating scenario:', error);
      setError('An error occurred while generating the scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Generate Scenario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="irExperience" className="block mb-1">IR Experience Level:</label>
          <select
            id="irExperience"
            value={formData.irExperience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="securityMaturity" className="block mb-1">Security Maturity:</label>
          <select
            id="securityMaturity"
            value={formData.securityMaturity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select maturity level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="industrySector" className="block mb-1">Industry Sector:</label>
          <input
            type="text"
            id="industrySector"
            value={formData.industrySector}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="e.g., Healthcare, Finance, Technology"
          />
        </div>

        <div>
          <label htmlFor="incidentType" className="block mb-1">Incident Type:</label>
          <select
            id="incidentType"
            value={formData.incidentType}
            onChange={handleChange}
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

        <div>
          <label htmlFor="incidentSeverity" className="block mb-1">Incident Severity:</label>
          <select
            id="incidentSeverity"
            value={formData.incidentSeverity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select severity</option>
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="teamSize" className="block mb-1">Team Size:</label>
          <input
            type="number"
            id="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="1"
            max="20"
            placeholder="Enter team size (1-20)"
          />
        </div>

        <div>
          <label htmlFor="attackTarget" className="block mb-1">Attack Target:</label>
          <input
            type="text"
            id="attackTarget"
            value={formData.attackTarget}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Customer Database, Email System"
          />
        </div>

        <div>
          <label htmlFor="complianceRequirements" className="block mb-1">Compliance Requirements:</label>
          <input
            type="text"
            id="complianceRequirements"
            value={formData.complianceRequirements}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., GDPR, HIPAA"
          />
        </div>

        <div>
          <label htmlFor="stakeholderInvolvement" className="block mb-1">Key Stakeholders:</label>
          <input
            type="text"
            id="stakeholderInvolvement"
            value={formData.stakeholderInvolvement}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., CEO, Legal Team, PR Department"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin mr-2" size={20} />
              Generating...
            </>
          ) : 'Generate Scenario'}
        </button>
      </form>
    </div>
  );
}
