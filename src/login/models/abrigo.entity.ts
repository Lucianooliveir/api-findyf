import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Animal } from 'src/animal/models/animal.entity';

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

  @ManyToOne(() => User, (user) => user.id)
  user_infos: User;

  @OneToMany(() => Animal, (animal) => animal.abrigo_infos)
  animais: Animal[];
}
