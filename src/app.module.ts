import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { Challenge } from './domain/entities/challenge.entity';
import { ChallengeSchema } from './domain/entities/challenge-schema.entity';
import { ChallengeSchemaModule } from './infrastructure/modules/challenge-schema.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ChallengeSchemaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
