import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/entities/challenge.entity';
import { ChallengeStatus } from '../../../domain/entities/challenge-status.enum';

@Injectable()
export class PrismaChallengeRepository implements IChallengeRepository {
  constructor(private prisma: PrismaService) {}

  async save(challenge: Challenge): Promise<void> {
    await this.prisma.challenge.create({
      data: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        tags: challenge.tags,
        databaseEngine: challenge.databaseEngine,
        timeLimit: challenge.timeLimit,
        status: challenge.status,
        courseId: challenge.courseId,
        createdBy: challenge.createdBy,
      },
    });
  }

  async findByCourseId(courseId: string): Promise<Challenge[]> {
    return this.prisma.challenge.findMany({ where: { courseId } });
  }

  async updateStatus(challengeId: string, status: ChallengeStatus): Promise<void> {
    await this.prisma.challenge.update({
      where: { id: challengeId },
      data: { status },
    });
  }

  async create(challenge: Challenge): Promise<Challenge> {
    return this.prisma.challenge.create({
      data: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        tags: challenge.tags,
        databaseEngine: challenge.databaseEngine,
        timeLimit: challenge.timeLimit,
        status: challenge.status,
        courseId: challenge.courseId,
        createdBy: challenge.createdBy,
      },
    });
  }

  async findAll(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany();
  }

  async findById(id: string): Promise<Challenge | null> {
    return this.prisma.challenge.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<Challenge>): Promise<Challenge> {
    return this.prisma.challenge.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.challenge.delete({ where: { id } });
  }
}
