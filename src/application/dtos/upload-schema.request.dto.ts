import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadSchemaRequestDto {
    @ApiProperty({
    description: 'DDL SQL script with CREATE TABLE statements',
    example: `CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(80) NOT NULL
    );`,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    ddlScript!: string;

    @ApiPropertyOptional({ description: 'Optional seed SQL script with INSERT statements' })
    @IsString()
    @IsOptional()
    seedScript!: string;
}