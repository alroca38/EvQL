import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { DatabaseEngine } from '../../domain/entities/database-engine.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionRequestDto {
  @ApiProperty({ example: 'challenge-123' })
  @IsString()
  @IsNotEmpty()
  challengeId!: string;

  @ApiProperty({ example: 'PostgreSQL' })
  @IsEnum(DatabaseEngine)
  engine!: DatabaseEngine;

  @ApiProperty({ example: 'SELECT * FROM users;' })
  @IsString()
  @IsNotEmpty()
  query!: string;
}