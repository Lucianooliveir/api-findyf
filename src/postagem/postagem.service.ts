import { Inject, Injectable } from '@nestjs/common';
import { Postagem } from './models/post.entity';
import { Repository } from 'typeorm';
import { Likes } from './models/like.entity';
import { Comentario } from './models/comentario.entity';

@Injectable()
export class PostagemService {
  constructor(
    @Inject('POSTAGEM_REPOSITORY')
    private postagemRepository: Repository<Postagem>,
    @Inject('LIKES_REPOSITORY')
    private likesRepository: Repository<Likes>,
    @Inject('COMENTARIO_REPOSITORY')
    private comentarioRepository: Repository<Comentario>,
  ) {}

  async postar(postagem: Postagem, file: Express.Multer.File) {
    postagem.imagem_post = file.path;
    postagem.data = new Date(Date.now());
    const response = await this.postagemRepository.insert(postagem);
    return response;
  }

  async getPostagensById(id: number) {
    const response = await this.postagemRepository.find({
      relations: ['user_infos', 'curtidas'],
      where: {
        user_infos: {
          id: id,
        },
      },
    });
    return response;
  }

  async getPostagens() {
    const response = await this.postagemRepository.find({
      relations: ['user_infos', 'curtidas'],
      order: { data: 'DESC' },
    });
    return response;
  }

  async curtir(like) {
    console.log('Looking for like:', like.post_infos?.id, like.user_infos?.id);

    const existingLike = await this.likesRepository.findOne({
      where: {
        post_infos: { id: like.post_infos },
        user_infos: { id: like.user_infos },
      },
    });

    console.log('Existing like:', existingLike);

    if (!existingLike) {
      return await this.likesRepository.insert(like);
    } else {
      return await this.likesRepository.delete({
        post_infos: { id: like.post_infos },
        user_infos: { id: like.user_infos },
      });
    }
  }

  async comentar(comentario: Comentario) {
    const response = await this.comentarioRepository.insert(comentario);
    return response;
  }
}
