import { Challenge } from '../../domain/entities/challenge.entity';
import { ChallengeModel } from '@prisma/client';
import { DatabaseEngine } from '../../domain/entities/database-engine.enum';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';

export class ChallengeMapper {
  static toDomain(model: ChallengeModel): Challenge {
    return new Challenge(
      model.id,
      model.title,
      model.description,
      model.difficulty,
      model.tags,
      model.databaseEngine as DatabaseEngine,
      model.timeLimit,
      model.status as ChallengeStatus,
      model.courseId,
      model.createdBy,
    );
  }

  static toPersistence(entity: Challenge): ChallengeModel {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      difficulty: entity.difficulty,
      tags: entity.tags,
      databaseEngine: entity.databaseEngine,
      timeLimit: entity.timeLimit,
      status: entity.status,
      courseId: entity.courseId,
      createdBy: entity.createdBy,
    };
  }

  static toPartialPersistence(data: Partial<Challenge>) {
    const result: any = { ...data };

    if (data.createdBy) {
      result.createdBy = data.createdBy;
      delete result.createdBy;
    }

    return result;
  }
}
