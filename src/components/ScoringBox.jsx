import React from 'react';
import './ScoringBox.css'; // Optional: if you have styling for ScoringBox

const ScoringBox = ({ score }) => {
  return (
    <div className="scoring-box">
      <h3>Environmental Score</h3>
      <p>{score}/10</p>
    </div>
  );
};

export default ScoringBox;