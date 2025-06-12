import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportsDto } from './entities/dto/create-reports.dto';
import { Admin } from '../admin/entities/admin.entity';
import { History } from '../history/entities/history.entity';
import { ReporteHistorial } from 'src/report-history/entity/reports-history.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(ReporteHistorial)
    private readonly reportsHistoryRepository: Repository<ReporteHistorial>,
  ) {}

  /**
   * Crea un nuevo reporte asociando historiales existentes
   */
  async create(
    createReportsDto: CreateReportsDto,
  ): Promise<{ message: string }> {
    const admin = await this.adminRepository.findOne({
      where: { idAdmin: createReportsDto.idAdmin },
    });
    if (!admin) {
      throw new NotFoundException(
        `Admin con ID ${createReportsDto.idAdmin} no encontrado`,
      );
    }

    // Verificar y recolectar historiales
    const historiales: History[] = [];
    for (const idHistorial of createReportsDto.historiales) {
      const historial = await this.historyRepository.findOne({
        where: { idHistorial },
      });
      if (!historial) {
        throw new NotFoundException(
          `Historial con ID ${idHistorial} no encontrado`,
        );
      }
      historiales.push(historial);
    }

    // Crear reporte
    const report = this.reportsRepository.create({
      admin,
      fecha: createReportsDto.fechaHora,
    });
    const savedReport = await this.reportsRepository.save(report);

    // Asociar historiales al reporte
    for (const historial of historiales) {
      const link = this.reportsHistoryRepository.create({
        historial,
        reporte: savedReport,
      });
      await this.reportsHistoryRepository.save(link);
    }

    return { message: 'Reporte creado correctamente' };
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.find({
      relations: ['admin', 'reportesHistorial'],
    });
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { idReporte: id },
      relations: ['admin', 'reportesHistorial'],
    });
    if (!report) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
    return report;
  }

}
