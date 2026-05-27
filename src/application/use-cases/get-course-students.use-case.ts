import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICourseRepository } from '../../domain/repositories/course.repository';
import { UserResponseDto } from '../dtos/user.response.dto';

@Injectable()
export class GetCourseStudentsUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(courseId: string): Promise<UserResponseDto[]> {
    const course = await this.courseRepo.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }
    return course.students.map(UserResponseDto.fromEntity);
  }
}