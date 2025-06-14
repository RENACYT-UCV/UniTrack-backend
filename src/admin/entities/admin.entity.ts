import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('administrador')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'idAdmin' })
  @ApiProperty({ description: 'Unique identifier for the admin', example: 1 })
  idAdmin: number;

  @Column({ length: 50 })
  @ApiProperty({ description: 'First name(s) of the admin', example: 'John' })
  nombres: string;

  @Column({ length: 50 })
  @ApiProperty({ description: 'Last name(s) of the admin', example: 'Doe' })
  apellidos: string;

  @Column({ length: 100, unique: true })
  @ApiProperty({
    description: 'Email address of the admin (must be unique)',
    example: 'john.doe@example.com',
  })
  correo: string;

  @Column({ length: 255 })
  @ApiProperty({
    description: 'Hashed password of the admin',
    example: 'hashedpassword123',
  })
  contrasena: string;

  @Column({ length: 50 })
  @ApiProperty({ description: 'Age of the admin', example: '30' })
  edad: string;

  @Column({ length: 50 })
  @ApiProperty({ description: 'Gender of the admin', example: 'Male' })
  sexo: string;
}
