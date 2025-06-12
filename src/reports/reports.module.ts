import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { ReporteHistorial } from 'src/report-history/entity/reports-history.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { History } from 'src/history/entities/history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReporteHistorial, Admin, History]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
