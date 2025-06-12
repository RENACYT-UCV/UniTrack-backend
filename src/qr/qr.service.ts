import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QrService {
  async generarCodigoQR(hash: string): Promise<string> {
    const folderPath = path.join(__dirname, '../../qrcodes');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, `${hash}.png`);

    await QRCode.toFile(filePath, hash, {
      color: {
        dark: '#000', 
        light: '#FFF', 
      },
    });

    return filePath;
  }
}
