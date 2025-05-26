import { User } from 'src/login/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'postagem', schema: 'public', synchronize: false })
export class Postagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @Column()
  data: Date;

  @ManyToOne(() => User, (user) => user.id)
  user_infos: User;
}
