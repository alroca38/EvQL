import { ChallengeSchema } from '../entities/challenge-schema.entity';

export interface IChallengeSchemaRepository {
  save(schema: ChallengeSchema): Promise<ChallengeSchema>;
  findByChallengeId(challengeId: string): Promise<ChallengeSchema | null>;
  update(schema: ChallengeSchema): Promise<ChallengeSchema>;
  delete(challengeId: string): Promise<void>;
}