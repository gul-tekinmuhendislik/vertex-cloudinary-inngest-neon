import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'vertex-cloudinary-app',
  eventKey: process.env.INNGEST_EVENT_KEY,
  isProduction: process.env.NODE_ENV === 'production',
});