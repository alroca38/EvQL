import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/entities/challenge.entity';
import { ChallengeMapper } from '../../mappers/challenge.mapper';
import { ChallengeStatus } from '../../../domain/entities/challenge-status.enum';

@Injectable()
export class PrismaChallengeRepository implements IChallengeRepository {
  constructor(private prisma: PrismaService) {}

  async create(challenge: Challenge): Promise<Challenge> {
    const data = await this.prisma.challengeModel.create({
      data: ChallengeMapper.toPersistence(challenge),
    });

    return ChallengeMapper.toDomain(data);
  }

  async save(challenge: Challenge): Promise<void> {
    await this.prisma.challengeModel.upsert({
      where: { id: challenge.id },
      update: ChallengeMapper.toPersistence(challenge),
      create: ChallengeMapper.toPersistence(challenge),
    });
  }

  async findAll(): Promise<Challenge[]> {
    const data = await this.prisma.challengeModel.findMany();
    return data.map(ChallengeMapper.toDomain);
  }

  async findById(id: string): Promise<Challenge | null> {
    const data = await this.prisma.challengeModel.findUnique({
      where: { id },
    });

    return data ? ChallengeMapper.toDomain(data) : null;
  }

  async findByCourseId(courseId: string): Promise<Challenge[]> {
    const data = await this.prisma.challengeModel.findMany({
      where: { courseId },
    });

    return data.map(ChallengeMapper.toDomain);
  }

  async update(id: string, data: Partial<Challenge>): Promise<Challenge> {
    const updated = await this.prisma.challengeModel.update({
      where: { id },
      data: ChallengeMapper.toPartialPersistence(data),
    });

    return ChallengeMapper.toDomain(updated);
  }

  async updateStatus(challengeId: string, status: ChallengeStatus): Promise<void> {
    await this.prisma.challengeModel.update({
      where: { id: challengeId },
      data: { status },
    });
  }

  async findAvailableForStudent(studentId: string): Promise<Challenge[]> {
    const enrollments = await this.prisma.courseEnrollmentModel.findMany({
      where: { studentId },
    });
    const courseIds = enrollments.map((e) => e.courseId);

    if (courseIds.length == 0) {
      return [];
    }

    const models = await this.prisma.challengeModel.findMany({
      where: {
        courseId: { in: courseIds },
        status: 'published',
      },
    });
    return models.map((m) => ChallengeMapper.toDomain(m));
  }

  async findByEvaluationId(evaluationId: string): Promise<Challenge[]> {
    const models = await this.prisma.challengeModel.findMany({
      where: {
        evaluations: { some: { id: evaluationId } },
      },
    });
    return models.map((m) => ChallengeMapper.toDomain(m));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.challengeModel.delete({
      where: { id },
    });
  }
}