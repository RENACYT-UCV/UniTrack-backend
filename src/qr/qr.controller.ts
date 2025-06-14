import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QR } from './entities/qr.entity';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { QrService } from './qr.service';
import { VerificarQrDto } from './dto/verificar-qr.dto';

@ApiTags('qr')
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('historial/:idUsuario')
  @ApiOperation({ summary: 'Retrieve QR history for a specific user' })
  @ApiParam({
    name: 'idUsuario',
    description: 'ID of the user',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved QR history.',
    type: [QR],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async historial(@Param('idUsuario') idUsuario: string) {
    return this.qrService.findByUserId(Number(idUsuario));
  }

  @Get('generar')
  @ApiOperation({ summary: 'Generate a new QR code' })
  @ApiQuery({
    name: 'hash',
    description: 'The hash to embed in the QR code',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'QR code generated successfully.' })
  async generar(@Query('hash') hash: string) {
    const mensaje = await this.qrService.generarCodigoQR(hash);
    return { mensaje };
  }

  @Post('verificarExpiracion')
  async verificar(@Body() body: VerificarQrDto) {
    try {
      const mensaje = await this.qrService.verificarCodigoQRConExpiracion(
        body.hash,
        5,
      ); // 5 minutos de validez
      return { mensaje };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('usuario-por-qr')
  @ApiOperation({ summary: 'Get user information by QR hash' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { hash: { type: 'string', example: 'somehashvalue' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User found for the given QR hash.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found for this QR.' })
  async usuarioPorQr(@Body() body: { hash: string }) {
    const usuario = await this.qrService.obtenerUsuarioPorHash(body.hash);
    if (!usuario) {
      return { error: 'Usuario no encontrado para este QR' };
    }
    return usuario;
  }
}
