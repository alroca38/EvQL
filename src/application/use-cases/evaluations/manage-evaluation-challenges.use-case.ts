import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { EvaluationResponseDto } from '../../dtos/evaluation.response.dto';

@Injectable()
export class AddChallengeToEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(evaluationId: string, challengeId: string): Promise<EvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);
    if (!evaluation) throw new NotFoundException(`Evaluation "${evaluationId}" not found`);

    await this.evaluationRepository.addChallenge(evaluationId, challengeId);
    const updated = await this.evaluationRepository.findById(evaluationId);
    return EvaluationResponseDto.fromEntity(updated!);
  }
}

@Injectable()
export class RemoveChallengeFromEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(evaluationId: string, challengeId: string): Promise<void> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);
    if (!evaluation) throw new NotFoundException(`Evaluation "${evaluationId}" not found`);

    await this.evaluationRepository.removeChallenge(evaluationId, challengeId);
  }
}
