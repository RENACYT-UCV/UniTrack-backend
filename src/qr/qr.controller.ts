
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QrService } from './qr.service';
import { VerificarQrDto } from './dto/verificar-qr.dto';
import { CreateQRBlockchainDto, QRBlockchainResponseDto, QRVerificationResponseDto } from './dto/create-qr-blockchain.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('QR')
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

  // New blockchain-integrated endpoints
  @Post('crear-blockchain')
  @ApiOperation({ summary: 'Crear QR y guardarlo en blockchain' })
  @ApiBody({ type: CreateQRBlockchainDto, description: 'Datos para crear QR en blockchain' })
  @ApiResponse({ status: 201, description: 'QR creado exitosamente en blockchain', type: QRBlockchainResponseDto })
  @ApiResponse({ status: 400, description: 'Error en los datos proporcionados' })
  async crearQREnBlockchain(@Body() createQRDto: CreateQRBlockchainDto): Promise<QRBlockchainResponseDto> {
    return await this.qrService.createQRWithBlockchain(createQRDto.userId, createQRDto.qrData);
  }

  @Get('blockchain/:qrHash')
  @ApiOperation({ summary: 'Obtener QR específico desde blockchain' })
  @ApiParam({ name: 'qrHash', description: 'Hash del QR a buscar' })
  @ApiResponse({ status: 200, description: 'QR encontrado en blockchain' })
  @ApiResponse({ status: 404, description: 'QR no encontrado' })
  async obtenerQRDeBlockchain(@Param('qrHash') qrHash: string) {
    return await this.qrService.getQRFromBlockchain(qrHash);
  }

  @Get('blockchain/usuario/:userId')
  @ApiOperation({ summary: 'Obtener todos los QRs de un usuario desde blockchain' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de QRs del usuario' })
  async obtenerQRsUsuarioDeBlockchain(@Param('userId') userId: string) {
    return await this.qrService.getUserQRsFromBlockchain(Number(userId));
  }

  @Get('blockchain/todos')
  @ApiOperation({ summary: 'Obtener todos los QRs desde blockchain' })
  @ApiResponse({ status: 200, description: 'Lista de todos los QRs en blockchain' })
  async obtenerTodosQRsDeBlockchain() {
    return await this.qrService.getAllQRsFromBlockchain();
  }

  @Post('verificar-blockchain')
  @ApiOperation({ summary: 'Verificar QR en blockchain' })
  @ApiBody({ type: VerificarQrDto, description: 'Hash del QR a verificar' })
  @ApiResponse({ status: 200, description: 'Resultado de verificación', type: QRVerificationResponseDto })
  async verificarQREnBlockchain(@Body() body: VerificarQrDto): Promise<QRVerificationResponseDto> {
    return await this.qrService.verificarQREnBlockchain(body.hash);
  }
}

