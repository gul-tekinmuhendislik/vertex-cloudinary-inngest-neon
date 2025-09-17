import { NextRequest, NextResponse } from 'next/server';
import { readSheet, readAllSheets, getSheetMetadata } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const spreadsheetId = searchParams.get('id');
    const range = searchParams.get('range');
    const mode = searchParams.get('mode') || 'single'; // single, all, metadata

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Spreadsheet ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (mode) {
      case 'metadata':
        result = await getSheetMetadata(spreadsheetId);
        break;

      case 'all':
        result = await readAllSheets(spreadsheetId);
        break;

      case 'single':
      default:
        result = await readSheet(spreadsheetId, range || 'A:Z');
        break;
    }

    return NextResponse.json({
      success: true,
      spreadsheetId,
      ...result
    });

  } catch (error) {
    console.error('Sheets API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read Google Sheets',
        details: error instanceof Error ? error.toString() : 'Unknown error'
      },
      { status: 500 }
    );
  }
}