import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';

@Injectable()
export class DeleteEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const evaluation = await this.evaluationRepository.findById(id);
    if (!evaluation) throw new NotFoundException(`Evaluation "${id}" not found`);
    await this.evaluationRepository.delete(id);
  }
}
