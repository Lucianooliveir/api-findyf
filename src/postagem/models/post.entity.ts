import { User } from 'src/login/models/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Likes } from './like.entity';

@Entity({ name: 'posts' })
export class Postagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @Column()
  data: Date;

  @Column()
  imagem_post: string;

  @ManyToOne(() => User, (user) => user.id)
  user_infos: User;

  @OneToMany(() => Likes, (likes) => likes.post_infos)
  curtidas: Likes[];
}
