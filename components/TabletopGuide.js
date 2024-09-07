import React, { useState, useEffect } from 'react';
import { getRandomInject } from '/components/Injects';
import { jsPDF } from 'jspdf';
import parse from 'html-react-parser';

export default function TabletopGuide({ scenario, roles, onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
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

  const handleCompleteStep = () => {
    if (!scenario || !scenario.steps) return;

    setActions(prevActions => [...prevActions, {
      description: `Completed: ${scenario.steps[currentStepIndex].title}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete(actions, notes);
    }
  };

  const handleNoteChange = (e) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [`step${currentStepIndex + 1}`]: e.target.value
    }));
  };

  const handleActionComplete = (description, role) => {
    const assignedRole = roles?.[role] || 'Unassigned';
    setActions(prevActions => [...prevActions, {
      description,
      actor: assignedRole,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const parseHtml = (htmlString) => {
    if (typeof htmlString !== 'string') return null;
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

  const currentStep = scenario.steps[currentStepIndex];
  
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
          onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
          className="bg-gray-500 text-white p-2 rounded"
          disabled={currentStepIndex === 0}
        >
          Previous
        </button>
        <button 
          onClick={handleCompleteStep}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {currentStepIndex === scenario.steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
