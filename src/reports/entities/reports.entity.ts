import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('reportes')
export class Report {
  @PrimaryGeneratedColumn({ name: 'idReporte' })
  idReporte: number;

  @ManyToOne(() => User, (user) => user.reportes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'idUsuario' })
  usuario: User;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ length: 50, nullable: true })
  modo?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
