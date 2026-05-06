import { Module } from '@nestjs/common';
import { CourseController } from '../controllers/course.controller';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaCourseRepository } from '../persistence/repositories/prisma-course.repository';
import { PrismaUserRepository } from '../persistence/repositories/prisma-user.repository';
import { CreateCourseUseCase } from '../../application/use-cases/create-course.use-case';
import { GetAllCoursesUseCase } from '../../application/use-cases/get-all-courses.use-case';
import { GetCourseByIdUseCase } from '../../application/use-cases/get-course-by-id.use-case';
import { UpdateCourseUseCase } from '../../application/use-cases/update-course.use-case';
import { DeleteCourseUseCase } from '../../application/use-cases/delete-course.use-case';
import { EnrollStudentUseCase, RemoveStudentUseCase } from '../../application/use-cases/enroll-student.use-case';

@Module({
  controllers: [CourseController],
  providers: [
    PrismaService,
    CreateCourseUseCase,
    GetAllCoursesUseCase,
    GetCourseByIdUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    EnrollStudentUseCase,
    RemoveStudentUseCase,
    {
      provide: 'ICourseRepository',
      useClass: PrismaCourseRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: ['ICourseRepository'],
})
export class CourseModule {}