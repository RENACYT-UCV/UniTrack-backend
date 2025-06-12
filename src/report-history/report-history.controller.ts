import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReportHistoryService } from './report-history.service';
import { CreateReportsHistoryDto } from './entity/dto/create-reports-history.dto';
import { UpdateReportsHistoryDto } from './entity/dto/update-reports-history.dto';

@Controller('reporte-historial')
export class ReportHistoryController {
  constructor(private reportHistoryService: ReportHistoryService) {}

  @Get()
  async createReportHistory(
    @Body() createReportsHistory: CreateReportsHistoryDto,
  ) {
    return '';
  }

  @Post()
  async updateReportHistory(
    @Body() updateReportHistory: UpdateReportsHistoryDto,
  ) {
    return '';
  }
}
