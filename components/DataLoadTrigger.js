import { useState } from 'react';

export default function DataLoadTrigger() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoadData = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/loadMitreData', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_MITRE_LOAD_SECRET
        }
      });
      const data = await response.json();
      setMessage(data.message || 'Data loaded successfully');
    } catch (error) {
      setMessage('Error loading data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button 
        onClick={handleLoadData} 
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? 'Loading...' : 'Load MITRE Data'}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
