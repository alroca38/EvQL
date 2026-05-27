import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { Evaluation } from '../../../domain/entities/evaluation.entity';
import { PrismaEvaluationMapper } from '../../mappers/prisma-evaluation.mapper';

const include = {
  challenges: true,
};

@Injectable()
export class PrismaEvaluationRepository implements IEvaluationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(evaluation: Evaluation): Promise<Evaluation> {
    const created = await this.prisma.evaluationModel.create({
      data: {
        name: evaluation.name,
        description: evaluation.description,
        startDate: evaluation.startDate,
        endDate: evaluation.endDate,
        duration: evaluation.duration,
        maxAttempts: evaluation.maxAttempts,
        score: evaluation.score,
        courseId: evaluation.courseId,
      },
      include,
    });
    return PrismaEvaluationMapper.toDomain(created);
  }

  async findAll(): Promise<Evaluation[]> {
    const evaluations = await this.prisma.evaluationModel.findMany({ include });
    return evaluations.map(PrismaEvaluationMapper.toDomain);
  }

  async findById(id: string): Promise<Evaluation | null> {
    const evaluation = await this.prisma.evaluationModel.findUnique({
      where: { id },
      include,
    });
    return evaluation ? PrismaEvaluationMapper.toDomain(evaluation) : null;
  }

  async update(evaluation: Evaluation): Promise<Evaluation> {
    const updated = await this.prisma.evaluationModel.update({
      where: { id: evaluation.id },
      data: {
        name: evaluation.name,
        description: evaluation.description,
        startDate: evaluation.startDate,
        endDate: evaluation.endDate,
        duration: evaluation.duration,
        maxAttempts: evaluation.maxAttempts,
        score: evaluation.score,
        updatedAt: new Date(),
      },
      include,
    });
    return PrismaEvaluationMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.evaluationModel.delete({ where: { id } });
  }

  async addChallenge(evaluationId: string, challengeId: string): Promise<void> {
    await this.prisma.evaluationModel.update({
      where: { id: evaluationId },
      data: {
        challenges: {
          connect: { id: challengeId },
        },
      },
    });
  }

  async removeChallenge(evaluationId: string, challengeId: string): Promise<void> {
    await this.prisma.evaluationModel.update({
      where: { id: evaluationId },
      data: {
        challenges: {
          disconnect: { id: challengeId },
        },
      },
    });
  }

  async findAvailableForStudent(studentId: string): Promise<Evaluation[]> {
    const evaluations = await this.prisma.evaluationModel.findMany({
      where: {
        course: {
          students: {
            some: { studentId },
          },
        },
      },
      include,
    });
    return evaluations.map(PrismaEvaluationMapper.toDomain);
  }
}
