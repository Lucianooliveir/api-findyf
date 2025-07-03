import { Inject, Injectable } from '@nestjs/common';
import { Postagem } from './models/post.entity';
import { Repository } from 'typeorm';
import { Likes } from './models/like.entity';
import { Comentario } from './models/comentario.entity';
import { CreatePostagemDto } from './models/create-postagem.dto';
import { User } from 'src/login/models/user.entity';
import { Animal } from 'src/animal/models/animal.entity';

@Injectable()
export class PostagemService {
  constructor(
    @Inject('POSTAGEM_REPOSITORY')
    private postagemRepository: Repository<Postagem>,
    @Inject('LIKES_REPOSITORY')
    private likesRepository: Repository<Likes>,
    @Inject('COMENTARIO_REPOSITORY')
    private comentarioRepository: Repository<Comentario>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ANIMAL_REPOSITORY')
    private animalRepository: Repository<Animal>,
  ) {}

  async postar(postagem: Postagem, file: Express.Multer.File) {
    postagem.imagem_post = file.path;
    postagem.data = new Date(Date.now());
    const response = await this.postagemRepository.insert(postagem);
    return response;
  }

  async criarPostagem(dto: CreatePostagemDto, file: Express.Multer.File) {
    // Find the user
    const user = await this.userRepository.findOneBy({ id: dto.user_infos });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the animal if provided
    let animal: Animal | null = null;
    if (dto.animal) {
      animal = await this.animalRepository.findOneBy({ id: dto.animal });
      if (!animal) {
        throw new Error('Animal not found');
      }
    }

    // Create the postagem
    const postagem = new Postagem();
    postagem.texto = dto.texto;
    postagem.user_infos = user;
    postagem.animal = animal;
    postagem.imagem_post = file.path;
    postagem.data = new Date(Date.now());

    const response = await this.postagemRepository.insert(postagem);
    return response;
  }

  async getPostagensById(id: number) {
    const response = await this.postagemRepository.find({
      relations: [
        'user_infos',
        'user_infos.abrigo',
        'curtidas',
        'animal',
        'animal.abrigo_infos',
      ],
      where: {
        user_infos: {
          id: id,
        },
      },
    });

    // Add isShelter field to user objects
    response.forEach((post) => {
      if (post.user_infos) {
        post.user_infos.isShelter = !!post.user_infos.abrigo;
      }
    });

    return response;
  }

  async getPostagens() {
    const response = await this.postagemRepository
      .createQueryBuilder('postagem')
      .leftJoinAndSelect('postagem.user_infos', 'user_infos')
      .leftJoinAndSelect('user_infos.abrigo', 'user_abrigo')
      .leftJoinAndSelect('user_infos.postagens', 'user_postagens')
      .leftJoinAndSelect('user_infos.curtidos', 'user_curtidos')
      .leftJoinAndSelect('user_curtidos.post_infos', 'curtidos_posts')
      .leftJoinAndSelect('postagem.curtidas', 'curtidas')
      .leftJoinAndSelect('curtidas.user_infos', 'curtidas_user')
      .leftJoinAndSelect('curtidas_user.abrigo', 'curtidas_user_abrigo')
      .leftJoinAndSelect('postagem.animal', 'animal')
      .leftJoinAndSelect('animal.abrigo_infos', 'animal_abrigo')
      .leftJoinAndSelect(
        'postagem.comentarios',
        'comentarios',
        'comentarios.responde IS NULL',
      )
      .leftJoinAndSelect('comentarios.autor', 'comentarios_autor')
      .leftJoinAndSelect('comentarios_autor.abrigo', 'comentarios_autor_abrigo')
      .leftJoinAndSelect('comentarios.respostas', 'respostas')
      .leftJoinAndSelect('respostas.autor', 'respostas_autor')
      .leftJoinAndSelect('respostas_autor.abrigo', 'respostas_autor_abrigo')
      .orderBy('postagem.data', 'DESC')
      .getMany();

    // Add isShelter field to all user objects
    response.forEach((post) => {
      if (post.user_infos) {
        post.user_infos.isShelter = !!post.user_infos.abrigo;
      }

      // Add isShelter to users who liked the post
      if (post.curtidas) {
        post.curtidas.forEach((like) => {
          if (like.user_infos) {
            like.user_infos.isShelter = !!like.user_infos.abrigo;
          }
        });
      }

      // Add isShelter to comment authors
      if (post.comentarios) {
        post.comentarios.forEach((comment) => {
          if (comment.autor) {
            comment.autor.isShelter = !!comment.autor.abrigo;
          }

          // Add isShelter to reply authors
          if (comment.respostas) {
            comment.respostas.forEach((reply) => {
              if (reply.autor) {
                reply.autor.isShelter = !!reply.autor.abrigo;
              }
            });
          }
        });
      }
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
