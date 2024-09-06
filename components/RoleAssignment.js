import { useState, useEffect } from 'react';

export default function RoleAssignment({ scenario, onAssign }) {
  const [roles, setRoles] = useState([
    { title: "Incident Commander", description: "Overall lead of the incident response team.", assignee: "" },
    { title: "Security Analyst", description: "Monitors and analyzes suspicious activities.", assignee: "" },
    { title: "Forensic Investigator", description: "Responsible for collecting and analyzing forensic evidence.", assignee: "" },
    { title: "Legal Advisor", description: "Ensures regulatory compliance during the incident.", assignee: "" },
    { title: "Public Relations Lead", description: "Manages external communications and public relations.", assignee: "" },
    { title: "Network Engineer", description: "Handles network configurations and containment.", assignee: "" },
    { title: "Threat Intelligence Analyst", description: "Gathers intelligence about the threat actor and tactics.", assignee: "" },
    { title: "Recovery Manager", description: "Oversees system restoration and business continuity.", assignee: "" },
    { title: "Compliance Officer", description: "Ensures compliance with industry-specific regulations.", assignee: "" },
    { title: "Communications Lead", description: "Coordinates internal and external communications.", assignee: "" },
    { title: "Business Continuity Officer", description: "Maintains business operations with minimal disruption.", assignee: "" },
 ]);

  const handleAssigneeChange = (index, value) => {
    const updatedRoles = [...roles];
    updatedRoles[index].assignee = value;
    setRoles(updatedRoles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(roles);
  };
    
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
    if (!scenario) {
      console.error('Scenario details are missing. Please generate a scenario first.');
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Assign Roles</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {roles.map((role, index) => (
          <div key={index}>
            <label htmlFor={`role-${index}`} className="block mb-1">{role.title}:</label>
            <input
              type="text"
              id={`role-${index}`}
              value={role.assignee}
              onChange={(e) => handleAssigneeChange(index, e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Assign Roles and Start Exercise
        </button>
      </form>
    </div>
  );
}
