import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

class RegisterQrDto {
  hash: string;
  userId: number;
}

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('status')
  @ApiOperation({ summary: 'Obtiene el estado de la conexión con la blockchain' })
  @ApiResponse({ status: 200, description: 'Estado de la conexión con la blockchain' })
  async getStatus() {
    const isConfigured = this.blockchainService.isConfigured();
    const balance = await this.blockchainService.getWalletBalance();
    const totalQrs = await this.blockchainService.getTotalQrs();

    return {
      isConfigured,
      balance,
      totalQrs,
      provider: 'Polygon Amoy Testnet',
    };
  }

  @Post('register-qr')
  @ApiOperation({ summary: 'Registra un QR en la blockchain' })
  @ApiBody({ type: RegisterQrDto })
  @ApiResponse({ status: 201, description: 'QR registrado correctamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos proporcionados' })
  @ApiResponse({ status: 500, description: 'Error en la blockchain' })
  async registerQr(@Body() registerQrDto: RegisterQrDto) {
    const { hash, userId } = registerQrDto;

    if (!hash || !userId) {
      throw new HttpException('Hash y userId son requeridos', HttpStatus.BAD_REQUEST);
    }

    const result = await this.blockchainService.registerQr(hash, userId);

    if (!result.success) {
      throw new HttpException(
        `Error registrando QR en blockchain: ${result.error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      success: true,
      transactionHash: result.transactionHash,
      message: 'QR registrado correctamente en la blockchain',
    };
  }

  @Get('verify-qr/:hash')
  @ApiOperation({ summary: 'Verifica si un QR es válido en la blockchain' })
  @ApiParam({ name: 'hash', description: 'Hash del QR a verificar' })
  @ApiResponse({ status: 200, description: 'Resultado de la verificación' })
  async verifyQr(@Param('hash') hash: string) {
    if (!hash) {
      throw new HttpException('Hash es requerido', HttpStatus.BAD_REQUEST);
    }

    const isValid = await this.blockchainService.verifyQr(hash);
    const qrInfo = await this.blockchainService.getQrInfo(hash);

    return {
      isValid,
      qrInfo,
    };
  }

  @Get('user-qrs/:userId')
  @ApiOperation({ summary: 'Obtiene todos los QRs de un usuario desde la blockchain' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de QRs del usuario' })
  async getUserQrs(@Param('userId') userId: string) {
    const userIdNumber = parseInt(userId, 10);

    if (isNaN(userIdNumber)) {
      throw new HttpException('userId debe ser un número', HttpStatus.BAD_REQUEST);
    }

    const qrHashes = await this.blockchainService.getUserQrs(userIdNumber);

    // Obtener información detallada de cada QR
    const qrDetails = await Promise.all(
      qrHashes.map(async (hash) => {
        const info = await this.blockchainService.getQrInfo(hash);
        return {
          hash,
          ...info,
        };
      })
    );

    return {
      userId: userIdNumber,
      totalQrs: qrHashes.length,
      qrs: qrDetails,
    };
  }

  @Post('invalidate-qr/:hash')
  @ApiOperation({ summary: 'Invalida un QR en la blockchain' })
  @ApiParam({ name: 'hash', description: 'Hash del QR a invalidar' })
  @ApiResponse({ status: 200, description: 'QR invalidado correctamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos proporcionados' })
  @ApiResponse({ status: 500, description: 'Error en la blockchain' })
  async invalidateQr(@Param('hash') hash: string) {
    if (!hash) {
      throw new HttpException('Hash es requerido', HttpStatus.BAD_REQUEST);
    }

    const result = await this.blockchainService.invalidateQr(hash);

    if (!result.success) {
      throw new HttpException(
        `Error invalidando QR en blockchain: ${result.error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      success: true,
      transactionHash: result.transactionHash,
      message: 'QR invalidado correctamente en la blockchain',
    };
  }
}