import { Module } from '@nestjs/common';
import { ChallengeSchemaController } from '../controllers/challenge-schema.controller';
import { UploadChallengeSchemaUseCase } from '../../application/use-cases/upload-challenge-schema.use-case';
import { GetChallengeSchemaUseCase } from '../../application/use-cases/get-challenge-schema.use-case';
import { GenerateSeedUseCase } from '../../application/use-cases/generate-seed.use-case';
import { DataGeneratorService } from '../../application/services/data-generator.service';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaChallengeSchemaRepository } from '../persistence/repositories/prisma-challenge-schema.repository';
import { PrismaChallengeRepository } from '../persistence/repositories/prisma-challenge.repository';

@Module({
  controllers: [ChallengeSchemaController],
  providers: [
    PrismaService,
    UploadChallengeSchemaUseCase,
    GetChallengeSchemaUseCase,
    GenerateSeedUseCase,
    DataGeneratorService,
    {
      provide: 'IChallengeSchemaRepository',
      useClass: PrismaChallengeSchemaRepository,
    },
    {
      provide: 'IChallengeRepository',
      useClass: PrismaChallengeRepository,
    },
  ],
  exports: ['IChallengeSchemaRepository', 'IChallengeRepository'],
})
export class ChallengeSchemaModule {}