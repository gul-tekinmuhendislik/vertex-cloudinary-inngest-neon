import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { processImage, helloWorld } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processImage,
    helloWorld,
  ],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});