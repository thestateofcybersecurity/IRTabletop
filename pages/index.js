import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScenarioGenerator from '../components/ScenarioGenerator';
import TabletopGuide from '../components/TabletopGuide';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import DataLoadTrigger from '../components/DataLoadTrigger';
import RoleAssignment from '../components/RoleAssignment';
import ReportingTemplate from '../components/ReportingTemplate';
import MetricsTracker from '../components/Metrics';

export default function Home() {
  const [scenario, setScenario] = useState(null);
  const [user, setUser] = useState(null);
  const [tactics, setTactics] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [assignedRoles, setAssignedRoles] = useState({});
  const [actions, setActions] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [inject, setInject] = useState(null);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }

    async function fetchData() {
      try {
        const tacticRes = await fetch('/api/tactics');
        const techniqueRes = await fetch('/api/techniques');
        const mitigationRes = await fetch('/api/mitigations');

        setTactics(await tacticRes.json());
        setTechniques(await techniqueRes.json());
        setMitigations(await mitigationRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reset all exercise states
    setScenario(null);
    setActions([]);
    setRoles({});
    setMetrics(null);
    setInject(null);
  };

  const handleRegistration = (userData) => {
    // After successful registration, automatically log the user in
    handleLogin(userData);
  };

  const addAction = (action) => {
    setActions([...actions, { ...action, timestamp: new Date().toLocaleTimeString() }]);
  };

  const assignRoles = (assignedRoles) => {
    setRoles(assignedRoles);
  };

  const handleScenarioGeneration = (scenarioData) => {
    setScenario(scenarioData);
    setInject(getRandomInject());
  };

  const updateMetrics = (newMetrics) => {
    setMetrics(newMetrics);
  };
  
  return (
    <div className="container mx-auto px-4">

      <Header user={user} onLogout={handleLogout} />
    
      <main className="my-8">
        {user ? (
          <div className="container mx-auto p-4">
            {/* Step 1: Generate Scenario */}
            <ScenarioGenerator setScenario={handleScenarioGeneration} />
            
            {/* Step 2: Assign Roles */}
            {scenario && !Object.keys(roles).length && (
              <RoleAssignment assignRoles={assignRoles} />
            )}
            
            {/* Step 3: Begin Tabletop Guide and Metrics Tracking */}
            {Object.keys(roles).length > 0 && scenario && (
              <>
                <TabletopGuide scenario={scenario} roles={roles} addAction={addAction} inject={inject} />
                <MetricsTracker scenario={scenario} addAction={addAction} updateMetrics={updateMetrics} />
              </>
            )}
            
            {/* Step 4: Display Summary of Actions */}
            {actions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Summary of Actions</h2>
                <ul className="list-disc pl-6">
                  {actions.map((action, index) => (
                    <li key={index} className="mb-2">
                      <strong>{action.timestamp}:</strong> {action.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Step 5: Display Incident Report and PDF Export */}
            {scenario && actions.length > 0 && (
              <ReportingTemplate scenario={scenario} actions={actions} metrics={metrics} />
            )}
          </div>
        ) : (
          <div>
            {isLogin ? (
              <>
                <LoginForm onLogin={handleLogin} />
                <p className="mt-4">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Register here
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegistrationForm onRegister={handleRegistration} />
                <p className="mt-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Login here
                  </button>
                </p>
              </>
            )}
          </div>
        )}
        {user && user.isAdmin && <DataLoadTrigger />}
      </main>

      <Footer />
    </div>
  );
}
