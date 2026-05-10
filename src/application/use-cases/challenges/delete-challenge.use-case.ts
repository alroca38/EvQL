import { Inject, Injectable } from '@nestjs/common';
import { type IChallengeRepository } from '../../../domain/repositories/challenge.repository';

@Injectable()
export class DeleteChallengeUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
