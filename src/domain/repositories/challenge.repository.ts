import { ChallengeStatus } from "../entities/challenge-status.enum";
import { Challenge } from "../entities/challenge.entity";

export interface IChallengeRepository {
    save(challenge: Challenge): Promise<void>;
    findByCourseId(courseId: string): Promise<Challenge[]>;
    updateStatus(challengeId: string, status: ChallengeStatus): Promise<void>;
}