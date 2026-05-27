import { Module } from '@nestjs/common';

import { ChallengeController } from '../controllers/challenge.controller';

import { PrismaService } from '../persistence/prisma.service';
import { PrismaChallengeRepository } from '../persistence/repositories/prisma-challenge.repository';

import { CreateChallengeUseCase } from '../../application/use-cases/challenges/create-challenge.use-case';
import { DeleteChallengeUseCase } from '../../application/use-cases/challenges/delete-challenge.use-case';
import { GetChallengesUseCase } from '../../application/use-cases/challenges/get-challenges.use-case';
import { GetChallengesByCourseUseCase } from '../../application/use-cases/challenges/get-challenges-by-course.use-case';
import { GetChallengeUseCase } from '../../application/use-cases/challenges/get-challenge.use-case';
import { UpdateChallengeStatusUseCase } from '../../application/use-cases/challenges/update-challenge-status.use-case';
import { GetMyAvailableChallengesUseCase } from '../../application/use-cases/challenges/get-my-available-challenges.use-case';
import { GetChallengesByEvaluationUseCase } from '../../application/use-cases/challenges/get-challenges-by-evaluation.use-case';
import { UpdateChallengeUseCase } from '../../application/use-cases/challenges/update-challenge.use-case';

import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ChallengeController],

  providers: [
    PrismaService,

    {
      provide: 'IChallengeRepository',
      useClass: PrismaChallengeRepository,
    },

    CreateChallengeUseCase,
    DeleteChallengeUseCase,
    GetChallengesUseCase,
    GetChallengesByCourseUseCase,
    GetChallengeUseCase,
    UpdateChallengeStatusUseCase,
    UpdateChallengeUseCase,
    GetMyAvailableChallengesUseCase,
    GetChallengesByEvaluationUseCase,
  ],

  exports: [
    'IChallengeRepository',
    GetChallengeUseCase,
    GetChallengesUseCase,
  ],
})
export class ChallengeModule {}