import { google } from 'googleapis';

export async function getDriveServiceWithServiceAccount(scopes?: string[]) {
  let auth;
  let credentials = null;

  // Önce Base64 encoded credential'ı kontrol et (Vercel için)
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (base64Key) {
    try {
      const decodedKey = Buffer.from(base64Key, 'base64').toString('utf-8');
      credentials = JSON.parse(decodedKey);
    } catch (error) {
      console.error('Error decoding Base64 credentials:', error);
    }
  }

  // Base64 yoksa direkt JSON string dene
  if (!credentials) {
    const jsonKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (jsonKey) {
      try {
        credentials = JSON.parse(jsonKey);
      } catch (error) {
        console.error('Error parsing JSON credentials:', error);
      }
    }
  }

  // Credentials varsa kullan
  if (credentials) {
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: scopes || ['https://www.googleapis.com/auth/drive']
    });
  } else {
    // Fallback to application default credentials
    console.log('No service account key found, using application default credentials');
    auth = new google.auth.GoogleAuth({
      scopes: scopes || ['https://www.googleapis.com/auth/drive']
    });
  }

  return google.drive({ version: 'v3', auth });
}

export async function listDriveFiles(query?: string, pageSize: number = 30) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const response = await drive.files.list({
      pageSize,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, parents)',
      q: query || undefined,
      orderBy: 'modifiedTime desc'
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error listing Drive files:', error);
    throw error;
  }
}

export async function getDriveFile(fileId: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const metadata = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, parents'
    });

    return metadata.data;
  } catch (error) {
    console.error('Error getting Drive file metadata:', error);
    throw error;
  }
}

export async function downloadDriveFile(fileId: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    // Google Docs, Sheets, Slides gibi dosyalar için export
    const file = await getDriveFile(fileId);

    if (file.mimeType?.includes('google-apps')) {
      // Google dokümanları için export
      let mimeType = 'application/pdf'; // default

      if (file.mimeType.includes('document')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (file.mimeType.includes('spreadsheet')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (file.mimeType.includes('presentation')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      }

      const response = await drive.files.export({
        fileId,
        mimeType
      }, {
        responseType: 'stream'
      });

      return response.data;
    } else {
      // Normal dosyalar için download
      const response = await drive.files.get({
        fileId,
        alt: 'media'
      }, {
        responseType: 'stream'
      });

      return response.data;
    }
  } catch (error) {
    console.error('Error downloading Drive file:', error);
    throw error;
  }
}

export async function readJsonFromDrive(fileId: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const response = await drive.files.get({
      fileId,
      alt: 'media'
    });

    // JSON olarak parse et
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);
    } else if (typeof response.data === 'object') {
      return response.data;
    }

    throw new Error('Unable to parse file as JSON');
  } catch (error) {
    console.error('Error reading JSON from Drive:', error);
    throw error;
  }
}

export async function uploadFile(
  name: string,
  mimeType: string,
  content: Buffer | string | NodeJS.ReadableStream,
  parentId?: string
) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const fileMetadata: {name: string; mimeType: string; parents?: string[]} = {
      name,
      mimeType
    };

    if (parentId) {
      fileMetadata.parents = [parentId];
    }

    const media = {
      mimeType,
      body: content
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, mimeType, size, modifiedTime, webViewLink, parents'
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading file to Drive:', error);
    throw error;
  }
}

export async function updateFile(
  fileId: string,
  content: Buffer | string | NodeJS.ReadableStream,
  mimeType?: string,
  name?: string
) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const fileMetadata: {name?: string} = {};
    if (name) fileMetadata.name = name;

    const media = mimeType ? {
      mimeType,
      body: content
    } : {
      body: content
    };

    const response = await drive.files.update({
      fileId,
      requestBody: fileMetadata,
      media,
      fields: 'id, name, mimeType, size, modifiedTime, webViewLink'
    });

    return response.data;
  } catch (error) {
    console.error('Error updating file in Drive:', error);
    throw error;
  }
}

export async function deleteFile(fileId: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    await drive.files.delete({
      fileId
    });

    return { success: true, fileId };
  } catch (error) {
    console.error('Error deleting file from Drive:', error);
    throw error;
  }
}

export async function createFolder(name: string, parentId?: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const fileMetadata: {name: string; mimeType: string; parents?: string[]} = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    };

    if (parentId) {
      fileMetadata.parents = [parentId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name, mimeType, webViewLink'
    });

    return response.data;
  } catch (error) {
    console.error('Error creating folder in Drive:', error);
    throw error;
  }
}

export async function moveFile(fileId: string, newParentId: string, oldParentId?: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    // If oldParentId is not provided, get current parents
    let removeParents = oldParentId;
    if (!removeParents) {
      const file = await getDriveFile(fileId);
      removeParents = file.parents ? file.parents.join(',') : undefined;
    }

    const response = await drive.files.update({
      fileId,
      addParents: newParentId,
      removeParents,
      fields: 'id, name, parents'
    });

    return response.data;
  } catch (error) {
    console.error('Error moving file in Drive:', error);
    throw error;
  }
}

export async function copyFile(fileId: string, newName?: string, parentId?: string) {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const requestBody: {name?: string; parents?: string[]} = {};
    if (newName) requestBody.name = newName;
    if (parentId) requestBody.parents = [parentId];

    const response = await drive.files.copy({
      fileId,
      requestBody,
      fields: 'id, name, mimeType, size, modifiedTime, webViewLink, parents'
    });

    return response.data;
  } catch (error) {
    console.error('Error copying file in Drive:', error);
    throw error;
  }
}

export async function shareFile(fileId: string, emailAddress: string, role: 'reader' | 'writer' | 'commenter' = 'reader') {
  try {
    const drive = await getDriveServiceWithServiceAccount();

    const response = await drive.permissions.create({
      fileId,
      requestBody: {
        type: 'user',
        role,
        emailAddress
      },
      fields: 'id, emailAddress, role'
    });

    return response.data;
  } catch (error) {
    console.error('Error sharing file in Drive:', error);
    throw error;
  }
}

export async function searchFiles(searchTerm: string, options?: {
  mimeType?: string;
  parentId?: string;
  pageSize?: number;
  orderBy?: string;
}) {
  try {
    const queries: string[] = [];

    if (searchTerm) {
      queries.push(`fullText contains '${searchTerm}'`);
    }

    if (options?.mimeType) {
      queries.push(`mimeType='${options.mimeType}'`);
    }

    if (options?.parentId) {
      queries.push(`'${options.parentId}' in parents`);
    }

    const query = queries.join(' and ');

    const files = await listDriveFiles(
      query,
      options?.pageSize || 30
    );

    return files;
  } catch (error) {
    console.error('Error searching files in Drive:', error);
    throw error;
  }
}