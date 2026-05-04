import { Course } from "../entities/course.entity";

export interface ICourseRepository {
    save(course: Course): Promise<void>;
    findAll(): Promise<Course | null>;
    addStudent(courseCode: string, studentCode: string): Promise<void>;
}