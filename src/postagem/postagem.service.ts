import { Inject, Injectable } from '@nestjs/common';
import { Postagem } from './models/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostagemService {
  constructor(
    @Inject('POSTAGEM_REPOSITORY')
    private postagemRepository: Repository<Postagem>,
  ) {}
  async postar(postagem: Postagem) {
    const response = await this.postagemRepository.insert(postagem);
    console.log(response);
  }

  async getPostagens() {
    const response = await this.postagemRepository.find({
      relations: ['user_infos'],
    });
    return response;
  }
}
