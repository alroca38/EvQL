import { Injectable, Inject } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { CourseResponseDto } from '../dtos/course.response.dto';

@Injectable()
export class GetAllCoursesUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.findAll();
    return courses.map(CourseResponseDto.fromEntity);
  }
}