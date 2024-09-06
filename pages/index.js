import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScenarioGenerator from '../components/ScenarioGenerator';
import RoleAssignment from '../components/RoleAssignment';
import TabletopGuide from '../components/TabletopGuide';
import ReportGenerator from '../components/ReportGenerator';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState('login');
  const [scenario, setScenario] = useState(null);
  const [roles, setRoles] = useState({});
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
      setCurrentStep('generateScenario');
    }
  }, []);

  const handleLogin = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentStep('generateScenario');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setScenario(null);
    setRoles({});
    setActions([]);
    setCurrentStep('login');
  };

  const handleScenarioGeneration = (generatedScenario) => {
    setScenario(generatedScenario);
    setCurrentStep('assignRoles');
  };

  const handleRoleAssignment = (assignedRoles) => {
    setRoles(assignedRoles);
    setCurrentStep('runExercise');
  };

  const handleExerciseComplete = (completedActions) => {
    setActions(completedActions);
    setCurrentStep('generateReport');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return isLogin ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegistrationForm onRegister={handleLogin} />
        );
      case 'generateScenario':
        return <ScenarioGenerator onGenerate={handleScenarioGeneration} />;
      case 'assignRoles':
        return <RoleAssignment scenario={scenario} onAssign={handleRoleAssignment} />;
      case 'runExercise':
        return (
          <TabletopGuide
            scenario={scenario}
            roles={roles}
            onComplete={handleExerciseComplete}
          />
        );
      case 'generateReport':
        return (
          <ReportGenerator
            scenario={scenario}
            roles={roles}
            actions={actions}
            notes={notes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>IR Tabletop Scenario Generator</title>
        <meta name="description" content="Generate and run IR tabletop exercises" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
      </main>

      <Footer />
    </div>
  );
}
