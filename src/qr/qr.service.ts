import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QR } from './entities/qr.entity';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../users/entities/user.entity';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import jsQR from 'jsqr';
import { createCanvas, loadImage } from 'canvas';

@Injectable()
export class QrService {
  constructor(
    @InjectRepository(QR)
    private readonly qrRepository: Repository<QR>,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async findByUserId(idUsuario: number) {
    return this.qrRepository
      .createQueryBuilder('r')
      .innerJoin('r.usuario', 'u')
      .select(['u.idUsuario', 'r.hash', 'r.timestamp'])
      .where('u.idUsuario = :idUsuario', { idUsuario })
      .getRawMany();
  }

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

    // Subir a Google Drive
    try {
      const driveUrl = await this.googleDriveService.uploadQRCode(
        filePath,
        `${hash}.png`,
      );
      return `Código QR generado y subido exitosamente. URL: ${driveUrl}`;
    } catch (error) {
      console.error('Error al subir a Google Drive:', error);
      return 'Código QR generado localmente, pero hubo un error al subir a Google Drive';
    }
  }

  async verificarCodigoQR(hash: string): Promise<string> {
    const filePath = path.join(__dirname, '../../qrcodes', `${hash}.png`);
    if (!fs.existsSync(filePath)) {
      throw new Error('Código QR no encontrado');
    }
    return 'Código QR encontrado en ' + filePath;
  }

  async verificarImagenQR(imagePath: string): Promise<string> {
    try {
      const image = await loadImage(imagePath);
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        return code.data;
      } else {
        throw new Error('No se pudo encontrar un código QR en la imagen');
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      throw new Error('Error al procesar la imagen del código QR');
    }
  }

  async verificarCodigoQRConExpiracion(
    hash: string,
    minutosValidez = 5,
  ): Promise<string> {
    const qr = await this.qrRepository.findOne({ where: { hash } });
    if (!qr) {
      throw new Error('Código QR no encontrado');
    }
    const ahora = new Date();
    const expiracion = new Date(qr.timestamp);
    expiracion.setMinutes(expiracion.getMinutes() + minutosValidez);
    if (ahora > expiracion) {
      throw new Error('Código QR expirado');
    }
    return 'Código QR válido y vigente';
  }

  async obtenerUsuarioPorHash(hash: string): Promise<User | null> {
    const qr = await this.qrRepository.findOne({
      where: { hash },
      relations: ['usuario'],
    });
    return qr?.usuario ?? null;
  }

  async registrarQR(
    hash: string,
    idUsuario: number,
    url?: string,
  ): Promise<QR> {
    // Verifica si el hash ya está en uso por otro usuario
    const hashExistente = await this.qrRepository.findOne({
      where: { hash },
      relations: ['usuario'],
    });
    if (hashExistente && hashExistente.usuario.idUsuario !== idUsuario) {
      throw new Error('Este hash ya está asociado a otro usuario.');
    }

    // Busca si ya existe un QR para este usuario
    let qr = await this.qrRepository.findOne({
      where: { usuario: { idUsuario } },
      relations: ['usuario'],
    });

    if (qr) {
      // Elimina el archivo QR anterior si existe
      const oldFilePath = path.join(
        __dirname,
        '../../qrcodes',
        `${qr.hash}.png`,
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      // Actualiza el hash y el timestamp
      qr.hash = hash;
      qr.timestamp = new Date();
      qr.url = url;
      await this.qrRepository.save(qr);
    } else {
      // Crea un nuevo QR
      qr = this.qrRepository.create({
        hash,
        usuario: { idUsuario },
        url,
      });
      await this.qrRepository.save(qr);
    }
    return qr;
  }

  async obtenerQRporHash(hash: string): Promise<QR | null> {
    return this.qrRepository.findOne({ where: { hash } });
  }
}
