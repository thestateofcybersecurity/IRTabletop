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

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setCurrentStep('generateScenario');
  };

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
        return <RoleAssignment assignRoles={handleRoleAssignment} />;
      case 'runExercise':
        return (
          <>
            <TabletopGuide scenario={scenario} roles={roles} addAction={addAction} />
            <MetricsTracker scenario={scenario} addAction={addAction} updateMetrics={updateMetrics} />
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
            <ReportingTemplate scenario={scenario} actions={actions} metrics={metrics} />
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>IR Tabletop Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} onLogout={handleLogout} />
    
      <main className="my-8">
        <h1 className="text-4xl font-bold mb-4">IR Tabletop Scenario Generator</h1>
        {user ? (
          <div>
            {!scenario && <ScenarioGenerator setScenario={setScenario} />}
            
            {scenario && !Object.keys(roles).length && (
              <RoleAssignment assignRoles={assignRoles} />
            )}
            
            {scenario && Object.keys(roles).length > 0 && (
              <>
                <TabletopGuide scenario={scenario} roles={roles} addAction={addAction} />
                <MetricsTracker scenario={scenario} addAction={addAction} updateMetrics={updateMetrics} />
              </>
            )}
            
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
