import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Debug endpoint',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
      hasEventKey: !!process.env.INNGEST_EVENT_KEY,
      hasSigningKey: !!process.env.INNGEST_SIGNING_KEY,
      hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
      hasNeonDB: !!process.env.DATABASE_URL,
    },
    timestamp: new Date().toISOString(),
  });
}