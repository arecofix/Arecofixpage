import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '@app/core/services/supabase.service';
import { CertificatesService } from '@app/features/courses/application/services/certificates.service';
import { ApproveStudentModalComponent } from '../../components/approve-student-modal/approve-student-modal.component';

import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-course-students-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ApproveStudentModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-8 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/instructor" class="btn btn-circle btn-sm">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white">Alumnos Inscritos</h1>
          </div>
          
          <button class="btn btn-primary" (click)="openManualCertModal()">
            <i class="fas fa-certificate mr-2"></i> Emitir Cert. Manual
          </button>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div class="loading loading-spinner loading-lg"></div>
          </div>
        } @else if (students().length === 0) {
          <div class="text-center py-20 text-slate-500">
            No hay alumnos inscritos en este curso todavía.
          </div>
        } @else {
          <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-box shadow">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Certificado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (student of students(); track student.id) {
                  <tr>
                    <td>
                      <div class="font-bold">{{ student.full_name }}</div>
                    </td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.phone || '-' }}</td>
                    <td>
                      <span class="badge" [class.badge-success]="student.status === 'confirmed'">
                        {{ student.status }}
                      </span>
                    </td>
                    <td>
                      @if (student.has_certificate) {
                        <div class="flex items-center gap-3">
                          <a [href]="student.certificate_url" target="_blank" class="text-success text-sm font-bold flex items-center gap-1">
                            <i class="fas fa-certificate"></i> Emitido
                          </a>
                          <button class="btn btn-ghost btn-xs text-error" (click)="revokeCertificate(student.email)" title="Revocar Certificado">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      } @else {
                        <span class="text-slate-400 text-sm">No emitido</span>
                      }
                    </td>
                    <td>
                      @if (!student.has_certificate && student.status === 'confirmed') {
                        <button class="btn btn-sm btn-primary" (click)="openApproveModal(student)">
                          Aprobar
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

      </div>
    </div>

    <app-approve-student-modal #approveModal 
      (onApproved)="onCertificateGenerated($event)">
    </app-approve-student-modal>
  `
})
export class CourseStudentsPage implements OnInit {
  private readonly supabase = inject(SupabaseService).getClient();
  private readonly certificatesService = inject(CertificatesService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('approveModal') approveModal!: ApproveStudentModalComponent;

  loading = signal(true);
  students = signal<any[]>([]);
  courseId = '';
  courseName = 'Curso';

  async ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) {
      await this.loadCourseAndStudents();
    }
  }

  async loadCourseAndStudents() {
    this.loading.set(true);
    try {
      // 1. Get Course Info
      const { data: course } = await this.supabase
        .from('courses')
        .select('title')
        .eq('id', this.courseId)
        .single();
      
      if (course) this.courseName = course.title;

      // 2. Get Enrollments and left join with certificates to know if they have one
      const { data: enrollments, error: enrollmentsError } = await this.supabase
        .from('course_enrollments')
        .select('*, profiles:user_id(first_name, last_name, email, phone)')
        .eq('course_id', this.courseId);
        
      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
      }

      // 3. Get Certificates for this course
      const { data: certificates } = await this.supabase
        .from('course_certificates')
        .select('email, pdf_url')
        .eq('course_id', this.courseId);

      const certsMap = new Map(certificates?.map(c => [c.email, c.pdf_url]));

      const capitalizeWords = (str: string) => {
        return str
          .split(' ')
          .filter(word => word.length > 0)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };

      const enrichedStudents = (enrollments || []).map((e: any) => {
        const profileName = e.profiles ? `${e.profiles.last_name || ''}, ${e.profiles.first_name || ''}`.trim().replace(/^,\s*|\s*,$/g, '') : '';
        const fallbackName = e.student_name || e.full_name || e.name || 'Sin Nombre';
        let finalName = profileName || fallbackName;
        
        finalName = capitalizeWords(finalName);
        
        const finalEmail = e.profiles?.email || e.email || e.student_email || '';
        const finalPhone = e.profiles?.phone || e.phone || '-';

        return {
          ...e,
          full_name: finalName,
          email: finalEmail,
          phone: finalPhone,
          has_certificate: certsMap.has(finalEmail),
          certificate_url: certsMap.get(finalEmail)
        };
      });

      this.students.set(enrichedStudents);
    } catch (e) {
      console.error('Error loading students', e);
    } finally {
      this.loading.set(false);
    }
  }

  openApproveModal(student: any) {
    this.approveModal.open({
      enrollmentId: student.id,
      courseId: this.courseId,
      courseName: this.courseName,
      studentName: student.full_name,
      studentEmail: student.email
    });
  }

  openManualCertModal() {
    this.approveModal.open({
      courseId: this.courseId,
      courseName: this.courseName,
      studentName: '',
      studentEmail: ''
    });
  }

  onCertificateGenerated(result: { certificateId: string; pdfUrl: string }) {
    // Reload list to update status
    this.loadCourseAndStudents();
  }

  async revokeCertificate(studentEmail: string) {
    if (!confirm('¿Estás seguro que deseas revocar y eliminar este certificado? Esta acción no se puede deshacer.')) return;
    
    this.loading.set(true);
    const success = await this.certificatesService.revokeCertificate(this.courseId, studentEmail);
    if (success) {
      await this.loadCourseAndStudents();
    } else {
      this.loading.set(false);
      alert('Hubo un error al intentar revocar el certificado.');
    }
  }
}
