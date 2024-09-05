import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScenarioGenerator from '../components/ScenarioGenerator';
import TabletopGuide from '../components/TabletopGuide';

export default function Home() {
  const [scenario, setScenario] = useState(null);

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>IR Tabletop Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="my-8">
        <h1 className="text-4xl font-bold mb-4">IR Tabletop Scenario Generator</h1>
        <ScenarioGenerator setScenario={setScenario} />
        {scenario && <TabletopGuide scenario={scenario} />}
      </main>

      <Footer />
    </div>
  );
}
