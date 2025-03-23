import { Inject, Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class LoginService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  cadastro(user: User): Promise<InsertResult> {
    return this.userRepository.insert(user);
  }
}
