export class ChallengeSchema {
    constructor(
        public id: string,
        public challengeId: string,
        public ddlScript: string,
        public seedScript: string,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}