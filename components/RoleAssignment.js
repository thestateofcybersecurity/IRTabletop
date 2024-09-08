import { useState, useEffect } from 'react';

export default function RoleAssignment({ scenario, onAssign }) {
  const [roles, setRoles] = useState([
    { title: "Incident Commander: Overall lead of the incident response team.", assignee: "" },
    { title: "Security Analyst: Monitors and analyzes suspicious activities.", assignee: "" },
    { title: "Forensic Investigator: Responsible for collecting and analyzing forensic evidence.", assignee: "" },
    { title: "Legal Advisor: Ensures regulatory compliance during the incident.", assignee: "" },
    { title: "Public Relations Lead: Manages external communications and public relations.", assignee: "" },
    { title: "Network Engineer: Handles network configurations and containment.", assignee: "" },
    { title: "Threat Intelligence Analyst: Gathers intelligence about the threat actor and tactics.", assignee: "" },
    { title: "Recovery Manager: Oversees system restoration and business continuity.", assignee: "" },
    { title: "Compliance Officer: Ensures compliance with industry-specific regulations.", assignee: "" },
    { title: "Communications Lead: Coordinates internal and external communications.", assignee: "" },
    { title: "Business Continuity Officer: Maintains business operations with minimal disruption.", assignee: "" },
    { title: "Additional Participants: List any other attendees and their roles.", assignee: "" },
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
