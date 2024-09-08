import { useState, useEffect } from 'react';

export default function MetricsTracker({ scenario, addAction }) {
  const [metrics, setMetrics] = useState({
    detectionTime: null,
    containmentTime: null,
    recoveryTime: null,
    incidentStartTime: new Date(),
    containmentStartTime: null,
    recoveryStartTime: null
  });

  const calculateTimeElapsed = (startTime, endTime) => {
    const elapsedMs = endTime - startTime;
    const elapsedMinutes = Math.floor(elapsedMs / 60000); // Convert milliseconds to minutes
    return `${elapsedMinutes} minutes`;
  };

  useEffect(() => {
    if (metrics.containmentStartTime && metrics.recoveryStartTime) {
      const containmentTime = calculateTimeElapsed(metrics.incidentStartTime, metrics.containmentStartTime);
      const recoveryTime = calculateTimeElapsed(metrics.containmentStartTime, metrics.recoveryStartTime);
      setMetrics({ ...metrics, containmentTime, recoveryTime });
    }
  }, [metrics.containmentStartTime, metrics.recoveryStartTime]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Metrics Tracking</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      </div>
    </div>
  );
}
