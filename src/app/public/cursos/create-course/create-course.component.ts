import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { CoursesService } from '@app/core/services/courses.service';
import { Course, CourseLevel } from '@app/features/courses/domain/entities/course.entity';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-course.component.html'
})
export class CreateCourseComponent {
  private authService = inject(AuthService);
  private coursesService = inject(CoursesService);
  private tenantService = inject(TenantService);
  private router = inject(Router);

  isSubmitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Form Model
  course: Partial<Course> = {
    title: '',
    description: '',
    duration: '',
    schedule: '',
    level: CourseLevel.BASIC,
    price: 0,
    image_url: ''
  };

  async submitCourse() {
    this.error.set(null);
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.error.set('Debes estar logueado para proponer un curso.');
      return;
    }

    if (!this.course.title || !this.course.description || !this.course.price) {
      this.error.set('Por favor completa todos los campos requeridos (Título, Descripción, Precio).');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload = {
        ...this.course,
        slug: this.course.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        tenant_id: this.tenantService.getTenantId(),
        author_id: user.id,
        status: 'pending',
        is_active: false
      };

      // @ts-ignore
      const { data, error } = await this.coursesService.supabase.from('courses').insert(payload);

      if (error) throw error;
      
      this.success.set(true);
      setTimeout(() => {
        this.router.navigate(['/academy']);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      this.error.set('Hubo un error al enviar tu propuesta. ' + err.message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
