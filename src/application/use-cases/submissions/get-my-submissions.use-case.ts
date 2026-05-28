import { Inject, Injectable } from '@nestjs/common';
import type { ISubmissionRepository } from '../../../domain/repositories/submission.repository';
import { Submission } from '../../../domain/entities/submission.entity';
import { SubmissionResponseDto } from '../../dtos/submission.response.dto';

@Injectable()
export class GetMySubmissionsUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepo: ISubmissionRepository,
  ) {}

  async execute(studentId: string): Promise<SubmissionResponseDto[]> {
    const submissions = await this.submissionRepo.findByStudentId(studentId);

    return submissions.map((sub) => {
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