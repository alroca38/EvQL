import { ChallengeStatus } from '../entities/challenge-status.enum';
import { Challenge } from '../entities/challenge.entity';

export interface IChallengeRepository {
  save(challenge: Challenge): Promise<void>;
  create(challenge: Challenge): Promise<Challenge>;
  findAll(): Promise<Challenge[]>;
  findById(id: string): Promise<Challenge | null>;
  update(id: string, data: Partial<Challenge>): Promise<Challenge>;
  delete(id: string): Promise<void>;

  findByCourseId(courseId: string): Promise<Challenge[]>;
  updateStatus(challengeId: string, status: ChallengeStatus): Promise<void>;
}
