import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQRBlockchainDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que crea el QR' })
  @IsNumber()
  userId: number;

  @ApiProperty({ 
    example: { description: 'QR para acceso al laboratorio', location: 'Lab 101' }, 
    description: 'Datos adicionales del QR',
    required: false 
  })
  @IsOptional()
  qrData?: any;
}

export class QRBlockchainResponseDto {
  @ApiProperty({ example: 'abc123...', description: 'Hash del QR generado' })
  qrHash: string;

  @ApiProperty({ example: 'def456...', description: 'Hash del bloque en blockchain' })
  blockHash: string;

  @ApiProperty({ example: 'QR creado y guardado en blockchain exitosamente', description: 'Mensaje de respuesta' })
  message: string;
}

export class QRVerificationResponseDto {
  @ApiProperty({ example: true, description: 'Si el QR fue encontrado' })
  found: boolean;

  @ApiProperty({ 
    example: { userId: 1, qrHash: 'abc123...', timestamp: '1640995200' }, 
    description: 'Datos del QR si fue encontrado',
    required: false 
  })
  data?: any;

  @ApiProperty({ example: 'QR encontrado en blockchain', description: 'Mensaje de respuesta' })
  message: string;
}