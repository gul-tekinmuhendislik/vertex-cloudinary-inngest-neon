import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // Create Neon client
    const sql = neon(process.env.DATABASE_URL!);

    // Test connection with a simple query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;

    // Get database name
    const dbInfo = await sql`SELECT current_database() as database_name`;

    return NextResponse.json({
      success: true,
      message: 'Neon PostgreSQL connection successful',
      database: dbInfo[0].database_name,
      timestamp: result[0].current_time,
      postgresVersion: result[0].pg_version,
      connectionString: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'hidden'
    });
  } catch (error) {
    console.error('Neon connection error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Neon PostgreSQL',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}