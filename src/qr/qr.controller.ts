import { Controller, Get, Param } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('reports')
export class QrController {
  constructor(private readonly reportsService: QrService) {}

  @Get('historial/:idUsuario')
  async historial(@Param('idUsuario') idUsuario: string) {
    return this.reportsService.findByUserId(Number(idUsuario));
  }
}
