import React from 'react';
import './SessionCard.css';

const SessionCard = ({ session }) => {
  return (
    <div className="session-card">
      <p><strong>📅 Date:</strong> {session.date}</p>
      <p><strong>😃 Emotion:</strong> {session.emotion}</p>
      <p><strong>📊 Score:</strong> {session.score}%</p>
    </div>
  );
};

export default SessionCard;
