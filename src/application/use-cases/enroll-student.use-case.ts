import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { type ICourseRepository } from '../../domain/repositories/course.repository';
import { type IUserRepository } from '../../domain/repositories/user.repository';
import { Role } from '../../domain/entities/role.enum';

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(courseId: string, studentId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new NotFoundException(`Course "${courseId}" not found`);

    const student = await this.userRepository.findById(studentId);
    if (!student) throw new NotFoundException(`Student "${studentId}" not found`);
    if (student.role !== Role.STUDENT) {
      throw new BadRequestException('Only users with role STUDENT can be enrolled');
    }

    const alreadyEnrolled = course.students.some(s => s.id === studentId);
    if (alreadyEnrolled) throw new ConflictException('Student is already enrolled in this course');

    await this.courseRepository.addStudent(courseId, studentId);
  }
}

@Injectable()
export class RemoveStudentUseCase {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(courseId: string, studentId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new NotFoundException(`Course "${courseId}" not found`);

    const enrolled = course.students.some(s => s.id === studentId);
    if (!enrolled) throw new NotFoundException('Student is not enrolled in this course');

    await this.courseRepository.removeStudent(courseId, studentId);
  }
}