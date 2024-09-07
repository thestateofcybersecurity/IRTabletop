import React, { useState, useEffect } from 'react';
import { getRandomInject } from '/components/Injects';
import { jsPDF } from 'jspdf';
import parse from 'html-react-parser';

export default function TabletopGuide({ scenario, roles, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [actions, setActions] = useState([]);
  const [notes, setNotes] = useState({});
  
  useEffect(() => {
    const injectInterval = setInterval(() => {
      const newInject = getRandomInject();
      setActions(prevActions => [...prevActions, {
        description: `New inject: ${newInject.description}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 5 * 60 * 1000);

    return () => clearInterval(injectInterval);
  }, []);

  const parseHtml = (htmlString) => {
    try {
      return parse(htmlString);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return <p>Error rendering content</p>;
    }
  };

  if (!scenario || !scenario.steps || scenario.steps.length === 0) {
    return <p>No valid scenario available. Please generate a scenario first.</p>;
  }

  const currentStep = scenario.steps[currentStep];
  
  return (
    <div className="tabletop-guide">
      <div className="scenario-summary mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">Scenario Summary</h2>
        <p><strong>Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">{currentStep.title}</h2>
      <div className="mb-4">
        <p className="font-semibold">{currentStep.initialQuestion}</p>
      </div>
    
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Recommendations:</h3>
        {parseHtml(currentStep.recommendations)}
      </div>
        
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Discussion Prompts:</h3>
        {parseHtml(currentStep.discussionPrompts)}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Notes:</h3>
        <textarea
          value={notes[`step${currentStep + 1}`] || ''}
          onChange={handleNoteChange}
          className="w-full p-2 border rounded"
          rows="4"
        />
      </div>
        
      <div className="flex justify-between">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="bg-gray-500 text-white p-2 rounded"
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button 
          onClick={handleCompleteStep}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {currentStep === scenario.steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
        </button>
      </div>

      <button 
        onClick={exportToPDF}
        className="mt-4 bg-green-500 text-white p-2 rounded"
      >
        Export to PDF
      </button>
    </div>
  );
}
