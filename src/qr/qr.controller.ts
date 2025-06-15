import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
  async verificarImagen(@Body() body: { imagePath: string }) {
    try {
      const hash = await this.qrService.verificarImagenQR(body.imagePath);
      const usuario = await this.qrService.obtenerUsuarioPorHash(hash);



      if (!usuario) {
        return { error: 'No se encontró un usuario asociado a este código QR' };
      }

      return { usuario, hash };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('verificarExpiracion')
  async verificar(@Body() body: VerificarQrDto) {
    try {
      const mensaje = await this.qrService.verificarCodigoQRConExpiracion(
        body.hash,
        5,
      );
      // Usa el método público para obtener el QR y su URL
      const qr = await this.qrService.obtenerQRporHash(body.hash);
      return { mensaje, qrUrl: qr?.url ?? null };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('usuario-por-qr')

  async usuarioPorQr(@Body() body: { idUsuario: number }) {
    const qrUrl = await this.qrService.obtenerQRUrlPorUsuario(body.idUsuario);
    if (!qrUrl) {
      return { error: 'No se encontró un QR para este usuario' };
    }
    return { qrUrl };
  }
}
