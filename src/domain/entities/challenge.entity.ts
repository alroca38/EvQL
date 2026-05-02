import { ChallengeStatus } from './challenge-status.enum';
import { DatabaseEngine } from './database-engine.enum';
import { User } from './user.entity';

export class Challenge{
    constructor(
        public title: string,
        public description: string,
        public difficulty: string,
        public tags: string[],
        public databaseEngine: DatabaseEngine,
        public timelimit: number,
        public status: ChallengeStatus,
        public courseId: string,
        public createdBy: User,
    ){}
}