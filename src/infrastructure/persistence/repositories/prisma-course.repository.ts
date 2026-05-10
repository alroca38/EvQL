import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICourseRepository } from '../../../domain/repositories/course.repository';
import { Course } from '../../../domain/entities/course.entity';
import { PrismaCourseMapper } from '../../mappers/prisma-course.mapper';

const include = {
  professor: true,
  students: { include: { student: true } },
};

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(course: Course): Promise<Course> {
    const created = await this.prisma.courseModel.create({
      data: {
        name: course.name,
        code: course.code,
        period: course.period,
        group: course.group,
        professorId: course.professorId,
      },
      include,
    });
    return PrismaCourseMapper.toDomain(created);
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.courseModel.findMany({ include });
    return courses.map(PrismaCourseMapper.toDomain);
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.courseModel.findUnique({
      where: { id },
      include,
    });
    return course ? PrismaCourseMapper.toDomain(course) : null;
  }

  async findByCode(code: string): Promise<Course | null> {
    const course = await this.prisma.courseModel.findUnique({
      where: { code },
      include,
    });
    return course ? PrismaCourseMapper.toDomain(course) : null;
  }

  async update(course: Course): Promise<Course> {
    const updated = await this.prisma.courseModel.update({
      where: { id: course.id },
      data: {
        name: course.name,
        code: course.code,
        period: course.period,
        group: course.group,
        updatedAt: new Date(),
      },
      include,
    });
    return PrismaCourseMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.courseModel.delete({ where: { id } });
  }

  async addStudent(courseId: string, studentId: string): Promise<void> {
    await this.prisma.courseEnrollmentModel.create({
      data: { courseId, studentId },
    });
  }

  async removeStudent(courseId: string, studentId: string): Promise<void> {
    await this.prisma.courseEnrollmentModel.delete({
      where: { courseId_studentId: { courseId, studentId } },
    });
  }
}
