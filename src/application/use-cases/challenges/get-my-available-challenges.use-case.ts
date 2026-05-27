import { Injectable, Inject } from '@nestjs/common';
import { type IChallengeRepository } from '../../../domain/repositories/challenge.repository';
import { Challenge } from '../../../domain/entities/challenge.entity';

@Injectable()
export class GetMyAvailableChallengesUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(studentId: string): Promise<Challenge[]> {
    return this.challengeRepository.findAvailableForStudent(studentId);
  }
}
