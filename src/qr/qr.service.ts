import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QR } from './entities/qr.entity';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../users/entities/user.entity';

@Injectable()
export class QrService {
  constructor(
    @InjectRepository(QR)
    private readonly qrRepository: Repository<QR>,
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
    return 'Código QR generado exitosamente en ' + filePath;    
  }

  async verificarCodigoQR(hash: string): Promise<string> {
    const filePath = path.join(__dirname, '../../qrcodes', `${hash}.png`);
    if (!fs.existsSync(filePath)) {
      throw new Error('Código QR no encontrado');
    }
    return 'Código QR encontrado en ' + filePath;
  }

  async obtenerUsuarioPorHash(hash: string): Promise<User | null> {
    const qr = await this.qrRepository.findOne({
      where: { hash },
      relations: ['usuario'],
    });
    return qr?.usuario ?? null;
  }

  async registrarQR(hash: string, idUsuario: number): Promise<QR> {
    // Busca si ya existe un QR para este usuario
    let qr = await this.qrRepository.findOne({
      where: { usuario: { idUsuario } },
      relations: ['usuario'],
    });

    if (qr) {
      // Elimina el archivo QR anterior si existe
      const oldFilePath = path.join(__dirname, '../../qrcodes', `${qr.hash}.png`);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      // Actualiza el hash y el timestamp
      qr.hash = hash;
      qr.timestamp = new Date();
      await this.qrRepository.save(qr);
    } else {
      // Crea un nuevo QR
      qr = this.qrRepository.create({
        hash,
        usuario: { idUsuario },
      });
      await this.qrRepository.save(qr);
    }
    return qr;
  }
}

