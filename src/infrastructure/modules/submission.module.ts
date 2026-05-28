import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../persistence/prisma.module';

import { SubmissionController } from '../controllers/submission.controller';
import { SqlEvaluationWorker } from '../workers/sql-evaluation.worker';
import { PrismaSubmissionRepository } from '../persistence/repositories/prisma-submission.repository';
import { SubmitSolutionUseCase, SUBMISSION_QUEUE } from '../../application/use-cases/submissions/submit-solution.use-case';
import { GetMySubmissionsUseCase } from '../../application/use-cases/submissions/get-my-submissions.use-case';
import { SqlAssistantService } from '../../application/services/sql-assistant.service';
import { ChallengeSchemaModule } from './challenge-schema.module';
import { EvaluationModule } from './evaluation.module';
import { GetEvaluationChallengeSubmissionsUseCase } from '../../application/use-cases/submissions/get-evaluation-challenge-submissions.use-case';
import { GetChallengeSubmissionsUseCase } from '../../application/use-cases/challenges/get-challenge-submissions.use-case';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SUBMISSION_QUEUE,
    }),
    ChallengeSchemaModule,
    EvaluationModule,
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
    GetEvaluationChallengeSubmissionsUseCase,
    GetChallengeSubmissionsUseCase,
    SqlEvaluationWorker,
    SqlAssistantService,
  ],
})
export class SubmissionModule {}