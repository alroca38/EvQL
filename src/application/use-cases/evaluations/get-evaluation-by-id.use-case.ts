import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { EvaluationResponseDto } from '../../dtos/evaluation.response.dto';

@Injectable()
export class GetEvaluationByIdUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(id: string): Promise<EvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.findById(id);
    if (!evaluation) throw new NotFoundException(`Evaluation "${id}" not found`);
    return EvaluationResponseDto.fromEntity(evaluation);
  }
}
