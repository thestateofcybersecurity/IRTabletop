import React, { useState } from 'react';
import { generateScenario, generateChatGPTScenario } from '../utils/api';

export default function ScenarioGenerator({ onGenerate }) {
  const [formData, setFormData] = useState({
    irExperience: '',
    securityMaturity: '',
    industrySector: '',
    complianceRequirements: '',
    stakeholderInvolvement: '',
    organizationSize: '',
    geographicLocation: '',
    infrastructureComplexity: '',
    thirdPartyDependencies: '',
    businessFunctions: '',
    riskTolerance: '',
    teamStructure: '',
    previousIncidents: '',
    securityStack: '',
    generationType: 'mitre' // Default to MITRE ATT&CK
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let generatedScenario;
      if (formData.generationType === 'chatgpt') {
        generatedScenario = await generateChatGPTScenario(formData);
      } else {
        generatedScenario = await generateScenario(formData);
      }
      
      console.log('Generated scenario:', generatedScenario);
      onGenerate(generatedScenario);
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
  
        {/* Organization Size */}
        <div>
          <label htmlFor="organizationSize" className="block mb-1 font-medium">Organization Size:</label>
          <select id="organizationSize" value={formData.organizationSize} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select organization size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Specify the size of your organization. <strong>Small</strong> for fewer resources and complexity, <strong>Medium</strong> for moderate-sized organizations, <strong>Large</strong> for more complex environments, and <strong>Enterprise</strong> for large-scale businesses with significant infrastructure.
          </p>
        </div>
  
        {/* Geographic Location */}
        <div>
          <label htmlFor="geographicLocation" className="block mb-1 font-medium">Geographic Location:</label>
          <input
            type="text"
            id="geographicLocation"
            value={formData.geographicLocation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., North America, Europe, Asia, Multi-national"
          />
          <p className="text-sm text-gray-600 mt-1">
            Specify the geographic location(s) of your organization. This helps account for regional compliance requirements and localized threats.
          </p>
        </div>
  
        {/* IT Infrastructure Complexity */}
        <div>
          <label htmlFor="infrastructureComplexity" className="block mb-1 font-medium">IT Infrastructure Complexity:</label>
          <select id="infrastructureComplexity" value={formData.infrastructureComplexity} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select infrastructure complexity</option>
            <option value="simple">Simple</option>
            <option value="medium">Medium</option>
            <option value="complex">Complex</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Select the complexity of your IT infrastructure. <strong>Simple</strong> for small networks with basic setups, <strong>Medium</strong> for more complex setups including cloud and on-prem infrastructure, and <strong>Complex</strong> for large-scale, hybrid infrastructure environments.
          </p>
        </div>
  
        {/* Third-Party Dependencies */}
        <div>
          <label htmlFor="thirdPartyDependencies" className="block mb-1 font-medium">Third-Party Dependencies:</label>
          <input
            type="text"
            id="thirdPartyDependencies"
            value={formData.thirdPartyDependencies}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Cloud Providers, SaaS Vendors"
          />
          <p className="text-sm text-gray-600 mt-1">
            Specify any critical third-party dependencies your organization relies on. Examples: <strong>Cloud Providers</strong> (AWS, Azure), <strong>SaaS Vendors</strong> (Microsoft 365, Salesforce).
          </p>
        </div>
  
        {/* Critical Business Functions */}
        <div>
          <label htmlFor="businessFunctions" className="block mb-1 font-medium">Critical Business Functions:</label>
          <input
            type="text"
            id="businessFunctions"
            value={formData.businessFunctions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Customer Data, Financial Transactions"
          />
          <p className="text-sm text-gray-600 mt-1">
            Identify the most critical business functions that should be protected in case of a cyber attack. Examples: <strong>Customer Data</strong>, <strong>Financial Transactions</strong>, <strong>Intellectual Property</strong>.
          </p>
        </div>
  
        {/* Risk Tolerance */}
        <div>
          <label htmlFor="riskTolerance" className="block mb-1 font-medium">Risk Tolerance:</label>
          <select id="riskTolerance" value={formData.riskTolerance} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select risk tolerance</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Define the organization's risk tolerance. <strong>Low</strong> means avoiding disruptions at all costs, <strong>Medium</strong> is a balance between risk and continuity, and <strong>High</strong> is accepting more risk for faster recovery.
          </p>
        </div>
  
        {/* Incident Response Team Structure */}
        <div>
          <label htmlFor="teamStructure" className="block mb-1 font-medium">Incident Response Team Structure:</label>
          <select id="teamStructure" value={formData.teamStructure} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select team structure</option>
            <option value="dedicated">Dedicated IR Team</option>
            <option value="multi-departmental">Multi-departmental Team</option>
            <option value="external">External Service Provider</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Select your organization's incident response team structure. Choose <strong>Dedicated</strong> for organizations with a full-time incident response team, <strong>Multi-departmental</strong> for teams drawn from multiple departments, or <strong>External</strong> if using a third-party service.
          </p>
        </div>
  
        {/* Previous Incidents */}
        <div>
          <label htmlFor="previousIncidents" className="block mb-1 font-medium">Previous Incidents:</label>
          <input
            type="text"
            id="previousIncidents"
            value={formData.previousIncidents}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Ransomware, Phishing"
          />
          <p className="text-sm text-gray-600 mt-1">
            Specify any previous incidents your organization has faced. This helps tailor the scenario to test improvements since the last breach. Examples: <strong>Ransomware</strong>, <strong>Phishing</strong>, <strong>Insider Threat</strong>.
          </p>
        </div>
  
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Scenario'}
        </button>
      </form>
    </div>
  );
}
