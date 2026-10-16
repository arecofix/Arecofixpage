import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService, Module } from '@app/core/services/courses.service';
import { ProductMediaService } from '@app/admin/products/services/product-media.service';
import { LoggerService } from '@app/core/services/logger.service';
import { CourseLevel } from '@app/features/courses/domain/entities/course.entity';
import { NotificationService } from '@app/core/services/notification.service';
import { AdminUsersService } from '@app/admin/users/services/admin-users.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { signal } from '@angular/core';
import { CourseBasicInfoFormComponent } from './components/course-basic-info-form.component';
import { CourseLogisticsFormComponent } from './components/course-logistics-form.component';
import { CourseStaffFormComponent } from './components/course-staff-form.component';
import { CourseModulesFormComponent } from './components/app-course-modules-form.component';
@Component({
  selector: 'app-admin-course-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CourseBasicInfoFormComponent, CourseLogisticsFormComponent, CourseStaffFormComponent, CourseModulesFormComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-course-form-page.html',
})
export class AdminCourseFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mediaService = inject(ProductMediaService);
  private cdr = inject(ChangeDetectorRef);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);
  private adminUsersService = inject(AdminUsersService);

  form: FormGroup;
  isEditing = false;
  courseId: string | null = null;
  saving = false;

  instructors = signal<UserProfile[]>([]);

  constructor() {
    this.form = this.fb.group(
      {
        title: ['', Validators.required],
        slug: ['', Validators.required],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        sale_price: [null],
        level: [CourseLevel.BASIC, Validators.required],
        duration: ['', Validators.required],
        schedule: ['', Validators.required],
        image_url: ['', Validators.required],
        is_active: [true],
        instructor_name: [''],
        instructor_id: [''],
        start_date: [''],
        is_featured: [false],
        short_description: [''],
        students: [0],
        rating: [5.0],
        classes_count: [0],
        hours_content: [0],
        hours_practice: [0],
        hours_per_week: [''],
        instructor_role: [''],
        instructor_bio: [''],
        instructor_avatar: [''],
        author_id: [''],
        audience_list: [''],
        reviews_count: [0],
        modules: this.fb.array([]),
      },
      { validators: this.priceValidator },
    );
  }

  // Custom validator to ensure sale_price < price
  priceValidator(group: FormGroup) {
    const price = group.get('price')?.value;
    const salePrice = group.get('sale_price')?.value;

    if (price !== null && salePrice !== null && salePrice !== '') {
      if (Number(salePrice) >= Number(price)) {
        return { salePriceTooHigh: true };
      }
    }
    return null;
  }

  get modulesFormArray() {
    return this.form.get('modules') as FormArray;
  }

  addModule(modData?: Partial<Module>) {
    const moduleGroup = this.fb.group({
      id: [modData?.id || null],
      title: [modData?.title || '', Validators.required],
      description: [modData?.description || ''],
      order_index: [modData?.order_index || this.modulesFormArray.length + 1],
    });
    this.modulesFormArray.push(moduleGroup);
  }

  removeModule(index: number) {
    this.modulesFormArray.removeAt(index);
  }

  ngOnInit() {
    this.loadInstructors();
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditing = true;
      this.loadCourse(this.courseId);
    } else {
      // Auto-generate slug for new courses
      this.form.get('title')?.valueChanges.subscribe((val) => {
        if (val) {
          const slug = val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          this.form.get('slug')?.setValue(slug, { emitEvent: false });
        }
      });
    }
  }

  getImageSrc(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    // If it is a relative path (e.g. from existing database seed), prepend /
    return '/' + url;
  }

  async onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.saving = true;
    this.cdr.markForCheck(); // Force update UI to show spinner

    try {
      const publicUrl = await this.mediaService.uploadFile(file, 'courses');
      this.form.patchValue({ image_url: publicUrl });
      this.cdr.markForCheck(); // Update preview
    } catch (error: any) {
      this.logger.error('Error uploading image', error);
      this.notificationService.showError(
        'Error al subir la imagen: ' + (error.message || error),
      );
    } finally {
      this.saving = false;
      this.cdr.markForCheck(); // Ensure spinner stops
      // Reset input so same file can be selected again if needed
      if (event.target) event.target.value = '';
    }
  }

  loadCourse(id: string) {
    this.coursesService.getCourseById(id).subscribe({
      next: (response: { data: any; error: any }) => {
        if (response.data) {
          // Join audience_list array to string for the textarea
          if (
            response.data.audience_list &&
            Array.isArray(response.data.audience_list)
          ) {
            response.data.audience_list =
              response.data.audience_list.join('\n');
          }
          this.form.patchValue(response.data);
        }
      },
      error: (err: any) => this.logger.error('Error loading course', err),
    });

    this.coursesService.getModulesByCourseId(id).subscribe({
      next: (res: { data: any[]; error: any }) => {
        if (res.data && res.data.length > 0) {
          this.modulesFormArray.clear();
          res.data.forEach((m: any) => this.addModule(m));
        }
      },
      error: (err: any) => this.logger.error('Error loading modules', err),
    });
  }

  async save() {
    if (this.saving) return; // Prevent double execution

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      // Extract which fields are invalid
      const invalidFields = Object.keys(this.form.controls).filter(
        (key) => this.form.get(key)?.invalid,
      );

      const fieldNames: Record<string, string> = {
        title: 'Título',
        slug: 'URL (Slug)',
        description: 'Descripción',
        price: 'Inversión Real',
        duration: 'Duración Total',
        schedule: 'Días y Horarios',
        image_url: 'Portada del Curso',
        level: 'Dificultad',
      };

      const translatedFields = invalidFields.map((f) => fieldNames[f] || f);

      this.logger.warn('Form is invalid. Missing fields:', invalidFields);

      if (this.modulesFormArray.invalid) {
        this.notificationService.showError(
          'Por favor asegúrate de que todos los módulos tengan un título.',
        );
      } else if (this.form.hasError('salePriceTooHigh')) {
        this.notificationService.showError(
          'El Precio Ficticio (Tachado) no puede ser mayor o igual a la Inversión Real.',
        );
      } else {
        this.notificationService.showError(
          `Faltan completar campos obligatorios: ${translatedFields.join(', ')}`,
        );
      }
      return;
    }

    this.saving = true;
    const formValue = this.form.value;

    const courseData = {
      title: formValue.title,
      slug: formValue.slug,
      description: formValue.description,
      price: formValue.price,
      sale_price: formValue.sale_price || null,
      level: formValue.level,
      duration: formValue.duration,
      schedule: formValue.schedule,
      image_url: formValue.image_url,
      is_active: formValue.is_active,
      instructor_name: formValue.instructor_name || null,
      instructor_id: formValue.instructor_id || null,
      start_date: formValue.start_date || null,
      is_featured: formValue.is_featured || false,
      short_description: formValue.short_description || null,
      classes_count: formValue.classes_count || 0,
      hours_content: formValue.hours_content || 0,
      hours_practice: formValue.hours_practice || 0,
      hours_per_week: formValue.hours_per_week || null,
      instructor_role: formValue.instructor_role || null,
      instructor_bio: formValue.instructor_bio || null,
      instructor_avatar: formValue.instructor_avatar || null,
      author_id: formValue.author_id || null,
      audience_list: formValue.audience_list
        ? formValue.audience_list
            .split('\n')
            .map((i: string) => i.trim())
            .filter((i: string) => i)
        : null,
      reviews_count: formValue.reviews_count || 0,
    };

    const modules = this.modulesFormArray.value;

    this.logger.debug('Starting course save workflow', {
      isEditing: this.isEditing,
    });

    try {
      let courseResult;
      if (this.isEditing && this.courseId) {
        courseResult = await this.coursesService
          .updateCourse(this.courseId, courseData)
          .toPromise();
      } else {
        courseResult = await this.coursesService
          .createCourse(courseData)
          .toPromise();
      }

      if (courseResult?.error) {
        throw new Error(
          courseResult.error.message || 'Error al guardar el curso',
        );
      }

      const savedCourseId = courseResult?.data?.id || this.courseId;

      if (savedCourseId && modules && modules.length >= 0) {
        try {
          await this.coursesService
            .saveModules(savedCourseId, modules)
            .toPromise();
        } catch (modErr: any) {
          this.logger.warn('Failed to sync modules', modErr);
          this.notificationService.showError(
            'El programa se guardó con éxito pero falló la sincronización de los Módulos. Esto puede deberse a que no has aplicado las migraciones de Base de Datos para el Temario.',
          );
        }
      }

      this.notificationService.showSuccess(
        'Programa educativo guardado correctamente.',
      );
      this.router.navigate(['/admin/courses']);
    } catch (err: any) {
      this.logger.error('Save workflow failed', err);
      this.notificationService.showError('Error al guardar: ' + err.message);
      alert('Error al guardar: ' + err.message); // Adding an alert as fallback so the user definitely sees the database error
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  loadInstructors() {
    this.adminUsersService.getUsers().subscribe({
      next: (instructors) => {
        this.instructors.set(instructors);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.logger.error('Error loading instructors', err);
      },
    });
  }
}
