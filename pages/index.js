import { useState, useEffect, useRef } from 'react';
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
    console.log('handleLogin called with:', userData); // Debugging log
    setUser(userData.user);
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
    <div className="container mx-auto px-4">
      <Header user={user} onLogout={handleLogout} />
      <main className="my-8">
        <h1 className="text-4xl font-bold mb-4">IR Tabletop Scenario Generator</h1>
        {renderCurrentStep()}
        {!user && (
          <p className="mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-700"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        )}
        {user && user.isAdmin && <DataLoadTrigger />}
      </main>

      <Footer />
    </div>
  );
}
