import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService, Course, Module } from '@app/core/services/courses.service';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';
import { AuthService } from '@app/core/services/auth.service';
import { firstValueFrom } from 'rxjs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  private authService = inject(AuthService);
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
    hours_per_week: 'A tu ritmo',
    instructor_name: '',
    instructor_role: '',
    instructor_bio: '',
    instructor_avatar: '',
    audience_list: [],
    is_active: true
  };

  modules: (Module & { uploading: boolean; uploadProgress: number })[] = [];
  moduleContentsMap: Record<string, any[]> = {};
  newAudienceItem = '';

  get publicUrl(): string {
    return this.courseData.slug ? `/academy/${this.courseData.slug}` : '';
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const idOrSlug = params.get('idOrSlug') ?? params.get('id');
      if (idOrSlug && idOrSlug !== 'new') {
        await this.loadCourseByIdOrSlug(idOrSlug);
      } else {
        this.loading.set(false);
      }
    });
  }

  async loadCourseByIdOrSlug(idOrSlug: string) {
    this.loading.set(true);
    this.errorMsg.set(null);
    try {
      let course: Course | null = null;
      if (UUID_RE.test(idOrSlug)) {
        const res = await firstValueFrom(this.coursesService.getCourseById(idOrSlug));
        if (res.error || !res.data) throw new Error('Curso no encontrado');
        course = res.data;
        if (course.slug) {
          this.router.navigate(['/instructor/builder', course.slug], { replaceUrl: true });
        }
      } else {
        const res = await firstValueFrom(this.coursesService.getCourseBySlug(idOrSlug));
        if (res.error || !res.data) throw new Error('Curso no encontrado');
        course = res.data;
      }
      this.courseId.set(course.id);
      this.courseData = {
        ...course,
        audience_list: Array.isArray(course.audience_list) ? [...course.audience_list] : []
      };
      const modulesRes = await firstValueFrom(this.coursesService.getModulesByCourseId(course.id));
      if (modulesRes.data) {
        this.modules = modulesRes.data.map((m: Module) => ({ ...m, uploading: false, uploadProgress: 0 }));
        for (const mod of this.modules) {
          const contentsRes = await firstValueFrom(this.coursesService.getModuleContents(mod.id));
          this.moduleContentsMap[mod.id] = contentsRes.data || [];
        }
      }
    } catch (e: unknown) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Error al cargar el curso');
    } finally {
      this.loading.set(false);
    }
  }

  addAudienceItem() {
    const trimmed = this.newAudienceItem.trim();
    if (!trimmed) return;
    if (!Array.isArray(this.courseData.audience_list)) this.courseData.audience_list = [];
    this.courseData.audience_list = [...this.courseData.audience_list, trimmed];
    this.newAudienceItem = '';
  }

  removeAudienceItem(index: number) {
    if (!Array.isArray(this.courseData.audience_list)) return;
    this.courseData.audience_list = this.courseData.audience_list.filter((_, i) => i !== index);
  }

  addModule() {
    const tempId = crypto.randomUUID();
    this.modules.push({
      id: tempId,
      course_id: this.courseId() || '',
      title: '',
      description: '',
      order_index: this.modules.length,
      uploading: false,
      uploadProgress: 0
    });
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

  async onDrop(event: DragEvent, mod: { id: string; uploading: boolean; uploadProgress: number }) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      await this.handleFiles(event.dataTransfer.files, mod);
    }
  }

  async onFileSelected(event: Event, mod: { id: string; uploading: boolean; uploadProgress: number }) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      await this.handleFiles(input.files, mod);
    }
  }

  async handleFiles(files: FileList, mod: { id: string; uploading: boolean; uploadProgress: number }) {
    mod.uploading = true;
    this.cd.detectChanges();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let type: 'video' | 'image' | 'document' = 'document';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('image/')) type = 'image';
      try {
        const url = await this.storageService.uploadFile(file, 'course-materials');
        this.moduleContentsMap[mod.id].push({
          id: crypto.randomUUID(),
          title: file.name,
          type,
          url,
          order_index: this.moduleContentsMap[mod.id].length
        });
      } catch (e) {
        console.error('Error uploading file', e);
        this.errorMsg.set(`Error al subir ${file.name}`);
      }
    }
    mod.uploading = false;
    this.cd.detectChanges();
  }

  addLinkContent(modId: string) {
    const url = prompt('Pega la URL del contenido (YouTube, Drive, etc.):');
    if (!url?.trim()) return;
    const title = prompt('Titulo para este contenido:') || 'Enlace externo';
    this.moduleContentsMap[modId].push({
      id: crypto.randomUUID(),
      title: title.trim(),
      type: 'link',
      url: url.trim(),
      order_index: this.moduleContentsMap[modId].length
    });
    this.cd.detectChanges();
  }

  removeContent(modId: string, contentId: string) {
    this.moduleContentsMap[modId] = this.moduleContentsMap[modId].filter(c => c.id !== contentId);
  }

  getContentIcon(type: string): string {
    const icons: Record<string, string> = {
      video: 'fa-play-circle text-blue-500',
      image: 'fa-image text-green-500',
      document: 'fa-file-pdf text-red-500',
      link: 'fa-link text-purple-500',
      exam: 'fa-clipboard-check text-orange-500',
      text: 'fa-align-left text-gray-500'
    };
    return icons[type] || 'fa-file text-gray-400';
  }

  async uploadCourseImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploadingImage.set(true);
    this.cd.detectChanges();
    try {
      const url = await this.storageService.uploadFile(input.files[0], 'courses');
      this.courseData.image_url = url;
    } catch (e) {
      this.errorMsg.set('Error al subir la imagen de portada');
    } finally {
      this.uploadingImage.set(false);
      this.cd.detectChanges();
    }
  }

  async uploadInstructorAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploadingAvatar.set(true);
    this.cd.detectChanges();
    try {
      const url = await this.storageService.uploadFile(input.files[0], 'courses');
      this.courseData.instructor_avatar = url;
    } catch (e) {
      this.errorMsg.set('Error al subir el avatar del instructor');
    } finally {
      this.uploadingAvatar.set(false);
      this.cd.detectChanges();
    }
  }

  async save() {
    this.errorMsg.set(null);
    this.successMsg.set(null);
    this.saving.set(true);
    try {
      if (this.courseId()) {
        await firstValueFrom(this.coursesService.updateCourse(this.courseId()!, this.courseData));
        const cleanModules = this.modules.map(({ uploading, uploadProgress, ...rest }) => rest);
        const savedModulesRes = await firstValueFrom(this.coursesService.saveModules(this.courseId()!, cleanModules));
        if (savedModulesRes.data) {
          const savedModules: Module[] = savedModulesRes.data;
          for (let i = 0; i < savedModules.length; i++) {
            const newModId = savedModules[i].id;
            const oldModId = this.modules[i]?.id;
            const contentsToSave = this.moduleContentsMap[oldModId] || [];
            await firstValueFrom(this.coursesService.saveModuleContents(newModId, contentsToSave));
            this.moduleContentsMap[newModId] = contentsToSave;
            if (oldModId !== newModId) delete this.moduleContentsMap[oldModId];
          }
          this.modules = savedModules.map(m => ({ ...m, uploading: false, uploadProgress: 0 }));
        }
        this.successMsg.set('Curso guardado exitosamente!');
        setTimeout(() => this.successMsg.set(null), 4000);
      } else {
        const profile = this.authService.getCurrentProfile();
        const payload: Partial<Course> = { ...this.courseData, author_id: profile?.id };
        const res = await firstValueFrom(this.coursesService.createCourse(payload));
        if (res.data) {
          this.courseId.set(res.data.id);
          this.successMsg.set('Curso creado exitosamente!');
          const slug = res.data.slug || res.data.id;
          this.router.navigate(['/instructor/builder', slug], { replaceUrl: true });
        }
      }
    } catch (e: unknown) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Error al guardar el curso');
    } finally {
      this.saving.set(false);
    }
  }

  generateSlug() {
    if (!this.courseData.title) return;
    this.courseData.slug = this.courseData.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
