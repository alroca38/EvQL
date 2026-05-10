import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IChallengeSchemaRepository } from '../../domain/repositories/challenge-schema.repository';
import type { IChallengeRepository } from '../../domain/repositories/challenge.repository';
import { GenerateSeedRequestDto } from '../dtos/generate-seed.request.dto';
import { SchemaResponseDto } from '../dtos/schema.response.dto';
import { DataGeneratorService } from '../services/data-generator.service';

@Injectable()
export class GenerateSeedUseCase {
  constructor(
    @Inject('IChallengeSchemaRepository')
    private readonly schemaRepository: IChallengeSchemaRepository,
    @Inject('IChallengeRepository')
    private readonly challengeRepository: IChallengeRepository,
    private readonly dataGenerator: DataGeneratorService,
  ) {}

  async execute(challengeId: string, dto: GenerateSeedRequestDto): Promise<SchemaResponseDto> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException(`Challenge "${challengeId}" not found`);

    const schema = await this.schemaRepository.findByChallengeId(challengeId);
    if (!schema) throw new BadRequestException(`Challenge "${challengeId}" has no schema uploaded yet`);

    const seedScript = this.dataGenerator.generate(dto.tables);

    schema.seedScript = seedScript;
    schema.updatedAt = new Date();
    const updated = await this.schemaRepository.update(schema);

    return SchemaResponseDto.fromEntity(updated);
  }
}
