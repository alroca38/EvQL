import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { UpdateEvaluationRequestDto } from '../../dtos/update-evaluation.request.dto';
import { EvaluationResponseDto } from '../../dtos/evaluation.response.dto';

@Injectable()
export class UpdateEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(id: string, dto: UpdateEvaluationRequestDto): Promise<EvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.findById(id);
    if (!evaluation) throw new NotFoundException(`Evaluation "${id}" not found`);

    evaluation.name = dto.name ?? evaluation.name;
    evaluation.description = dto.description ?? evaluation.description;
    evaluation.startDate = dto.startDate ? new Date(dto.startDate) : evaluation.startDate;
    evaluation.endDate = dto.endDate ? new Date(dto.endDate) : evaluation.endDate;
    evaluation.duration = dto.duration ?? evaluation.duration;
    evaluation.maxAttempts = dto.maxAttempts ?? evaluation.maxAttempts;
    evaluation.score = dto.score ?? evaluation.score;
    evaluation.updatedAt = new Date();

    const updated = await this.evaluationRepository.update(evaluation);
    return EvaluationResponseDto.fromEntity(updated);
  }
}
