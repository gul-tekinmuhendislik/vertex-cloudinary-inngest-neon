import { google } from 'googleapis';

export function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
  );

  if (process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDriveService(auth: any) {
  return google.drive({ version: 'v3', auth });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function listFiles(auth: any, query?: string) {
  const drive = await getDriveService(auth);

  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
      q: query,
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFileContent(auth: any, fileId: string) {
  const drive = await getDriveService(auth);

  try {
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    }, {
      responseType: 'stream'
    });

    return response.data;
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFileMetadata(auth: any, fileId: string) {
  const drive = await getDriveService(auth);

  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, modifiedTime, parents, webViewLink, webContentLink',
    });

    return response.data;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
}