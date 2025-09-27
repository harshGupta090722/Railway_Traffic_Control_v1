// src/hooks/useWebSocket.js
'use client';
import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [socketData, setSocketData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const ws = useRef(null);

  useEffect(() => {
    // For demo purposes, simulate WebSocket with intervals
    // In production, you would connect to actual WebSocket server
    const simulateWebSocket = () => {
      setConnectionStatus('Connected');
      
      const interval = setInterval(() => {
        // Simulate incoming real-time data
        const messages = [
          {
            type: 'TRAIN_UPDATE',
            message: 'Train EXP001 approaching Platform 2',
            level: 'info',
            timestamp: new Date().toISOString()
          },
          {
            type: 'CONFLICT_DETECTED',
            message: 'Potential conflict detected at Junction Alpha',
            level: 'warning',
            timestamp: new Date().toISOString()
          },
          {
            type: 'AI_RECOMMENDATION',
            message: 'AI suggests rerouting LOC002 to Track 3',
            level: 'info',
            timestamp: new Date().toISOString()
          },
          {
            type: 'THROUGHPUT_UPDATE',
            message: 'Section throughput increased by 12%',
            level: 'success',
            timestamp: new Date().toISOString()
          }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setSocketData(randomMessage);
      }, 3000);
      
      return () => clearInterval(interval);
    };

    const cleanup = simulateWebSocket();
    
    return cleanup;
  }, [url]);

  const sendMessage = (message) => {
    // In production, this would send to actual WebSocket
    console.log('Sending message:', message);
    
    // Simulate response
    setTimeout(() => {
      setSocketData({
        type: 'ACTION_RESPONSE',
        message: `Action executed: ${message.type}`,
        level: 'success',
        timestamp: new Date().toISOString()
      });
    }, 1000);
  };

  return { socketData, connectionStatus, sendMessage };
};
