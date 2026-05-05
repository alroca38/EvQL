import { Inject, Injectable } from '@nestjs/common';
import { IChallengeRepository } from '../../../domain/repositories/challenge.repository';

@Injectable()
export class GetChallengeUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute(id: string) {
    return this.repo.findById(id);
  }
}
