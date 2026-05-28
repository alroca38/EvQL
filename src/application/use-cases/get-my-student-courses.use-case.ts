import { Injectable, Inject } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { CourseResponseDto } from '../dtos/course.response.dto';

@Injectable()
export class GetMyStudentCoursesUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(studentId: string): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.findByStudentId(studentId);
    return courses.map(CourseResponseDto.fromEntity);
  }
}
