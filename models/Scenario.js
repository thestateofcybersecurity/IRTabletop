import { useState } from 'react';

export default function ScenarioGenerator({ setScenario }) {
  const [irExperience, setIrExperience] = useState('');
  const [securityMaturity, setSecurityMaturity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/generate-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ irExperience, securityMaturity }),
    });
    const data = await response.json();
    setScenario(data);
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Generate Scenario
      </button>
    </form>
  );
}
