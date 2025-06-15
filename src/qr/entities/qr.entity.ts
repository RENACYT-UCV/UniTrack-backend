import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('qr')
export class QR {
  @PrimaryGeneratedColumn({ name: 'idQr' })
  @ApiProperty({ description: 'Unique identifier for the QR code', example: 1 })
  idQr: number;

  @ManyToOne(() => User, (user) => user.historial, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario', referencedColumnName: 'idUsuario' })
  @ApiProperty({ description: 'The user associated with this QR code' })
  usuario: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Timestamp when the QR code was generated or updated',
    example: '2023-10-27T10:00:00Z',
  })
  timestamp: Date;

  @Column({ name: 'hash', unique: true })
  @ApiProperty({
    description: 'The hash value stored in the QR code',
    example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  })
  hash: string;

  @Column({ name: 'url', type: 'text', nullable: true })
  url?: string;
}
