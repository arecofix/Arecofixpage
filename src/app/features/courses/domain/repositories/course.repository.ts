import { Course, CourseModule, StudentEnrollment } from '../entities/course.entity';

export abstract class CourseRepository {
    abstract getAll(): Promise<Course[]>;
    abstract getBySlug(slug: string): Promise<Course | null>;
    abstract getById(id: string): Promise<Course | null>;
    abstract create(course: Partial<Course>): Promise<Course>;
    abstract update(id: string, course: Partial<Course>): Promise<Course>;
    abstract delete(id: string): Promise<void>;
    
    // Modules
    abstract getModules(courseId: string): Promise<CourseModule[]>;
    abstract saveModules(courseId: string, modules: Partial<CourseModule>[], tenantId?: string): Promise<CourseModule[]>;
    
    // Enrollments
    abstract enrollStudent(enrollment: StudentEnrollment): Promise<StudentEnrollment>;
}
