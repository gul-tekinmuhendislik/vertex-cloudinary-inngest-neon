import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Test Cloudinary connection
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      timestamp: new Date().toISOString(),
      pingResult: result
    });
  } catch (error) {
    console.error('Cloudinary connection error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Cloudinary',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}