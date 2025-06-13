import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QR } from './entities/qr.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
import { SubmitQRDTO } from '../blockchain/dto';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

@Injectable()
export class QrService {
  constructor(
    @InjectRepository(QR)
    private readonly qrRepository: Repository<QR>,
    private readonly blockchainService: BlockchainService,
  ) {}

  async findByUserId(idUsuario: number) {
    return this.qrRepository
      .createQueryBuilder('r')
      .innerJoin('r.usuario', 'u')
      .select(['u.idUsuario', 'r.hora', 'r.modo'])
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

  // New blockchain-integrated methods
  async createQRWithBlockchain(
    userId: number,
    qrData?: any,
  ): Promise<{ qrHash: string; blockHash: string; message: string }> {
    // Generate a unique QR hash
    const timestamp = new Date().getTime().toString();
    const qrHash = createHash('sha256')
      .update(`${userId}-${timestamp}`)
      .digest('hex');

    // Request ownership verification message
    const message =
      await this.blockchainService.requestQROwnershipVerification(userId);

    // Create submission data
    const submitQRData: SubmitQRDTO = {
      userId,
      qrHash,
      message,
      signature: `signature_${userId}_${timestamp}`, // In real implementation, this should be properly signed
      qrData,
    };

    // Submit to blockchain
    const block = await this.blockchainService.submitQR(submitQRData);

    // Generate QR code image
    await this.generarCodigoQR(qrHash);

    // Save to database
    const qrEntity = this.qrRepository.create({
      hash: qrHash,
      usuario: { idUsuario: userId } as any,
      timestamp: new Date(),
    });
    await this.qrRepository.save(qrEntity);

    return {
      qrHash,
      blockHash: block.hash,
      message: 'QR creado y guardado en blockchain exitosamente',
    };
  }

  async getQRFromBlockchain(qrHash: string) {
    return await this.blockchainService.getQRByHash(qrHash);
  }

  async getUserQRsFromBlockchain(userId: number) {
    return await this.blockchainService.getQRsByUserId(userId);
  }

  async getAllQRsFromBlockchain() {
    return await this.blockchainService.getAllQRs();
  }

  async verificarQREnBlockchain(
    qrHash: string,
  ): Promise<{ found: boolean; data?: any; message: string }> {
    try {
      const qrData = await this.blockchainService.getQRByHash(qrHash);
      if (qrData) {
        return {
          found: true,
          data: qrData,
          message: 'QR encontrado en blockchain',
        };
      } else {
        return {
          found: false,
          message: 'QR no encontrado en blockchain',
        };
      }
    } catch (error) {
      return {
        found: false,
        message: 'Error al verificar QR en blockchain: ' + error.message,
      };
    }
  }
}
