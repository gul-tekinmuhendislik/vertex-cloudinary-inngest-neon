import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const method = searchParams.get('method') || 'oauth';

    if (method === 'oauth') {
      // OAuth2 flow için authorization URL oluştur
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
      );

      const scopes = [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file'
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      });

      return NextResponse.json({ authUrl });
    } else {
      // Service account veya application default credentials check
      try {
        const auth = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        await auth.getClient();
        const projectId = await auth.getProjectId();

        return NextResponse.json({
          authenticated: true,
          method: 'application_default_credentials',
          projectId
        });
      } catch {
        return NextResponse.json({
          authenticated: false,
          message: 'No authentication configured. Please set up OAuth2 or service account credentials.'
        });
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}