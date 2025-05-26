import { Postagem } from 'src/postagem/models/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  nome: string;

  @Column({ length: 15 })
  telefone: string;

  @Column({ length: 90 })
  email: string;

  @Column()
  senha: string;

  @Column({ length: 10 })
  cep: string;

  @Column({ length: 10 })
  numero: string;

  @OneToMany(() => Postagem, (postagem) => postagem.user_infos)
  postagens: Postagem[];
}
