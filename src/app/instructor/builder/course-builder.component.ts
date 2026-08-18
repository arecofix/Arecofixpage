import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService, Course, Module } from '@app/core/services/courses.service';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';

import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-builder.component.html'
})
export class CourseBuilderComponent implements OnInit {
  private router = inject(Router);
  route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  private storageService = inject(SupabaseStorageService);
  cd = inject(ChangeDetectorRef);
  
  courseId = signal<string | null>(null);
  loading = signal(true);
  saving = signal(false);
  uploadingImage = signal(false);
  uploadingAvatar = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  activeTab = signal<'general' | 'modules' | 'settings'>('general');

  courseData: Partial<Course> = {
    title: '',
    description: '',
    short_description: '',
    slug: '',
    level: 'basic',
    price: 0,
    sale_price: 0,
    duration: '',
    schedule: 'A tu propio ritmo',
    image_url: '',
    classes_count: 0,
    hours_content: 0,
    hours_practice: 0,
    instructor_name: '',
    instructor_bio: '',
    is_active: true
  };

  modules: any[] = [];
  moduleContentsMap: Record<string, any[]> = {};

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.courseId.set(id);
        await this.loadCourse(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  async loadCourse(id: string) {
    this.loading.set(true);
    this.errorMsg.set(null);
    try {
      const courseRes = await firstValueFrom(this.coursesService.getCourseById(id));
      if (courseRes.error || !courseRes.data) throw new Error('Curso no encontrado');
      
      this.courseData = { ...courseRes.data };

      const modulesRes = await firstValueFrom(this.coursesService.getModulesByCourseId(id));
      if (modulesRes.data) {
        this.modules = modulesRes.data.map((m: any) => ({ ...m, uploading: false, uploadProgress: 0 }));
        
        for (const mod of this.modules) {
          const contentsRes = await firstValueFrom(this.coursesService.getModuleContents(mod.id));
          if (contentsRes.data) {
             this.moduleContentsMap[mod.id] = contentsRes.data;
          } else {
             this.moduleContentsMap[mod.id] = [];
          }
        }
      }
    } catch (e: any) {
      this.errorMsg.set(e.message || 'Error al cargar el curso');
    } finally {
      this.loading.set(false);
    }
  }

  addModule() {
    const tempId = crypto.randomUUID();
    this.modules.push({ id: tempId, title: '', description: '', order_index: this.modules.length, uploading: false, uploadProgress: 0 });
    this.moduleContentsMap[tempId] = [];
  }

  removeModule(index: number) {
    const mod = this.modules[index];
    delete this.moduleContentsMap[mod.id];
    this.modules.splice(index, 1);
  }

  moveModule(index: number, direction: number) {
    if (index + direction < 0 || index + direction >= this.modules.length) return;
    const temp = this.modules[index];
    this.modules[index] = this.modules[index + direction];
    this.modules[index + direction] = temp;
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }
  onDragLeave(event: DragEvent) { event.preventDefault(); }

  async onDrop(event: DragEvent, mod: any) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      await this.handleFiles(event.dataTransfer.files, mod);
    }
  }

  async onFileSelected(event: any, mod: any) {
    if (event.target.files && event.target.files.length > 0) {
      await this.handleFiles(event.target.files, mod);
    }
  }

  async handleFiles(files: FileList, mod: any) {
    mod.uploading = true;
    this.cd.detectChanges();
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let type = 'document';
        if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('image/')) type = 'image';

        try {
            const url = await this.storageService.uploadFile(file, 'course-materials');
            this.moduleContentsMap[mod.id].push({
                id: crypto.randomUUID(),
                title: file.name,
                type: type,
                url: url
            });
        } catch (e) {
            console.error('Error uploading file', e);
            this.errorMsg.set(`Error al subir ${file.name}`);
        }
    }
    
    mod.uploading = false;
    this.cd.detectChanges();
  }

  removeContent(modId: string, contentId: string) {
    this.moduleContentsMap[modId] = this.moduleContentsMap[modId].filter(c => c.id !== contentId);
  }

  async uploadCourseImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadingImage.set(true);
      this.cd.detectChanges();
      const file = event.target.files[0];
      try {
        const url = await this.storageService.uploadFile(file, 'courses');
        this.courseData.image_url = url;
      } catch (e) {
        this.errorMsg.set('Error al subir la imagen de portada');
      } finally {
        this.uploadingImage.set(false);
        this.cd.detectChanges();
      }
    }
  }

  async uploadInstructorAvatar(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadingAvatar.set(true);
      this.cd.detectChanges();
      const file = event.target.files[0];
      try {
        const url = await this.storageService.uploadFile(file, 'courses');
        this.courseData.instructor_avatar = url;
      } catch (e) {
        this.errorMsg.set('Error al subir el avatar del instructor');
      } finally {
        this.uploadingAvatar.set(false);
        this.cd.detectChanges();
      }
    }
  }

  async save() {
    this.errorMsg.set(null);
    this.successMsg.set(null);
    this.saving.set(true);
    
    try {
      if (this.courseId()) {
          await firstValueFrom(this.coursesService.updateCourse(this.courseId()!, this.courseData));
          
          const cleanModules = this.modules.map(m => {
              const { uploading, uploadProgress, created_at, updated_at, ...rest } = m;
              return rest;
          });
          const savedModulesRes = await firstValueFrom(this.coursesService.saveModules(this.courseId()!, cleanModules));
          if (savedModulesRes.data) {
             const savedModules = savedModulesRes.data;
             for (let i = 0; i < savedModules.length; i++) {
                 const newModId = savedModules[i].id;
                 const oldModId = this.modules[i].id;
                 const contentsToSave = this.moduleContentsMap[oldModId] || [];
                 if (contentsToSave.length > 0) {
                     await firstValueFrom(this.coursesService.saveModuleContents(newModId, contentsToSave));
                 }
             }
          }
          this.successMsg.set('¡Curso guardado exitosamente!');
      } else {
          const res = await firstValueFrom(this.coursesService.createCourse(this.courseData));
          if (res.data) {
              this.courseId.set(res.data.id);
              this.successMsg.set('¡Curso creado exitosamente!');
              this.router.navigate(['/instructor/builder', res.data.id], { replaceUrl: true });
          }
      }
    } catch (e: any) {
        this.errorMsg.set(e.message || 'Error al guardar el curso');
    } finally {
        this.saving.set(false);
    }
  }
}
