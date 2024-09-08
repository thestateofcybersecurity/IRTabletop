
import { useState } from 'react';

const availableRoles = [
  { id: 1, role: "Incident Commander" },
  { id: 2, role: "Security Analyst" },
  { id: 3, role: "Legal Advisor" },
  { id: 4, role: "Public Relations Lead" },
  { id: 5, role: "Forensic Investigator" },
  { id: 6, role: "Network Engineer" }
];

export default function RoleAssignment({ assignRoles }) {
  const [assignedRoles, setAssignedRoles] = useState({});

  const handleAssignRole = (role, person) => {
    setAssignedRoles({ ...assignedRoles, [role]: person });
  };

  const handleAutoAssign = () => {
    const autoAssigned = {};
    availableRoles.forEach((roleObj, index) => {
      autoAssigned[roleObj.role] = `Team Member ${index + 1}`;
    });
    setAssignedRoles(autoAssigned);
    assignRoles(autoAssigned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    assignRoles(assignedRoles);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Assign Roles to Team Members</h2>
      <form onSubmit={handleSubmit}>
        {availableRoles.map((roleObj) => (
          <div key={roleObj.id} className="mb-4">
            <label className="block mb-2">{roleObj.role}</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder={`Assign a person to ${roleObj.role}`}
              value={assignedRoles[roleObj.role] || ''}
              onChange={(e) => handleAssignRole(roleObj.role, e.target.value)}
            />
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAutoAssign}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Auto Assign Roles
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirm Role Assignment
          </button>
        </div>
      </form>
    </div>
  );
}
