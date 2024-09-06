import { useState, useEffect } from 'react';

// Define available roles with descriptions
const availableRoles = [
  { role: "Incident Commander", description: "Overall lead of the incident response team." },
  { role: "Security Analyst", description: "Monitors and analyzes suspicious activities." },
  { role: "Forensic Investigator", description: "Responsible for collecting and analyzing forensic evidence." },
  { role: "Legal Advisor", description: "Ensures regulatory compliance during the incident." },
  { role: "Public Relations Lead", description: "Manages external communications and public relations." },
  { role: "Network Engineer", description: "Handles network configurations and containment." },
  { role: "Threat Intelligence Analyst", description: "Gathers intelligence about the threat actor and tactics." },
  { role: "Recovery Manager", description: "Oversees system restoration and business continuity." },
  { role: "Compliance Officer", description: "Ensures compliance with industry-specific regulations." },
  { role: "Communications Lead", description: "Coordinates internal and external communications." },
  { role: "Business Continuity Officer", description: "Maintains business operations with minimal disruption." }
];

export default function RoleAssignment({ assignRoles, scenario }) {
  const [assignedRoles, setAssignedRoles] = useState({});
  const [error, setError] = useState('');

  const roleCriteria = {
    critical: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Legal Advisor", "Public Relations Lead", "Network Engineer", "Threat Intelligence Analyst", "Recovery Manager", "Compliance Officer"],
    major: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Legal Advisor", "Network Engineer", "Threat Intelligence Analyst", "Recovery Manager"],
    minor: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Network Engineer"]
  };

  const roleByIncidentType = {
    phishing: ["Incident Commander", "Security Analyst", "Threat Intelligence Analyst", "Communications Lead"],
    ransomware: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Recovery Manager", "Legal Advisor", "Public Relations Lead"],
    insiderThreat: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Legal Advisor", "Compliance Officer"],
    supplyChain: ["Incident Commander", "Security Analyst", "Threat Intelligence Analyst", "Legal Advisor", "Business Continuity Officer"]
  };

  const assignAutomatedRoles = () => {
    setError('');
    if (!scenario) {
      setError('Scenario details are missing. Please generate a scenario first.');
      return;
    }

    const { incidentSeverity, incidentType, teamSize } = scenario;
    
    let rolesToAssign = roleCriteria[incidentSeverity] || roleCriteria.minor;
    
    // Further filter roles based on incident type
    const typeRoles = roleByIncidentType[incidentType] || [];
    rolesToAssign = rolesToAssign.filter(role => typeRoles.includes(role));

    // Adjust roles based on available team size
    const availableTeamSize = teamSize || 5; // Default to 5 if not specified
    if (availableTeamSize < rolesToAssign.length) {
      rolesToAssign = rolesToAssign.slice(0, availableTeamSize);
    }

    // Auto-assign roles to available team members
    const assigned = rolesToAssign.reduce((acc, role, index) => {
      acc[role] = `Team Member ${index + 1}`;
      return acc;
    }, {});

    setAssignedRoles(assigned);
    assignRoles(assigned);
  };

  useEffect(() => {
    if (scenario) {
      assignAutomatedRoles();
    }
  }, [scenario]);

  const handleAssignRole = (role, person) => {
    setAssignedRoles({ ...assignedRoles, [role]: person });
  };

  const validateRoles = () => {
    if (Object.keys(assignedRoles).length < availableRoles.length) {
      setError('All roles must be assigned before proceeding.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateRoles()) {
      assignRoles(assignedRoles);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Assigned Roles Based on Scenario</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={assignAutomatedRoles} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Re-Assign Roles
      </button>

      <div className="mt-4">
        {Object.keys(assignedRoles).length > 0 ? (
          <div>
            <h4 className="text-lg font-semibold mb-2">Assigned Roles:</h4>
            <ul className="list-disc pl-6">
              {Object.entries(assignedRoles).map(([role, member], index) => (
                <li key={index} className="mb-2">
                  <strong>{role}:</strong> {member}
                  <p className="text-sm text-gray-600">{availableRoles.find(r => r.role === role)?.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No roles assigned yet. Click "Re-Assign Roles" to generate assignments.</p>
        )}
      </div>
    </div>
  );
}
