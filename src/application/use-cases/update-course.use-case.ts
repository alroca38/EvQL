import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { UpdateCourseRequestDto } from '../dtos/update-course.request.dto';
import { CourseResponseDto } from '../dtos/course.response.dto';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string, dto: UpdateCourseRequestDto): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException(`Course "${id}" not found`);

    if (dto.code && dto.code !== course.code) {
      const conflict = await this.courseRepository.findByCode(dto.code);
      if (conflict) throw new ConflictException(`Course with code "${dto.code}" already exists`);
    }

    course.name = dto.name ?? course.name;
    course.code = dto.code ?? course.code;
    course.period = dto.period ?? course.period;
    course.group = dto.group ?? course.group;
    course.updatedAt = new Date();

    const updated = await this.courseRepository.update(course);
    return CourseResponseDto.fromEntity(updated);
  }
}