import { DataSource } from 'typeorm';
import { Postagem } from './models/post.entity';
import { Likes } from './models/like.entity';
import { Comentario } from './models/comentario.entity';
import { User } from 'src/login/models/user.entity';
import { Animal } from 'src/animal/models/animal.entity';

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

export const comentarioProviders = [
  {
    provide: 'COMENTARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Comentario),
    inject: ['DATA_SOURCE'],
  },
];

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];

export const animalProviders = [
  {
    provide: 'ANIMAL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Animal),
    inject: ['DATA_SOURCE'],
  },
];
