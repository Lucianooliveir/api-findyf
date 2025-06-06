import { DataSource } from 'typeorm';
import { User } from './models/user.entity';
import { Abrigo } from './models/abrigo.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },

  {
    provide: 'ABRIGO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Abrigo),
    inject: ['DATA_SOURCE'],
  },
];
