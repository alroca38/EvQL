import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { type ISubmissionRepository } from '../../../domain/repositories/submission.repository';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { SubmissionResponseDto } from '../../dtos/submission.response.dto';

@Injectable()
export class GetChallengeSubmissionsUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepository: ISubmissionRepository,
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(evaluationId: string, challengeId: string): Promise<SubmissionResponseDto[]> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);
    if (!evaluation) {
      throw new NotFoundException(`Evaluation "${evaluationId}" not found`);
    }

    const hasChallenge = evaluation.challenges.some(c => c.id === challengeId);
    if (!hasChallenge) {
      throw new ForbiddenException(`Challenge "${challengeId}" is not part of Evaluation "${evaluationId}"`);
    }

    const submissions = await this.submissionRepository.findByChallengeId(challengeId);

    return submissions.map(sub => {
      const dto = new SubmissionResponseDto();
      dto.id = sub.id;
      dto.studentId = sub.studentId;
      dto.challengeId = sub.challengeId;
      dto.engine = sub.engine;
      dto.query = sub.query;
      dto.status = sub.status;
      dto.score = sub.score ?? undefined;
      dto.executionTimeMs = sub.executionTimeMs ?? undefined;
      dto.feedback = sub.feedback ?? undefined;
      dto.createdAt = sub.createdAt;
      return dto;
    });
  }
}
