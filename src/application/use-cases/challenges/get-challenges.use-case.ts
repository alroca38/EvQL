import { Inject, Injectable } from '@nestjs/common';
import { IChallengeRepository } from '../../../domain/repositories/challenge.repository';

@Injectable()
export class GetChallengesUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute() {
    return this.repo.findAll();
  }
}
