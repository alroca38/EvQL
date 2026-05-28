import { DatabaseEngine } from "./database-engine.enum";
import { SubmissionStatus } from "./submission-status.enum";

export class Submission {
    constructor(
        public id: string,
        public studentId: string,
        public challengeId: string,
        public engine: DatabaseEngine,
        public query: string,
        public status: SubmissionStatus,
        public createdAt: Date,
        public score?: number | null,
        public executionTimeMs?: number | null,
        public feedback?: string | null,
    ) {}
}