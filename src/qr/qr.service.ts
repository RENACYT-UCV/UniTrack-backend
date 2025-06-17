import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QR } from './entities/qr.entity';
import * as QRCode from 'qrcode';
import { User } from '../users/entities/user.entity';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import jsQR from 'jsqr';
import { createCanvas, loadImage } from 'canvas';
import * as https from 'https';

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
    // Generar el QR en memoria como un buffer
    const qrBuffer = await QRCode.toBuffer(hash, {
      color: {
        dark: '#000',
        light: '#FFF',
      },
    });

    // Subir a Google Drive
    try {
      // Crear un stream a partir del buffer para la subida
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(qrBuffer);

      const driveUrl = await this.googleDriveService.uploadQRCodeFromBuffer(
        bufferStream,
        `${hash}.png`,
      );
      return driveUrl;
    } catch (error) {
      console.error('Error al subir a Google Drive:', error);
      throw new Error('Error al subir el código QR a Google Drive');
    }
  }

  async verificarCodigoQR(hash: string): Promise<string> {
    // This method is no longer relevant as QR codes are not stored locally.
    // It might need to be re-evaluated based on new requirements.
    return 'Verification of QR code hash (not file) is handled elsewhere.';
  }

  async verificarImagenQR(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(imageUrl, (response) => {
          const data: Buffer[] = [];
          response.on('data', (chunk) => data.push(chunk));
          response.on('end', async () => {
            try {
              const imageBuffer = Buffer.concat(data);
              const image = await loadImage(imageBuffer);
              const canvas = createCanvas(image.width, image.height);
              const ctx = canvas.getContext('2d');
              ctx.drawImage(image, 0, 0);

              const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
              );
              const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
              );

              if (code) {
                resolve(code.data);
              } else {
                reject(
                  new Error('No se pudo encontrar un código QR en la imagen'),
                );
              }
            } catch (error) {
              console.error('Error al procesar la imagen:', error);
              reject(new Error('Error al procesar la imagen del código QR'));
            }
          });
        })
        .on('error', (error) => {
          console.error('Error al descargar la imagen:', error);
          reject(new Error('Error al descargar la imagen del código QR'));
        });
    });
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
    tipo: string,
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
      qr.hash = hash;
      qr.timestamp = new Date();
      qr.url = url;
      qr.tipo = tipo;
      await this.qrRepository.save(qr);
    } else {
      // Crea un nuevo QR
      qr = this.qrRepository.create({
        hash,
        usuario: { idUsuario },
        url,
        tipo,
      });
      await this.qrRepository.save(qr);
    }
    return qr;
  }

  async obtenerQRporHash(hash: string): Promise<QR | null> {
    return this.qrRepository.findOne({ where: { hash } });
  }

  async obtenerQRUrlPorUsuario(idUsuario: number): Promise<string | null> {
    const qr = await this.qrRepository.findOne({
      where: { usuario: { idUsuario } },
      order: { timestamp: 'DESC' },
    });
    return qr?.url ?? null;
  }

  async findLatestQrByUserId(idUsuario: number): Promise<QR | null> {
    const latestQr = await this.qrRepository.findOne({
      where: { usuario: { idUsuario } },
      order: { timestamp: 'DESC' },
    });
    return latestQr;
  }
}
