import React, { useState } from 'react';
import api from '../utils/api';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', { feedback });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (isSubmitted) {
    return <p>Thank you for your feedback!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Please provide your feedback here"
        required
      />
      <button type="submit">Submit Feedback</button>
    </form>
  );
}
