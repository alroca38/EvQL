import { SubmissionStatus } from '../../domain/entities/submission-status.enum';

export class SubmissionResponseDto {
  id!: string;
  studentId!: string;
  challengeId!: string;
  engine!: string;
  query!: string;
  status!: SubmissionStatus;
  score?: number;
  executionTimeMs?: number;
  feedback?: string;
  createdAt!: Date;
}