import { NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

export async function GET() {
  try {
    // Send a test event to Inngest
    const result = await inngest.send({
      name: 'test/hello.world',
      data: {
        name: 'Next.js App',
        timestamp: new Date().toISOString(),
        test: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Inngest test event sent successfully',
      eventId: result.ids,
      eventKey: process.env.INNGEST_EVENT_KEY ? 'Configured' : 'Not configured',
      signingKey: process.env.INNGEST_SIGNING_KEY ? 'Configured' : 'Not configured',
    });
  } catch (error) {
    console.error('Inngest test error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to send Inngest event',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Send an image processing event
    const result = await inngest.send({
      name: 'app/image.uploaded',
      data: {
        imageId: 'test-image-123',
        url: 'https://example.com/image.jpg',
        userId: 'user-456',
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Image processing event sent to Inngest',
      eventId: result.ids,
    });
  } catch (error) {
    console.error('Inngest image event error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to send image processing event',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}