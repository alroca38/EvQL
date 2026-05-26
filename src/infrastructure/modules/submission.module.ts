import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../persistence/prisma.module';

import { SubmissionController } from '../controllers/submission.controller';
import { SqlEvaluationWorker } from '../workers/sql-evaluation.worker';
import { PrismaSubmissionRepository } from '../persistence/repositories/prisma-submission.repository';
import { SubmitSolutionUseCase, SUBMISSION_QUEUE } from '../../application/use-cases/submissions/submit-solution.use-case';
import { GetMySubmissionsUseCase } from '../../application/use-cases/submissions/get-my-submissions.use-case';
import { ChallengeSchemaModule } from './challenge-schema.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SUBMISSION_QUEUE,
    }),
    ChallengeSchemaModule,
    PrismaModule,
  ],
  controllers: [SubmissionController],
  providers: [
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