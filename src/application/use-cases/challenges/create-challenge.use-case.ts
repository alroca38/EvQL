import { Inject, Injectable } from '@nestjs/common';
import { IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/entities/challenge.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateChallengeUseCase {
  constructor(
    @Inject('ChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute(data: Partial<Challenge>): Promise<Challenge> {
    const challenge = new Challenge(
      randomUUID(),
      data.title!,
      data.description!,
      data.difficulty!,
      data.tags!,
      data.databaseEngine!,
      data.timelimit!,
      data.status!,
      data.courseId!,
      data.createdBy!,
    );

    return this.repo.create(challenge);
  }
}
