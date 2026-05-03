import { ChallengeStatus } from "../entities/challenge-status.enum";
import { Challenge } from "../entities/challenge.entity";

export interface ChallengeRepository {
    save(challenge: Challenge): Promise<void>;
    findByCourseId(courseId: string): Promise<Challenge[]>;
    updateStatus(challengeId: string, status: ChallengeStatus): Promise<void>;
}