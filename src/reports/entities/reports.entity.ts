import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reportes')
export class Report {
  @PrimaryGeneratedColumn({ name: 'idReporte' })
  idReporte: number;

  @Column({ name: 'user_id', length: 100 })
  userId: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ length: 50, nullable: true })
  modo?: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
