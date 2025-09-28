// src/hooks/useTrafficData.js
'use client';
import { useState, useEffect } from 'react';

export const useTrafficData = () => {
  const [trafficData, setTrafficData] = useState({
    trains: [
      {
        id: 'EXP001',
        name: 'Rajdhani Express',
        type: 'EXPRESS',
        currentSection: 'SEC001',
        speed: 85,
        delay: 2,
        status: 'RUNNING',
        destination: 'New Delhi',
        passengerCount: 1250,
        position: { x: -50, y: 0, z: 0 }
      },
      {
        id: 'LOC002',
        name: 'Local Passenger',
        type: 'LOCAL',
        currentSection: 'SEC002',
        speed: 60,
        delay: 0,
        status: 'RUNNING',
        destination: 'Suburban Station',
        passengerCount: 890,
        position: { x: -30, y: 0, z: 6 }
      },
      {
        id: 'FRG003',
        name: 'Freight Express',
        type: 'FREIGHT',
        currentSection: 'SEC003',
        speed: 45,
        delay: 5,
        status: 'DELAYED',
        destination: 'Industrial Hub',
        cargoTons: 2400,
        position: { x: 40, y: 0, z: -6 }
      },
      {
        id: 'EXP004',
        name: 'Shatabdi Express',
        type: 'EXPRESS',
        currentSection: 'SEC001',
        speed: 90,
        delay: 0,
        status: 'RUNNING',
        destination: 'Business District',
        passengerCount: 1100,
        position: { x: 80, y: 0, z: 0 }
      }
    ],
    sections: [
      {
        id: 'SEC001',
        name: 'Main Line North',
        capacity: 4,
        currentLoad: 2,
        maxSpeed: 120,
        length: 45.5
      },
      {
        id: 'SEC002', 
        name: 'Suburban Loop',
        capacity: 6,
        currentLoad: 1,
        maxSpeed: 80,
        length: 23.2
      },
      {
        id: 'SEC003',
        name: 'Freight Corridor',
        capacity: 3,
        currentLoad: 1,
        maxSpeed: 60,
        length: 38.7
      }
    ],
    conflicts: []
  });
  
  const [loading, setLoading] = useState(false); // Changed to false to prevent loading loop
  const [error, setError] = useState(null);

  // Static data, no need for repeated fetching
  useEffect(() => {
    // Set loading to false immediately since we have static data
    setLoading(false);
  }, []);

  return { trafficData, loading, error };
};
