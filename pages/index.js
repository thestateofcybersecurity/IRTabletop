import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScenarioGenerator from '../components/ScenarioGenerator';
import TabletopGuide from '../components/TabletopGuide';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';

export default function Home() {
  const [scenario, setScenario] = useState(null);
  const [user, setUser] = useState(null);
  const [tactics, setTactics] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [isLogin, setIsLogin] = useState(true);

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
    handleLogin(userData);
  };
  
  return (
    <div className="container mx-auto px-4">

      <Header user={user} onLogout={handleLogout} />
    
      <main className="my-8">
        {user ? (
          <>
            <ScenarioGenerator setScenario={setScenario} />
            {scenario && <TabletopGuide scenario={scenario} />}
          </>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
            {isLogin ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <RegistrationForm onRegister={handleRegistration} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
