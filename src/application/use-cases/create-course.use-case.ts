import { Injectable, Inject, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { type IUserRepository } from '../../domain/repositories/user.repository';
import { Course } from '../../domain/entities/course.entity';
import { CreateCourseRequestDto } from '../dtos/create-course.request.dto';
import { CourseResponseDto } from '../dtos/course.response.dto';
import { Role } from '../../domain/entities/role.enum';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateCourseRequestDto, professorId: string): Promise<CourseResponseDto> {
    const professor = await this.userRepository.findById(professorId);
    if (!professor) throw new NotFoundException('Professor not found');
    if (professor.role !== Role.PROFESSOR && professor.role !== Role.ADMIN) {
      throw new ForbiddenException('Only professors can own courses');
    }

    const existing = await this.courseRepository.findByCode(dto.code);
    if (existing) throw new ConflictException(`Course with code "${dto.code}" already exists`);

    const course = new Course(
      undefined,
      dto.name,
      dto.code,
      dto.period,
      dto.group,
      professorId,
      professor,
      [],
      [],
      new Date(),
      new Date(),
    );

    const saved = await this.courseRepository.save(course);
    return CourseResponseDto.fromEntity(saved);
  }
}
