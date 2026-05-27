import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Evaluation } from '../../domain/entities/evaluation.entity';

class ChallengeSummaryDto {
  id!: string;
  title!: string;
  difficulty!: string;
}

export class EvaluationResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() description!: string;
  @ApiProperty() startDate!: Date;
  @ApiProperty() endDate!: Date;
  @ApiProperty() duration!: number;
  @ApiProperty() maxAttempts!: number;
  @ApiProperty() score!: number;
  @ApiProperty() courseId!: string;
  @ApiPropertyOptional() challenges!: ChallengeSummaryDto[];
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;

  static fromEntity(entity: Evaluation): EvaluationResponseDto {
    const dto = new EvaluationResponseDto();
    dto.id = entity.id!;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.duration = entity.duration;
    dto.maxAttempts = entity.maxAttempts;
    dto.score = entity.score;
    dto.courseId = entity.courseId;
    dto.challenges = entity.challenges.map(c => ({
      id: c.id,
      title: c.title,
      difficulty: c.difficulty,
    }));
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
