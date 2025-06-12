import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './entities/dto/create-history.dto';
import { UpdateHistoryDto } from './entities/dto/update-history.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<History> {
    const user = await this.userRepository.findOne({
      where: { idUsuario: createHistoryDto.idUser },
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${createHistoryDto.idUser} no encontrado`,
      );
    }
    const now = new Date();
    const history = this.historyRepository.create({
      usuario: user,
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0],
      timestamp: now,
    });
    return this.historyRepository.save(history);
  }

  async update(updateHistoryDto: UpdateHistoryDto): Promise<History> {
    const history = await this.historyRepository.findOne({
      where: { idHistorial: updateHistoryDto.idHistorial },
    });
    if (!history) {
      throw new NotFoundException(
        `Historial con ID ${updateHistoryDto.idHistorial} no encontrado`,
      );
    }
    history.modo = updateHistoryDto.modo;
    return this.historyRepository.save(history);
  }

  async findAll(): Promise<History[]> {
    return this.historyRepository.find({
      relations: ['usuario', 'reportesHistorial'],
    });
  }

  async findOne(id: number): Promise<History> {
    const history = await this.historyRepository.findOne({
      where: { idHistorial: id },
      relations: ['usuario', 'reportesHistorial'],
    });
    if (!history) {
      throw new NotFoundException(`Historial con ID ${id} no encontrado`);
    }
    return history;
  }
}
