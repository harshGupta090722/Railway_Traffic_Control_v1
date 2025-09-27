// src/app/api/trains/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/mongodb';
import Train from '@/lib/database/models/Train';

/**
 * GET /api/trains/[id] - Get specific train details
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const train = await Train.findOne({ trainId: params.id });
    
    if (!train) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Train not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    // Enhanced train data for frontend
    const enhancedTrain = {
      ...train.toObject(),
      isRunning: train.isRunning,
      isDelayed: train.isDelayed,
      speedStatus: train.speedStatus,
      nextStation: train.getNextStation(),
      estimatedArrival: train.schedule.arrivalTime,
      routeProgress: train.schedule.route.filter(s => s.isCompleted).length
    };
    
    return NextResponse.json({
      success: true,
      data: enhancedTrain,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Train Details API Error:', error);
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
 * PUT /api/trains/[id] - Update train information
 */
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const updates = await request.json();
    
    const train = await Train.findOneAndUpdate(
      { trainId: params.id },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!train) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Train not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: train,
      message: 'Train updated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Train Update Error:', error);
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
 * PATCH /api/trains/[id]/position - Update train position (for 3D visualization)
 */
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { sectionId, coordinates } = await request.json();
    
    const train = await Train.findOne({ trainId: params.id });
    
    if (!train) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Train not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    await train.updatePosition(sectionId, coordinates);
    
    return NextResponse.json({
      success: true,
      data: {
        trainId: train.trainId,
        position: train.currentPosition
      },
      message: 'Position updated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Position Update Error:', error);
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
