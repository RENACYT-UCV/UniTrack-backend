/**
 * Este es un archivo de ejemplo que muestra cómo integrar el servicio de blockchain
 * con el servicio de QR existente. No es un archivo funcional, sino una guía de implementación.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QR } from '../../qr/entities/qr.entity';
import { User } from '../../users/entities/user.entity';
import { BlockchainService } from '../blockchain.service';

@Injectable()
export class QrServiceWithBlockchain {
  constructor(
    @InjectRepository(QR)
    private qrRepository: Repository<QR>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private blockchainService: BlockchainService,
  ) {}

  /**
   * Crea un nuevo QR y lo registra en la blockchain
   */
  async createQrWithBlockchain(userId: number, hash: string): Promise<QR> {
    // 1. Buscar el usuario
    const user = await this.userRepository.findOne({ where: { idUsuario: userId } });
    if (!user) {
      throw new Error(`Usuario con ID ${userId} no encontrado`);
    }

    // 2. Crear el QR en la base de datos local
    const qr = new QR();
    qr.usuario = user;
    qr.hash = hash;
    
    const savedQr = await this.qrRepository.save(qr);

    // 3. Registrar el QR en la blockchain
    try {
      const blockchainResult = await this.blockchainService.registerQr(hash, userId);
      
      if (!blockchainResult.success) {
        // Manejar el error de blockchain (podría ser registrar el error, revertir la transacción local, etc.)
        console.error(`Error registrando QR en blockchain: ${blockchainResult.error}`);
      } else {
        console.log(`QR registrado en blockchain. TX: ${blockchainResult.transactionHash}`);
        // Opcionalmente, se podría guardar el hash de la transacción en la entidad QR
      }
    } catch (error) {
      // Manejar excepciones inesperadas
      console.error('Error inesperado registrando QR en blockchain:', error);
    }

    return savedQr;
  }

  /**
   * Verifica un QR tanto en la base de datos local como en la blockchain
   */
  async verifyQr(hash: string): Promise<{ localValid: boolean; blockchainValid: boolean; qrInfo: any }> {
    // 1. Verificar en la base de datos local
    const qr = await this.qrRepository.findOne({ where: { hash }, relations: ['usuario'] });
    const localValid = !!qr;

    // 2. Verificar en la blockchain
    const blockchainValid = await this.blockchainService.verifyQr(hash);
    
    // 3. Obtener información adicional de la blockchain
    const blockchainInfo = await this.blockchainService.getQrInfo(hash);

    return {
      localValid,
      blockchainValid,
      qrInfo: {
        local: qr,
        blockchain: blockchainInfo,
      },
    };
  }

  /**
   * Invalida un QR tanto en la base de datos local como en la blockchain
   */
  async invalidateQr(hash: string): Promise<boolean> {
    // 1. Verificar que el QR exista en la base de datos local
    const qr = await this.qrRepository.findOne({ where: { hash } });
    if (!qr) {
      throw new Error(`QR con hash ${hash} no encontrado`);
    }

    // 2. Invalidar en la blockchain
    const blockchainResult = await this.blockchainService.invalidateQr(hash);
    if (!blockchainResult.success) {
      throw new Error(`Error invalidando QR en blockchain: ${blockchainResult.error}`);
    }

    // 3. Eliminar o marcar como inválido en la base de datos local
    // Opción 1: Eliminar el QR
    // await this.qrRepository.remove(qr);
    
    // Opción 2: Marcar como inválido (requeriría añadir un campo isValid a la entidad QR)
    // qr.isValid = false;
    // await this.qrRepository.save(qr);

    return true;
  }

  /**
   * Obtiene todos los QRs de un usuario, combinando datos locales y de blockchain
   */
  async getUserQrs(userId: number): Promise<any[]> {
    // 1. Obtener QRs de la base de datos local
    const localQrs = await this.qrRepository.find({
      where: { usuario: { idUsuario: userId } },
    });

    // 2. Obtener hashes de QR de la blockchain
    const blockchainQrHashes = await this.blockchainService.getUserQrs(userId);

    // 3. Combinar los resultados
    const localQrMap = new Map(localQrs.map(qr => [qr.hash, qr]));
    
    const combinedQrs = [];

    // Añadir QRs locales
    for (const localQr of localQrs) {
      combinedQrs.push({
        hash: localQr.hash,
        timestamp: localQr.timestamp,
        source: 'local',
        blockchainVerified: blockchainQrHashes.includes(localQr.hash),
      });
    }

    // Añadir QRs que solo existen en blockchain
    for (const blockchainHash of blockchainQrHashes) {
      if (!localQrMap.has(blockchainHash)) {
        const blockchainInfo = await this.blockchainService.getQrInfo(blockchainHash);
        
        combinedQrs.push({
          hash: blockchainHash,
          timestamp: new Date(blockchainInfo.timestamp * 1000), // Convertir timestamp de blockchain a Date
          source: 'blockchain',
          blockchainVerified: true,
          userId: blockchainInfo.userId,
          isValid: blockchainInfo.isValid,
        });
      }
    }

    return combinedQrs;
  }
}