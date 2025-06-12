import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QR } from './entities/qr.entity';

@Injectable()
export class QrService {
  constructor(
    @InjectRepository(QR)
    private readonly reportRepository: Repository<QR>,
  ) {}

  async findByUserId(idUsuario: number) {
    return this.reportRepository
      .createQueryBuilder('r')
      .innerJoin('r.usuario', 'u')
      .select(['u.idUsuario', 'r.fecha', 'r.hora', 'r.modo'])
      .where('u.idUsuario = :idUsuario', { idUsuario })
      .getRawMany();
  }
}
