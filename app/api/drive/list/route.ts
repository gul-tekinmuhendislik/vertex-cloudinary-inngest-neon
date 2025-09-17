import { NextRequest, NextResponse } from 'next/server';
import { listDriveFiles } from '@/lib/google-drive-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || undefined;
    const pageSize = parseInt(searchParams.get('pageSize') || '30');
    const mimeType = searchParams.get('mimeType') || undefined;

    let driveQuery = query;
    if (mimeType) {
      driveQuery = query ? `${query} and mimeType='${mimeType}'` : `mimeType='${mimeType}'`;
    }

    const files = await listDriveFiles(driveQuery, pageSize);

    return NextResponse.json({
      success: true,
      files,
      count: files.length
    });
  } catch (error) {
    console.error('Error in Drive list API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files from Google Drive'
      },
      { status: 500 }
    );
  }
}