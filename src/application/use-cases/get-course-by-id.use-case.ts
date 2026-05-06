import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { CourseResponseDto } from '../dtos/course.response.dto';

@Injectable()
export class GetCourseByIdUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException(`Course "${id}" not found`);
    return CourseResponseDto.fromEntity(course);
  }
}