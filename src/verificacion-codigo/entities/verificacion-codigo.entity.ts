import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('verificacion_codigo')
export class VerificacionCodigo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'idUsuario' })
  usuario: User;

  @Column({ length: 6 })
  codigo: string;

  @Column({
    name: 'fecha_creacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  @Column({ default: false })
  usado: boolean;

  @Column({ default: 0 })
  intentos: number;
}
