import { ChallengeStatus } from './challenge-status.enum';
import { DatabaseEngine } from './database-engine.enum';

export class Challenge{
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public difficulty: string,
        public tags: string[],
        public databaseEngine: DatabaseEngine,
        public timeLimit: number,
        public status: ChallengeStatus,
        public courseId: string,
        public createdById: string,
    ){}
}