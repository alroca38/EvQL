import {
  IsString,
  IsArray,
  IsInt,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseEngine } from '../../domain/entities/database-engine.enum';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';

export class UpdateChallengeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ enum: DatabaseEngine, required: false })
  @IsOptional()
  @IsEnum(DatabaseEngine)
  databaseEngine?: DatabaseEngine;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  timeLimit?: number;

  @ApiProperty({ enum: ChallengeStatus, required: false })
  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}