import { NextRequest, NextResponse } from 'next/server';
import { createFolder } from '@/lib/google-drive-service';

export async function POST(request: NextRequest) {
  try {
    const { name, parentId } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Folder name is required' },
        { status: 400 }
      );
    }

    const folder = await createFolder(name, parentId);

    return NextResponse.json({
      success: true,
      folder
    });
  } catch (error) {
    console.error('Error creating folder in Drive:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create folder in Google Drive'
      },
      { status: 500 }
    );
  }
}