import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Course } from '../../domain/entities/course.entity';

class UserSummaryDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  code!: string;
}

export class CourseResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() code!: string;
  @ApiProperty() period!: string;
  @ApiProperty() group!: string;
  @ApiProperty() professorId!: string;
  @ApiPropertyOptional() professor!: UserSummaryDto | null;
  @ApiProperty() studentCount!: number;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;

  static fromEntity(entity: Course): CourseResponseDto {
    const dto = new CourseResponseDto();
    dto.id = entity.id!;
    dto.name = entity.name;
    dto.code = entity.code;
    dto.period = entity.period;
    dto.group = entity.group;
    dto.professorId = entity.professorId;
    dto.professor = entity.professor
      ? {
          id: entity.professor.id!,
          firstName: entity.professor.firstName,
          lastName: entity.professor.lastName,
          email: entity.professor.email,
          code: entity.professor.code,
        }
      : null;
    dto.studentCount = entity.students.length;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
