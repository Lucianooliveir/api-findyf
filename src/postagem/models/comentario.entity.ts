import { User } from 'src/login/models/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Postagem } from './post.entity';

@Entity({ name: 'comentario' })
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @ManyToOne(() => User, (user) => user.id)
  autor: User;

  @ManyToOne(() => Comentario, (comentario) => comentario.respostas)
  responde: Comentario;

  @ManyToOne(() => Postagem, (postagem) => postagem.comentarios)
  postagem: Postagem;

  @OneToMany(() => Comentario, (comentario) => comentario.responde)
  respostas: Comentario[];
}
