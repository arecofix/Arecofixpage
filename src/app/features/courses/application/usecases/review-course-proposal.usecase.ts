import { Injectable, inject } from '@angular/core';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { Course } from '../../domain/entities/course.entity';

@Injectable({
  providedIn: 'root'
})
export class ReviewCourseProposalUseCase {
  private courseRepository = inject(CourseRepository);

  async execute(courseId: string, status: 'APPROVED' | 'REJECTED', feedback?: string): Promise<{ success: boolean; data?: Course; error?: any }> {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      
      const updatePayload: Partial<Course> = {
        status: status,
        admin_feedback: feedback || '',
        is_active: status === 'APPROVED' // automatically activate if approved
      };

      const updated = await this.courseRepository.update(courseId, updatePayload);
      
      return { success: true, data: updated };
    } catch (error) {
      console.error('Error reviewing course proposal:', error);
      return { success: false, error };
    }
  }
}
