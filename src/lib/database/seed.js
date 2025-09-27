// src/lib/database/seed.js
import dbConnect from './mongodb.js';
import Train from './models/Train.js';
import Section from './models/Section.js';
import Conflict from './models/Conflict.js';

export async function seedDatabase() {
  await dbConnect();
  
  // Sample trains for demo
  const sampleTrains = [
    {
      trainId: 'EXP001',
      name: 'Rajdhani Express',
      trainType: 'EXPRESS',
      currentPosition: {
        sectionId: 'SEC001',
        coordinates: { x: -50, y: 0, z: 0 }
      },
      status: 'RUNNING',
      currentSpeed: 85,
      destination: 'New Delhi',
      priority: 8,
      passengerCount: 1250
    },
    {
      trainId: 'LOC002',
      name: 'Local Passenger',
      trainType: 'LOCAL',
      currentPosition: {
        sectionId: 'SEC002',
        coordinates: { x: -30, y: 0, z: 10 }
      },
      status: 'RUNNING',
      currentSpeed: 60,
      destination: 'Suburban Station',
      priority: 5,
      passengerCount: 890
    },
    {
      trainId: 'FRG003',
      name: 'Freight Express',
      trainType: 'FREIGHT',
      currentPosition: {
        sectionId: 'SEC003',
        coordinates: { x: -70, y: 0, z: -10 }
      },
      status: 'DELAYED',
      currentSpeed: 45,
      delay: 5,
      destination: 'Industrial Hub',
      priority: 3,
      cargoWeight: 2400
    }
  ];
  
  // Sample sections
  const sampleSections = [
    {
      sectionId: 'SEC001',
      name: 'Main Line North',
      length: 45.5,
      maxSpeed: 120,
      capacity: 4,
      currentLoad: 2,
      blocks: [
        { blockId: 'BLK001', occupied: true, trainId: 'EXP001', signalStatus: 'GREEN' }
      ]
    },
    {
      sectionId: 'SEC002', 
      name: 'Suburban Loop',
      length: 23.2,
      maxSpeed: 80,
      capacity: 6,
      currentLoad: 3,
      blocks: [
        { blockId: 'BLK002', occupied: true, trainId: 'LOC002', signalStatus: 'YELLOW' }
      ]
    }
  ];
  
  try {
    await Train.deleteMany({});
    await Section.deleteMany({});
    await Train.insertMany(sampleTrains);
    await Section.insertMany(sampleSections);
    
    console.log('✅ Database seeded successfully');
    return { success: true, message: 'Database seeded with sample data' };
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}
