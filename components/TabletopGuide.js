import React, { useState, useEffect } from 'react';
import { getRandomInject } from '/components/Injects';
import { jsPDF } from 'jspdf';

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

  const handleCompleteStep = () => {
    setActions(prevActions => [...prevActions, {
      description: `Completed: ${scenario.steps[currentStep].title}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(actions, notes);
    }
  };

  const handleNoteChange = (e) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [`step${currentStep + 1}`]: e.target.value
    }));
  };

  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  const handleActionComplete = (description, role) => {
    const assignedRole = roles?.[role] || 'Unassigned';
    setActions(prevActions => [...prevActions, {
      description,
      actor: assignedRole,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Incident Response Tabletop Exercise Report`, 10, 10);
    doc.text(`Scenario: ${scenario.title}`, 10, 20);
    scenario.steps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step.title}`, 10, 30 + index * 30);
      doc.text(`Initial Question: ${step.initialQuestion}`, 10, 40 + index * 30);
      doc.text(`User Notes: ${notes[`step${index + 1}`] || 'No notes added'}`, 10, 50 + index * 30);
      doc.text(`Recommendations:`, 10, 60 + index * 30);
      if (step.recommendations && step.recommendations.props && step.recommendations.props.children) {
        step.recommendations.props.children.forEach((recommendation, idx) => {
          if (recommendation && recommendation.props) {
            doc.text(`${idx + 1}. ${recommendation.props.children}`, 15, 70 + index * 30 + idx * 10);
          }
        });
      }
    });
    doc.save('tabletop-exercise.pdf');
  };

  return (
    <div className="tabletop-guide">
      <div className="scenario-summary mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">Scenario Summary</h2>
        <p><strong>Title:</strong> {scenario.title}</p>
        <p><strong>Description:</strong> {scenario.description}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">{scenario.steps[currentStep].title}</h2>
      <div className="mb-4">
        <p className="font-semibold">{scenario.steps[currentStep].initialQuestion}</p>
      </div>
    
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Recommendations:</h3>
        {scenario.steps[currentStep].recommendations}
      </div>
        
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Discussion Prompts:</h3>
        {scenario.steps[currentStep].discussionPrompts}
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
