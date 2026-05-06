import { Course } from '../entities/course.entity';

export interface ICourseRepository {
  save(course: Course): Promise<Course>;
  findAll(): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  findByCode(code: string): Promise<Course | null>;
  update(course: Course): Promise<Course>;
  delete(id: string): Promise<void>;
  addStudent(courseId: string, studentId: string): Promise<void>;
  removeStudent(courseId: string, studentId: string): Promise<void>;
}
