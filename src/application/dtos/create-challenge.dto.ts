import {
  IsString,
  IsArray,
  IsInt,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseEngine } from '../../domain/entities/database-engine.enum';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Consulta básica' })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: 'Seleccionar todos los usuarios' })
  @IsString()
  @MinLength(5)
  description!: string;

  @ApiProperty({ example: 'Easy' })
  @IsString()
  difficulty!: string;

  @ApiProperty({ example: ['SELECT'] })
  @IsArray()
  tags!: string[];

  @ApiProperty({ enum: DatabaseEngine, example: DatabaseEngine.PostgreSQL })
  @IsEnum(DatabaseEngine, { message: 'Motor de base de datos inválido' })
  databaseEngine!: DatabaseEngine;

  @ApiProperty({ example: 2000 })
  @IsInt({ message: 'El tiempo límite debe ser un número' })
  timeLimit!: number;

  @ApiProperty({ enum: ChallengeStatus, example: ChallengeStatus.draft })
  @IsEnum(ChallengeStatus, { message: 'Estado inválido' })
  status!: ChallengeStatus;

  @ApiProperty({ example: 'course1' })
  @IsString()
  courseId!: string;

  @ApiProperty({ example: 'user1' })
  @IsString()
  createdBy!: string;
}
