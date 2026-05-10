import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type IChallengeSchemaRepository } from '../../domain/repositories/challenge-schema.repository';
import { SchemaResponseDto } from '../dtos/schema.response.dto';

@Injectable()
export class GetChallengeSchemaUseCase {
    constructor(
        @Inject('IChallengeSchemaRepository')
        private readonly schemaRepository: IChallengeSchemaRepository
    ) {}

    async execute(challengeId: string): Promise<SchemaResponseDto> {
        const schema = await this.schemaRepository.findByChallengeId(challengeId);
        if (!schema) {
            throw new NotFoundException(
                `No schema found for challenge "${challengeId}"`
            );
        }
        return SchemaResponseDto.fromEntity(schema);
    }
}