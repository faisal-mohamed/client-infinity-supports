import { google } from "googleapis";
import { Readable } from "stream";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
}

/**
 * Upload a PDF buffer to Google Drive.
 * Creates a client subfolder inside the main folder if it doesn't exist.
 */
export async function uploadPDFToDrive({
  buffer,
  filename,
  clientName,
}: {
  buffer: Buffer;
  filename: string;
  clientName: string;
}): Promise<{ fileId: string; webViewLink: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: "v3", auth });
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;

  // Find or create client subfolder
  const folderId = await getOrCreateFolder(drive, clientName, parentFolderId);

  // Upload file
  const res = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
      mimeType: "application/pdf",
    },
    media: {
      mimeType: "application/pdf",
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink",
    supportsAllDrives: true,
  });

  return {
    fileId: res.data.id!,
    webViewLink: res.data.webViewLink!,
  };
}

/**
 * Upload multiple PDFs for a batch completion.
 */
export async function uploadBatchToDrive(
  files: Array<{ buffer: Buffer; filename: string }>,
  clientName: string
): Promise<Array<{ filename: string; fileId: string; webViewLink: string }>> {
  const results = [];
  for (const file of files) {
    try {
      const result = await uploadPDFToDrive({
        buffer: file.buffer,
        filename: file.filename,
        clientName,
      });
      results.push({ filename: file.filename, ...result });
      console.log(`✅ [GDRIVE] Uploaded: ${file.filename}`);
    } catch (err) {
      console.error(`❌ [GDRIVE] Failed to upload ${file.filename}:`, err);
    }
  }
  return results;
}

async function getOrCreateFolder(
  drive: any,
  folderName: string,
  parentId: string
): Promise<string> {
  // Search for existing folder
  const search = await drive.files.list({
    q: `name='${folderName.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (search.data.files?.length) {
    return search.data.files[0].id;
  }

  // Create new folder
  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
    supportsAllDrives: true,
  });

  return folder.data.id!;
}
