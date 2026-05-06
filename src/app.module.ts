import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './infrastructure/auth/auth.module';
import { Challenge } from './domain/entities/challenge.entity';
import { ChallengeSchema } from './domain/entities/challenge-schema.entity';
import { ChallengeSchemaModule } from './infrastructure/modules/challenge-schema.module';

// Controller
import { ChallengeController } from './infrastructure/controllers/challenge.controller';

// Prisma
import { PrismaService } from './infrastructure/persistence/prisma.service';

// Repository
import { PrismaChallengeRepository } from './infrastructure/persistence/repositories/prisma-challenge.repository';

// Use Cases
import { CreateChallengeUseCase } from './application/use-cases/challenges/create-challenge.use-case';
import { GetChallengesUseCase } from './application/use-cases/challenges/get-challenges.use-case';
import { GetChallengeUseCase } from './application/use-cases/challenges/get-challenge.use-case';
import { UpdateChallengeUseCase } from './application/use-cases/challenges/update-challenge.use-case';
import { DeleteChallengeUseCase } from './application/use-cases/challenges/delete-challenge.use-case';
import { GetChallengesByCourseUseCase } from './application/use-cases/challenges/get-challenges-by-course.use-case';
import { UpdateChallengeStatusUseCase } from './application/use-cases/challenges/update-challenge-status.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [
    AppController,
    ChallengeController,
  ],
  providers: [
    AppService,

    // Prisma
    PrismaService,

    // Repository (inyección por token)
    {
      provide: 'IChallengeRepository',
      useClass: PrismaChallengeRepository,
    },

    // Use Cases
    CreateChallengeUseCase,
    GetChallengesUseCase,
    GetChallengeUseCase,
    UpdateChallengeUseCase,
    DeleteChallengeUseCase,
    GetChallengesByCourseUseCase,
    UpdateChallengeStatusUseCase,
    ChallengeSchemaModule
  ],
})
export class AppModule {}
