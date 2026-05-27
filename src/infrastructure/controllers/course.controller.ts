import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/entities/role.enum';
import { CreateCourseUseCase } from '../../application/use-cases/create-course.use-case';
import { GetAllCoursesUseCase } from '../../application/use-cases/get-all-courses.use-case';
import { GetCourseByIdUseCase } from '../../application/use-cases/get-course-by-id.use-case';
import { UpdateCourseUseCase } from '../../application/use-cases/update-course.use-case';
import { GetMyStudentCoursesUseCase } from '../../application/use-cases/get-my-student-courses.use-case';
import { GetMyProfessorCoursesUseCase } from '../../application/use-cases/get-my-professor-courses.use-case';
import { DeleteCourseUseCase } from '../../application/use-cases/delete-course.use-case';
import { EnrollStudentUseCase, RemoveStudentUseCase } from '../../application/use-cases/enroll-student.use-case';
import { CreateCourseRequestDto } from '../../application/dtos/create-course.request.dto';
import { UpdateCourseRequestDto } from '../../application/dtos/update-course.request.dto';
import { EnrollStudentRequestDto } from '../../application/dtos/enroll-student.request.dto';
import { GetCourseStudentsUseCase } from '../../application/use-cases/get-course-students.use-case';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(
    private readonly createCourse: CreateCourseUseCase,
    private readonly getAllCourses: GetAllCoursesUseCase,
    private readonly getCourseById: GetCourseByIdUseCase,
    private readonly updateCourse: UpdateCourseUseCase,
    private readonly deleteCourse: DeleteCourseUseCase,
    private readonly enrollStudent: EnrollStudentUseCase,
    private readonly removeStudent: RemoveStudentUseCase,
    private readonly getMyStudentCourses: GetMyStudentCoursesUseCase,
    private readonly getMyProfessorCourses: GetMyProfessorCoursesUseCase,
    private readonly getCourseStudents: GetCourseStudentsUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new course' })
  async create(@Body() dto: CreateCourseRequestDto, @Req() req: any) {
    return this.createCourse.execute(dto, req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'List all courses' })
  async findAll() {
    return this.getAllCourses.execute();
  }

  @Get('student/me')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get all courses enrolled by the current student' })
  async findMyStudentCourses(@Req() req: any) {
    return this.getMyStudentCourses.execute(req.user.userId);
  }

  @Get('professor/me')
  @Roles(Role.PROFESSOR)
  @ApiOperation({ summary: 'Get all courses taught by the current professor' })
  async findMyProfessorCourses(@Req() req: any) {
    return this.getMyProfessorCourses.execute(req.user.userId);
  }

  @Get(':id/students')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Get all students enrolled in a course' })
  @ApiParam({ name: 'id', type: String })
  async findStudents(@Param('id', ParseUUIDPipe) id: string) {
    return this.getCourseStudents.execute(id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getCourseById.execute(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseRequestDto,
  ) {
    return this.updateCourse.execute(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course (admin only)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCourse.execute(id);
  }

  @Post(':id/students')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Enroll a student in a course' })
  @ApiParam({ name: 'id', type: String })
  async enroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnrollStudentRequestDto,
  ) {
    await this.enrollStudent.execute(id, dto.studentId);
    return { message: 'Student enrolled successfully' };
  }

  @Delete(':id/students/:studentId')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a student from a course' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'studentId', type: String })
  async unenroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.removeStudent.execute(id, studentId);
  }
}
