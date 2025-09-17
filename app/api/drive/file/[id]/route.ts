import { NextRequest, NextResponse } from 'next/server';
import {
  getDriveFile,
  downloadDriveFile,
  readJsonFromDrive,
  updateFile,
  deleteFile,
  moveFile,
  copyFile
} from '@/lib/google-drive-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'metadata';

    if (type === 'content') {
      const stream = await downloadDriveFile(id);
      return new NextResponse(stream as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="download"`
        }
      });
    } else if (type === 'json') {
      const jsonData = await readJsonFromDrive(id);
      return NextResponse.json({
        success: true,
        data: jsonData
      });
    } else {
      const metadata = await getDriveFile(id);
      return NextResponse.json({
        success: true,
        metadata
      });
    }
  } catch (error) {
    console.error('Error in Drive file GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file from Google Drive'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const name = formData.get('name') as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await updateFile(
        id,
        buffer,
        file.type || 'application/octet-stream',
        name || undefined
      );

      return NextResponse.json({
        success: true,
        file: result
      });
    } else {
      const data = await request.json();
      const { action, ...params } = data;

      switch (action) {
        case 'move':
          if (!params.newParentId) {
            return NextResponse.json(
              { success: false, error: 'New parent ID is required' },
              { status: 400 }
            );
          }
          const movedFile = await moveFile(id, params.newParentId, params.oldParentId);
          return NextResponse.json({
            success: true,
            file: movedFile
          });

        case 'copy':
          const copiedFile = await copyFile(id, params.name, params.parentId);
          return NextResponse.json({
            success: true,
            file: copiedFile
          });

        default:
          return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
          );
      }
    }
  } catch (error) {
    console.error('Error in Drive file PUT:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update file in Google Drive'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteFile(id);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error in Drive file DELETE:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file from Google Drive'
      },
      { status: 500 }
    );
  }
}