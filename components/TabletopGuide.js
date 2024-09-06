import React, { useState, useEffect } from 'react';
import { getRandomInject } from '/components/Injects';

export default function TabletopGuide({ scenario, roles, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [actions, setActions] = useState([]);
  const [notes, setNotes] = useState({}); // Store user notes for each step
  
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
  const generateUniqueInject = () => {
    let inject;
    do {
      inject = getRandomInject();
    } while (previousInjects.current.includes(inject.description));
    previousInjects.current.push(inject.description);
    return inject;
  };

  const handleCompleteStep = () => {
    setActions(prevActions => [...prevActions, {
      description: `Completed: ${steps[currentStep].title}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    if (currentStep < steps.length - 1) {
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

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  // Define handleActionComplete to track when an action is completed
  const handleActionComplete = (description, role) => {
    const assignedRole = roles?.[role] || 'Unassigned';
    addAction({
      description,
      actor: assignedRole,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  if (!scenario) {
    return <p>No scenario generated yet. Please use the form above to generate a scenario.</p>;
  }

  const renderSection = (title, content) => (
    <>
      <h4 className="text-lg font-semibold mb-2">{title}:</h4>
      <p className="mb-4">{content || 'Not specified'}</p>
    </>
  );

  // PDF Export Function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Incident Response Tabletop Exercise Report`, 10, 10);
      scenario.steps.forEach((step, index) => {
        doc.text(`${index + 1}. ${step.title}`, 10, 30 + index * 10);
        doc.text(`User Notes: ${notes[`step${index + 1}`] || 'No notes added'}`, 10, 40 + index * 10);
        doc.text(`Initial Question: ${step.initialQuestion}`, 10, 30 + index * 20);
        doc.text(`Recommendations:`, 10, 40 + index * 20);
        doc.text(`Scenario: ${scenario.title}`, 10, 20);
        step.recommendations.props.children.forEach((recommendation, idx) => {
        doc.text(`${idx + 1}. ${recommendation.props.children}`, 15, 50 + index * 20 + idx * 10);
      });
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
        <p className="font-semibold">{scenario.steps[currentStep].question}</p>
      </div>
    
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Recommendations:</h3>
        {steps[currentStep].recommendations}
      </div>
        
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Discussion Prompts:</h3>
        {steps[currentStep].discussionPrompts}
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
          {currentStep === steps.length - 1 ? 'Complete Exercise' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
