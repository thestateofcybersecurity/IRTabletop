import { useState } from 'react';

export default function ScenarioGenerator({ setScenario }) {
  const [irExperience, setIrExperience] = useState('');
  const [securityMaturity, setSecurityMaturity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ irExperience, securityMaturity }),
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
