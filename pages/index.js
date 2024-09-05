import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScenarioGenerator from '../components/ScenarioGenerator';
import TabletopGuide from '../components/TabletopGuide';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const [scenario, setScenario] = useState(null);
  const [user, setUser] = useState(null);
  const [tactics, setTactics] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [mitigations, setMitigations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      // This is a simplified example. In a real application, you'd want to verify the token with your backend.
      setUser(JSON.parse(localStorage.getItem('user')));
    }
      async function fetchData() {
      const tacticRes = await fetch('/api/tactics');
      const techniqueRes = await fetch('/api/techniques');
      const mitigationRes = await fetch('/api/mitigations');

      setTactics(await tacticRes.json());
      setTechniques(await techniqueRes.json());
      setMitigations(await mitigationRes.json());
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

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>IR Tabletop Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} onLogout={handleLogout} />
      <div>
        <h1>MITRE ATT&CK Data</h1>
        {/* Render your data here */}
      </div>
      <main className="my-8">
        <h1 className="text-4xl font-bold mb-4">IR Tabletop Scenario Generator</h1>
        {user ? (
          <>
            <ScenarioGenerator setScenario={setScenario} />
            {scenario && <TabletopGuide scenario={scenario} />}
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </main>

      <Footer />
    </div>
  );
}
