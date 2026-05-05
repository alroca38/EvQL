import { Inject, Injectable } from '@nestjs/common';
import { type IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/entities/challenge.entity';

@Injectable()
export class UpdateChallengeUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute(id: string, data: Partial<Challenge>) {
    return this.repo.update(id, data);
  }
}
