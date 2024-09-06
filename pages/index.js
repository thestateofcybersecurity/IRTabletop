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
  };

  const handleRegistration = (userData) => {
    // After successful registration, automatically log the user in
    handleLogin(userData);
  };

  const handleRoleAssignment = (roles) => {
    setAssignedRoles(roles);
  };

  const addAction = (action) => {
    setActions([...actions, action]);
  };

  const updateMetrics = (newMetrics) => {
    setMetrics(newMetrics);
  };
  
  return (
    <div className="container mx-auto px-4">

      <Header user={user} onLogout={handleLogout} />
    
      <main className="my-8">
        {user ? (     
          <>
            <ScenarioGenerator setScenario={setScenario} />
            {scenario && (
              <>
                <RoleAssignment assignRoles={handleRoleAssignment} />
                <TabletopGuide scenario={scenario} addAction={addAction} />
                <MetricsTracker scenario={scenario} addAction={addAction} updateMetrics={updateMetrics} />
                <ReportingTemplate scenario={scenario} actions={actions} metrics={metrics} />
              </>
            )}
          </>
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
