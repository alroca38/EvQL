import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';

import type { ISubmissionRepository } from '../../../domain/repositories/submission.repository';
import { Submission } from '../../../domain/entities/submission.entity';
import { SubmissionStatus } from '../../../domain/entities/submission-status.enum';
import { DatabaseEngine } from '../../../domain/entities/database-engine.enum';
import { CreateSubmissionRequestDto } from '../../dtos/create-submission.request.dto';

export const SUBMISSION_QUEUE = 'sql-evaluation';

@Injectable()
export class SubmitSolutionUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepo: ISubmissionRepository,

    @InjectQueue(SUBMISSION_QUEUE)
    private readonly submissionQueue: Queue,
  ) {}

  async execute(studentId: string, dto: CreateSubmissionRequestDto): Promise<Submission> {
    const submission = new Submission(
      randomUUID(),
      studentId,
      dto.challengeId,
      dto.engine as DatabaseEngine,
      dto.query,
      SubmissionStatus.QUEUED,
      new Date(),
    );

    await this.submissionRepo.save(submission);

    await this.submissionQueue.add(
      'evaluate',
      {
        submissionId: submission.id,
        challengeId: submission.challengeId,
        engine: submission.engine,
        query: submission.query,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    return submission;
  }
}