import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../persistence/prisma.service';

import { SubmissionController } from '../controllers/submission.controller';
import { SqlEvaluationWorker } from '../workers/sql-evaluation.worker';
import { PrismaSubmissionRepository } from '../persistence/repositories/prisma-submission.repository';
import { SubmitSolutionUseCase, SUBMISSION_QUEUE } from '../../application/use-cases/submissions/submit-solution.use-case';
import { GetMySubmissionsUseCase } from '../../application/use-cases/submissions/get-my-submissions.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SUBMISSION_QUEUE,
    }),
  ],
  controllers: [SubmissionController],
  providers: [
    PrismaService,
    {
      provide: 'ISubmissionRepository',
      useClass: PrismaSubmissionRepository,
    },
    SubmitSolutionUseCase,
    GetMySubmissionsUseCase,
    SqlEvaluationWorker,
  ],
})
export class SubmissionModule {}