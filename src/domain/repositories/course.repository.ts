import { Course } from "../entities/course.entity";

export interface CourseRepository {
    save(course: Course): Promise<void>;
    findAll(): Promise<Course | null>;
    addStudent(courseCode: string, studentCode: string): Promise<void>;
}