import { Evaluation } from '../../domain/entities/evaluation.entity';
import { Challenge } from '../../domain/entities/challenge.entity';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';
import { DatabaseEngine } from '../../domain/entities/database-engine.enum';

type EvaluationModelWithRelations = {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  maxAttempts: number;
  score: number;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  course?: any;
  challenges?: any[];
};

export class PrismaEvaluationMapper {
  static toDomain(model: EvaluationModelWithRelations): Evaluation {
    return new Evaluation(
      model.id,
      model.name,
      model.description,
      model.startDate,
      model.endDate,
      model.duration,
      model.maxAttempts,
      model.score,
      model.courseId,
      null,
      model.challenges?.map(
        (c) =>
          new Challenge(
            c.id,
            c.title,
            c.description,
            c.difficulty,
            c.tags,
            c.databaseEngine as DatabaseEngine,
            c.timeLimit,
            c.status as ChallengeStatus,
            c.courseId,
            c.createdBy,
          ),
      ) ?? [],
      model.createdAt,
      model.updatedAt,
    );
  }
}
