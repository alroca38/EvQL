import { Inject, Injectable } from '@nestjs/common';
import type { IChallengeRepository } from '../../../domain/repositories/challenge.repository';

@Injectable()
export class GetChallengesByCourseUseCase {
  constructor(
    @Inject('IChallengeRepository')
    private readonly repo: IChallengeRepository,
  ) {}

  async execute(courseId: string) {
    return this.repo.findByCourseId(courseId);
  }
}