import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Animal } from './models/animal.entity';

@Injectable()
export class AnimalService {
  constructor(
    @Inject('ANIMAL_REPOSITORY') private animalRepository: Repository<Animal>,
  ) {}

  async createAnimal(animal: Animal, file: Express.Multer.File) {
    animal.imagem = file.path;
    const response = await this.animalRepository.insert(animal);
    return response;
  }

  async getAnimaisByUserId(userId: number) {
    const response = await this.animalRepository.find({
      where: { abrigo_infos: { id: userId } },
      relations: ['abrigo_infos'],
    });
    return response;
  }
}
