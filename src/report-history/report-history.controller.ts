import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReportHistoryService } from './report-history.service';

@Controller('reporte-historial')
export class ReportHistoryController {
  constructor(private reportHistoryService: ReportHistoryService) {}

  @Get()
  async createReportHistory() {
    return '';
  }

  @Post()
  async updateReportHistory() {
    return '';
  }
}
