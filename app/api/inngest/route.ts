import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { processImage, helloWorld } from '@/inngest/functions';

// Create the serve handler
const handler = serve({
  client: inngest,
  functions: [
    processImage,
    helloWorld,
  ],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Export all required HTTP methods for Inngest
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;