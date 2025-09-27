// src/app/api/demo/scenarios/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/mongodb';
import { DemoScenario, Train, Section } from '@/lib/database/models';

/**
 * GET /api/demo/scenarios - Get all demo scenarios
 */
export async function GET() {
  try {
    await dbConnect();
    
    const scenarios = await DemoScenario.find({}).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      data: scenarios,
      count: scenarios.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Demo Scenarios API Error:', error);
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
 * POST /api/demo/scenarios/[id]/activate - Activate a demo scenario
 */
export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const scenario = await DemoScenario.findOne({ scenarioId: params.id });
    
    if (!scenario) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Scenario not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    // Deactivate all other scenarios
    await DemoScenario.updateMany({}, { isActive: false });
    
    // Activate selected scenario
    scenario.isActive = true;
    await scenario.save();
    
    // Apply scenario state to trains and sections
    if (scenario.initialState.trains) {
      for (const trainData of scenario.initialState.trains) {
        await Train.findOneAndUpdate(
          { trainId: trainData.trainId },
          trainData,
          { upsert: true, new: true }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      data: scenario,
      message: `Scenario "${scenario.name}" activated successfully`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Scenario Activation Error:', error);
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
