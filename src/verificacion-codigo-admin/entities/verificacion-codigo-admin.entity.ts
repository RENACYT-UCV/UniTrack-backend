import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';

@Entity('verificacion_codigo_admin')
export class VerificacionCodigoAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_admin' })
  idAdmin: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'id_admin', referencedColumnName: 'idAdmin' })
  admin: Admin;

  @Column({ length: 10 })
  codigo: string;

  @Column({ default: 0 })
  intentos: number;

  @Column({ default: false, type: 'boolean' })
  usado: boolean;

  @Column({
    name: 'fecha_creacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;
}
