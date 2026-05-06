import { Inject, Injectable } from '@nestjs/common';
import { ChallengeStatus } from '../../../domain/entities/challenge-status.enum';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';

@Injectable()
export class UpdateChallengeStatusUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute(id: string, status: ChallengeStatus) {
    await this.repo.updateStatus(id, status);
  }
}