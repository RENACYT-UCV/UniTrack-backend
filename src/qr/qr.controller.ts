import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QrService } from './qr.service';
import { VerificarQrDto } from './dto/verificar-qr.dto';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('generar')
  async generar(@Query('hash') hash: string) {
    const mensaje = await this.qrService.generarCodigoQR(hash);
    return { mensaje };
  }

  @Post('verificar')
  verificar(@Body() body: VerificarQrDto) {
    console.log('se escaneo el hash', body.hash);
    return this.qrService.verificarCodigoQR(body.hash);
  }
  
}
