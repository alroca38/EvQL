import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';

import { ChallengeController } from './infrastructure/controllers/challenge.controller';
import { PrismaChallengeRepository } from './infrastructure/persistence/repositories/prisma-challenge.repository';

import { CreateChallengeUseCase } from './application/use-cases/challenges/create-challenge.use-case';
import { GetChallengesUseCase } from './application/use-cases/challenges/get-challenges.use-case';
import { GetChallengeUseCase } from './application/use-cases/challenges/get-challenge.use-case';
import { UpdateChallengeUseCase } from './application/use-cases/challenges/update-challenge.use-case';
import { DeleteChallengeUseCase } from './application/use-cases/challenges/delete-challenge.use-case';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController, ChallengeController],
  providers: [
    AppService,
    {
      provide: 'ChallengeRepository',
      useClass: PrismaChallengeRepository,
    },
    CreateChallengeUseCase,
    GetChallengesUseCase,
    GetChallengeUseCase,
    UpdateChallengeUseCase,
    DeleteChallengeUseCase,
  ],
})
export class AppModule {}
