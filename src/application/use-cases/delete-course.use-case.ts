import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException(`Course "${id}" not found`);
    await this.courseRepository.delete(id);
  }
}