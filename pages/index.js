import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TabletopGuide from '../components/TabletopGuide';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import DataLoadTrigger from '../components/DataLoadTrigger';
import ReportingTemplate from '../components/ReportingTemplate';

const ScenarioGenerator = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    irExperience: '',
    securityMaturity: '',
    industrySector: '',
    incidentType: '',
    incidentSeverity: '',
    teamSize: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onGenerate({
        ...formData,
        title: `${formData.incidentSeverity} ${formData.incidentType} Incident in ${formData.industrySector}`,
        description: `A ${formData.incidentSeverity} ${formData.incidentType} incident has occurred in a ${formData.industrySector} organization with ${formData.irExperience} IR experience and ${formData.securityMaturity} security maturity.`
      });
    } catch (error) {
      console.error('Error generating scenario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="irExperience" className="block mb-1">IR Experience Level:</label>
        <select id="irExperience" value={formData.irExperience} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select experience level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      {/* Add similar blocks for other form fields */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Scenario'}
      </button>
    </form>
  );
};

const MetricsTracker = () => {
  const [containmentStart, setContainmentStart] = useState(null);
  const [recoveryStart, setRecoveryStart] = useState(null);

  return (
    <div>
      <button onClick={() => setContainmentStart(new Date())} className="bg-green-500 text-white p-2 rounded mr-2">
        Mark Containment Start
      </button>
      <button onClick={() => setRecoveryStart(new Date())} className="bg-yellow-500 text-white p-2 rounded">
        Mark Recovery Start
      </button>
      <div className="mt-2">
        <p>Containment Start: {containmentStart ? containmentStart.toLocaleString() : 'Not set'}</p>
        <p>Recovery Start: {recoveryStart ? recoveryStart.toLocaleString() : 'Not set'}</p>
      </div>
    </div>
  );
};

const RoleAssignment = ({ scenario }) => {
  const [roles, setRoles] = useState([]);

  const assignRoles = () => {
    // Simulating role assignment
    setRoles([
      { title: "Incident Commander", assignee: "John Doe" },
      { title: "Technical Lead", assignee: "Jane Smith" },
      { title: "Communications Officer", assignee: "Mike Johnson" }
    ]);
  };

  return (
    <div>
      <button onClick={assignRoles} className="bg-purple-500 text-white p-2 rounded mb-2">Re-Assign Roles</button>
      {roles.length > 0 ? (
        <ul>
          {roles.map((role, index) => (
            <li key={index}>{role.title}: {role.assignee}</li>
          ))}
        </ul>
      ) : (
        <p>No roles assigned yet. Click "Re-Assign Roles" to generate assignments.</p>
      )}
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [scenario, setScenario] = useState(null);
  const [roles, setRoles] = useState({});
  const [actions, setActions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [currentStep, setCurrentStep] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user')));
      setCurrentStep('generateScenario');
    }
  }, []);

  const handleLogin = useCallback((data) => {
    console.log('handleLogin called with:', data); // Debugging log
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentStep('generateScenario');
  }, []);
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setScenario(null);
    setRoles({});
    setActions([]);
    setMetrics(null);
    setCurrentStep('login');
  };

  const handleRegistration = (userData) => {
    handleLogin(userData);
  };

  const handleScenarioGeneration = (generatedScenario) => {
    setScenario(generatedScenario);
    setCurrentStep('assignRoles');
  };

  const handleRoleAssignment = (assignedRoles) => {
    setRoles(assignedRoles);
    setCurrentStep('runExercise');
  };

  const addAction = (action) => {
    setActions(prevActions => [...prevActions, action]);
  };

  const updateMetrics = (newMetrics) => {
    setMetrics(newMetrics);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return isLogin ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegistrationForm onRegister={handleRegistration} />
        );
      case 'generateScenario':
        return <ScenarioGenerator setScenario={handleScenarioGeneration} />;
      case 'assignRoles':
        return scenario ? (
          <RoleAssignment assignRoles={handleRoleAssignment} scenario={scenario} />
        ) : (
          <div>Error: Scenario not generated. Please go back and generate a scenario first.</div>
        );
      case 'runExercise':
        return scenario ? (
          <>
            <TabletopGuide scenario={scenario} roles={roles} addAction={addAction} />
            <MetricsTracker scenario={scenario} addAction={addAction} updateMetrics={updateMetrics} />
            <RoleAssignment assignRoles={handleRoleAssignment} />
            {actions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Summary of Actions</h2>
                <ul className="list-disc pl-6">
                  {actions.map((action, index) => (
                    <li key={index} className="mb-2">
                      <strong>{action.timestamp}:</strong> {action.description} {action.actor && `(Actor: ${action.actor})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {metrics && <ReportingTemplate scenario={scenario} actions={actions} metrics={metrics} />}
          </>
        ) : (
          <div>Error: Scenario not properly set. Please go back and generate a scenario first.</div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">IR Tabletop Scenario Generator</h1>
        <div>
          Welcome, {user.name}
          <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-4 py-2 rounded">Log Out</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate Scenario</h2>
          <ScenarioGenerator onGenerate={setScenario} />
        </div>

        {scenario && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Current Scenario</h2>
            <p><strong>Title:</strong> {scenario.title}</p>
            <p><strong>Description:</strong> {scenario.description}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Metrics Tracking</h2>
          <MetricsTracker />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Assigned Roles</h2>
          <RoleAssignment scenario={scenario} />
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        © 2024 IR Tabletop Generator. All rights reserved.
      </footer>
    </div>
  );
}
