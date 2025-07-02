import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Postagem } from './post.entity';
import { User } from 'src/login/models/user.entity';

@Entity({ name: 'likes' })
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Postagem)
  @JoinColumn({ name: 'postInfosId' }) // <-- match your DB column
  post_infos: Postagem;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userInfosId' }) // <-- match your DB column
  user_infos: User;
}
