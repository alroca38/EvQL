import { Submission } from "../entities/submission.entity";
import { SubmissionStatus } from "../entities/submission-status.enum";

export interface ISubmissionRepository {
    save(submission: Submission): Promise<void>;
    findByStudentId(studentId: string): Promise<Submission[]>;
    updateStatus(submissionId: string, status: SubmissionStatus): Promise<void>;
}