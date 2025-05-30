import { DataSource, Like } from 'typeorm';
import { Postagem } from './models/post.entity';
import { Likes } from './models/like.entity';

export const postagemProviders = [
  {
    provide: 'POSTAGEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Postagem),
    inject: ['DATA_SOURCE'],
  },
];

export const likesProviders = [
  {
    provide: 'LIKES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Likes),
    inject: ['DATA_SOURCE'],
  },
];
