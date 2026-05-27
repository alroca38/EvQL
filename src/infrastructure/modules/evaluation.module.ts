import { Module } from '@nestjs/common';
import { EvaluationController } from '../controllers/evaluation.controller';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaEvaluationRepository } from '../persistence/repositories/prisma-evaluation.repository';
import { PrismaCourseRepository } from '../persistence/repositories/prisma-course.repository';
import { CreateEvaluationUseCase } from '../../application/use-cases/evaluations/create-evaluation.use-case';
import { GetAllEvaluationsUseCase } from '../../application/use-cases/evaluations/get-all-evaluations.use-case';
import { GetEvaluationByIdUseCase } from '../../application/use-cases/evaluations/get-evaluation-by-id.use-case';
import { UpdateEvaluationUseCase } from '../../application/use-cases/evaluations/update-evaluation.use-case';
import { DeleteEvaluationUseCase } from '../../application/use-cases/evaluations/delete-evaluation.use-case';
import {
  AddChallengeToEvaluationUseCase,
  RemoveChallengeFromEvaluationUseCase,
} from '../../application/use-cases/evaluations/manage-evaluation-challenges.use-case';
import { GetMyEvaluationsUseCase } from '../../application/use-cases/evaluations/get-my-evaluations.use-case';

@Module({
  controllers: [EvaluationController],
  providers: [
    PrismaService,
    CreateEvaluationUseCase,
    GetAllEvaluationsUseCase,
    GetEvaluationByIdUseCase,
    UpdateEvaluationUseCase,
    DeleteEvaluationUseCase,
    AddChallengeToEvaluationUseCase,
    RemoveChallengeFromEvaluationUseCase,
    GetMyEvaluationsUseCase,
    {
      provide: 'IEvaluationRepository',
      useClass: PrismaEvaluationRepository,
    },
    {
      provide: 'ICourseRepository',
      useClass: PrismaCourseRepository,
    },
  ],
  exports: ['IEvaluationRepository'],
})
export class EvaluationModule {}
