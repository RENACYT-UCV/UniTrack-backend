import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportsDto } from './entities/dto/create-reports.dto';
import { UpdateReportsDto } from './entities/dto/update-reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async createUser(@Body() createReportDto: CreateReportsDto) {
    return null;
  }

  @Put()
  async updateUser(@Body() createReportDto: UpdateReportsDto) {
    return null;
  }
}
