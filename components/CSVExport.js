import React from 'react';

export default function CSVExport({ scenario, actions, metrics }) {
  const generateCSV = () => {
    const headers = ['Timestamp', 'Description', 'Actor'];
    const csvContent = [
      headers.join(','),
      ...actions.map(action => 
        `${action.timestamp},${action.description},${action.actor || 'N/A'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'exercise_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button onClick={generateCSV} className="btn-secondary">
      Export to CSV
    </button>
  );
}
