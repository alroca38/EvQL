import { Injectable, Inject } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { EvaluationResponseDto } from '../../dtos/evaluation.response.dto';

@Injectable()
export class GetMyEvaluationsUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(studentId: string): Promise<EvaluationResponseDto[]> {
    const evaluations = await this.evaluationRepository.findAvailableForStudent(studentId);
    return evaluations.map(EvaluationResponseDto.fromEntity);
  }
}
