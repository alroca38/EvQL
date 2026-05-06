import { PartialType } from '@nestjs/swagger';
import { CreateCourseRequestDto } from './create-course.request.dto';

export class UpdateCourseRequestDto extends PartialType(CreateCourseRequestDto) {}
