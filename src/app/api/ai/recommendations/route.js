// src/app/api/ai/recommendations/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/mongodb';
import { AIRecommendation, Train, Section, Conflict } from '@/lib/database/models';

/**
 * GET /api/ai/recommendations - Get AI recommendations based on current state
 */
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const scenario = searchParams.get('scenario') || 'normal';
    const urgencyLevel = searchParams.get('urgency');
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    // Get current system state for intelligent recommendations
    const currentTrains = await Train.find({ status: { $in: ['RUNNING', 'DELAYED'] } });
    const sections = await Section.find({});
    const activeConflicts = await Conflict.find({ status: 'ACTIVE' });
    
    // Generate scenario-based recommendations
    const recommendations = await generateAIRecommendations(scenario, {
      trains: currentTrains,
      sections: sections,
      conflicts: activeConflicts
    });
    
    let query = {};
    if (urgencyLevel) query.urgency = urgencyLevel;
    
    // Fetch stored recommendations and merge with generated ones
    const storedRecommendations = await AIRecommendation.find(query)
      .sort({ createdAt: -1, urgency: -1 })
      .limit(limit);
    
    // Combine and prioritize recommendations
    const allRecommendations = [...recommendations, ...storedRecommendations]
      .sort((a, b) => {
        const urgencyOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      })
      .slice(0, limit);
    
    return NextResponse.json({
      success: true,
      data: allRecommendations,
      count: allRecommendations.length,
      scenario: scenario,
      systemState: {
        activeTrains: currentTrains.length,
        activeSections: sections.length,
        activeConflicts: activeConflicts.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ AI Recommendations API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/recommendations/execute - Execute an AI recommendation
 */
export async function POST(request) {
  try {
    await dbConnect();
    
    const { recommendationId, action } = await request.json();
    
    // Find and execute the recommendation
    const recommendation = await AIRecommendation.findOne({ recommendationId });
    
    if (!recommendation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Recommendation not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    // Execute the action based on type
    const executionResult = await executeRecommendation(action, recommendation);
    
    // Update recommendation status
    recommendation.executed = true;
    recommendation.executionTime = new Date();
    await recommendation.save();
    
    return NextResponse.json({
      success: true,
      data: {
        recommendationId,
        executionResult,
        executed: true
      },
      message: 'Recommendation executed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Recommendation Execution Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to generate AI recommendations
async function generateAIRecommendations(scenario, systemState) {
  const recommendations = [];
  const { trains, sections, conflicts } = systemState;
  
  switch (scenario) {
    case 'congestion':
      // High-impact congestion management recommendations
      recommendations.push({
        recommendationId: `AI_CONG_${Date.now()}`,
        type: 'PRIORITY',
        title: 'Prioritize Express Trains',
        description: 'Delay local trains by 3-5 minutes to clear main line for express services',
        impact: '18% throughput improvement',
        confidence: 94,
        urgency: 'HIGH',
        targetTrains: trains.filter(t => t.trainType === 'EXPRESS').map(t => t.trainId),
        estimatedBenefit: {
          throughputImprovement: 18,
          delayReduction: 7,
          efficiencyGain: 15
        },
        action: 'prioritize_express',
        executed: false
      });
      
      recommendations.push({
        recommendationId: `AI_ROUTE_${Date.now()}`,
        type: 'ROUTING',
        title: 'Dynamic Track Reassignment',
        description: 'Reroute freight trains to parallel tracks during peak hours',
        impact: '25% section utilization improvement',
        confidence: 87,
        urgency: 'MEDIUM',
        targetTrains: trains.filter(t => t.trainType === 'FREIGHT').map(t => t.trainId),
        estimatedBenefit: {
          throughputImprovement: 12,
          delayReduction: 4,
          efficiencyGain: 25
        },
        action: 'reroute_freight',
        executed: false
      });
      break;
      
    case 'emergency':
      recommendations.push({
        recommendationId: `AI_EMRG_${Date.now()}`,
        type: 'EMERGENCY',
        title: 'Emergency Corridor Activation',
        description: 'Clear Track 1 for emergency services, hold all trains at nearest stations',
        impact: 'Life-Critical Priority',
        confidence: 99,
        urgency: 'CRITICAL',
        targetTrains: trains.map(t => t.trainId),
        estimatedBenefit: {
          throughputImprovement: -50,
          delayReduction: 0,
          efficiencyGain: 0
        },
        action: 'emergency_clear',
        executed: false
      });
      break;
      
    case 'optimized':
      recommendations.push({
        recommendationId: `AI_OPT_${Date.now()}`,
        type: 'OPTIMIZATION',
        title: 'Predictive Speed Optimization',
        description: 'Adjust train speeds based on real-time track conditions and traffic flow',
        impact: '32% energy efficiency gain',
        confidence: 91,
        urgency: 'LOW',
        targetTrains: trains.map(t => t.trainId),
        estimatedBenefit: {
          throughputImprovement: 22,
          delayReduction: 8,
          efficiencyGain: 32
        },
        action: 'optimize_speeds',
        executed: false
      });
      break;
  }
  
  return recommendations;
}

// Helper function to execute recommendations
async function executeRecommendation(action, recommendation) {
  switch (action) {
    case 'prioritize_express':
      // Update train priorities
      await Train.updateMany(
        { trainType: 'EXPRESS' },
        { $inc: { priority: 2 } }
      );
      return { message: 'Express trains prioritized', affectedTrains: recommendation.targetTrains.length };
      
    case 'reroute_freight':
      // Simulate freight rerouting
      await Train.updateMany(
        { trainType: 'FREIGHT' },
        { $set: { 'specialInstructions': ['Rerouted to parallel track'] } }
      );
      return { message: 'Freight trains rerouted', affectedTrains: recommendation.targetTrains.length };
      
    case 'emergency_clear':
      // Emergency protocol activation
      await Train.updateMany(
        {},
        { $set: { status: 'STOPPED', 'specialInstructions': ['Emergency protocol active'] } }
      );
      return { message: 'Emergency corridor cleared', affectedTrains: recommendation.targetTrains.length };
      
    case 'optimize_speeds':
      // Speed optimization based on conditions
      await Train.updateMany(
        { status: 'RUNNING' },
        { $mul: { currentSpeed: 1.15 } }
      );
      return { message: 'Train speeds optimized', affectedTrains: recommendation.targetTrains.length };
      
    default:
      return { message: 'Action executed', details: 'Generic action completion' };
  }
}
