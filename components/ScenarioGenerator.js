import React, { useState } from 'react';

export default function ScenarioGenerator({ onGenerate }) {
  const [formData, setFormData] = useState({
    irExperience: '',
    securityMaturity: '',
    industrySector: '',
    complianceRequirements: '',
    stakeholderInvolvement: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const generatedScenario = await response.json();
      // Process the scenario data to ensure JSX elements are handled correctly
      const processedScenario = {
        ...generatedScenario,
        steps: generatedScenario.steps.map(step => ({
          ...step,
          recommendations: processJSX(step.recommendations),
          discussionPrompts: processJSX(step.discussionPrompts),
        })),
      };

      onGenerate(processedScenario); // Pass processed scenario to the guide component
    } catch (error) {
      console.error('Error generating scenario:', error);
      alert('An error occurred while generating the scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to process JSX content
  const processJSX = (content) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    if (React.isValidElement(content)) {
      return content;
    }
    if (Array.isArray(content)) {
      return <>{content.map((item, index) => <React.Fragment key={index}>{processJSX(item)}</React.Fragment>)}</>;
    }
    return null;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Generate Scenario</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IR Experience Level */}
        <div>
          <label htmlFor="irExperience" className="block mb-1 font-medium">IR Experience Level:</label>
          <select id="irExperience" value={formData.irExperience} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Choose the Incident Response (IR) experience level of your team. 
            <strong> Beginner</strong> for new teams, <strong>Intermediate</strong> for teams with some experience, and 
            <strong>Advanced</strong> for highly experienced teams.
          </p>
        </div>

        {/* Security Maturity */}
        <div>
          <label htmlFor="securityMaturity" className="block mb-1 font-medium">Security Maturity:</label>
          <select id="securityMaturity" value={formData.securityMaturity} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select maturity level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Indicate the overall security maturity of your organization. 
            <strong> Low</strong> for organizations with little security infrastructure, 
            <strong>Medium</strong> for organizations with some policies and tools, and 
            <strong>High</strong> for well-established security practices.
          </p>
        </div>

        {/* Industry Sector */}
        <div>
          <label htmlFor="industrySector" className="block mb-1 font-medium">Industry Sector:</label>
          <input
            type="text"
            id="industrySector"
            value={formData.industrySector}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="e.g., Healthcare, Finance, Technology"
          />
          <p className="text-sm text-gray-600 mt-1">
            Specify the industry your organization operates in. This helps in tailoring the scenario to industry-specific risks and regulations. Examples: <strong>Healthcare</strong>, <strong>Finance</strong>, <strong>Technology</strong>.
          </p>
        </div>

        {/* Compliance Requirements */}
        <div>
          <label htmlFor="complianceRequirements" className="block mb-1 font-medium">Compliance Requirements:</label>
          <input
            type="text"
            id="complianceRequirements"
            value={formData.complianceRequirements}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., GDPR, HIPAA"
          />
          <p className="text-sm text-gray-600 mt-1">
            List any compliance or regulatory requirements relevant to your organization. Examples: <strong>GDPR</strong>, <strong>HIPAA</strong>, or <strong>PCI-DSS</strong>.
          </p>
        </div>

        {/* Key Stakeholders */}
        <div>
          <label htmlFor="stakeholderInvolvement" className="block mb-1 font-medium">Key Stakeholders:</label>
          <input
            type="text"
            id="stakeholderInvolvement"
            value={formData.stakeholderInvolvement}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., CEO, Legal Team, PR Department"
          />
          <p className="text-sm text-gray-600 mt-1">
            Identify the stakeholders that should be involved during the incident response. Examples: <strong>CEO</strong>, <strong>Legal Team</strong>, <strong>PR Department</strong>.
          </p>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Scenario'}
        </button>
      </form>
    </div>
  );
}
