import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';

export class UpdateChallengeStatusDto {
  @ApiProperty({ enum: ChallengeStatus })
  @IsEnum(ChallengeStatus, { message: 'Estado inválido' })
  status!: ChallengeStatus;
}