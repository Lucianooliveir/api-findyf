import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
