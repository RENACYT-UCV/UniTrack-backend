import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UpdateHistoryDto } from './entities/dto/update-history.dto';
import { CreateHistoryDto } from './entities/dto/create-history.dto';

@Controller('historial')
export class HistoryController {
  constructor(private HistoryService: HistoryService) {}

  @Get()
  async createHistory(@Body() history: CreateHistoryDto) {
    return null;
  }

  @Post()
  async updateHistory(@Body() history: UpdateHistoryDto) {
    return null;
  }
}
