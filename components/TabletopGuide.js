import React, { useState, useEffect } from 'react';
import { getRandomInject } from '/components/Injects';
import { jsPDF } from 'jspdf';
import parse from 'html-react-parser';

export default function TabletopGuide({ scenario, roles, onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [actions, setActions] = useState([]);
  const [notes, setNotes] = useState({});
  const [chatGPTResponse, setChatGPTResponse] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
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

    const newActions = [...actions, {
      description: `Completed: ${scenario.steps[currentStepIndex].title}`,
      timestamp: new Date().toLocaleTimeString()
    }];

    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setActions(newActions);
    } else {
      // This is the final step
      onComplete(newActions, notes);
    }
  };

  const handleNoteChange = (e) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [`step${currentStepIndex + 1}`]: e.target.value
    }));
  };

    const getChatGPTResponse = async (prompt) => {
    setIsLoadingResponse(true);
    try {
      const response = await fetch('/api/chatgpt-prompt-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario,
          currentStep: scenario.steps[currentStepIndex],
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setChatGPTResponse(prevResponse => prevResponse + result);
      }
    } catch (error) {
      console.error('Error getting ChatGPT response:', error);
      setChatGPTResponse('Error: Unable to get response from ChatGPT.');
    } finally {
      setIsLoadingResponse(false);
    }
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
        <div className="mt-2">
          <strong>Description:</strong>
          {Array.isArray(scenario.description) 
            ? scenario.description.map((paragraph, index) => (
                <p key={index} className="mt-2">{paragraph}</p>
              ))
            : <p className="mt-2">{scenario.description}</p>
          }
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{currentStep.title}</h2>
      <div className="mb-4">
        <p className="font-semibold">{currentStep.initialQuestion}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Discussion Prompts:</h3>
        {parseHtml(currentStep.discussionPrompts)}
        <button 
          onClick={() => getChatGPTResponse(currentStep.discussionPrompts)}
          className="bg-blue-500 text-white p-2 rounded mt-2"
          disabled={isLoadingResponse}
        >
          {isLoadingResponse ? 'Loading...' : 'Get ChatGPT Response'}
        </button>
        {chatGPTResponse && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="font-semibold">ChatGPT Response:</h4>
            <p>{chatGPTResponse}</p>
          </div>
        )}
      </div>
    
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Recommendations:</h3>
        {parseHtml(currentStep.recommendations)}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Notes:</h3>
        <textarea
          value={notes[`step${currentStepIndex + 1}`] || ''}
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
