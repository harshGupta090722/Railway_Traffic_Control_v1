// src/app/api/sections/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/mongodb';
import Section from '@/lib/database/models/Section';

/**
 * GET /api/sections - Retrieve all sections with utilization data
 */
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minCapacity = searchParams.get('minCapacity');
    
    let query = {};
    if (status) query.status = status;
    if (minCapacity) query.capacity = { $gte: parseInt(minCapacity) };
    
    const sections = await Section.find(query).sort({ sectionId: 1 });
    
    // Enhanced sections with utilization metrics
    const enhancedSections = sections.map(section => ({
      ...section.toObject(),
      utilizationRate: section.utilizationRate,
      availableCapacity: section.capacity - section.currentLoad,
      isOvercrowded: section.currentLoad > section.capacity * 0.8,
      signalStatus: section.blocks.length > 0 ? section.blocks[0].signalStatus : 'GREEN'
    }));
    
    return NextResponse.json({
      success: true,
      data: enhancedSections,
      count: enhancedSections.length,
      summary: {
        totalSections: enhancedSections.length,
        normalSections: enhancedSections.filter(s => s.status === 'NORMAL').length,
        congestedSections: enhancedSections.filter(s => s.status === 'CONGESTED').length,
        averageUtilization: enhancedSections.reduce((acc, s) => acc + s.utilizationRate, 0) / enhancedSections.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sections API Error:', error);
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
 * POST /api/sections - Create new section (for demo setup)
 */
export async function POST(request) {
  try {
    await dbConnect();
    
    const sectionData = await request.json();
    
    const section = new Section(sectionData);
    await section.save();
    
    return NextResponse.json({
      success: true,
      data: section,
      message: 'Section created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Section Creation Error:', error);
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
