import { Injectable, Inject } from '@nestjs/common';
import { type IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/entities/challenge.entity';

@Injectable()
export class GetChallengesByEvaluationUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(evaluationId: string): Promise<Challenge[]> {
    return this.challengeRepository.findByEvaluationId(evaluationId);
  }
}
