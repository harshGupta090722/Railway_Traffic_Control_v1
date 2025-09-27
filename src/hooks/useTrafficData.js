// src/hooks/useTrafficData.js
'use client';
import { useState, useEffect } from 'react';

export const useTrafficData = () => {
  const [trafficData, setTrafficData] = useState({
    trains: [],
    sections: [],
    conflicts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with realistic railway data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData = {
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
          conflicts: [
            {
              id: 'CONF001',
              type: 'CROSSING',
              severity: 'MEDIUM',
              involvedTrains: ['EXP001', 'LOC002'],
              estimatedResolutionTime: 8,
              location: 'Junction Alpha'
            }
          ]
        };
        
        setTrafficData(mockData);
        setLoading(false);
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrafficData();
    
    // Set up periodic updates every 5 seconds
    const interval = setInterval(fetchTrafficData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return { trafficData, loading, error };
};
