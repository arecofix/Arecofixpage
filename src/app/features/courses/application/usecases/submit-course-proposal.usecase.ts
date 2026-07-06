import { Injectable, inject } from '@angular/core';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { Course } from '../../domain/entities/course.entity';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubmitCourseProposalUseCase {
  private courseRepository = inject(CourseRepository);
  private authService = inject(AuthService);

  async execute(courseData: Partial<Course>): Promise<{ success: boolean; data?: Course; error?: any }> {
    try {
      const user = this.authService.getCurrentProfile();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Basic validation
      if (!courseData.title || !courseData.description) {
        throw new Error('Missing required fields: title, description');
      }

      // For proposals, we set the initial status to PENDING or DRAFT
      // If it's ready for review, it's PENDING.
      const status = courseData.status === 'DRAFT' ? 'DRAFT' : 'PENDING';

      const newCourse: Partial<Course> = {
        ...courseData,
        status: status,
        author_id: user.id,
        is_active: false // Only active when PUBLISHED/APPROVED
      };

      // Since CourseRepository doesn't have a specific "create" method in the abstract class,
      // we'll assume it exists or use Supabase directly if we have to.
      // We will cast it to any for now assuming the implementation supports create.
      const repo = this.courseRepository as any;
      if (typeof repo.create !== 'function') {
         throw new Error('CourseRepository does not implement create()');
      }
      
      const created = await repo.create(newCourse);
      
      return { success: true, data: created };
    } catch (error) {
      console.error('Error submitting course proposal:', error);
      return { success: false, error };
    }
  }
}
