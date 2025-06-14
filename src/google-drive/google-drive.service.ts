import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleDriveService {
  private drive;
  private SCOPES = ['https://www.googleapis.com/auth/drive.file'];
  private FOLDER_NAME = 'QRCodes';
  private folderId: string;

  constructor() {
    this.initializeGoogleDrive();
  }

  private async initializeGoogleDrive() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      projectId: process.env.GOOGLE_PROJECT_ID,
      scopes: this.SCOPES,
    });

    this.drive = google.drive({ version: 'v3', auth });
    await this.ensureQRCodesFolderExists();
  }

  private async ensureQRCodesFolderExists() {
    try {
      const response = await this.drive.files.list({
        q: `name='${this.FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id)',
      });

      if (response.data.files.length > 0) {
        this.folderId = response.data.files[0].id;
      } else {
        const folderMetadata = {
          name: this.FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        };

        const folder = await this.drive.files.create({
          requestBody: folderMetadata,
          fields: 'id',
        });

        this.folderId = folder.data.id;
      }
    } catch (error) {
      console.error('Error al crear/verificar carpeta en Google Drive:', error);
      throw error;
    }
  }

  async uploadQRCode(filePath: string, fileName: string): Promise<string> {
    try {
      const fileMetadata = {
        name: fileName,
        parents: [this.folderId],
      };

      const media = {
        mimeType: 'image/png',
        body: fs.createReadStream(filePath),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,webViewLink',
      });

      return response.data.webViewLink;
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error);
      throw error;
    }
  }
}