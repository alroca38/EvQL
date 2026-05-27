import { Injectable, Inject } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { EvaluationResponseDto } from '../../dtos/evaluation.response.dto';

@Injectable()
export class GetAllEvaluationsUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(): Promise<EvaluationResponseDto[]> {
    const evaluations = await this.evaluationRepository.findAll();
    return evaluations.map(EvaluationResponseDto.fromEntity);
  }
}
