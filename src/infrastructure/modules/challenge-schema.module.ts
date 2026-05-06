import { Module } from '@nestjs/common';
import { ChallengeSchemaController } from '../controllers/challenge-schema.controller';
import { UploadChallengeSchemaUseCase } from '../../application/use-cases/upload-challenge-schema.use-case';
import { GetChallengeSchemaUseCase } from '../../application/use-cases/get-challenge-schema.use-case';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaChallengeSchemaRepository } from '../persistence/repositories/prisma-challenge-schema.repository';

@Module({
  controllers: [ChallengeSchemaController],
  providers: [
    PrismaService,
    UploadChallengeSchemaUseCase,
    GetChallengeSchemaUseCase,
    {
      provide: 'IChallengeSchemaRepository',
      useClass: PrismaChallengeSchemaRepository,
    },
    // TODO: reemplazar por PrismaChallengeRepository cuando
    // el módulo de retos esté listo
    {
      provide: 'IChallengeRepository',
      useValue: {
        findById: async (id: string) => ({ id }),
      },
    },
  ],
  exports: ['IChallengeSchemaRepository'],
})
export class ChallengeSchemaModule {}