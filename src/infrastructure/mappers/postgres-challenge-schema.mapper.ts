import { ChallengeSchema } from '../../domain/entities/challenge-schema.entity';
import { ChallengeSchemaModel } from '@prisma/client';

export class PostgresChallengeSchemaMapper {
    static toDomain(model: ChallengeSchemaModel): ChallengeSchema {
        return new ChallengeSchema(
            model.id,
            model.challengeId,
            model.ddlScript,
            model.seedScript!,
            model.createdAt,
            model.updatedAt
        );
    }

    static toPersistence(entity: ChallengeSchema) {
        return {
            challengeId: entity.challengeId,
            ddlScript: entity.ddlScript,
            seedScript: entity.seedScript,
        };
    }
}