import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
  private uploadPath = 'uploads/qr-images';

  constructor(private readonly qrService: QrService) {
    // Asegurar que el directorio de uploads existe
    const fs = require('fs');
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

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

  @Post('verificar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads/qr-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
  async verificarImagen(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('No se ha proporcionado ninguna imagen');
      }

      const hash = await this.qrService.verificarImagenQR(file.path);
      const usuario = await this.qrService.obtenerUsuarioPorHash(hash);

      // Eliminar el archivo temporal después de procesarlo
      const fs = require('fs');
      fs.unlinkSync(file.path);

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
