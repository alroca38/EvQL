import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { type IChallengeSchemaRepository } from '../../domain/repositories/challenge-schema.repository';
import { type IChallengeRepository } from '../../domain/repositories/challenge.repository';
import { ChallengeSchema } from '../../domain/entities/challenge-schema.entity';
import { UploadSchemaRequestDto } from '../dtos/upload-schema.request.dto';
import { SchemaResponseDto } from '../dtos/schema.response.dto';
import { SqlValidator } from '../validators/sql.validator';

@Injectable()
export class UploadChallengeSchemaUseCase {
    constructor(
        @Inject('IChallengeSchemaRepository')
        private readonly schemaRepository: IChallengeSchemaRepository,
        @Inject('IChallengeRepository')
        private readonly challengeRepository: IChallengeRepository,
    ) {}

    async execute(challengeId: string, dto: UploadSchemaRequestDto): Promise<SchemaResponseDto> {
        const challenge = await this.challengeRepository.findById(challengeId);
        if (!challenge) {
            throw new NotFoundException(`Challenge "${challengeId}" not found`);
        }

        SqlValidator.validateDdl(dto.ddlScript);
        if (dto.seedScript) SqlValidator.validateSeed(dto.seedScript);

        const existing = await this.schemaRepository.findByChallengeId(challengeId);

        let schema: ChallengeSchema;
        if (existing) {
            existing.ddlScript = dto.ddlScript;
            existing.seedScript = dto.seedScript ?? null;
            existing.updatedAt = new Date();
            schema = await this.schemaRepository.update(existing);
        } else {
            const newSchema = new ChallengeSchema(
                undefined!, challengeId, dto.ddlScript,
                dto.seedScript ?? null, new Date(), new Date(),
            );
            schema = await this.schemaRepository.save(newSchema);
        }

        return SchemaResponseDto.fromEntity(schema);
    }
}