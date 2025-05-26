import { DataSource } from 'typeorm';
import { Postagem } from './models/post.entity';

export const postagemProviders = [
  {
    provide: 'POSTAGEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Postagem),
    inject: ['DATA_SOURCE'],
  },
];
