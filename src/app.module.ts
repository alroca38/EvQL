import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './infrastructure/auth/auth.module';

import { ChallengeModule } from './infrastructure/modules/challenge.module';
import { ChallengeSchemaModule } from './infrastructure/modules/challenge-schema.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    ChallengeModule,
    ChallengeSchemaModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
