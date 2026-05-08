import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';

import { SUBMISSION_QUEUE } from '../../application/use-cases/submissions/submit-solution.use-case';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { SubmissionStatus } from '../../domain/entities/submission-status.enum';

export interface EvaluationJobPayload {
  submissionId: string;
  challengeId: string;
  engine: string;
  query: string;
}

@Processor(SUBMISSION_QUEUE)
export class SqlEvaluationWorker extends WorkerHost {
  private readonly logger = new Logger(SqlEvaluationWorker.name);

  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepo: ISubmissionRepository,
  ) {
    super();
  }

  async process(job: Job<EvaluationJobPayload>): Promise<void> {
    const { submissionId, challengeId, engine, query } = job.data;

    this.logger.log(
      `[Job ${job.id}] Processing submission ${submissionId} | challenge: ${challengeId} | engine: ${engine}`,
    );

    try {
      await this.submissionRepo.updateStatus(submissionId, SubmissionStatus.RUNNING);
      this.logger.log(`[Job ${job.id}] Submission ${submissionId} → RUNNING`);

      await this.sleep(500);

      const stubScore = 100;
      const stubTimeMs = 120;
      const stubFeedback = '[STUB] El evaluador SQL aún no está implementado.';

      await (this.submissionRepo as any).updateResult(
        submissionId,
        SubmissionStatus.ACCEPTED,
        stubScore,
        stubTimeMs,
        stubFeedback,
      );

      this.logger.log(
        `[Job ${job.id}] Submission ${submissionId} → ACCEPTED (stub) | time: ${stubTimeMs}ms`,
      );
    } catch (error) {
      this.logger.error(
        `[Job ${job.id}] Failed to process submission ${submissionId}`,
        error,
      );
      await this.submissionRepo.updateStatus(submissionId, SubmissionStatus.RUNTIME_ERROR);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}