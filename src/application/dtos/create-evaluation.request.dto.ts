import { IsString, IsNotEmpty, MaxLength, IsDateString, IsInt, IsArray, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluationRequestDto {
  @ApiProperty({ example: 'Evaluación parcial 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'Primera evaluación parcial del curso' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @ApiProperty({ example: '2026-06-01T08:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ example: '2026-06-01T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @ApiProperty({ example: 120, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  maxAttempts!: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  score!: number;

  @ApiProperty({ example: 'uuid-of-course' })
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @ApiPropertyOptional({ example: ['challenge-id-1', 'challenge-id-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  challengeIds?: string[];
}
