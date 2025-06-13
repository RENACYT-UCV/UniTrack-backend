import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QrService } from './qr.service';
import { VerificarQrDto } from './dto/verificar-qr.dto';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('historial/:idUsuario')
  async historial(@Param('idUsuario') idUsuario: string) {
    return this.qrService.findByUserId(Number(idUsuario));
  }

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

  @Post('usuario-por-qr')
  async usuarioPorQr(@Body() body: { hash: string }) {
    const usuario = await this.qrService.obtenerUsuarioPorHash(body.hash);
    if (!usuario) {
      return { error: 'Usuario no encontrado para este QR' };
    }
    return usuario;
  }
}
