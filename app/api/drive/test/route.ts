import { NextRequest, NextResponse } from 'next/server';
import { listDriveFiles, readJsonFromDrive } from '@/lib/google-drive-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');
    const fileName = searchParams.get('fileName');

    if (fileId) {
      // Specific file ID verilmişse direkt oku
      const jsonData = await readJsonFromDrive(fileId);
      return NextResponse.json({
        success: true,
        data: jsonData
      });
    }

    // Dosyaları listele
    let query = undefined;
    if (fileName) {
      query = `name contains '${fileName}'`;
    }
    // Tüm dosyaları listele, sadece JSON'lara sınırlamıyoruz

    const files = await listDriveFiles(query);

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No JSON files found in Drive',
        files: []
      });
    }

    // İlk JSON dosyayı otomatik oku
    if (files.length > 0 && !fileName) {
      try {
        const firstFileId = files[0].id;
        const jsonData = await readJsonFromDrive(firstFileId as string);

        return NextResponse.json({
          success: true,
          message: `Found ${files.length} JSON files. Reading first file: ${files[0].name}`,
          files,
          selectedFile: files[0],
          data: jsonData
        });
      } catch {
        // JSON okuma başarısız olursa sadece dosya listesini döndür
        return NextResponse.json({
          success: true,
          message: `Found ${files.length} JSON files but couldn't read the content`,
          files,
          error: 'Could not parse file as JSON'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${files.length} JSON files`,
      files
    });

  } catch (error) {
    console.error('Drive test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to access Google Drive',
        details: error instanceof Error ? error.toString() : 'Unknown error'
      },
      { status: 500 }
    );
  }
}