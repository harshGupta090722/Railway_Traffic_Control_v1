// src/app/api/metrics/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/mongodb';
import { PerformanceMetrics, Train, Section, Conflict } from '@/lib/database/models';

/**
 * GET /api/metrics - Get real-time performance metrics
 */
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const scenario = searchParams.get('scenario') || 'normal';
    const timeRange = parseInt(searchParams.get('timeRange')) || 24; // hours
    
    // Calculate current metrics from live data
    const currentMetrics = await calculateCurrentMetrics(scenario);
    
    // Get historical metrics for trends
    const startTime = new Date(Date.now() - timeRange * 60 * 60 * 1000);
    const historicalMetrics = await PerformanceMetrics.find({
      timestamp: { $gte: startTime }
    }).sort({ timestamp: -1 }).limit(50);
    
    // Calculate trends
    const trends = calculateTrends(historicalMetrics);
    
    return NextResponse.json({
      success: true,
      data: {
        current: currentMetrics,
        historical: historicalMetrics,
        trends: trends,
        scenario: scenario
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Metrics API Error:', error);
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
 * POST /api/metrics - Record new performance metrics
 */
export async function POST(request) {
  try {
    await dbConnect();
    
    const metricsData = await request.json();
    
    const metrics = new PerformanceMetrics(metricsData);
    await metrics.save();
    
    return NextResponse.json({
      success: true,
      data: metrics,
      message: 'Metrics recorded successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Metrics Creation Error:', error);
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

// Helper function to calculate current metrics
async function calculateCurrentMetrics(scenario) {
  const trains = await Train.find({});
  const sections = await Section.find({});
  const conflicts = await Conflict.find({ status: 'ACTIVE' });
  
  const runningTrains = trains.filter(t => t.status === 'RUNNING');
  const delayedTrains = trains.filter(t => t.delay > 0);
  
  // Calculate throughput (trains per hour)
  const throughput = runningTrains.length > 0 ? 
    Math.min((runningTrains.length / sections.length) * 10, 100) : 0;
  
  // Calculate average delay
  const averageDelay = delayedTrains.length > 0 ?
    delayedTrains.reduce((sum, t) => sum + t.delay, 0) / delayedTrains.length : 0;
  
  // Calculate efficiency based on scenario
  let baseEfficiency = 85;
  switch (scenario) {
    case 'congestion':
      baseEfficiency = 72;
      break;
    case 'emergency':
      baseEfficiency = 45;
      break;
    case 'optimized':
      baseEfficiency = 96;
      break;
  }
  
  const efficiency = Math.max(baseEfficiency - (conflicts.length * 5), 0);
  
  return {
    throughput: Math.round(throughput),
    averageDelay: Math.round(averageDelay * 10) / 10,
    efficiency: Math.round(efficiency),
    conflicts: conflicts.length,
    totalTrains: trains.length,
    activeTrains: runningTrains.length,
    sectionsUtilized: sections.filter(s => s.currentLoad > 0).length,
    scenario: scenario,
    timestamp: new Date()
  };
}

// Helper function to calculate trends
function calculateTrends(historicalData) {
  if (historicalData.length < 2) return null;
  
  const latest = historicalData[0];
  const previous = historicalData[Math.min(5, historicalData.length - 1)];
  
  return {
    throughput: {
      value: latest.throughput - previous.throughput,
      percentage: ((latest.throughput - previous.throughput) / previous.throughput * 100).toFixed(1)
    },
    efficiency: {
      value: latest.efficiency - previous.efficiency,
      percentage: ((latest.efficiency - previous.efficiency) / previous.efficiency * 100).toFixed(1)
    },
    averageDelay: {
      value: latest.averageDelay - previous.averageDelay,
      percentage: previous.averageDelay > 0 ? 
        ((latest.averageDelay - previous.averageDelay) / previous.averageDelay * 100).toFixed(1) : 0
    }
  };
}
