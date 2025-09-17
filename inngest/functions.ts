import { inngest } from './client';

// Example function that processes images
export const processImage = inngest.createFunction(
  {
    id: 'process-image',
    name: 'Process Image with Cloudinary',
  },
  { event: 'app/image.uploaded' },
  async ({ event, step }) => {
    // Log the event
    await step.run('log-event', async () => {
      console.log('Image upload event received:', event.data);
      return { message: 'Event logged' };
    });

    // Here you can add Cloudinary processing logic
    const result = await step.run('process-with-cloudinary', async () => {
      // This is where you would integrate Cloudinary processing
      return {
        success: true,
        imageId: event.data.imageId,
        timestamp: new Date().toISOString(),
      };
    });

    // Save to database
    await step.run('save-to-database', async () => {
      // This is where you would save to Neon PostgreSQL
      console.log('Saving to database:', result);
      return { saved: true };
    });

    return {
      message: 'Image processed successfully',
      result,
    };
  }
);

// Test function
export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
    name: 'Hello World Function',
  },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.run('say-hello', async () => {
      console.log('Hello from Inngest!', event.data);
      return { message: `Hello ${event.data.name || 'World'}!` };
    });

    return {
      message: 'Function executed successfully',
      data: event.data,
    };
  }
);