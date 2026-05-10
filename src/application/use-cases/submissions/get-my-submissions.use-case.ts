import { Inject, Injectable } from '@nestjs/common';
import type { ISubmissionRepository } from '../../../domain/repositories/submission.repository';
import { Submission } from '../../../domain/entities/submission.entity';

@Injectable()
export class GetMySubmissionsUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepo: ISubmissionRepository,
  ) {}

  async execute(studentId: string): Promise<Submission[]> {
    return this.submissionRepo.findByStudentId(studentId);
  }
}