import { PartialType } from '@nestjs/mapped-types';
import { CreateQrDto } from './create-qr.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQrDto extends PartialType(CreateQrDto) {
  @ApiProperty({
    description: 'The new hash value for the QR code',
    example: 'newhash123abc',
    required: false,
  })
  hash?: string;
}
