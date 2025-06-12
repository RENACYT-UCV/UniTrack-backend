import { Controller, Get, Query } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('generar')
  async generar(@Query('hash') hash: string) {
    const mensaje = await this.qrService.generarCodigoQR(hash);
    return { mensaje };
  }
  
}
