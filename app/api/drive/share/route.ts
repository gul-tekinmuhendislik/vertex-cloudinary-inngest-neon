import { NextRequest, NextResponse } from 'next/server';
import { shareFile } from '@/lib/google-drive-service';

export async function POST(request: NextRequest) {
  try {
    const { fileId, emailAddress, role = 'reader' } = await request.json();

    if (!fileId || !emailAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'File ID and email address are required'
        },
        { status: 400 }
      );
    }

    if (!['reader', 'writer', 'commenter'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be reader, writer, or commenter'
        },
        { status: 400 }
      );
    }

    const permission = await shareFile(fileId, emailAddress, role);

    return NextResponse.json({
      success: true,
      permission,
      message: `File shared with ${emailAddress} as ${role}`
    });
  } catch (error) {
    console.error('Error sharing Drive file:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to share file in Google Drive'
      },
      { status: 500 }
    );
  }
}