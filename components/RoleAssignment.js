import { useState } from 'react';

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

// Role Assignment based on incident severity, type, and team size
export default function RoleAssignment({ assignRoles, incidentSeverity, incidentType, teamSize }) {
  const [assignedRoles, setAssignedRoles] = useState({});

  const roleCriteria = {
    // For critical incidents, assign all roles
    critical: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Legal Advisor", "Public Relations Lead", "Network Engineer", "Threat Intelligence Analyst", "Recovery Manager", "Compliance Officer"],
    
    // For major incidents, reduce roles based on team size and complexity
    major: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Legal Advisor", "Network Engineer", "Threat Intelligence Analyst", "Recovery Manager"],

    // For minor incidents, fewer roles required
    minor: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Network Engineer"]
  };

  const roleByIncidentType = {
    phishing: ["Incident Commander", "Security Analyst", "Threat Intelligence Analyst", "Communications Lead"],
    ransomware: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Recovery Manager", "Legal Advisor", "Public Relations Lead"],
    insiderThreat: ["Incident Commander", "Security Analyst", "Forensic Investigator", "Legal Advisor", "Compliance Officer"],
    supplyChain: ["Incident Commander", "Security Analyst", "Threat Intelligence Analyst", "Legal Advisor", "Business Continuity Officer"]
  };

  const assignAutomatedRoles = () => {
    let rolesToAssign = [];
    
    // Determine roles based on severity
    if (incidentSeverity === "critical") {
      rolesToAssign = roleCriteria.critical;
    } else if (incidentSeverity === "major") {
      rolesToAssign = roleCriteria.major;
    } else if (incidentSeverity === "minor") {
      rolesToAssign = roleCriteria.minor;
    }

    // Further filter roles based on incident type
    const typeRoles = roleByIncidentType[incidentType] || [];
    rolesToAssign = rolesToAssign.filter(role => typeRoles.includes(role));

    // Adjust roles based on available team size
    if (teamSize < rolesToAssign.length) {
      rolesToAssign = rolesToAssign.slice(0, teamSize);
    }

    // Auto-assign roles to available team members (for simplicity, we assume generic names)
    const assigned = rolesToAssign.reduce((acc, role, index) => {
      acc[role] = `Team Member ${index + 1}`; // Assign "Team Member X" to each role
      return acc;
    }, {});

    setAssignedRoles(assigned);
    assignRoles(assigned); // Pass assigned roles to the main app
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Assign Roles Based on Criteria</h2>
      <button onClick={assignAutomatedRoles} className="bg-blue-500 text-white px-4 py-2 rounded">
        Auto Assign Roles
      </button>

      <div className="mt-4">
        {Object.keys(assignedRoles).length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Assigned Roles:</h4>
            <ul className="list-disc pl-6">
              {Object.entries(assignedRoles).map(([role, member], index) => (
                <li key={index} className="mb-2">
                  <strong>{role}:</strong> {member}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
