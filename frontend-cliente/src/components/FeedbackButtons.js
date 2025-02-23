// src/components/FeedbackButtons.js
import React from 'react';

const FeedbackButtons = ({ handleFeedback }) => {
  return (
    <div className="feedback-buttons">
      <button onClick={() => handleFeedback('sim')}>Esta resposta me ajudou.</button>
      <button onClick={() => handleFeedback('não')}>Preciso falar com o suporte.</button>
    </div>
  );
};

export default FeedbackButtons;
