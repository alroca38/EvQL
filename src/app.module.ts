import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './infrastructure/auth/auth.module';
import { ChallengeModule } from './infrastructure/modules/challenge.module';
import { ChallengeSchemaModule } from './infrastructure/modules/challenge-schema.module';
import { SubmissionModule } from './infrastructure/modules/submission.module';
import { CourseModule } from './infrastructure/modules/course.module';
import { EvaluationModule } from './infrastructure/modules/evaluation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      }),
    }),

    AuthModule,
    ChallengeModule,
    ChallengeSchemaModule,
    CourseModule,
    SubmissionModule,
    EvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}