import { google } from 'googleapis';

export async function getSheetsService() {
  let credentials = null;

  // Önce Base64 encoded credential'ı kontrol et (Vercel için)
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (base64Key) {
    try {
      const decodedKey = Buffer.from(base64Key, 'base64').toString('utf-8');
      credentials = JSON.parse(decodedKey);
    } catch (error) {
      console.error('Error decoding Base64 credentials for Sheets:', error);
    }
  }

  // Base64 yoksa direkt JSON string dene
  if (!credentials) {
    const jsonKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (jsonKey) {
      try {
        credentials = JSON.parse(jsonKey);
      } catch (error) {
        console.error('Error parsing JSON credentials for Sheets:', error);
      }
    }
  }

  const auth = new google.auth.GoogleAuth({
    credentials: credentials || undefined,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function readSheet(spreadsheetId: string, range: string = 'A:Z') {
  try {
    const sheets = await getSheetsService();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return { data: [], message: 'No data found in sheet' };
    }

    // İlk satırı header olarak al
    const headers = rows[0];
    const data = [];

    // Geri kalan satırları JSON objesine çevir
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowData: Record<string, string> = {};

      headers.forEach((header: string, index: number) => {
        rowData[header] = row[index] || '';
      });

      data.push(rowData);
    }

    return {
      headers,
      data,
      totalRows: rows.length - 1,
      raw: rows
    };

  } catch (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }
}

export async function getSheetMetadata(spreadsheetId: string) {
  try {
    const sheets = await getSheetsService();

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'properties,sheets.properties'
    });

    return {
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map(sheet => ({
        id: sheet.properties?.sheetId,
        title: sheet.properties?.title,
        index: sheet.properties?.index,
        gridProperties: sheet.properties?.gridProperties
      }))
    };

  } catch (error) {
    console.error('Error getting sheet metadata:', error);
    throw error;
  }
}

export async function readAllSheets(spreadsheetId: string) {
  try {
    const metadata = await getSheetMetadata(spreadsheetId);
    const allData: {spreadsheet: string | null | undefined; sheets: Array<{name: string; headers?: string[]; data?: Record<string, string>[]; totalRows?: number; raw?: unknown[][]}>} = {
      spreadsheet: metadata.title,
      sheets: []
    };

    if (metadata.sheets) {
      for (const sheet of metadata.sheets) {
        if (sheet.title) {
          const sheetData = await readSheet(spreadsheetId, `'${sheet.title}'!A:Z`);
          allData.sheets.push({
            name: sheet.title,
            ...sheetData
          });
        }
      }
    }

    return allData;

  } catch (error) {
    console.error('Error reading all sheets:', error);
    throw error;
  }
}