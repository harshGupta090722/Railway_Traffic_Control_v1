// src/lib/websocket/server.js
import { Server } from 'socket.io';
import dbConnect from '@/lib/database/mongodb';
import { Train, Section, Conflict, PerformanceMetrics } from '@/lib/database/models';

let io = null;

export function initializeWebSocketServer(httpServer) {
  if (io) return io;
  
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  });
  
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    
    // Join scenario room
    socket.on('join_scenario', (scenario) => {
      socket.join(`scenario_${scenario}`);
      console.log(`📡 Client ${socket.id} joined scenario: ${scenario}`);
    });
    
    // Handle train position updates
    socket.on('update_train_position', async (data) => {
      try {
        await dbConnect();
        const { trainId, position } = data;
        
        await Train.findOneAndUpdate(
          { trainId },
          { 'currentPosition.coordinates': position },
          { new: true }
        );
        
        // Broadcast to all clients in the same scenario
        socket.broadcast.emit('train_position_updated', {
          trainId,
          position,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ Position update error:', error);
        socket.emit('error', { message: 'Failed to update train position' });
      }
    });
    
    // Handle AI recommendation execution
    socket.on('execute_ai_recommendation', async (data) => {
      try {
        const { recommendationId, action } = data;
        
        // Execute the recommendation
        const result = await executeAIAction(action);
        
        // Broadcast success to all clients
        io.emit('ai_recommendation_executed', {
          recommendationId,
          result,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ AI execution error:', error);
        socket.emit('error', { message: 'Failed to execute AI recommendation' });
      }
    });
    
    // Handle scenario changes
    socket.on('change_scenario', async (scenario) => {
      try {
        // Broadcast scenario change to all clients
        io.emit('scenario_changed', {
          scenario,
          timestamp: new Date().toISOString()
        });
        
        // Generate new metrics for the scenario
        const metrics = await generateScenarioMetrics(scenario);
        
        io.emit('metrics_updated', {
          metrics,
          scenario,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ Scenario change error:', error);
        socket.emit('error', { message: 'Failed to change scenario' });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
  
  // Start real-time data broadcasting
  startRealTimeUpdates();
  
  return io;
}

// Real-time updates every 2 seconds for demo
function startRealTimeUpdates() {
  setInterval(async () => {
    try {
      await dbConnect();
      
      // Get current system state
      const trains = await Train.find({ status: 'RUNNING' }).limit(10);
      const sections = await Section.find({}).limit(10);
      const activeConflicts = await Conflict.find({ status: 'ACTIVE' });
      
      // Simulate train movements for demo
      for (const train of trains) {
        const newX = train.currentPosition.coordinates.x + (Math.random() * 2 - 1);
        const newZ = train.currentPosition.coordinates.z + (Math.random() * 0.5 - 0.25);
        
        await Train.findByIdAndUpdate(train._id, {
          'currentPosition.coordinates.x': newX,
          'currentPosition.coordinates.z': newZ,
          'currentPosition.lastUpdated': new Date()
        });
      }
      
      // Broadcast updates to all connected clients
      if (io) {
        io.emit('real_time_update', {
          trains: trains.map(t => ({
            trainId: t.trainId,
            position: t.currentPosition.coordinates,
            speed: t.currentSpeed,
            status: t.status
          })),
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('❌ Real-time update error:', error);
    }
  }, 2000); // Update every 2 seconds for smooth demo
}

async function executeAIAction(action) {
  // Simulate AI action execution with realistic delays
  const actions = {
    'prioritize_express': 'Express trains prioritized - 15% throughput improvement',
    'reroute_freight': 'Freight trains rerouted - 8 minutes delay reduction',
    'optimize_speeds': 'Train speeds optimized - 22% efficiency gain',
    'emergency_clear': 'Emergency corridor cleared - All trains halted safely'
  };
  
  return actions[action] || 'Action executed successfully';
}

async function generateScenarioMetrics(scenario) {
  const baseMetrics = {
    normal: { throughput: 85, efficiency: 92, averageDelay: 3.2, conflicts: 1 },
    congestion: { throughput: 68, efficiency: 78, averageDelay: 8.5, conflicts: 4 },
    emergency: { throughput: 25, efficiency: 45, averageDelay: 15.3, conflicts: 0 },
    optimized: { throughput: 96, efficiency: 98, averageDelay: 1.8, conflicts: 0 }
  };
  
  return baseMetrics[scenario] || baseMetrics.normal;
}
