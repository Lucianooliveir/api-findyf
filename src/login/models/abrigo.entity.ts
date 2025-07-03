import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Animal } from 'src/animal/models/animal.entity';
import { Evento } from 'src/eventos/models/evento.entity';

@Entity({ name: 'abrigo' })
export class Abrigo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome_responsavel: string;

  @Column()
  crmv_responsavel: string;

  @Column()
  telefone: string;

  @OneToOne(() => User, (user) => user.abrigo)
  @JoinColumn()
  user_infos: User;

  @OneToMany(() => Animal, (animal) => animal.abrigo_infos)
  animais: Animal[];

  @OneToMany(() => Evento, (evento) => evento.abrigo)
  eventos: Evento[];
}
