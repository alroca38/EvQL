import { Injectable, Inject } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { CourseResponseDto } from '../dtos/course.response.dto';

@Injectable()
export class GetMyProfessorCoursesUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(professorId: string): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.findByProfessorId(professorId);
    return courses.map(CourseResponseDto.fromEntity);
  }
}
