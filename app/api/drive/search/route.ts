import { NextRequest, NextResponse } from 'next/server';
import { searchFiles } from '@/lib/google-drive-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('q') || '';
    const mimeType = searchParams.get('mimeType') || undefined;
    const parentId = searchParams.get('parentId') || undefined;
    const pageSize = parseInt(searchParams.get('pageSize') || '30');

    const files = await searchFiles(searchTerm, {
      mimeType,
      parentId,
      pageSize
    });

    return NextResponse.json({
      success: true,
      files,
      count: files.length,
      query: {
        searchTerm,
        mimeType,
        parentId,
        pageSize
      }
    });
  } catch (error) {
    console.error('Error searching Drive files:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search files in Google Drive'
      },
      { status: 500 }
    );
  }
}