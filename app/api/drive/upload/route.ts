import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/google-drive-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const parentId = formData.get('parentId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadFile(
      file.name,
      file.type || 'application/octet-stream',
      buffer,
      parentId || undefined
    );

    return NextResponse.json({
      success: true,
      file: result
    });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file to Google Drive'
      },
      { status: 500 }
    );
  }
}