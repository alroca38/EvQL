import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';

import { SUBMISSION_QUEUE } from '../../application/use-cases/submissions/submit-solution.use-case';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { SubmissionStatus } from '../../domain/entities/submission-status.enum';
import { SqlAssistantService } from '../../application/services/sql-assistant.service';

export interface EvaluationJobPayload {
  submissionId: string;
  challengeId: string;
  engine: string;
  query: string;
  ddlScript?: string;
  executionTimeMs?: number;
  status?: string;
}

@Processor(SUBMISSION_QUEUE)
export class SqlEvaluationWorker extends WorkerHost {
  private readonly logger = new Logger(SqlEvaluationWorker.name);

  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepo: ISubmissionRepository,
    private readonly sqlAssistant: SqlAssistantService,
  ) {
    super();
  }

  async process(job: Job<EvaluationJobPayload>): Promise<void> {
    const { submissionId, challengeId, engine, query, ddlScript, executionTimeMs, status } = job.data;

    this.logger.log(
      `[Job ${job.id}] Processing submission ${submissionId} | challenge: ${challengeId} | engine: ${engine}`,
    );

    try {
      await this.submissionRepo.updateStatus(submissionId, SubmissionStatus.RUNNING);

      await this.sleep(500);

      const stubScore = 100;
      const stubTimeMs = executionTimeMs ?? 120;
      const stubStatus = SubmissionStatus.ACCEPTED;

      // Llamar al asistente inteligente
      let feedback = '[STUB] El evaluador SQL aún no está implementado.';
      try {
        const analysis = await this.sqlAssistant.analyze({
          query,
          ddlScript: ddlScript ?? 'No schema provided',
          executionTimeMs: stubTimeMs,
          status: stubStatus,
        });

        feedback = JSON.stringify(analysis, null, 2);
        this.logger.log(`[Job ${job.id}] AI analysis generated successfully`);
      } catch (aiError) {
        this.logger.warn(`[Job ${job.id}] AI analysis failed, using fallback`, aiError);
      }

      await (this.submissionRepo as any).updateResult(
        submissionId,
        stubStatus,
        stubScore,
        stubTimeMs,
        feedback,
      );

      this.logger.log(
        `[Job ${job.id}] Submission ${submissionId} → ACCEPTED | time: ${stubTimeMs}ms`,
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