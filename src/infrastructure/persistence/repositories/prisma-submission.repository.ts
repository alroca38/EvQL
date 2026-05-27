import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ISubmissionRepository } from '../../../domain/repositories/submission.repository';
import { Submission } from '../../../domain/entities/submission.entity';
import { SubmissionStatus } from '../../../domain/entities/submission-status.enum';
import { DatabaseEngine } from '../../../domain/entities/database-engine.enum';

@Injectable()
export class PrismaSubmissionRepository implements ISubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(submission: Submission): Promise<void> {
    await this.prisma.submissionModel.create({
      data: {
        id: submission.id,
        studentId: submission.studentId,
        challengeId: submission.challengeId,
        engine: submission.engine,
        query: submission.query,
        status: submission.status,
      },
    });
  }

  async findByStudentId(studentId: string): Promise<Submission[]> {
    const models = await this.prisma.submissionModel.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });

    return models.map(
      (m) =>
        new Submission(
          m.id,
          m.studentId,
          m.challengeId,
          m.engine as DatabaseEngine,
          m.query,
          m.status as SubmissionStatus,
          m.createdAt,
        ),
    );
  }

  async findByStudentAndChallenge(studentId: string, challengeId: string): Promise<Submission[]> {
    const models = await this.prisma.submissionModel.findMany({
      where: { studentId, challengeId },
      orderBy: { createdAt: 'desc' },
    });

    return models.map(
      (m) =>
        new Submission(
          m.id,
          m.studentId,
          m.challengeId,
          m.engine as DatabaseEngine,
          m.query,
          m.status as SubmissionStatus,
          m.createdAt,
        ),
    );
  }

  async findById(id: string): Promise<Submission | null> {
    const m = await this.prisma.submissionModel.findUnique({ where: { id } });
    if (!m) return null;

    return new Submission(
      m.id,
      m.studentId,
      m.challengeId,
      m.engine as DatabaseEngine,
      m.query,
      m.status as SubmissionStatus,
      m.createdAt,
    );
  }

  async updateStatus(submissionId: string, status: SubmissionStatus): Promise<void> {
    await this.prisma.submissionModel.update({
      where: { id: submissionId },
      data: { status },
    });
  }

  async updateResult(
    submissionId: string,
    status: SubmissionStatus,
    score: number,
    executionTimeMs: number,
    feedback: string,
  ): Promise<void> {
    await this.prisma.submissionModel.update({
      where: { id: submissionId },
      data: { status, score, executionTimeMs, feedback },
    });
  }
}