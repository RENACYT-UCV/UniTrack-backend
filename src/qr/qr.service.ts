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
    return 'Código QR generado exitosamente en ' + filePath;    
  }

  async verificarCodigoQR(hash: string): Promise<string> {
    const filePath = path.join(__dirname, '../../qrcodes', `${hash}.png`);
    if (!fs.existsSync(filePath)) {
      throw new Error('Código QR no encontrado');
    }
    return 'Código QR encontrado en ' + filePath;
  }
}
