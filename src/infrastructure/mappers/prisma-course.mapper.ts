import { Course } from '../../domain/entities/course.entity';
import { PostgresUserMapper } from './postgres-user.mapper';

type CourseModelWithRelations = {
  id: string;
  name: string;
  code: string;
  period: string;
  group: string;
  professorId: string;
  createdAt: Date;
  updatedAt: Date;
  professor?: any;
  students?: { student: any }[];
};

export class PrismaCourseMapper {
  static toDomain(model: CourseModelWithRelations): Course {
    return new Course(
      model.id,
      model.name,
      model.code,
      model.period,
      model.group,
      model.professorId,
      model.professor ? PostgresUserMapper.toDomain(model.professor) : null,
      model.students?.map(e => PostgresUserMapper.toDomain(e.student)) ?? [],
      [],
      model.createdAt,
      model.updatedAt,
    );
  }
}
