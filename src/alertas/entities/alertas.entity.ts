import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn({ name: 'idAlerta' })
  idAlerta: number;

  @Column({ name: 'user_id', length: 100 })
  userId: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
