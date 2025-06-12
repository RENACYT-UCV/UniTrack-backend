import { Controller, Get, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('historial')
export class HistoryController {
  constructor(private readonly HistoryService: HistoryService) {}

  @Get('historial/:idUsuario')
  async historial(@Param('idUsuario') idUsuario: string) {
    return this.HistoryService.findByUserId(Number(idUsuario));
  }
}
