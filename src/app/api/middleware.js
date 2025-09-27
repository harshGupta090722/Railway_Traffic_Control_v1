// src/lib/api/middleware.js
import { NextResponse } from 'next/server';

/**
 * Error handling middleware
 */
export function withErrorHandler(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('❌ API Error:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Internal server error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Request validation middleware
 */
export function withValidation(schema) {
  return function(handler) {
    return async (request, context) => {
      try {
        if (request.method === 'POST' || request.method === 'PUT') {
          const body = await request.json();
          const validation = schema.safeParse(body);
          
          if (!validation.success) {
            return NextResponse.json(
              {
                success: false,
                error: 'Validation failed',
                details: validation.error.errors,
                timestamp: new Date().toISOString()
              },
              { status: 400 }
            );
          }
        }
        
        return await handler(request, context);
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request format',
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
      }
    };
  };
}

/**
 * CORS middleware for API routes
 */
export function withCORS(handler) {
  return async (request, context) => {
    const response = await handler(request, context);
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  };
}
