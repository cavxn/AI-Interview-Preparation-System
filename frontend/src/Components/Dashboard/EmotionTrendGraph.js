import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const emotionColors = {
  Confident: '#00ff99',
  Nervous: '#ff6666',
  Calm: '#66ccff',
  Angry: '#ff3300',
  Happy: '#ffff66',
  Sad: '#9999ff',
  Focused: '#ffa500'
};

const emotionEmojis = {
  Confident: '😎',
  Nervous: '😰',
  Calm: '😌',
  Angry: '😠',
  Happy: '😊',
  Sad: '😢',
  Focused: '🎯'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { date, score, emotion } = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #00ffff',
        padding: '10px',
        borderRadius: '8px',
        color: '#fff'
      }}>
        <p><strong>{date}</strong></p>
        <p>Score: {score}%</p>
        <p>Emotion: {emotion} {emotionEmojis[emotion] || ''}</p>
      </div>
    );
  }
  return null;
};

const EmotionTrendGraph = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    emoji: emotionEmojis[item.emotion] || '',
    stroke: emotionColors[item.emotion] || '#00ffff'
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#ccc" />
        <YAxis domain={[0, 100]} stroke="#ccc" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#00ffff"
          strokeWidth={3}
          dot={({ cx, cy, payload }) => (
            <text
              x={cx - 10}
              y={cy - 10}
              fill={emotionColors[payload.emotion] || '#00ffff'}
              fontSize={22}
            >
              {payload.emoji}
            </text>
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EmotionTrendGraph;
