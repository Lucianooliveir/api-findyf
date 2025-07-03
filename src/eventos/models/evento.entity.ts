import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Abrigo } from 'src/login/models/abrigo.entity';

@Entity({ name: 'eventos' })
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  nome: string;

  @Column({ length: 400, nullable: true })
  descricao: string;

  @Column({ type: 'date', nullable: true, name: 'data-inicio' })
  dataInicio: Date;

  @Column({ type: 'date', nullable: true, name: 'data-fim' })
  dataFim: Date;

  @Column({ length: 50, nullable: true, name: 'preço' })
  preco: string;

  @Column({ length: 100, nullable: true })
  horario: string;

  @ManyToOne(() => Abrigo, { nullable: true })
  @JoinColumn({ name: 'abrigoId' })
  abrigo: Abrigo | null;

  @Column({ type: 'int', nullable: true })
  abrigoId: number | null;
}
