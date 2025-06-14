import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async findByUserId(idUsuario: number) {
    return this.historyRepository
      .createQueryBuilder('r')
      .innerJoin('r.usuario', 'u')
      .select(['u.idUsuario', 'u.nombres', 'u.correo', 'r.fecha', 'r.hora', 'r.modo'])
      .where('u.idUsuario = :idUsuario', { idUsuario })
      .getRawMany();
  }
}
