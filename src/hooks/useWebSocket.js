// src/hooks/useWebSocket.js
'use client';
import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [socketData, setSocketData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connected'); // Start as connected
  const intervalRef = useRef(null);

  useEffect(() => {
    // Simulate WebSocket connection without actual connection
    const simulateConnection = () => {
      setConnectionStatus('Connected');
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Send periodic updates every 10 seconds (not too frequent)
      intervalRef.current = setInterval(() => {
        const messages = [
          {
            type: 'TRAIN_UPDATE',
            message: 'Train position updated',
            level: 'info',
            timestamp: new Date().toISOString()
          },
          {
            type: 'SYSTEM_HEALTH',
            message: 'All systems operational',
            level: 'success',
            timestamp: new Date().toISOString()
          }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setSocketData(randomMessage);
      }, 10000); // Every 10 seconds instead of 3 seconds
    };

    simulateConnection();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Remove url dependency to prevent re-renders

  const sendMessage = (message) => {
    console.log('Sending message:', message);
    
    // Simulate response without triggering re-renders
    setTimeout(() => {
      if (message.type !== 'SCENARIO_CHANGE') { // Avoid duplicate alerts
        setSocketData({
          type: 'ACTION_RESPONSE',
          message: `Action executed: ${message.type}`,
          level: 'success',
          timestamp: new Date().toISOString()
        });
      }
    }, 1000);
  };

  return { socketData, connectionStatus, sendMessage };
};
