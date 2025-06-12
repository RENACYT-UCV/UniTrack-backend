import { Controller, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('historial')
export class HistoryController {
  constructor(private HistoryService: HistoryService) {}

  @Get()
  async createHistory() {
    return null;
  }

  @Post()
  async updateHistory() {
    return null;
  }
}
