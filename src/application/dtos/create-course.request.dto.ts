import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseRequestDto {
  @ApiProperty({ example: 'Bases de Datos II' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'BD2-2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code!: string;

  @ApiProperty({ example: '2026-1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  period!: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  group!: string;
}