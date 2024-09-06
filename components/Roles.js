// Define available roles in the tabletop exercise
const availableRoles = [
  { id: 1, role: "Incident Commander" },
  { id: 2, role: "Security Analyst" },
  { id: 3, role: "Legal Advisor" },
  { id: 4, role: "Public Relations Lead" },
  { id: 5, role: "Forensic Investigator" },
  { id: 6, role: "Network Engineer" }
];

// Component for role assignment
export default function RoleAssignment({ assignRoles }) {
  const [assignedRoles, setAssignedRoles] = useState({});

  const handleAssignRole = (role, person) => {
    setAssignedRoles({ ...assignedRoles, [role]: person });
  };

  const handleSubmit = () => {
    assignRoles(assignedRoles); // Pass the assigned roles back to the main app
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Assign Roles to Team Members</h2>
      <form onSubmit={handleSubmit}>
        {availableRoles.map((role) => (
          <div key={role.id} className="mb-4">
            <label className="block mb-2">{role.role}</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder={`Assign a person to ${role.role}`}
              onChange={(e) => handleAssignRole(role.role, e.target.value)}
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Assign Roles
        </button>
      </form>
    </div>
  );
}
