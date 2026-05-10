import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentRequestDto {
  @ApiProperty({ description: 'Student user ID (UUID)', example: 'c1a2b3...' })
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}