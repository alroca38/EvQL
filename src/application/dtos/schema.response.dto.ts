import { ChallengeSchema } from '../../domain/entities/challenge-schema.entity';

export class SchemaResponseDto {
    id!: string;
    challengeId!: string;
    ddlScript!: string;
    seedScript!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    static fromEntity(entity: ChallengeSchema): SchemaResponseDto {
        const dto = new SchemaResponseDto();
        dto.id = entity.id;
        dto.challengeId = entity.challengeId;
        dto.ddlScript = entity.ddlScript;
        dto.seedScript = entity.seedScript;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        return dto;
    }
}