import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Report } from '../../reports/entities/reports.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('usuario')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn({ name: 'idUsuario' })
  idUsuario: number;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Column({ length: 50 })
  nombres: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Column({ length: 50 })
  apellidos: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
    uniqueItems: true,
  })
  @Column({ length: 100, unique: true })
  correo: string;

  @ApiProperty({
    example: '20230001',
    description: 'Student code of the user',
    uniqueItems: true,
  })
  @Column({ name: 'codigo_estudiante', length: 20, unique: true })
  codigoEstudiante: string;

  @ApiProperty({
    example: 'securepassword123',
    description: 'Hashed password of the user',
  })
  @Column({ length: 255 })
  contrasena: string;

  @ApiProperty({
    example: 'john.doe.alt@example.com',
    description: 'Alternative email address of the user',
    required: false,
  })
  @Column({ name: 'correoA', length: 50, nullable: true })
  correoA?: string;

  @ApiProperty({
    example: 'Ingeniería de Sistemas',
    description: 'Major/career of the student',
  })
  @Column({ length: 50 })
  carrera: string;

  @ApiProperty({ example: 'V', description: 'Academic cycle of the student' })
  @Column({ length: 50 })
  ciclo: string;

  @ApiProperty({ example: '20', description: 'Age of the student' })
  @Column({ length: 50 })
  edad: string;

  @ApiProperty({ example: 'Masculino', description: 'Gender of the student' })
  @Column({ length: 50 })
  sexo: string;

  @ApiProperty({
    type: () => Report,
    isArray: true,
    description: 'List of reports associated with the user',
  })
  @OneToMany(() => Report, (report) => report.usuario)
  reportes: Report[];
}
