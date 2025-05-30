import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Postagem } from './post.entity';
import { User } from 'src/login/models/user.entity';

@Entity({ name: 'likes' })
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Postagem, (postagem) => postagem.id)
  post_infos: Postagem;

  @ManyToOne(() => User, (user) => user.id)
  user_infos: User;
}
