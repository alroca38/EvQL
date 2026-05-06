import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IChallengeSchemaRepository } from '../../../domain/repositories/challenge-schema.repository';
import { ChallengeSchema } from '../../../domain/entities/challenge-schema.entity';
import { PostgresChallengeSchemaMapper } from '../../mappers/postgres-challenge-schema.mapper';

@Injectable()
export class PrismaChallengeSchemaRepository implements IChallengeSchemaRepository {
  constructor(private readonly prisma: PrismaService) {}

    async save(schema: ChallengeSchema): Promise<ChallengeSchema> {
        const created = await (this.prisma as any).challengeSchemaModel.create({
            data: {
                challengeId: schema.challengeId,
                ddlScript: schema.ddlScript,
                seedScript: schema.seedScript,
            }
        });
        return PostgresChallengeSchemaMapper.toDomain(created);
    }

    async findByChallengeId(challengeId: string): Promise<ChallengeSchema | null> {
        const found = await (this.prisma as any).challengeSchemaModel.findUnique({
            where: { challengeId }
        });
        return found ? PostgresChallengeSchemaMapper.toDomain(found) : null;
    }

    async update(schema: ChallengeSchema): Promise<ChallengeSchema> {
        const updated = await (this.prisma as any).challengeSchemaModel.update({
            where: { challengeId: schema.challengeId },
            data: {
                ddlScript: schema.ddlScript,
                seedScript: schema.seedScript,
                updatedAt: new Date()
            }
        });
        return PostgresChallengeSchemaMapper.toDomain(updated);
    }

    async delete(challengeId: string): Promise<void> {
        await (this.prisma as any).challengeSchemaModel.delete({
            where: { challengeId }
        });
    }
}