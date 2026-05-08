import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { DatabaseEngine } from '../../domain/entities/database-engine.enum';

export class CreateSubmissionRequestDto {

  @IsString()
  @IsNotEmpty()
  challengeId!: string;


  @IsEnum(DatabaseEngine)
  engine!: DatabaseEngine;


  @IsString()
  @IsNotEmpty()
  query!: string;
}