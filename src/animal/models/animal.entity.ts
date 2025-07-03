import { Abrigo } from 'src/login/models/abrigo.entity';
import { Postagem } from 'src/postagem/models/post.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'animal' })
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  data_nascimento: Date;

  @Column()
  especie: string;

  @Column()
  raca: string;

  @Column()
  porte: string;

  @Column()
  imagem: string;

  @ManyToOne(() => Abrigo, (abrigo) => abrigo.id)
  abrigo_infos: Abrigo;

  @OneToMany(() => Postagem, (postagem) => postagem.animal)
  postagens: Postagem[];
}
