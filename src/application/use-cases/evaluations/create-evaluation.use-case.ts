import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type IEvaluationRepository } from '../../../domain/repositories/evaluation.repository';
import { type ICourseRepository } from '../../../domain/repositories/course.repository';
import { Evaluation } from '../../../domain/entities/evaluation.entity';
import { CreateEvaluationRequestDto } from '../../dtos/create-evaluation.request.dto';
import { EvaluationResponseDto } from '../../dtos/evaluation.response.dto';

@Injectable()
export class CreateEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(dto: CreateEvaluationRequestDto): Promise<EvaluationResponseDto> {
    const course = await this.courseRepository.findById(dto.courseId);
    if (!course) throw new NotFoundException(`Course "${dto.courseId}" not found`);

    const evaluation = new Evaluation(
      undefined,
      dto.name,
      dto.description,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.duration,
      dto.maxAttempts,
      dto.score,
      dto.courseId,
      null,
      [],
      new Date(),
      new Date(),
    );

    const saved = await this.evaluationRepository.save(evaluation);

    if (dto.challengeIds && dto.challengeIds.length > 0) {
      for (const challengeId of dto.challengeIds) {
        await this.evaluationRepository.addChallenge(saved.id!, challengeId);
      }
      const refreshed = await this.evaluationRepository.findById(saved.id!);
      return EvaluationResponseDto.fromEntity(refreshed!);
    }

    return EvaluationResponseDto.fromEntity(saved);
  }
}
