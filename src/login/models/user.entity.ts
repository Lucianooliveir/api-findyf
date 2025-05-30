import { Comentario } from 'src/postagem/models/comentario.entity';
import { Likes } from 'src/postagem/models/like.entity';
import { Postagem } from 'src/postagem/models/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
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

  @Column()
  imagem_perfil: string;

  @Column()
  abrigo: boolean;

  @OneToMany(() => Postagem, (postagem) => postagem.user_infos)
  postagens: Postagem[];

  @OneToMany(() => Likes, (likes) => likes.user_infos)
  curtidos: Likes[];

  @OneToMany(() => Postagem, (postagem) => postagem.id)
  comentarios: Comentario[];
}
